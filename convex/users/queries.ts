import { v } from "convex/values";
import { query } from "../_generated/server";
import { hasPermission } from "../constants";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    return user ?? null;
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "staff", "r")) {
      return null;
    }

    return await ctx.db.get(args.userId);
  },
});

export const listUsersByRole = query({
  args: {
    role: v.union(
      v.literal("super_admin"),
      v.literal("admin"),
      v.literal("doctor"),
      v.literal("nurse"),
      v.literal("receptionist"),
      v.literal("pharmacist"),
      v.literal("lab_technician"),
      v.literal("radiologist"),
      v.literal("billing_staff"),
      v.literal("hr"),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});

export const listUsers = query({
  args: {
    role: v.optional(
      v.union(
        v.literal("super_admin"),
        v.literal("admin"),
        v.literal("doctor"),
        v.literal("nurse"),
        v.literal("receptionist"),
        v.literal("pharmacist"),
        v.literal("lab_technician"),
        v.literal("radiologist"),
        v.literal("billing_staff"),
        v.literal("hr"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "staff", "r")) {
      return [];
    }

    if (args.role) {
      return await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", args.role!))
        .collect();
    }

    return await ctx.db.query("users").collect();
  },
});
