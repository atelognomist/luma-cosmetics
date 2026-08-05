import { Router } from "express";
import { Campaign } from "../models/Campaign.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const filter = req.session?.userId ? {} : { active: true };
    const campaigns = await Campaign.find(filter).sort({ startDate: -1 });
    res.json({ data: campaigns });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json({ data: campaign });
  } catch (err: any) {
    res.status(400).json({ error: { code: "BAD_REQUEST", message: err.message } });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!campaign) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Campagne non trouvée" } });
    res.json({ data: campaign });
  } catch (err: any) {
    res.status(400).json({ error: { code: "BAD_REQUEST", message: err.message } });
  }
});

export default router;
