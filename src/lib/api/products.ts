import { ApiClient } from "./client";
import type { Product, ProductMedia } from "./types";

function normalizeProduct(p: any): Product {
  // Legacy media fallback just in case backend returns old format
  let media = p.media || [];
  if (!media.length && (p.image || p.images?.length > 0 || p.video)) {
    const newMedia: ProductMedia[] = [];
    if (p.image) {
      newMedia.push({ id: `m_${Date.now()}_1`, type: "image", url: p.image, sortOrder: 0, isPrimary: true });
    }
    if (p.images && p.images.length > 0) {
      p.images.forEach((url: string, i: number) => {
        if (url !== p.image) {
          newMedia.push({ id: `m_${Date.now()}_img_${i}`, type: "image", url, sortOrder: newMedia.length, isPrimary: false });
        }
      });
    }
    if (p.video) {
      newMedia.push({ id: `m_${Date.now()}_vid`, type: "video", url: p.video, sortOrder: newMedia.length, isPrimary: false });
    }
    p.media = newMedia;
  }
  
  // Normalize id from _id if it comes directly from MongoDB
  if (p._id && !p.id) p.id = p._id.toString();

  return p as Product;
}

export async function getProducts(): Promise<Product[]> {
  const products = await ApiClient.get<Product[]>("/products");
  return products.map(normalizeProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await ApiClient.get<Product>(`/products/${id}`);
    return normalizeProduct(product);
  } catch (error) {
    return null;
  }
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const newProduct = await ApiClient.post<Product>("/products", product);
  return normalizeProduct(newProduct);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const updatedProduct = await ApiClient.patch<Product>(`/products/${id}`, updates);
  return normalizeProduct(updatedProduct);
}

export async function deleteProduct(id: string): Promise<void> {
  await ApiClient.delete(`/products/${id}`);
}
