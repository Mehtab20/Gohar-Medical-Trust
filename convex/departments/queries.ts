import { v } from "convex/values";
import { query } from "../_generated/server";

// ────────────────────────────────────
// Departments
// ────────────────────────────────────

export const getDepartment = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.departmentId);
  },
});

export const listDepartments = query({
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

export const listActiveDepartments = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("departments").collect();
    return all.filter((d) => d.isActive);
  },
});

// ────────────────────────────────────
// Rooms
// ────────────────────────────────────

export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

export const listRooms = query({
  args: {
    departmentId: v.optional(v.id("departments")),
    status: v.optional(
      v.union(v.literal("available"), v.literal("occupied"), v.literal("maintenance"), v.literal("reserved")),
    ),
  },
  handler: async (ctx, args) => {
    let rooms = await ctx.db.query("rooms").collect();

    if (args.departmentId) {
      rooms = rooms.filter((r) => r.departmentId === args.departmentId);
    }
    if (args.status) {
      rooms = rooms.filter((r) => r.status === args.status);
    }

    return rooms;
  },
});

export const getRoomStats = query({
  handler: async (ctx) => {
    const rooms = await ctx.db.query("rooms").collect();
    return {
      total: rooms.length,
      available: rooms.filter((r) => r.status === "available").length,
      occupied: rooms.filter((r) => r.status === "occupied").length,
      maintenance: rooms.filter((r) => r.status === "maintenance").length,
      totalCapacity: rooms.reduce((sum, r) => sum + r.capacity, 0),
      occupiedCount: rooms.reduce((sum, r) => sum + r.occupiedBeds, 0),
    };
  },
});
