import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { LoginSchema } from "../validators/auth.validator.js";
import { AuthService } from "../services/auth.service.js";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = Router();

router.post("/login", validate(LoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.validateCredentials(email, password);
    
    if (!user) {
      return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Email ou mot de passe incorrect" } });
    }

    // Set session
    req.session.userId = user._id.toString();
    req.session.role = user.role;

    res.json({ data: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

router.post("/logout", requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur lors de la déconnexion" } });
    }
    res.clearCookie("connect.sid");
    res.json({ data: { success: true } });
  });
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-passwordHash");
    if (!user || !user.active) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Non autorisé" } });
    }
    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur" } });
  }
});

export default router;
