import crypto from "crypto";

const BASE_URL = "https://luma-cosmetics.onrender.com/api";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@luma.dz";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "2N2KdtPc0619!"; 

async function runTests() {
  console.log("Starting Product Visibility Tests...");

  try {
    // 1. Authenticate as admin
    const authRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    if (!authRes.ok) throw new Error("Auth failed");
    const setCookie = authRes.headers.get('set-cookie');
    const sessionCookie = setCookie ? setCookie.split(';')[0] : "";

    const fetchAdmin = async (path: string, options: any = {}) => {
      const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          "Cookie": sessionCookie
        }
      });
      return res;
    };

    const fetchPublic = async (path: string) => {
      return fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" }
      });
    };

    // 2. Create a test product
    const pRes = await fetchAdmin("/products", {
      method: "POST",
      body: JSON.stringify({
        name: "Visibility Test Product",
        brand: "Luma",
        category: "Teint",
        price: 1500,
        stock: 50,
        status: "published",
        lowStockThreshold: 10
      })
    });
    const pData = await pRes.json();
    const productId = pData.data.id || pData.data._id;
    console.log(`Created test product ${productId} with status 'published'`);

    // 3. Create an order containing this product (for snapshot test later)
    const oRes = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({
        customer: { name: "Test Cust", phone: "0555555555", wilaya: "Alger", commune: "Alger", address: "Test" },
        items: [{ productId: productId, qty: 1 }],
        deliveryFee: 400
      })
    });
    const oData = await oRes.json();
    const orderId = oData.data.id || oData.data._id;
    console.log(`Created order ${orderId} containing test product`);

    // 4. Verify product appears publicly
    const pubList1 = await fetchPublic("/products");
    const pubListData1 = await pubList1.json();
    if (!pubListData1.data.find((p: any) => p.id === productId || p._id === productId)) {
      throw new Error("Published product missing from public list");
    }
    console.log("Published product appears publicly.");

    // 5. Archive product
    await fetchAdmin(`/products/${productId}`, {
      method: "DELETE" // Soft delete
    });
    console.log("Product archived.");

    // 6. Verify product no longer appears publicly
    const pubList2 = await fetchPublic("/products");
    const pubListData2 = await pubList2.json();
    if (pubListData2.data.find((p: any) => p.id === productId || p._id === productId)) {
      throw new Error("Archived product still appears in public list!");
    }
    console.log("Archived product successfully hidden from public list.");

    // 7. Verify public product-detail returns 404
    const pubDetail = await fetchPublic(`/products/${productId}`);
    if (pubDetail.status !== 404) {
      throw new Error(`Public detail returned ${pubDetail.status}, expected 404`);
    }
    console.log("Public detail endpoint correctly returned 404 for archived product.");

    // 8. Verify product remains accessible to admin
    const adminDetail = await fetchAdmin(`/products/${productId}?admin=true`);
    if (!adminDetail.ok) {
      throw new Error(`Admin detail returned ${adminDetail.status}, expected success`);
    }
    const adminDetailData = await adminDetail.json();
    if (adminDetailData.data.status !== "archived") {
      throw new Error(`Expected status archived, got ${adminDetailData.data.status}`);
    }
    console.log("Admin detail successfully accessed archived product.");

    // 9. Verify admin list
    const adminList = await fetchAdmin(`/products?admin=true`);
    const adminListData = await adminList.json();
    if (!adminListData.data.find((p: any) => p.id === productId || p._id === productId)) {
      throw new Error("Archived product missing from admin list!");
    }
    console.log("Admin list successfully includes archived product.");

    // 10. Verify order snapshot is unchanged
    const adminOrder = await fetchAdmin(`/orders/${orderId}`);
    const adminOrderData = await adminOrder.json();
    const orderItem = adminOrderData.data.items[0];
    if (orderItem.name !== "Visibility Test Product") {
      throw new Error("Order snapshot corrupted!");
    }
    console.log("Order snapshot remained perfectly intact.");

    console.log("\nALL VISIBILITY TESTS PASSED!");
    process.exit(0);

  } catch (err) {
    console.error("TEST FAILED:", err);
    process.exit(1);
  }
}

runTests();
