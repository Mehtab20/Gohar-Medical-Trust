import { v } from "convex/values";

export const appointmentFields = {
  patientId: v.id("patients"),
  doctorId: v.id("users"),
  departmentId: v.id("departments"),
  appointmentType: v.union(
    v.literal("checkup"),
    v.literal("followup"),
    v.literal("emergency"),
    v.literal("surgery"),
    v.literal("consultation"),
  ),
  scheduledDate: v.number(),
  startTime: v.string(),
  endTime: v.string(),
  duration: v.number(),
  reason: v.string(),
  notes: v.optional(v.string()),
  priority: v.union(v.literal("routine"), v.literal("urgent"), v.literal("emergency")),
  roomId: v.optional(v.id("rooms")),
};
