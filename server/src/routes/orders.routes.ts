import { Router } from "express";
import { Order } from "../models/Order.js";
import { OrderService } from "../services/order.service.js";
import { requireStaff } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { CreateOrderSchema, UpdateOrderStatusSchema, AddOrderCallSchema } from "../validators/order.validator.js";
import mongoose from "mongoose";

const router = Router();

// Public: Create order (Storefront)
router.post("/", validate(CreateOrderSchema), async (req, res) => {
  try {
    const idempotencyKey = req.headers["idempotency-key"] as string | undefined;
    const order = await OrderService.createOrder(req.body, idempotencyKey as string | undefined);
    res.status(201).json({ data: order });
  } catch (err: any) {
    res.status(400).json({ error: { code: "ORDER_ERROR", message: err.message } });
  }
});

// Admin: Get all orders
router.get("/", requireStaff, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ data: orders });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

// Admin: Get order by ID
router.get("/:id", requireStaff, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "ID invalide" } });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Commande non trouvée" } });
    res.json({ data: order });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

// Admin: Update order status
router.patch("/:id/status", requireStaff, validate(UpdateOrderStatusSchema), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "ID invalide" } });
    }
    const order = await OrderService.updateOrderStatus(req.params.id as string, req.body.status, req.session.userId!);
    res.json({ data: order });
  } catch (err: any) {
    res.status(400).json({ error: { code: "BAD_REQUEST", message: err.message } });
  }
});

// Admin: Add call attempt
router.post("/:id/calls", requireStaff, validate(AddOrderCallSchema), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "ID invalide" } });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Commande non trouvée" } });

    order.calls.push({
      at: new Date(),
      outcome: req.body.outcome,
      note: req.body.note,
      adminUserId: req.session.userId as any,
    });
    
    order.timeline.push({
      at: new Date(),
      label: `Appel: ${req.body.outcome}`,
      sub: req.body.note,
    });
    
    await order.save();
    res.json({ data: order });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

// Admin: Delete order
router.delete("/:id", requireStaff, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "ID invalide" } });
    }
    const order = await OrderService.deleteOrder(req.params.id as string);
    if (!order) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Commande non trouvée" } });
    res.json({ data: { success: true } });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

export default router;
