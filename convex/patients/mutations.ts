import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { patientFields } from "./validators";
import { hasPermission } from "../constants";

function generateMRN(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `GMT-${year}-${random}`;
}

export const createPatient = mutation({
  args: {
    ...patientFields,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "patients", "c")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    // Generate unique MRN
    let medicalRecordNumber = generateMRN();
    let existing = await ctx.db
      .query("patients")
      .withIndex("by_mrn", (q) => q.eq("medicalRecordNumber", medicalRecordNumber))
      .first();

    // Retry if collision (extremely rare)
    while (existing) {
      medicalRecordNumber = generateMRN();
      existing = await ctx.db
        .query("patients")
        .withIndex("by_mrn", (q) => q.eq("medicalRecordNumber", medicalRecordNumber))
        .first();
    }

    return await ctx.db.insert("patients", {
      medicalRecordNumber,
      firstName: args.firstName,
      lastName: args.lastName,
      dateOfBirth: args.dateOfBirth,
      gender: args.gender,
      bloodGroup: args.bloodGroup,
      phone: args.phone,
      email: args.email,
      address: args.address,
      emergencyContact: args.emergencyContact,
      insuranceProvider: args.insuranceProvider,
      insurancePolicyNumber: args.insurancePolicyNumber,
      allergies: args.allergies,
      chronicConditions: args.chronicConditions,
      registrationDate: Date.now(),
      status: "active",
    });
  },
});

export const updatePatient = mutation({
  args: {
    patientId: v.id("patients"),
    ...patientFields,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "patients", "u")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const { patientId, ...fields } = args;

    await ctx.db.patch(patientId, {
      ...fields,
    });
  },
});

export const updatePatientStatus = mutation({
  args: {
    patientId: v.id("patients"),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("deceased")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "patients", "u")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    await ctx.db.patch(args.patientId, { status: args.status });
  },
});

export const deletePatient = mutation({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!currentUser || !hasPermission(currentUser.role, "patients", "d")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    // Soft-delete by marking as inactive
    await ctx.db.patch(args.patientId, { status: "inactive" });
  },
});
