import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addToCart = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("cart", {
      userId,
      productId: args.productId,
      quantity: args.quantity,
    });
  },
});

export const getCart = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const products = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return { ...item, product };
      })
    );

    return products;
  },
});
