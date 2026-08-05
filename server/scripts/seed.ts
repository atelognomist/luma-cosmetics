import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { connectDB } from "../src/config/db";
import { User } from "../src/models/User";
import { Product } from "../src/models/Product";
import { Category } from "../src/models/Category";
import { Campaign } from "../src/models/Campaign";
import { ProductService } from "../src/services/product.service";

// We import the demo data from the existing frontend prototype to preserve the exact UI state
import { DEMO_PRODUCTS, DEMO_CAMPAIGNS } from "../../src/lib/api/seed";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    // 1. Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Campaign.deleteMany({});
    console.log("Cleared existing collections.");

    // 2. Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required for seeding");
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      name: "Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    });
    await admin.save();
    console.log(`Created admin user: ${adminEmail}`);

    // 3. Create Categories (Extracted from demo products)
    const categorySet = new Set(DEMO_PRODUCTS.map(p => p.category));
    const categoriesMap = new Map();
    for (const catName of categorySet) {
      const cat = new Category({
        name: catName,
        slug: catName.toLowerCase().replace(/ /g, "-"),
        isActive: true,
      });
      await cat.save();
      categoriesMap.set(catName, cat);
    }
    console.log(`Created ${categoriesMap.size} categories.`);

    // 4. Create Products
    for (const pData of DEMO_PRODUCTS) {
      const legacyMedia = [];
      if (pData.image) {
        legacyMedia.push({ type: "image", url: pData.image, sortOrder: 0, isPrimary: true });
      }
      if (pData.images && pData.images.length > 0) {
        pData.images.forEach((url, i) => {
          if (url !== pData.image) {
            legacyMedia.push({ type: "image", url, sortOrder: legacyMedia.length, isPrimary: legacyMedia.length === 0 });
          }
        });
      }
      if (pData.video) {
        legacyMedia.push({ type: "video", url: pData.video, sortOrder: legacyMedia.length, isPrimary: false });
      }

      const product = new Product({
        ...pData,
        media: ProductService.normalizeMedia(pData.media?.length ? pData.media : legacyMedia),
      });
      await product.save();
    }
    console.log(`Created ${DEMO_PRODUCTS.length} products.`);

    // 5. Create Campaigns
    for (const cData of DEMO_CAMPAIGNS) {
      // Find matching products by original IDs to link them
      const campaign = new Campaign({
        name: cData.name,
        description: cData.description,
        image: cData.image,
        video: cData.video,
        startDate: new Date(cData.startDate),
        endDate: cData.endDate ? new Date(cData.endDate) : undefined,
        active: cData.active,
        type: cData.type,
      });
      await campaign.save();
    }
    console.log(`Created ${DEMO_CAMPAIGNS.length} campaigns.`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
