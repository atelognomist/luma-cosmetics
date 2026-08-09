import mongoose from "mongoose";
import { Order, IOrder, IOrderItem } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Customer } from "../models/Customer.js";

export class OrderService {
  static async createOrder(payload: any, idempotencyKey?: string) {
    try {
      return await this._createOrderTx(payload, idempotencyKey, true);
    } catch (error: any) {
      // Return existing order if Idempotency collision
      if (error.code === 11000 && error.keyPattern && error.keyPattern.idempotencyKey) {
        const existingOrder = await Order.findOne({ idempotencyKey });
        if (existingOrder) return existingOrder;
      }
      
      if (error.message && error.message.includes("replica set")) {
        if (process.env.NODE_ENV === "production") {
          throw new Error("Production transactions are REQUIRED. Replica set missing or misconfigured.");
        }
        console.warn("MongoDB standalone detected, falling back to non-transactional order creation.");
        return await this._createOrderTx(payload, idempotencyKey, false);
      }
      throw error;
    }
  }

  static async _createOrderTx(payload: any, idempotencyKey: string | undefined, useTx: boolean) {
    const session = useTx ? await mongoose.startSession() : null;
    if (session) session.startTransaction();

    const opts = session ? { session } : {};

    try {
      // 1. Resolve customer
      let customer = session 
        ? await Customer.findOne({ phone: payload.customer.phone }).session(session)
        : await Customer.findOne({ phone: payload.customer.phone });

      if (!customer) {
        customer = new Customer({
          name: payload.customer.name,
          phone: payload.customer.phone,
        });
        await customer.save(opts);
      } else {
        if (customer.name !== payload.customer.name) {
          customer.name = payload.customer.name;
          await customer.save(opts);
        }
      }

      // 2. Fetch products and calculate total
      let subtotal = 0;
      const orderItems: IOrderItem[] = [];
      const successfulReservations: { id: string; qty: number }[] = [];

      try {
        for (const item of payload.items) {
          // Atomic reservation
          const product = session 
            ? await Product.findOneAndUpdate(
                { _id: item.productId, stock: { $gte: item.qty }, status: "published" },
                { $inc: { stock: -item.qty } },
                { new: true, session }
              )
            : await Product.findOneAndUpdate(
                { _id: item.productId, stock: { $gte: item.qty }, status: "published" },
                { $inc: { stock: -item.qty } },
                { new: true }
              );
          
          if (!product) {
            // Check if it exists at all to give a good error
            const exists = await Product.findById(item.productId);
            if (!exists) throw new Error(`Le produit n'existe pas`);
            if (exists.status !== "published") throw new Error(`Le produit ${exists.name} n'est pas disponible`);
            throw new Error(`Stock insuffisant pour ${exists.name}`);
          }

          successfulReservations.push({ id: item.productId, qty: item.qty });

          const price = product.salePrice != null && product.salePrice > 0 ? product.salePrice : product.price;
          subtotal += price * item.qty;

          let imageUrl = "";
          const primaryMedia = product.media?.find((m: any) => m.isPrimary);
          if (primaryMedia) imageUrl = primaryMedia.url;
          else if (product.media?.[0]) imageUrl = product.media[0].url;
          else imageUrl = product.image || "";

          orderItems.push({
            productId: product._id as mongoose.Types.ObjectId,
            name: product.name,
            qty: item.qty,
            unitPrice: price,
            image: imageUrl,
            variant: item.variant,
            shade: item.shade,
          });
        }
      } catch (reserveError) {
        // MANUAL ROLLBACK FOR STANDALONE MODE
        if (!session) {
          for (const res of successfulReservations) {
            await Product.updateOne({ _id: res.id }, { $inc: { stock: res.qty } });
          }
        }
        throw reserveError;
      }

      const deliveryFee = 600; 
      const total = subtotal + deliveryFee;

      const lastOrder = session 
        ? await Order.findOne().sort({ num: -1 }).session(session)
        : await Order.findOne().sort({ num: -1 });
      const num = lastOrder ? lastOrder.num + 1 : 1001;

      const order = new Order({
        num,
        status: "new",
        customerId: customer._id,
        customerSnapshot: {
          name: payload.customer.name,
          phone: payload.customer.phone,
          wilaya: payload.customer.wilaya,
          commune: payload.customer.commune,
          address: payload.customer.address,
          deliveryNotes: payload.customer.deliveryNotes,
        },
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
        timeline: [
          { at: new Date(), label: "Commande reçue" }
        ],
        calls: [],
        idempotencyKey,
      });

      await order.save(opts);

      if (session) {
        await session.commitTransaction();
        session.endSession();
      }
      
      return order;
    } catch (error) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      throw error;
    }
  }

  static async updateOrderStatus(id: string, status: string, adminUserId: string) {
    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    if (status === "cancelled" || status === "rejected") {
      // Prevent double restoration
      if (order.status === "cancelled" || order.status === "rejected") {
        return order; // Already cancelled, do nothing
      }
      try {
        return await this._updateOrderStatusTx(order, status, true);
      } catch (error: any) {
        const errorString = (error.message || "") + " " + (error.errmsg || "") + " " + JSON.stringify(error);
        if (errorString.toLowerCase().includes("replica set") || errorString.toLowerCase().includes("retryable writes")) {
          if (process.env.NODE_ENV === "production") {
            throw new Error("Production transactions are REQUIRED.");
          }
          return await this._updateOrderStatusTx(order, status, false);
        }
        throw error;
      }
    }

    // Ensure we don't accidentally transition FROM cancelled/rejected TO something else
    // without deducting stock again. For now, block restoring from cancelled.
    if (order.status === "cancelled" || order.status === "rejected") {
       throw new Error("Cannot change status of a cancelled/rejected order");
    }

    order.status = status;
    order.timeline.push({ at: new Date(), label: `Statut modifié: ${status}` });
    await order.save();
    return order;
  }

  static async _updateOrderStatusTx(order: any, status: string, useTx: boolean) {
    const session = useTx ? await mongoose.startSession() : null;
    if (session) session.startTransaction();

    const opts = session ? { session } : {};

    try {
      if (order.status !== "cancelled" && order.status !== "rejected") {
        for (const item of order.items) {
          if (session) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.qty } }).session(session);
          } else {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.qty } });
          }
        }
      }
      order.status = status;
      order.timeline.push({ at: new Date(), label: `Statut modifié: ${status}` });
      await order.save(opts);
      if (session) {
        await session.commitTransaction();
        session.endSession();
      }
      return order;
    } catch (err) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      throw err;
    }
  }

  static async deleteOrder(id: string) {
    // Hard delete without restoring stock (stock restoration requires explicit cancellation)
    return await Order.findByIdAndDelete(id);
  }
}
