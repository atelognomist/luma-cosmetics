import { ApiClient } from "./client";
import type { Campaign } from "./types";

function normalizeCampaign(c: any): Campaign {
  if (c._id && !c.id) c.id = c._id.toString();
  return c as Campaign;
}

export async function getCampaigns(): Promise<Campaign[]> {
  const campaigns = await ApiClient.get<Campaign[]>("/campaigns");
  return campaigns.map(normalizeCampaign);
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  try {
    const campaign = await ApiClient.get<Campaign>(`/campaigns/${id}`);
    return normalizeCampaign(campaign);
  } catch (err) {
    return null;
  }
}

export async function createCampaign(campaign: Omit<Campaign, "id">): Promise<Campaign> {
  const newCampaign = await ApiClient.post<Campaign>("/campaigns", campaign);
  return normalizeCampaign(newCampaign);
}

export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
  const updatedCampaign = await ApiClient.patch<Campaign>(`/campaigns/${id}`, updates);
  return normalizeCampaign(updatedCampaign);
}

export async function deleteCampaign(id: string): Promise<void> {
  // Our backend doesn't explicitly have deleteCampaign yet, but we stub it.
  await ApiClient.delete(`/campaigns/${id}`);
}
