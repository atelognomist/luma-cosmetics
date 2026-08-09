import dotenv from "dotenv";
import { connectDB } from "../src/config/db";
import { Product } from "../src/models/Product.js";
import { Order } from "../src/models/Order.js";
import mongoose from "mongoose";
import crypto from "crypto";

dotenv.config();

const API = "http://localhost:5000/api";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch (e) {
    return { status: res.status, text };
  }
}

async function runConcurrencyTest() {
  console.log("\n🚀 Starting E2E Concurrency & Idempotency Test\n");
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI not set in .env");
  await mongoose.connect(mongoUri);

  // Create test product with exactly 1 stock
  const p1 = new Product({
    name: "Concurrency Test Item",
    brand: "Test",
    category: "Test",
    price: 500,
    stock: 1,
    status: "published"
  });
  await p1.save();
  console.log(`Created test product with 1 stock: ${p1._id}`);

  console.log("Firing 5 simultaneous orders...");
  
  const requests = Array.from({ length: 5 }).map((_, i) => {
    return fetchAPI("/orders", {
      method: "POST",
      headers: {
        "Idempotency-Key": crypto.randomUUID() // Different keys to simulate 5 DIFFERENT customers ordering the same item at the exact same millisecond
      },
      body: JSON.stringify({
        customer: { name: `Cust ${i}`, phone: `0550${i}12233`, wilaya: "Alger", commune: "Hydra", address: "Test Addr" },
        items: [{ productId: p1._id.toString(), qty: 1 }]
      })
    });
  });

  const results = await Promise.all(requests);
  
  let successes = 0;
  let rejections = 0;
  
  for (const res of results) {
    if (res.status === 201) successes++;
    else if (res.status === 400 && (res.data?.error?.message?.includes("Stock insuffisant") || res.data?.error?.message?.includes("Write conflict"))) rejections++;
    else console.error("Unexpected response:", res);
  }

  console.log(`\nResults: ${successes} Success, ${rejections} Rejected (Insufficient Stock)`);
  
  const p1Final = await Product.findById(p1._id);
  console.log(`Final Product Stock: ${p1Final?.stock}`);

  if (successes === 1 && rejections === 4 && p1Final?.stock === 0) {
    console.log("\n✅ [PASS] Concurrency accurately caught!");
  } else {
    console.log("\n❌ [FAIL] Concurrency test failed.");
  }

  // --- Idempotency Test ---
  console.log("\n--- Testing Idempotency ---");
  const idempKey = crypto.randomUUID();
  const payload = {
    customer: { name: `Cust Idemp`, phone: `0660112233`, wilaya: "Alger", commune: "Hydra", address: "Test Addr" },
    items: [{ productId: p1._id.toString(), qty: 1 }]
  };
  
  // We'll restock to 1 to test
  await Product.updateOne({ _id: p1._id }, { stock: 1 });

  const req1 = await fetchAPI("/orders", { method: "POST", headers: { "Idempotency-Key": idempKey }, body: JSON.stringify(payload) });
  const req2 = await fetchAPI("/orders", { method: "POST", headers: { "Idempotency-Key": idempKey }, body: JSON.stringify(payload) });
  
  if (req1.status === 201 && req2.status === 201 && req1.data.data._id === req2.data.data._id) {
    console.log("✅ [PASS] Idempotency exactly matched existing order, no duplicate created.");
  } else {
    console.log("❌ [FAIL] Idempotency failed.", req1.status, req2.status, req2.data);
  }

  process.exit(0);
}

runConcurrencyTest();
