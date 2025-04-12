import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  vendors: defineTable({
    name: v.string(),
    description: v.string(),
    logo: v.string(),
    address: v.string(),
    userId: v.id("users"),
    rating: v.number(),
    isVerified: v.boolean(),
  }).index("by_user", ["userId"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    images: v.array(v.string()),
    stock: v.number(),
    isNew: v.boolean(),
    vendorId: v.id("vendors"),
    unit: v.string(),
    nutrition: v.optional(v.object({
      calories: v.number(),
      protein: v.number(),
      carbs: v.number(),
      fat: v.number(),
    })),
    origin: v.string(),
    organic: v.boolean(),
  })
    .index("by_category", ["category"])
    .index("by_vendor", ["vendorId"]),

  cart: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  }).index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.id("users"),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
