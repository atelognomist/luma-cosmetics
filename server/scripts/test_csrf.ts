import http from "http";
import dotenv from "dotenv";
dotenv.config();

process.env.FRONTEND_URL = process.env.FRONTEND_URL || "https://luma-cosmetics.com";
process.env.ADMIN_FRONTEND_URL = process.env.ADMIN_FRONTEND_URL || "https://admin.luma-cosmetics.com";

import express from "express";
import session from "express-session";
import { requireCsrfValidation } from "../src/middleware/csrf.js";

const FRONTEND = process.env.FRONTEND_URL;
const MALICIOUS = "https://evil-hacker.com";

const PORT = 5055;

const testApp = express();
testApp.use(express.json());
testApp.use(session({ secret: "test", resave: false, saveUninitialized: false }));

// Dummy authentication route
testApp.post("/login", (req, res) => {
  req.session.userId = "test_user_id";
  res.send("logged in");
});

testApp.use(requireCsrfValidation);

testApp.post("/api/orders", (req, res) => res.send("Order placed")); // Public mutation
testApp.post("/api/products", (req, res) => { // Mock authenticated mutation
  if (!req.session.userId) return res.status(401).send("Unauthorized");
  res.send("Product created");
});
testApp.get("/api/products", (req, res) => res.send("Products list")); // GET request
testApp.options("/api/products", (req, res) => res.send("OPTIONS okay"));

const testServer = http.createServer(testApp);

async function runTests() {
  await new Promise<void>((resolve) => testServer.listen(PORT, () => resolve()));
  console.log("🟢 Test Server running on port " + PORT + "\n");
  
  let passed = 0;
  let failed = 0;

  async function assertRequest(name: string, endpoint: string, method: string, origin: string | null, auth: boolean, expectedStatus: number) {
    let cookie = "";
    if (auth) {
      const loginRes = await fetch(`http://localhost:${PORT}/login`, { method: "POST" });
      cookie = loginRes.headers.get("set-cookie") || "";
    }

    const headers: any = { "Content-Type": "application/json" };
    if (origin) headers["Origin"] = origin;
    if (cookie) headers["Cookie"] = cookie;

    const res = await fetch(`http://localhost:${PORT}${endpoint}`, { method, headers });
    
    if (res.status === expectedStatus) {
      console.log(`✅ [PASS] ${name} (Expected: ${expectedStatus}, Got: ${res.status})`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} (Expected: ${expectedStatus}, Got: ${res.status})`);
      failed++;
    }
  }

  try {
    console.log("--- AUTHENTICATED MUTATIONS ---");
    await assertRequest("Auth Mutation + Valid Origin -> Allowed", "/api/products", "POST", FRONTEND, true, 200);
    await assertRequest("Auth Mutation + Malicious Origin -> 403", "/api/products", "POST", MALICIOUS, true, 403);
    await assertRequest("Auth Mutation + Missing Origin -> 403", "/api/products", "POST", null, true, 403);

    console.log("\n--- PUBLIC MUTATIONS (e.g. POST /api/orders) ---");
    await assertRequest("Public Mutation + Valid Origin -> Allowed", "/api/orders", "POST", FRONTEND, false, 200);
    await assertRequest("Public Mutation + Malicious Origin -> 403", "/api/orders", "POST", MALICIOUS, false, 403);
    await assertRequest("Public Mutation + Missing Origin -> Allowed", "/api/orders", "POST", null, false, 200);

    console.log("\n--- SAFE METHODS (GET, OPTIONS) ---");
    await assertRequest("GET Request + Malicious Origin -> Allowed", "/api/products", "GET", MALICIOUS, false, 200);
    await assertRequest("OPTIONS Request + Malicious Origin -> Allowed", "/api/products", "OPTIONS", MALICIOUS, false, 200);

  } catch (err) {
    console.error("Fatal test error:", err);
  } finally {
    testServer.close();
    console.log(`\nTest Summary: ${passed} Passed, ${failed} Failed`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
