import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    
    // Fetch vendor information for each product
    const productsWithVendors = await Promise.all(
      products.map(async (product) => {
        const vendor = await ctx.db.get(product.vendorId);
        return {
          ...product,
          vendor,
        };
      })
    );
    
    return productsWithVendors;
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    images: v.array(v.string()),
    stock: v.number(),
    unit: v.string(),
    nutrition: v.optional(v.object({
      calories: v.number(),
      protein: v.number(),
      carbs: v.number(),
      fat: v.number(),
    })),
    origin: v.string(),
    organic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get vendor profile
    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!vendor) {
      throw new Error("Must be a vendor to add products");
    }

    const productId = await ctx.db.insert("products", {
      ...args,
      isNew: true,
      vendorId: vendor._id,
    });

    await ctx.scheduler.runAfter(0, api.notifications.notifyNewProduct, {
      productId,
      productName: args.name,
    });

    return productId;
  },
});
