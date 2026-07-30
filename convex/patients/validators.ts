import { v } from "convex/values";

export const patientFields = {
  firstName: v.string(),
  lastName: v.string(),
  dateOfBirth: v.string(),
  gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
  bloodGroup: v.optional(
    v.union(
      v.literal("A+"), v.literal("A-"), v.literal("B+"),
      v.literal("B-"), v.literal("AB+"), v.literal("AB-"),
      v.literal("O+"), v.literal("O-"),
    ),
  ),
  phone: v.string(),
  email: v.optional(v.string()),
  address: v.object({
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    country: v.string(),
  }),
  emergencyContact: v.object({
    name: v.string(),
    relationship: v.string(),
    phone: v.string(),
  }),
  insuranceProvider: v.optional(v.string()),
  insurancePolicyNumber: v.optional(v.string()),
  allergies: v.array(v.string()),
  chronicConditions: v.array(v.string()),
};
