import { Request, Response, NextFunction } from "express";

export const requireCsrfValidation = (req: Request, res: Response, next: NextFunction) => {
  // Only apply to state-changing requests
  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
    const origin = req.headers.origin;
    
    // Browsers always send an Origin header for cross-origin POST requests.
    if (origin) {
      const allowedOrigins: string[] = [];
      if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
      if (process.env.ADMIN_FRONTEND_URL) allowedOrigins.push(process.env.ADMIN_FRONTEND_URL);
      if (process.env.NODE_ENV !== "production") allowedOrigins.push("http://localhost:5173");

      if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({
          error: { code: "FORBIDDEN", message: "Invalid Origin (CSRF Protection)" }
        });
      }
    } else {
      // If Origin is missing, only allow it if the request is NOT authenticated.
      // Authenticated state-changing requests MUST provide a valid Origin.
      if (req.session && req.session.userId) {
        return res.status(403).json({
          error: { code: "FORBIDDEN", message: "Origin header required for authenticated mutations (CSRF Protection)" }
        });
      }
    }
  }
  next();
};
