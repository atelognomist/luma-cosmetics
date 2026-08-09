import crypto from "crypto";

const BASE_URL = "https://luma-cosmetics.onrender.com/api";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@luma.dz";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "2N2KdtPc0619!"; 

async function runProductionTests() {
  console.log(`Starting Remaining Production E2E Tests (Order Deletion Only) against ${BASE_URL}...`);
  
  try {
    // 1. Authentication
    console.log("\n[1] Authenticating as Admin...");
    const authRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    if (!authRes.ok) throw new Error(`Auth failed: ${authRes.status}`);
    const setCookie = authRes.headers.get('set-cookie');
    const sessionCookie = setCookie ? setCookie.split(';')[0] : "";
    console.log("Authenticated successfully. Session cookie acquired.");

    console.log("Fetching CSRF token...");
    const csrfRes = await fetch(`${BASE_URL}/csrf-token`, { headers: { "Cookie": sessionCookie } });
    let csrfToken = "";
    if (csrfRes.ok) {
        const csrfData = await csrfRes.json();
        csrfToken = csrfData.data?.csrfToken || "";
    }

    const fetchAdmin = async (path: string, options: any = {}) => {
      const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          "Cookie": sessionCookie,
          "Origin": "https://luma-cosmetics-shop.vercel.app"
        }
      });
      if (!res.ok && options.method && options.method !== 'GET') {
          const text = await res.text();
          console.error(`Admin request failed: ${path} [${res.status}] ${text}`);
      }
      return res;
    };

    // 2. Setup product (need one to make an order)
    console.log("\n[2] Fetching/Setting up test product...");
    const prodRes = await fetchAdmin(`/products`);
    const prodData = await prodRes.json();
    let product = prodData.data.find((p: any) => p.name === "Test E2E Product");
    
    if (!product) {
        throw new Error("Test E2E Product not found! Please run the full suite first.");
    }
    const productId = product.id || product._id;
    await fetchAdmin(`/products/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "published" })
    });
    console.log(`Product found and republished: ${product.name} (ID: ${productId}, Stock: ${product.stock})`);

    // 3. Create an order
    console.log("\n[3] Creating order to delete...");
    const idemKey = crypto.randomUUID();
    const idemPayload = {
      customer: { name: "Deletion Tester", phone: "0555555555", wilaya: "Alger", commune: "Alger", address: "Test" },
      items: [{ productId: productId, qty: 1 }],
      deliveryFee: 400
    };

    const orderReq = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": idemKey, "Origin": "https://luma-cosmetics-shop.vercel.app" },
      body: JSON.stringify(idemPayload)
    });
    if (!orderReq.ok) throw new Error("Order creation failed: " + await orderReq.text());
    const orderRes = await orderReq.json();
    const orderId = orderRes.data.id || orderRes.data._id;
    console.log(`Order created: ${orderId}`);

    const preDeleteStock = (await (await fetchAdmin(`/products/${productId}`)).json()).data.stock;
    console.log(`Stock before deletion: ${preDeleteStock}`);

    // 4. Admin Order Hard Delete
    console.log("\n[4] Testing Order Hard Delete...");
    const deleteRes = await fetchAdmin(`/orders/${orderId}`, { method: "DELETE" });
    if (!deleteRes.ok) throw new Error("Order deletion request failed!");
    
    // Verify it's gone
    const orderVerifyRes = await fetchAdmin(`/orders/${orderId}`);
    if (orderVerifyRes.ok) throw new Error("Order not deleted! (Still accessible via GET)");
    console.log("Order deleted successfully.");

    // Make sure stock wasn't restored by hard delete
    const postDeleteStock = (await (await fetchAdmin(`/products/${productId}`)).json()).data.stock;
    console.log(`Stock after hard delete: ${postDeleteStock} (Expected: ${preDeleteStock})`);
    
    if (preDeleteStock !== postDeleteStock) {
        throw new Error("Stock was modified by order deletion! It should not be restored.");
    }

    console.log("\n🎉 ALL REMAINING E2E PRODUCTION TESTS PASSED SUCCESSFULLY! 🎉");
    process.exit(0);

  } catch (error) {
    console.error("E2E TEST FAILED:");
    console.error(error);
    process.exit(1);
  }
}

runProductionTests();
