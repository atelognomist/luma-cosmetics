import type { Product as ApiProduct } from "../lib/api/types";

export type PageId =
  | "home" | "shop" | "best-sellers" | "new-arrivals" | "offers"
  | "product" | "category" | "about" | "contact"
  | "delivery" | "faq" | "privacy" | "terms" | "cart" | "order";

// Alias the API product to be used throughout the storefront
export type Product = ApiProduct;

export type CartItem = { 
  product: Product; 
  quantity: number 
};
