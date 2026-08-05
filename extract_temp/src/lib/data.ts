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

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  originalPrice?: number;
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
  images: string[];
  video?: string;
  benefits?: string;
  ingredients?: string;
  howToUse?: string;
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

// ── Sample Demo Data ──────────────────────────────────────────────────────────

const NOW = new Date("2026-08-05T14:32:00");
const fmt = (d: Date) => d.toISOString();
const ago = (m: number) =>
  fmt(new Date(NOW.getTime() - m * 60 * 1000));

export const DEMO_ORDERS: Order[] = [
  {
    id: "ORD-1052",
    num: 1052,
    status: "new",
    customer: {
      name: "Amira Boudiaf",
      phone: "+213 550 124 783",
      wilaya: "Alger",
      commune: "Hydra",
      address: "12 Rue des Glycines, Hydra",
      deliveryNotes: "Appeler avant livraison",
    },
    items: [
      {
        id: "i1",
        productId: "p1",
        name: "Fond de Teint Velours",
        shade: "Beige Rosé 03",
        qty: 1,
        unitPrice: 3200,
        image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=80&h=80&fit=crop&auto=format",
      },
      {
        id: "i2",
        productId: "p3",
        name: "Rouge à Lèvres Satin",
        shade: "Nude Profond",
        qty: 2,
        unitPrice: 1400,
        image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2613?w=80&h=80&fit=crop&auto=format",
      },
    ],
    deliveryFee: 400,
    calls: [],
    timeline: [{ at: ago(3), label: "Commande reçue" }],
    createdAt: ago(3),
    updatedAt: ago(3),
  },
  {
    id: "ORD-1051",
    num: 1051,
    status: "no_answer",
    customer: {
      name: "Fatima Zekri",
      phone: "+213 661 987 345",
      wilaya: "Constantine",
      commune: "El Khroub",
      address: "Cité AADL Bloc 14 Apt 08",
    },
    items: [
      {
        id: "i3",
        productId: "p2",
        name: "Palette Yeux Or & Nude",
        qty: 1,
        unitPrice: 4800,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=80&h=80&fit=crop&auto=format",
      },
    ],
    deliveryFee: 500,
    calls: [
      { at: ago(21), outcome: "no_answer" },
    ],
    timeline: [
      { at: ago(45), label: "Commande reçue" },
      { at: ago(21), label: "Appel — Sans réponse", sub: "Tentative 1" },
    ],
    createdAt: ago(45),
    updatedAt: ago(21),
  },
  {
    id: "ORD-1050",
    num: 1050,
    status: "confirmed",
    customer: {
      name: "Nadia Hammoud",
      phone: "+213 770 456 123",
      wilaya: "Oran",
      commune: "Bir El Djir",
      address: "Résidence Les Pins, Bt C, Appt 12",
    },
    items: [
      {
        id: "i4",
        productId: "p4",
        name: "Sérum Éclat Vitamine C",
        qty: 1,
        unitPrice: 2900,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop&auto=format",
      },
      {
        id: "i5",
        productId: "p5",
        name: "Crème Hydratante Intense",
        qty: 1,
        unitPrice: 2400,
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=80&h=80&fit=crop&auto=format",
      },
    ],
    deliveryFee: 500,
    calls: [{ at: ago(55), outcome: "confirmed", note: "Cliente disponible toute la journée" }],
    timeline: [
      { at: ago(70), label: "Commande reçue" },
      { at: ago(55), label: "Appel client" },
      { at: ago(54), label: "Commande confirmée" },
    ],
    createdAt: ago(70),
    updatedAt: ago(54),
  },
  {
    id: "ORD-1049",
    num: 1049,
    status: "preparing",
    customer: {
      name: "Yasmine Larabi",
      phone: "+213 555 789 012",
      wilaya: "Sétif",
      commune: "Sétif",
      address: "Cité Olympique, Bt 5",
    },
    items: [
      {
        id: "i6",
        productId: "p6",
        name: "Kit Contouring Pro",
        qty: 1,
        unitPrice: 5600,
        image: "https://images.unsplash.com/photo-1583241476978-4c1f89f17379?w=80&h=80&fit=crop&auto=format",
      },
    ],
    deliveryFee: 600,
    calls: [{ at: ago(120), outcome: "confirmed" }],
    timeline: [
      { at: ago(180), label: "Commande reçue" },
      { at: ago(120), label: "Commande confirmée" },
      { at: ago(90), label: "En préparation" },
    ],
    createdAt: ago(180),
    updatedAt: ago(90),
  },
  {
    id: "ORD-1048",
    num: 1048,
    status: "ready",
    customer: {
      name: "Souad Belkacemi",
      phone: "+213 699 234 567",
      wilaya: "Blida",
      commune: "Blida",
      address: "Rue Benaouda, nr 7",
    },
    items: [
      {
        id: "i7",
        productId: "p1",
        name: "Fond de Teint Velours",
        shade: "Caramel Doré 05",
        qty: 2,
        unitPrice: 3200,
        image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=80&h=80&fit=crop&auto=format",
      },
    ],
    deliveryFee: 400,
    calls: [{ at: ago(240), outcome: "confirmed" }],
    timeline: [
      { at: ago(320), label: "Commande reçue" },
      { at: ago(240), label: "Commande confirmée" },
      { at: ago(200), label: "En préparation" },
      { at: ago(160), label: "Prête pour livraison" },
    ],
    createdAt: ago(320),
    updatedAt: ago(160),
  },
  {
    id: "ORD-1047",
    num: 1047,
    status: "sent",
    customer: {
      name: "Meriem Benouis",
      phone: "+213 540 321 876",
      wilaya: "Annaba",
      commune: "El Bouni",
      address: "Zone industrielle, Bt 3",
    },
    items: [
      {
        id: "i8",
        productId: "p7",
        name: "Mascara Volume Extrême",
        qty: 3,
        unitPrice: 1600,
        image: "https://images.unsplash.com/photo-1631214524020-3c69e4a19e05?w=80&h=80&fit=crop&auto=format",
      },
    ],
    deliveryFee: 600,
    deliveryAgency: "Yalidine",
    trackingNumber: "YLD-889934",
    calls: [{ at: ago(480), outcome: "confirmed" }],
    timeline: [
      { at: ago(540), label: "Commande reçue" },
      { at: ago(480), label: "Commande confirmée" },
      { at: ago(420), label: "En préparation" },
      { at: ago(360), label: "Prête pour livraison" },
      { at: ago(300), label: "Envoyée à Yalidine", sub: "YLD-889934" },
    ],
    createdAt: ago(540),
    updatedAt: ago(300),
  },
  {
    id: "ORD-1046",
    num: 1046,
    status: "delivered",
    customer: {
      name: "Hafsa Cherid",
      phone: "+213 772 654 321",
      wilaya: "Tlemcen",
      commune: "Tlemcen",
      address: "Cité Bel Air, Appt 22",
    },
    items: [
      {
        id: "i9",
        productId: "p2",
        name: "Palette Yeux Or & Nude",
        qty: 1,
        unitPrice: 4800,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=80&h=80&fit=crop&auto=format",
      },
    ],
    deliveryFee: 700,
    deliveryAgency: "Zr Express",
    trackingNumber: "ZRX-445521",
    calls: [{ at: ago(1440), outcome: "confirmed" }],
    timeline: [
      { at: ago(1500), label: "Commande reçue" },
      { at: ago(1440), label: "Commande confirmée" },
      { at: ago(1380), label: "En préparation" },
      { at: ago(1320), label: "Prête pour livraison" },
      { at: ago(1200), label: "Envoyée à Zr Express" },
      { at: ago(600), label: "Prise en charge" },
      { at: ago(120), label: "En cours de livraison" },
      { at: ago(30), label: "Livrée avec succès" },
    ],
    createdAt: ago(1500),
    updatedAt: ago(30),
  },
  {
    id: "ORD-1045",
    num: 1045,
    status: "rejected",
    customer: {
      name: "Rania Bouchama",
      phone: "+213 660 111 222",
      wilaya: "Alger",
      commune: "Bab El Oued",
      address: "Rue Arezki Amokrane, 45",
    },
    items: [
      {
        id: "i10",
        productId: "p3",
        name: "Rouge à Lèvres Satin",
        shade: "Rose Berry",
        qty: 1,
        unitPrice: 1400,
        image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2613?w=80&h=80&fit=crop&auto=format",
      },
    ],
    deliveryFee: 400,
    calls: [{ at: ago(800), outcome: "rejected", note: "Commande passée par erreur" }],
    timeline: [
      { at: ago(860), label: "Commande reçue" },
      { at: ago(800), label: "Commande rejetée", sub: "Passée par erreur" },
    ],
    createdAt: ago(860),
    updatedAt: ago(800),
  },
  {
    id: "ORD-1044",
    num: 1044,
    status: "no_answer",
    customer: {
      name: "Imane Bensalem",
      phone: "+213 557 987 654",
      wilaya: "Alger",
      commune: "Kouba",
      address: "Cité des 1000 Logements, Bt 8",
    },
    items: [
      {
        id: "i11",
        productId: "p4",
        name: "Sérum Éclat Vitamine C",
        qty: 2,
        unitPrice: 2900,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop&auto=format",
      },
    ],
    deliveryFee: 400,
    calls: [
      { at: ago(180), outcome: "no_answer" },
      { at: ago(90), outcome: "no_answer" },
    ],
    timeline: [
      { at: ago(300), label: "Commande reçue" },
      { at: ago(180), label: "Appel — Sans réponse", sub: "Tentative 1" },
      { at: ago(90), label: "Appel — Sans réponse", sub: "Tentative 2" },
    ],
    createdAt: ago(300),
    updatedAt: ago(90),
  },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Fond de Teint Velours",
    brand: "LUMA",
    category: "Teint",
    subcategory: "Fond de teint",
    description: "Un fond de teint couvrance modulable à finition velours soyeux. Longue tenue 24h, résistant à la chaleur.",
    price: 3200,
    originalPrice: 3800,
    stock: 48,
    lowStockThreshold: 10,
    status: "published",
    flags: { bestSeller: true, newArrival: false, featured: true, onSale: true, outOfStock: false },
    images: [
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1631214524020-3c69e4a19e05?w=400&h=400&fit=crop&auto=format",
    ],
    shades: ["Ivoire 01", "Beige Naturel 02", "Beige Rosé 03", "Doré 04", "Caramel Doré 05"],
    benefits: "Couvre les imperfections. Tenue longue durée. Fini naturel velouté.",
    ingredients: "Aqua, Cyclopentasiloxane, Titanium Dioxide, Niacinamide...",
    howToUse: "Appliquer du centre du visage vers l'extérieur avec une éponge ou un pinceau.",
    suitableFor: "Tous types de peau",
    size: "30ml",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "p2",
    name: "Palette Yeux Or & Nude",
    brand: "LUMA",
    category: "Yeux",
    subcategory: "Palettes",
    description: "12 teintes harmonieuses entre ombres dorées et nudes pour un regard intense ou naturel.",
    price: 4800,
    stock: 23,
    lowStockThreshold: 5,
    status: "published",
    flags: { bestSeller: true, newArrival: false, featured: true, onSale: false, outOfStock: false },
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&auto=format",
    ],
    benefits: "Pigmentation intense. Longue tenue. Facile à estomper.",
    howToUse: "Utiliser avec un pinceau à paupières ou les doigts.",
    size: "12 × 1.2g",
    createdAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "p3",
    name: "Rouge à Lèvres Satin",
    brand: "LUMA",
    category: "Lèvres",
    subcategory: "Rouge à lèvres",
    description: "Rouge à lèvres satiné hydratant avec finition lumineuse. Formule enrichie en huile d'argan.",
    price: 1400,
    stock: 67,
    lowStockThreshold: 15,
    status: "published",
    flags: { bestSeller: false, newArrival: true, featured: false, onSale: false, outOfStock: false },
    images: [
      "https://images.unsplash.com/photo-1586495777744-4e6232bf2613?w=400&h=400&fit=crop&auto=format",
    ],
    shades: ["Nude Profond", "Rose Berry", "Rouge Classique", "Corail Sunset", "Prune Intense"],
    size: "3.5g",
    createdAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "p4",
    name: "Sérum Éclat Vitamine C",
    brand: "LUMA",
    category: "Soin",
    subcategory: "Sérums",
    description: "Sérum concentré en vitamine C pure à 15%. Illumine le teint, réduit les taches et unifie la carnation.",
    price: 2900,
    stock: 8,
    lowStockThreshold: 10,
    status: "published",
    flags: { bestSeller: false, newArrival: true, featured: false, onSale: false, outOfStock: false },
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format",
    ],
    ingredients: "Ascorbic Acid 15%, Hyaluronic Acid, Niacinamide, Tocopherol...",
    howToUse: "Appliquer 3-4 gouttes le matin sur peau nette avant la crème hydratante.",
    suitableFor: "Tous types de peau, surtout peaux ternes",
    warnings: "Protéger du soleil après application. Éviter le contour des yeux.",
    size: "30ml",
    createdAt: "2026-04-20T10:00:00Z",
  },
  {
    id: "p5",
    name: "Crème Hydratante Intense",
    brand: "LUMA",
    category: "Soin",
    subcategory: "Crèmes",
    description: "Crème riche en acide hyaluronique et beurre de karité. Hydratation 72h.",
    price: 2400,
    stock: 31,
    lowStockThreshold: 8,
    status: "published",
    flags: { bestSeller: false, newArrival: false, featured: false, onSale: false, outOfStock: false },
    images: [
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop&auto=format",
    ],
    size: "50ml",
    createdAt: "2025-11-01T10:00:00Z",
  },
  {
    id: "p6",
    name: "Kit Contouring Pro",
    brand: "LUMA",
    category: "Teint",
    subcategory: "Contouring",
    description: "Kit complet incluant poudre bronzante, enlumineur et blush pour un maquillage sculpté.",
    price: 5600,
    stock: 14,
    lowStockThreshold: 5,
    status: "published",
    flags: { bestSeller: true, newArrival: false, featured: true, onSale: false, outOfStock: false },
    images: [
      "https://images.unsplash.com/photo-1583241476978-4c1f89f17379?w=400&h=400&fit=crop&auto=format",
    ],
    size: "3 × 8g",
    createdAt: "2026-01-30T10:00:00Z",
  },
  {
    id: "p7",
    name: "Mascara Volume Extrême",
    brand: "LUMA",
    category: "Yeux",
    subcategory: "Mascara",
    description: "Mascara volumisant et allongeant. Formule waterproof tenue 24h.",
    price: 1600,
    stock: 4,
    lowStockThreshold: 10,
    status: "published",
    flags: { bestSeller: false, newArrival: false, featured: false, onSale: false, outOfStock: false },
    images: [
      "https://images.unsplash.com/photo-1631214524020-3c69e4a19e05?w=400&h=400&fit=crop&auto=format",
    ],
    size: "10ml",
    createdAt: "2025-09-15T10:00:00Z",
  },
  {
    id: "p8",
    name: "Huile Démaquillante Rose",
    brand: "LUMA",
    category: "Soin",
    subcategory: "Démaquillants",
    description: "Huile démaquillante luxueuse infusée à l'eau de rose. Élimine maquillage waterproof.",
    price: 1800,
    stock: 0,
    lowStockThreshold: 8,
    status: "published",
    flags: { bestSeller: false, newArrival: false, featured: false, onSale: false, outOfStock: true },
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&auto=format",
    ],
    size: "150ml",
    createdAt: "2025-08-10T10:00:00Z",
  },
];

