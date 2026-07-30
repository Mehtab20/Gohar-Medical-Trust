import { v } from "convex/values";
import { query } from "../_generated/server";
import { hasPermission } from "../constants";

export const getMedicalRecord = query({
  args: { recordId: v.id("medicalRecords") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "medicalRecords", "r")) return null;

    const record = await ctx.db.get(args.recordId);
    if (!record) return null;

    // Check confidentiality — only the author doctor or authorized roles can view confidential records
    if (record.isConfidential) {
      const canViewConfidential =
        currentUser.role === "super_admin" ||
        currentUser.role === "admin" ||
        record.doctorId === currentUser._id;
      if (!canViewConfidential) return null;
    }

    return record;
  },
});

export const listRecordsByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "medicalRecords", "r")) return [];

    const records = await ctx.db
      .query("medicalRecords")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();

    // Filter out confidential records if not authorized
    const canViewConfidential =
      currentUser.role === "super_admin" ||
      currentUser.role === "admin";
    if (canViewConfidential) return records;

    return records.filter((r) => !r.isConfidential || r.doctorId === currentUser._id);
  },
});

export const listRecordsByDoctor = query({
  args: { doctorId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("medicalRecords")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .order("desc")
      .collect();
  },
});

export const listRecentRecords = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "medicalRecords", "r")) return [];

    const limit = args.limit ?? 20;
    const records = await ctx.db
      .query("medicalRecords")
      .order("desc")
      .take(limit);

    // Filter confidential
    const canViewConfidential =
      currentUser.role === "super_admin" ||
      currentUser.role === "admin";
    if (canViewConfidential) return records;

    return records.filter((r) => !r.isConfidential || r.doctorId === currentUser._id);
  },
});

export const getRecordCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const allRecords = await ctx.db.query("medicalRecords").collect();
    return allRecords.length;
  },
});
