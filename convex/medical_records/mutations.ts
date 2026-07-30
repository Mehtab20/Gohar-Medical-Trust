import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { medicalRecordFields } from "./validators";
import { hasPermission } from "../constants";

export const createMedicalRecord = mutation({
  args: medicalRecordFields,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "medicalRecords", "c")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    return await ctx.db.insert("medicalRecords", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateMedicalRecord = mutation({
  args: {
    recordId: v.id("medicalRecords"),
    ...medicalRecordFields,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "medicalRecords", "u")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const { recordId, ...fields } = args;
    await ctx.db.patch(recordId, { ...fields });
  },
});

export const deleteMedicalRecord = mutation({
  args: { recordId: v.id("medicalRecords") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "medicalRecords", "d")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    await ctx.db.delete(args.recordId);
  },
});
