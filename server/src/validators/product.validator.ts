import { z } from "zod";

export const ProductMediaSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["image", "video"]),
  url: z.string().url("URL invalide"),
  sortOrder: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional().default(false),
});

export const CreateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Le nom est requis"),
    brand: z.string().min(1, "La marque est requise"),
    category: z.string().min(1, "La catégorie est requise"),
    subcategory: z.string().optional(),
    description: z.string().optional(),
    price: z.number().min(0, "Le prix ne peut pas être négatif"),
    originalPrice: z.number().min(0).optional(),
    salePrice: z.number().min(0).optional(),
    stock: z.number().int().min(0, "Le stock ne peut pas être négatif"),
    lowStockThreshold: z.number().int().min(0).optional().default(0),
    status: z.enum(["published", "draft", "archived", "hidden"]).optional().default("draft"),
    flags: z.object({
      bestSeller: z.boolean().optional().default(false),
      newArrival: z.boolean().optional().default(false),
      featured: z.boolean().optional().default(false),
      onSale: z.boolean().optional().default(false),
      outOfStock: z.boolean().optional().default(false),
    }).optional(),
    media: z.array(ProductMediaSchema).optional().default([]),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    video: z.string().optional(),
    benefits: z.union([z.string(), z.array(z.string())]).optional(),
    ingredients: z.string().optional(),
    howToUse: z.string().optional(),
    characteristic: z.string().optional(),
    suitableFor: z.string().optional(),
    warnings: z.string().optional(),
    size: z.string().optional(),
    shades: z.array(z.string()).optional(),
    variants: z.array(z.string()).optional(),
  }),
});

export const UpdateProductSchema = z.object({
  body: CreateProductSchema.shape.body.partial(),
});
