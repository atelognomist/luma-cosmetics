import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fmtPrice = (n: number) => n.toLocaleString("fr-DZ") + " DA";

export const ACCENT = "#C4855A";

export function getPrimaryImage(product: any): string {
  if (!product) return "";
  if (product.media && Array.isArray(product.media)) {
    const primary = product.media.find((m: any) => m.isPrimary && m.type === "image");
    if (primary) return primary.url;
    const firstImg = product.media.find((m: any) => m.type === "image");
    if (firstImg) return firstImg.url;
  }
  return product.image || (product.images && product.images[0]) || "";
}
