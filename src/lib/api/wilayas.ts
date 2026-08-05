export interface Wilaya {
  id: number;
  code: string;
  name: string;
}

export interface Commune {
  id: number;
  wilaya_id: number;
  name: string;
}

// Minimal dataset for the prototype. In production, this would be the full 48/58 Wilayas and 1541 Communes.
export const ALGERIA_WILAYAS: Wilaya[] = [
  { id: 16, code: "16", name: "Alger" },
  { id: 31, code: "31", name: "Oran" },
  { id: 25, code: "25", name: "Constantine" },
  { id: 23, code: "23", name: "Annaba" },
  { id: 9, code: "09", name: "Blida" },
  { id: 19, code: "19", name: "Sétif" }
];

export const ALGERIA_COMMUNES: Commune[] = [
  // Alger (16)
  { id: 1601, wilaya_id: 16, name: "Alger Centre" },
  { id: 1602, wilaya_id: 16, name: "Sidi M'Hamed" },
  { id: 1603, wilaya_id: 16, name: "El Madania" },
  { id: 1604, wilaya_id: 16, name: "Bab El Oued" },
  { id: 1605, wilaya_id: 16, name: "Hydra" },
  { id: 1606, wilaya_id: 16, name: "Kouba" },
  
  // Oran (31)
  { id: 3101, wilaya_id: 31, name: "Oran" },
  { id: 3102, wilaya_id: 31, name: "Bir El Djir" },
  { id: 3103, wilaya_id: 31, name: "Es Senia" },
  
  // Constantine (25)
  { id: 2501, wilaya_id: 25, name: "Constantine" },
  { id: 2502, wilaya_id: 25, name: "El Khroub" },
  
  // Annaba (23)
  { id: 2301, wilaya_id: 23, name: "Annaba" },
  { id: 2302, wilaya_id: 23, name: "El Bouni" },
  
  // Blida (9)
  { id: 901, wilaya_id: 9, name: "Blida" },
  { id: 902, wilaya_id: 9, name: "Boufarik" },
  
  // Sétif (19)
  { id: 1901, wilaya_id: 19, name: "Sétif" },
  { id: 1902, wilaya_id: 19, name: "El Eulma" }
];

export async function getWilayas(): Promise<Wilaya[]> {
  // Simulating API fetch
  return ALGERIA_WILAYAS;
}

export async function getCommunesByWilaya(wilayaId: number): Promise<Commune[]> {
  // Simulating API fetch
  return ALGERIA_COMMUNES.filter(c => c.wilaya_id === wilayaId);
}
