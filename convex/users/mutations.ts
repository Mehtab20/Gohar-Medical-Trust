import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { hasPermission } from "../constants";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
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
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "staff", "c")) {
      throw new Error("Forbidden");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
      isActive: true,
      phone: args.phone,
    });
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
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
    isActive: v.optional(v.boolean()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "staff", "u")) {
      throw new Error("Forbidden");
    }

    const patch: Record<string, unknown> = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.role !== undefined) patch.role = args.role;
    if (args.isActive !== undefined) patch.isActive = args.isActive;
    if (args.phone !== undefined) patch.phone = args.phone;

    await ctx.db.patch(args.userId, patch);
  },
});

export const deactivateUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "staff", "d")) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(args.userId, { isActive: false });
  },
});
