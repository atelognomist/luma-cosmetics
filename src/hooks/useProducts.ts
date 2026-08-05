import { useState, useEffect } from "react";
import { getProducts } from "../lib/api/products";
import type { Product } from "../lib/api/types";

// Simple global cache to avoid redundant fetches on every mount
let cachedProducts: Product[] | null = null;
let fetchPromise: Promise<Product[]> | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cachedProducts || []);
  const [loading, setLoading] = useState<boolean>(!cachedProducts);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedProducts) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = getProducts();
    }

    fetchPromise
      .then((data) => {
        const mappedData = data.map(p => {
          const isSale = p.flags?.onSale || p.isOffer;
          return {
            ...p,
            salePrice: isSale ? p.price : undefined,
            price: isSale && p.originalPrice ? p.originalPrice : p.price,
            isNew: p.flags?.newArrival || p.isNew,
            isBestSeller: p.flags?.bestSeller || p.isBestSeller,
            isOffer: p.flags?.onSale || p.isOffer,
            available: !p.flags?.outOfStock
          };
        });
        cachedProducts = mappedData;
        setProducts(mappedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Filter helpers
  const bestSellers = products.filter(p => p.flags?.bestSeller || p.isBestSeller);
  const newArrivals = products.filter(p => p.flags?.newArrival || p.isNew);
  const offers = products.filter(p => p.flags?.onSale || p.isOffer);

  return { products, loading, error, bestSellers, newArrivals, offers };
}
