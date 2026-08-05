import { Router } from "express";
import { Category } from "../models/Category.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const filter = req.session?.userId ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json({ data: categories });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ data: category });
  } catch (err: any) {
    res.status(400).json({ error: { code: "BAD_REQUEST", message: err.message } });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Catégorie non trouvée" } });
    res.json({ data: category });
  } catch (err: any) {
    res.status(400).json({ error: { code: "BAD_REQUEST", message: err.message } });
  }
});

export default router;
