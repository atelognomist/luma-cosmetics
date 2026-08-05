import dotenv from "dotenv";
import { connectDB } from "../src/config/db";
import { Product } from "../src/models/Product";
import { Order } from "../src/models/Order";
import { Customer } from "../src/models/Customer";

dotenv.config();

const API = "http://localhost:5000/api";
let adminCookie = "";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (adminCookie) headers["Cookie"] = adminCookie;

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) adminCookie = setCookie.split(";")[0]; // extract connect.sid

  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch (e) {
    return { status: res.status, text };
  }
}

async function runTests() {
  console.log("\n🚀 Starting E2E Functional Tests\n");
  await connectDB();

  try {
    // 1. AUTHENTICATION TEST
    console.log("--- 1. AUTHENTICATION ---");
    const loginRes = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }),
    });
    if (loginRes.status === 200 && loginRes.data.data.role === "ADMIN") {
      console.log("[PASS] Admin login successful");
    } else {
      console.error("[FAIL] Admin login failed:", loginRes);
    }

    const meRes = await fetchAPI("/auth/me");
    if (meRes.status === 200) console.log("[PASS] Session persistence working");
    else console.error("[FAIL] Session persistence failed:", meRes);

    // 2. PRODUCT CRUD & MEDIA TEST
    console.log("\n--- 2. PRODUCT CRUD & MEDIA ---");
    const createRes = await fetchAPI("/products", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Product",
        brand: "LUMA Test",
        category: "Test",
        price: 1000,
        stock: 5,
        media: [
          { type: "video", url: "http://vid.com/1" },
          { type: "image", url: "http://img.com/1" }, // should become primary
          { type: "image", url: "http://img.com/2", isPrimary: true }, // should not override the first since backend fixes logic? Wait, explicit isPrimary takes precedence.
        ]
      })
    });
    
    if (createRes.status === 201) {
      console.log("[PASS] Product created successfully");
      const p = createRes.data.data;
      const primaryMedia = p.media.filter((m: any) => m.isPrimary);
      if (primaryMedia.length === 1 && primaryMedia[0].url === "http://img.com/2") {
        console.log("[PASS] Media correctly normalized and primary enforced");
      } else {
        console.error("[FAIL] Media normalization incorrect:", p.media);
      }
    } else {
      console.error("[FAIL] Product creation failed:", createRes);
    }

    // 3. ATOMIC TRANSACTIONS & CONCURRENCY TEST
    console.log("\n--- 3. ATOMIC TRANSACTIONS & STOCK ---");
    
    // Create a product with stock = 1
    const p1 = new Product({
      name: "Transaction Test Item",
      brand: "Test",
      category: "Test",
      price: 500,
      stock: 1,
      status: "published"
    });
    await p1.save();

    // Create another product with stock = 0
    const p2 = new Product({
      name: "Out of Stock Item",
      brand: "Test",
      category: "Test",
      price: 500,
      stock: 0,
      status: "published"
    });
    await p2.save();

    // Attempt to order p1 (stock=1) AND p2 (stock=0)
    // The transaction should fail on p2 and rollback p1's stock deduction
    const orderRes = await fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify({
        customer: { name: "Test Cust", phone: "0550112233", wilaya: "Alger", commune: "Hydra", address: "Test Addr" },
        items: [
          { productId: p1._id.toString(), qty: 1 },
          { productId: p2._id.toString(), qty: 1 }
        ]
      })
    });

    if (orderRes.status !== 201) {
      console.log("[PASS] Order correctly rejected due to out of stock item");
      // Verify rollback
      const p1Check = await Product.findById(p1._id);
      if (p1Check?.stock === 1) {
        console.log("[PASS] Transaction Rollback Successful! Stock was NOT decremented.");
      } else {
        console.error("[FAIL] Transaction Rollback FAILED! Stock was decremented.", p1Check);
      }
    } else {
      console.error("[FAIL] Order incorrectly succeeded!");
    }

    // 4. ORDER PRICING & SNAPSHOTS
    console.log("\n--- 4. ORDER PRICING SNAPSHOTS ---");
    const validOrderRes = await fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify({
        customer: { name: "Test Cust", phone: "0550112233", wilaya: "Alger", commune: "Hydra", address: "Test Addr" },
        items: [
          { productId: p1._id.toString(), qty: 1 } // p1 price is 500
        ]
      })
    });

    if (validOrderRes.status === 201) {
      const order = validOrderRes.data.data;
      console.log(`[PASS] Order created successfully. Total: ${order.total}`);
      
      // Now change the product price
      await Product.findByIdAndUpdate(p1._id, { price: 900 });

      // Fetch order and ensure price is still snapshotted at 500
      const fetchedOrder = await fetchAPI(`/orders/${order._id}`);
      if (fetchedOrder.data.data.items[0].unitPrice === 500) {
        console.log("[PASS] Order item price properly snapshotted and immune to future price changes");
      } else {
        console.error("[FAIL] Order item price changed! Snapshot failed.");
      }
      
      // Check customer creation
      const cust = await Customer.findOne({ phone: "0550112233" });
      if (cust) {
        console.log("[PASS] Customer record correctly created/linked");
      } else {
        console.error("[FAIL] Customer record missing");
      }

    } else {
      console.error("[FAIL] Valid order creation failed:", validOrderRes);
    }

    console.log("\n--- TESTS COMPLETE ---");
    process.exit(0);
  } catch (error) {
    console.error("Test execution failed:", error);
    process.exit(1);
  }
}

runTests();
