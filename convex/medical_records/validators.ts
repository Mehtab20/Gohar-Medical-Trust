import { v } from "convex/values";

export const medicalRecordFields = {
  patientId: v.id("patients"),
  doctorId: v.id("users"),
  appointmentId: v.optional(v.id("appointments")),
  recordType: v.union(
    v.literal("consultation"),
    v.literal("admission"),
    v.literal("discharge_summary"),
    v.literal("surgery"),
    v.literal("followup"),
    v.literal("lab_report"),
    v.literal("imaging_report"),
  ),
  diagnosis: v.optional(v.string()),
  symptoms: v.array(v.string()),
  vitalSigns: v.optional(
    v.object({
      bloodPressure: v.optional(v.string()),
      heartRate: v.optional(v.number()),
      temperature: v.optional(v.number()),
      respiratoryRate: v.optional(v.number()),
      oxygenSaturation: v.optional(v.number()),
      weight: v.optional(v.number()),
      height: v.optional(v.number()),
    }),
  ),
  treatmentPlan: v.optional(v.string()),
  notes: v.string(),
  attachments: v.array(v.id("_storage")),
  isConfidential: v.boolean(),
};

export const vitalSignsFields = {
  bloodPressure: v.optional(v.string()),
  heartRate: v.optional(v.number()),
  temperature: v.optional(v.number()),
  respiratoryRate: v.optional(v.number()),
  oxygenSaturation: v.optional(v.number()),
  weight: v.optional(v.number()),
  height: v.optional(v.number()),
};
