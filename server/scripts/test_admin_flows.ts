import mongoose from "mongoose";
import { Product } from "../src/models/Product.js";
import { Order } from "../src/models/Order.js";
import { OrderService } from "../src/services/order.service.js";
import { ProductService } from "../src/services/product.service.js";
import dotenv from "dotenv";

dotenv.config();

async function testAdminFlows() {
  console.log("Starting Admin Flows Tests...");
  
  // Connect to Atlas MongoDB for production testing
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI not set in .env");
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  try {
    // 1. Setup Test Products
    const p1 = new Product({
      name: "Test Product A",
      brand: "LUMA",
      category: "Soin",
      subcategory: "Test",
      description: "Test Desc",
      price: 1000,
      stock: 10,
      lowStockThreshold: 2,
      status: "published",
      flags: { bestSeller: false, newArrival: false, featured: false, onSale: false, outOfStock: false },
    });
    await p1.save();
    console.log("Created Product A, stock: 10");

    // 2. Test Order Creation (Stock decreases)
    console.log("Creating Order for Product A (qty: 2)...");
    const order = await OrderService.createOrder({
      customer: {
        name: "Test Customer",
        phone: "0555000000",
        wilaya: "Alger",
        commune: "Alger Centre",
        address: "Test Address"
      },
      items: [
        { productId: p1._id.toString(), qty: 2 }
      ]
    });
    
    let p1Updated = await Product.findById(p1._id);
    if (p1Updated?.stock !== 8) throw new Error(`Stock not decreased correctly. Expected 8, got ${p1Updated?.stock}`);
    console.log("Order created, stock decreased to 8. ✅");

    // 3. Test Order Status Transition (Active to Active)
    console.log("Testing active status transition (new -> confirmed)...");
    await OrderService.updateOrderStatus(order._id.toString(), "confirmed", new mongoose.Types.ObjectId().toString());
    let orderUpdated = await Order.findById(order._id);
    if (orderUpdated?.status !== "confirmed") throw new Error("Status not updated to confirmed");
    
    p1Updated = await Product.findById(p1._id);
    if (p1Updated?.stock !== 8) throw new Error("Stock incorrectly changed during active transition");
    console.log("Active transition successful, stock unaffected. ✅");

    // 4. Test Cancellation (Stock restores)
    console.log("Testing cancellation (confirmed -> cancelled)...");
    await OrderService.updateOrderStatus(order._id.toString(), "cancelled", new mongoose.Types.ObjectId().toString());
    
    p1Updated = await Product.findById(p1._id);
    if (p1Updated?.stock !== 10) throw new Error(`Stock not restored. Expected 10, got ${p1Updated?.stock}`);
    console.log("Cancellation successful, stock restored to 10. ✅");

    // 5. Test Double Cancellation Prevention
    console.log("Testing double cancellation prevention...");
    await OrderService.updateOrderStatus(order._id.toString(), "cancelled", new mongoose.Types.ObjectId().toString());
    
    p1Updated = await Product.findById(p1._id);
    if (p1Updated?.stock !== 10) throw new Error("Stock incorrectly restored twice!");
    console.log("Double cancellation prevented, stock is still 10. ✅");

    // 6. Test Prevent Cancelled -> Active
    console.log("Testing prevention of cancelled -> active transition...");
    let threw = false;
    try {
      await OrderService.updateOrderStatus(order._id.toString(), "confirmed", new mongoose.Types.ObjectId().toString());
    } catch (err: any) {
      if (err.message === "Cannot change status of a cancelled/rejected order") {
        threw = true;
      }
    }
    if (!threw) throw new Error("Allowed cancelled -> confirmed transition!");
    console.log("Cancelled -> active transition prevented. ✅");

    // 7. Test Soft Delete Product
    console.log("Testing soft delete product...");
    await ProductService.deleteProduct(p1._id.toString());
    p1Updated = await Product.findById(p1._id);
    if (p1Updated?.status !== "archived") throw new Error("Product not archived");
    console.log("Product soft deleted successfully. ✅");

    // 8. Test Historical Order Snapshot survives product deletion
    orderUpdated = await Order.findById(order._id);
    if (orderUpdated?.items[0].name !== "Test Product A") throw new Error("Historical order snapshot corrupted");
    console.log("Historical order snapshot survived product deletion. ✅");

    // 9. Test Hard Delete Order
    console.log("Testing hard delete order...");
    await OrderService.deleteOrder(order._id.toString());
    const orderDeleted = await Order.findById(order._id);
    if (orderDeleted) throw new Error("Order not deleted");
    
    p1Updated = await Product.findById(p1._id);
    if (p1Updated?.stock !== 10) throw new Error("Order deletion incorrectly restored stock!");
    console.log("Order deleted, stock unaffected. ✅");

    // Clean up
    await Product.findByIdAndDelete(p1._id);
    
    console.log("All Admin Flow tests passed! 🎉");
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testAdminFlows();