export const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    name: "Rentrée Beauté 2026",
    description: "Préparez votre rentrée avec les essentiels beauté LUMA. Soins et maquillage sélectionnés pour la saison.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=400&fit=crop&auto=format",
    startDate: "2026-08-15",
    endDate: "2026-09-15",
    active: true,
    productIds: ["p1", "p4", "p5"],
    type: "seasonal",
  },
  {
    id: "c2",
    name: "Meilleures Ventes",
    description: "Les produits les plus appréciés par nos clientes. Qualité certifiée.",
    image: "https://images.unsplash.com/photo-1583241475880-083f84372725?w=800&h=400&fit=crop&auto=format",
    startDate: "2026-01-01",
    active: true,
    productIds: ["p1", "p2", "p6"],
    type: "trending",
  },
  {
    id: "c3",
    name: "Soldes Été",
    description: "Jusqu'à 20% de réduction sur une sélection de produits.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop&auto=format",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    active: true,
    productIds: ["p1", "p3"],
    type: "offer",
  },
];

export const DEMO_AGENCIES: DeliveryAgency[] = [
  {
    id: "a1",
    name: "Yalidine",
    active: true,
    apiConnected: false,
    wilayas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 19, 23, 25, 31],
    stats: { pending: 8, inTransit: 14, delivered: 142, failed: 6, returned: 4 },
    pricing: [{ wilayaCode: 16, price: 400 }, { wilayaCode: 31, price: 500 }],
  },
  {
    id: "a2",
    name: "Zr Express",
    active: true,
    apiConnected: false,
    wilayas: [16, 9, 31, 23, 25, 13, 19, 27],
    stats: { pending: 3, inTransit: 7, delivered: 89, failed: 3, returned: 2 },
    pricing: [{ wilayaCode: 16, price: 450 }, { wilayaCode: 31, price: 550 }],
  },
  {
    id: "a3",
    name: "Procolis",
    active: false,
    apiConnected: false,
    wilayas: [],
    stats: { pending: 0, inTransit: 0, delivered: 0, failed: 0, returned: 0 },
    pricing: [],
  },
];

