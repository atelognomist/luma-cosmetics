export type OrderStatus =
  | "new"
  | "calling"
  | "confirmed"
  | "preparing"
  | "ready"
  | "sent"
  | "picked_up"
  | "out_for_delivery"
  | "delivered"
  | "rejected"
  | "no_answer"
  | "cancelled"
  | "failed"
  | "returned";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  shade?: string;
  variant?: string;
  qty: number;
  unitPrice: number;
  image: string;
}

export interface CallAttempt {
  at: string;
  outcome:
    | "confirmed"
    | "rejected"
    | "no_answer"
    | "unavailable"
    | "wrong_number"
    | "callback"
    | "address_correction";
  note?: string;
}

export interface TimelineEvent {
  at: string;
  label: string;
  sub?: string;
}

export interface Order {
  id: string;
  num: number;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
    deliveryNotes?: string;
  };
  items: OrderItem[];
  deliveryFee: number;
  deliveryAgency?: string;
  trackingNumber?: string;
  calls: CallAttempt[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductMedia {
  id: string;
  type: "image" | "video";
  url: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  originalPrice?: number;
  salePrice?: number; // Kept for storefront compat
  stock: number;
  lowStockThreshold: number;
  status: "published" | "draft" | "archived" | "hidden";
  flags: {
    bestSeller: boolean;
    newArrival: boolean;
    featured: boolean;
    onSale: boolean;
    outOfStock: boolean;
  };
  media: ProductMedia[];
  image?: string; // Kept for storefront compat mapping to primary image
  images?: string[]; // Made optional, legacy
  video?: string; // Made optional, legacy
  benefits?: string | string[]; // Allow array for storefront compat
  ingredients?: string;
  howToUse?: string;
  characteristic?: string; // from storefront
  suitableFor?: string;
  warnings?: string;
  size?: string;
  shades?: string[];
  variants?: string[];
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  image?: string;
  video?: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  productIds: string[];
  type: "collection" | "offer" | "seasonal" | "trending";
}

export interface DeliveryAgency {
  id: string;
  name: string;
  active: boolean;
  apiConnected: boolean;
  wilayas: number[];
  stats: {
    pending: number;
    inTransit: number;
    delivered: number;
    failed: number;
    returned: number;
  };
  pricing: { wilayaCode: number; price: number }[];
}
