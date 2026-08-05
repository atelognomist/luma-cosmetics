import { dbGet, dbSet } from "./adapter";
import { DEMO_AGENCIES } from "./seed";
import type { DeliveryAgency } from "./types";

const DB_KEY = "luma_delivery_agencies";

export async function getDeliveryAgencies(): Promise<DeliveryAgency[]> {
  let agencies = await dbGet<DeliveryAgency[]>(DB_KEY);
  if (!agencies) {
    agencies = DEMO_AGENCIES as DeliveryAgency[];
    await dbSet(DB_KEY, agencies);
  }
  return agencies;
}