export const ANALYTICS_DAILY = [
  { date: "28 Jul", orders: 14, confirmed: 10, delivered: 8, revenue: 38400 },
  { date: "29 Jul", orders: 18, confirmed: 14, delivered: 11, revenue: 52800 },
  { date: "30 Jul", orders: 12, confirmed: 9, delivered: 10, revenue: 41200 },
  { date: "31 Jul", orders: 22, confirmed: 17, delivered: 13, revenue: 68100 },
  { date: "1 Aoû", orders: 16, confirmed: 12, delivered: 15, revenue: 55300 },
  { date: "2 Aoû", orders: 25, confirmed: 20, delivered: 12, revenue: 82400 },
  { date: "3 Aoû", orders: 19, confirmed: 15, delivered: 18, revenue: 61700 },
  { date: "4 Aoû", orders: 21, confirmed: 16, delivered: 14, revenue: 71200 },
  { date: "5 Aoû", orders: 9, confirmed: 7, delivered: 6, revenue: 34600 },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Nouveau",
  calling: "En cours",
  confirmed: "Confirmé",
  preparing: "En préparation",
  ready: "Prêt",
  sent: "Envoyé",
  picked_up: "Pris en charge",
  out_for_delivery: "En livraison",
  delivered: "Livré",
  rejected: "Rejeté",
  no_answer: "Sans réponse",
  cancelled: "Annulé",
  failed: "Échoué",
  returned: "Retourné",
};

export const STATUS_CSS: Record<OrderStatus, string> = {
  new: "bg-blue-50 text-blue-700 border border-blue-200",
  calling: "bg-violet-50 text-violet-700 border border-violet-200",
  confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  preparing: "bg-amber-50 text-amber-700 border border-amber-200",
  ready: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  sent: "bg-blue-50 text-blue-800 border border-blue-200",
  picked_up: "bg-sky-50 text-sky-700 border border-sky-200",
  out_for_delivery: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  delivered: "bg-green-50 text-green-800 border border-green-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
  no_answer: "bg-orange-50 text-orange-700 border border-orange-200",
  cancelled: "bg-neutral-100 text-neutral-600 border border-neutral-200",
  failed: "bg-red-50 text-red-700 border border-red-200",
  returned: "bg-orange-50 text-orange-800 border border-orange-200",
};

export function orderTotal(order: Order): number {
  return order.items.reduce((s, i) => s + i.qty * i.unitPrice, 0) + order.deliveryFee;
}

export function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "à l'instant";
  if (diff < 60) return `${diff} min`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

export function formatPrice(da: number): string {
  return da.toLocaleString("fr-DZ") + " DA";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-DZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
