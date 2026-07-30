import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { labOrderFields } from "./validators";
import { hasPermission } from "../constants";

export const createLabOrder = mutation({
  args: labOrderFields,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "lab", "c")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    return await ctx.db.insert("labOrders", {
      patientId: args.patientId,
      doctorId: args.doctorId,
      testType: args.testType,
      testCode: args.testCode,
      priority: args.priority,
      status: "ordered",
      notes: args.notes,
      clinicalHistory: args.clinicalHistory,
    });
  },
});

export const recordSampleCollection = mutation({
  args: {
    orderId: v.id("labOrders"),
    sampleType: v.string(),
    sampleCollectedById: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "lab", "u")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    if (order.status !== "ordered") throw new Error("Can only collect sample for ordered tests");

    await ctx.db.patch(args.orderId, {
      status: "sample_collected",
      sampleType: args.sampleType,
      sampleCollectedAt: Date.now(),
      sampleCollectedById: args.sampleCollectedById,
    });
  },
});

export const enterLabResults = mutation({
  args: {
    orderId: v.id("labOrders"),
    resultValue: v.string(),
    referenceRange: v.string(),
    isAbnormal: v.boolean(),
    resultNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "lab", "u")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    if (order.status === "completed") throw new Error("Results already completed");
    if (order.status === "cancelled") throw new Error("Cannot enter results for cancelled order");

    await ctx.db.patch(args.orderId, {
      status: "completed",
      resultValue: args.resultValue,
      referenceRange: args.referenceRange,
      isAbnormal: args.isAbnormal,
      resultNotes: args.resultNotes,
      completedAt: Date.now(),
      verifiedById: currentUser._id,
    });
  },
});

export const cancelLabOrder = mutation({
  args: {
    orderId: v.id("labOrders"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "lab", "d")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    if (order.status === "completed") throw new Error("Cannot cancel completed order");

    await ctx.db.patch(args.orderId, {
      status: "cancelled",
      resultNotes: args.reason,
    });
  },
});

export const updateLabOrderStatus = mutation({
  args: {
    orderId: v.id("labOrders"),
    status: v.union(
      v.literal("ordered"),
      v.literal("sample_collected"),
      v.literal("in_analysis"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "lab", "u")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const patch: Record<string, unknown> = { status: args.status };
    if (args.status === "completed") {
      patch.completedAt = Date.now();
    }
    await ctx.db.patch(args.orderId, patch);
  },
});
