import { Product, IProduct } from "../models/Product.js";
import { IProductMedia } from "../models/Product.js";

export class ProductService {
  static normalizeMedia(mediaInput: any[]): IProductMedia[] {
    if (!mediaInput || !Array.isArray(mediaInput)) return [];

    let normalized: IProductMedia[] = mediaInput
      .filter((m) => {
        const urlStr = m.url?.trim();
        return urlStr && urlStr.length <= 500 && (urlStr.startsWith("http") || urlStr.startsWith("/"));
      })
      .map((m, idx) => ({
        id: m.id || `m_${Math.random().toString(36).substring(2)}`,
        type: m.type === "video" ? "video" : "image",
        url: m.url.trim(),
        sortOrder: idx,
        isPrimary: m.isPrimary === true,
      }));

    // Ensure exactly one primary image
    const images = normalized.filter((m) => m.type === "image");
    
    // Videos cannot be primary
    normalized = normalized.map((m) => {
      if (m.type === "video") return { ...m, isPrimary: false };
      return m;
    });

    const primaryCount = normalized.filter((m) => m.isPrimary).length;
    
    if (images.length > 0) {
      if (primaryCount === 0) {
        // No primary supplied, choose first image
        const firstImageIndex = normalized.findIndex((m) => m.type === "image");
        if (firstImageIndex !== -1) normalized[firstImageIndex].isPrimary = true;
      } else if (primaryCount > 1) {
        // Too many primaries, keep only the first one marked
        let foundPrimary = false;
        normalized = normalized.map((m) => {
          if (m.isPrimary) {
            if (!foundPrimary) {
              foundPrimary = true;
              return m;
            }
            return { ...m, isPrimary: false };
          }
          return m;
        });
      }
    }

    return normalized;
  }

  static async createProduct(data: Partial<IProduct>) {
    if (data.media) {
      data.media = this.normalizeMedia(data.media);
    }
    
    const product = new Product(data);
    await product.save();
    return product;
  }

  static async updateProduct(id: string, data: Partial<IProduct>) {
    if (data.media) {
      data.media = this.normalizeMedia(data.media);
    }
    
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) throw new Error("Product not found");
    return product;
  }
}
