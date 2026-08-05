import { Request, Response, NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Non autorisé" }
    });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    if (req.session.role !== "ADMIN") {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Accès refusé - Réservé aux administrateurs" }
      });
    }
    next();
  });
};

export const requireStaff = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    if (req.session.role !== "ADMIN" && req.session.role !== "STAFF") {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Accès refusé - Réservé au personnel" }
      });
    }
    next();
  });
};
