import { Router } from "express";
import { Product } from "../models/Product.js";
import { ProductService } from "../services/product.service.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { CreateProductSchema, UpdateProductSchema } from "../validators/product.validator.js";
import mongoose from "mongoose";

const router = Router();

// Public: Get all published products (with optional filtering)
router.get("/", async (req, res) => {
  try {
    const filter: any = {};
    
    // Only return all products if requested by an admin via ?admin=true query parameter
    if (req.query.admin === "true" && req.session?.userId) {
       // admin wants all, don't filter by status
    } else {
       filter.status = "published";
    }
    
    // Support category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ data: products });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

// Public: Get single product
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "ID invalide" } });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Produit non trouvé" } });
    
    // Storefront logic
    if (req.query.admin === "true" && req.session?.userId) {
       // Admin allowed to see archived products
    } else if (product.status !== "published") {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Produit non trouvé" } });
    }
    
    res.json({ data: product });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

// Admin: Create product
router.post("/", requireAdmin, validate(CreateProductSchema), async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json({ data: product });
  } catch (err: any) {
    res.status(400).json({ error: { code: "BAD_REQUEST", message: err.message } });
  }
});

// Admin: Update product
router.patch("/:id", requireAdmin, validate(UpdateProductSchema), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "ID invalide" } });
    }
    const product = await ProductService.updateProduct(req.params.id as string, req.body);
    res.json({ data: product });
  } catch (err: any) {
    res.status(400).json({ error: { code: "BAD_REQUEST", message: err.message } });
  }
});

// Admin: Delete/Archive product
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "ID invalide" } });
    }
    const product = await ProductService.deleteProduct(req.params.id as string);
    if (!product) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Produit non trouvé" } });
    res.json({ data: { success: true } });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

export default router;
