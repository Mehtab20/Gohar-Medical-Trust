import { v } from "convex/values";
import { query } from "../_generated/server";

export const getLabOrder = query({
  args: { orderId: v.id("labOrders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db.get(args.orderId);
  },
});

export const listLabOrders = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("ordered"),
        v.literal("sample_collected"),
        v.literal("in_analysis"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const limit = args.limit ?? 50;

    if (args.status) {
      return await ctx.db
        .query("labOrders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    }

    return await ctx.db.query("labOrders").order("desc").take(limit);
  },
});

export const listLabOrdersByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("labOrders")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
  },
});

export const listLabOrdersByDoctor = query({
  args: { doctorId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("labOrders")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .order("desc")
      .collect();
  },
});

export const getLabWorklist = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { pending: 0, collected: 0, inAnalysis: 0, completed: 0, cancelled: 0, total: 0 };

    const allOrders = await ctx.db.query("labOrders").collect();

    return {
      pending: allOrders.filter((o) => o.status === "ordered").length,
      collected: allOrders.filter((o) => o.status === "sample_collected").length,
      inAnalysis: allOrders.filter((o) => o.status === "in_analysis").length,
      completed: allOrders.filter((o) => o.status === "completed").length,
      cancelled: allOrders.filter((o) => o.status === "cancelled").length,
      total: allOrders.length,
    };
  },
});

export const getPendingCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const pending = await ctx.db
      .query("labOrders")
      .withIndex("by_status", (q) => q.eq("status", "ordered"))
      .collect();
    return pending.length;
  },
});
