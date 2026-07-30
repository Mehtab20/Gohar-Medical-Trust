import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { departmentFields, roomFields } from "./validators";
import { hasPermission } from "../constants";

// ────────────────────────────────────
// Departments
// ────────────────────────────────────

export const createDepartment = mutation({
  args: departmentFields,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "admin", "c")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    return await ctx.db.insert("departments", args);
  },
});

export const updateDepartment = mutation({
  args: {
    departmentId: v.id("departments"),
    ...departmentFields,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "admin", "u")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const { departmentId, ...fields } = args;
    await ctx.db.patch(departmentId, { ...fields });
  },
});

export const deleteDepartment = mutation({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "admin", "d")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    await ctx.db.patch(args.departmentId, { isActive: false });
  },
});

// ────────────────────────────────────
// Rooms
// ────────────────────────────────────

export const createRoom = mutation({
  args: {
    ...roomFields,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "admin", "c")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    return await ctx.db.insert("rooms", {
      ...args,
      occupiedBeds: 0,
      status: "available",
    });
  },
});

export const updateRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    ...roomFields,
    status: v.optional(
      v.union(v.literal("available"), v.literal("occupied"), v.literal("maintenance"), v.literal("reserved")),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "admin", "u")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const { roomId, ...fields } = args;
    await ctx.db.patch(roomId, { ...fields });
  },
});

export const deleteRoom = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "admin", "d")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    await ctx.db.patch(args.roomId, { status: "maintenance" });
  },
});
