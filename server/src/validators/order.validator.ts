import { z } from "zod";

export const CreateOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      name: z.string().min(1, "Nom requis").max(100),
      phone: z.string().regex(/^(0)(5|6|7)[0-9]{8}$/, "Numéro de téléphone algérien invalide"),
      wilaya: z.string().min(1, "Wilaya requise"),
      commune: z.string().min(1, "Commune requise"),
      address: z.string().min(1, "Adresse requise").max(255),
      deliveryNotes: z.string().max(500).optional(),
    }),
    items: z.array(
      z.object({
        productId: z.string().min(1, "Produit requis"),
        qty: z.number().int().min(1, "La quantité doit être au moins 1"),
        variant: z.string().optional(),
        shade: z.string().optional(),
      })
    ).min(1, "La commande doit contenir au moins un produit"),
  }),
});

export const UpdateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "new", "calling", "confirmed", "preparing", "ready", "sent", 
      "picked_up", "out_for_delivery", "delivered", "rejected", 
      "no_answer", "cancelled", "failed", "returned"
    ]),
  }),
});

export const AddOrderCallSchema = z.object({
  body: z.object({
    outcome: z.string().min(1, "Outcome est requis"),
    note: z.string().optional(),
  }),
});
