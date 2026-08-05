import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import campaignsRoutes from "./routes/campaigns.routes.js";

export const app = express();

// Security middleware
app.use(helmet());

// CORS configuration (allow credentials for cookies)
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? [
      "https://luma-cosmetics.com",
      "https://www.luma-cosmetics.com",
      "https://admin.luma-cosmetics.com"
    ]
  : [
      "https://luma-cosmetics.com",
      "https://www.luma-cosmetics.com",
      "https://admin.luma-cosmetics.com",
      "http://localhost:5173"
    ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

const sessionSecret = process.env.SESSION_SECRET;
if (process.env.NODE_ENV === "production" && !sessionSecret) {
  throw new Error("SESSION_SECRET is required in production environment");
}

app.use(
  session({
    secret: sessionSecret || "development_fallback_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax", // Lax preferred as requested
      domain: process.env.NODE_ENV === "production" ? ".luma-cosmetics.com" : undefined,
    },
  })
);

// Rate Limiting Config
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: { code: "TOO_MANY_REQUESTS", message: "Trop de tentatives de connexion, veuillez réessayer plus tard" } }
});

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: { code: "TOO_MANY_REQUESTS", message: "Trop de commandes créées, veuillez réessayer plus tard" } }
});

// Routes
app.use("/api/auth/login", loginLimiter);
app.use("/api/orders", (req, res, next) => {
  // Only rate limit POST (order creation), not GET (admin viewing orders)
  if (req.method === "POST") return orderLimiter(req, res, next);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/campaigns", campaignsRoutes);

// Health check verifying database connection without exposing details
app.get("/api/health", (req, res) => {
  // mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ data: { status: "ok" } });
  } else {
    return res.status(503).json({ error: { code: "SERVICE_UNAVAILABLE", message: "Database unreachable" } });
  }
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: { code: "SERVER_ERROR", message: "Erreur serveur interne" } });
});
