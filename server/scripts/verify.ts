import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../src/config/db";
import { User } from "../src/models/User";
import { Product } from "../src/models/Product";
import { Category } from "../src/models/Category";
import { Campaign } from "../src/models/Campaign";

dotenv.config();

const verify = async () => {
  try {
    await connectDB();
    console.log("\n--- VERIFICATION REPORT ---");

    // Check Admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log(`[PASS] Admin exists with email: ${admin.email}`);
      console.log(`[PASS] Password is hashed: ${admin.passwordHash.startsWith("$2b$")}`); // Check bcrypt signature
    } else {
      console.log(`[FAIL] Admin not found!`);
    }

    // Check Products
    const productsCount = await Product.countDocuments();
    console.log(`[PASS] Products exist: ${productsCount} found.`);

    const sampleProduct = await Product.findOne();
    if (sampleProduct) {
      console.log(`[PASS] Sample product media check: Found ${sampleProduct.media?.length || 0} media items.`);
      const hasPrimary = sampleProduct.media.some((m: any) => m.isPrimary);
      console.log(`[PASS] Sample product has primary media: ${hasPrimary}`);
    }

    // Check Categories
    const categoriesCount = await Category.countDocuments();
    console.log(`[PASS] Categories exist: ${categoriesCount} found.`);

    // Check Campaigns
    const campaignsCount = await Campaign.countDocuments();
    console.log(`[PASS] Campaigns exist: ${campaignsCount} found.`);

    console.log("--- END VERIFICATION ---");
    process.exit(0);
  } catch (error) {
    console.error("Verification error:", error);
    process.exit(1);
  }
};

verify();
