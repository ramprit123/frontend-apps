import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Initial vendors data
const initialVendors = [
  {
    name: "Green Valley Farms",
    description: "Family-owned farm specializing in organic produce",
    logo: "https://images.unsplash.com/photo-1595351298020-038700609878?w=800",
    address: "123 Farm Road, Valley City",
    rating: 4.8,
    isVerified: true,
  },
  {
    name: "Fresh Fields Market",
    description: "Local market with fresh, seasonal produce",
    logo: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
    address: "456 Market Street, Harvest Town",
    rating: 4.5,
    isVerified: true,
  },
  {
    name: "Urban Garden Co",
    description: "Urban farming with hydroponically grown vegetables",
    logo: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
    address: "789 City Center, Metro City",
    rating: 4.7,
    isVerified: true,
  },
];

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("vendors").collect();
  },
});

export const getMyVendorProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    return vendor;
  },
});

export const register = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    logo: v.string(),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user is already a vendor
    const existingVendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (existingVendor) {
      throw new Error("User is already a vendor");
    }

    return await ctx.db.insert("vendors", {
      ...args,
      userId,
      rating: 5.0,
      isVerified: false,
    });
  },
});

// Initialize vendors
export const initialize = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    for (const vendor of initialVendors) {
      await ctx.db.insert("vendors", {
        ...vendor,
        userId,
      });
    }
  },
});
