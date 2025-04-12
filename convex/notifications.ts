import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found");
    }

    await ctx.db.patch(args.notificationId, { read: true });
  },
});

export const notifyNewProduct = mutation({
  args: {
    productId: v.id("products"),
    productName: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all users
    const users = await ctx.db.query("users").collect();
    
    // Create a notification for each user
    for (const user of users) {
      await ctx.db.insert("notifications", {
        userId: user._id,
        message: `New product available: ${args.productName}`,
        read: false,
        createdAt: Date.now(),
      });
    }
  },
});
