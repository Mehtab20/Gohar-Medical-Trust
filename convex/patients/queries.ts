import { v } from "convex/values";
import { query } from "../_generated/server";
import { hasPermission } from "../constants";

export const getPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "patients", "r")) {
      return null;
    }

    return await ctx.db.get(args.patientId);
  },
});

export const getPatientByMRN = query({
  args: { medicalRecordNumber: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "patients", "r")) {
      return null;
    }

    return await ctx.db
      .query("patients")
      .withIndex("by_mrn", (q) => q.eq("medicalRecordNumber", args.medicalRecordNumber))
      .first();
  },
});

export const listPatients = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("deceased"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "patients", "r")) {
      return [];
    }

    if (args.status) {
      return await ctx.db
        .query("patients")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("patients")
      .order("desc")
      .collect();
  },
});

export const searchPatients = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "patients", "r")) {
      return [];
    }

    const term = args.searchTerm.toLowerCase().trim();
    if (!term) {
      return await ctx.db.query("patients").order("desc").collect();
    }

    // Get all patients and filter (Convex doesn't support full-text search natively)
    const allPatients = await ctx.db.query("patients").order("desc").collect();

    return allPatients.filter((patient) => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const mrn = patient.medicalRecordNumber.toLowerCase();
      const phone = patient.phone.toLowerCase();

      return (
        fullName.includes(term) ||
        mrn.includes(term) ||
        phone.includes(term) ||
        patient.firstName.toLowerCase().includes(term) ||
        patient.lastName.toLowerCase().includes(term)
      );
    });
  },
});

export const getPatientCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { total: 0, active: 0 };

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "patients", "r")) {
      return { total: 0, active: 0 };
    }

    const allPatients = await ctx.db.query("patients").collect();
    return {
      total: allPatients.length,
      active: allPatients.filter((p) => p.status === "active").length,
    };
  },
});
