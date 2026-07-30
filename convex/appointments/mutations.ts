import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { appointmentFields } from "./validators";
import { hasPermission } from "../constants";

export const createAppointment = mutation({
  args: appointmentFields,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "appointments", "c")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    // Check for time conflicts with the same doctor
    const doctorAppointments = await ctx.db
      .query("appointments")
      .withIndex("by_doctor_date", (q) => q.eq("doctorId", args.doctorId).eq("scheduledDate", args.scheduledDate))
      .collect();

    const hasConflict = doctorAppointments.some((apt) => {
      if (apt.status === "cancelled" || apt.status === "no_show") return false;
      return apt.startTime < args.endTime && apt.endTime > args.startTime;
    });

    if (hasConflict) {
      throw new Error("The doctor already has an appointment scheduled during this time slot");
    }

    return await ctx.db.insert("appointments", {
      ...args,
      status: "scheduled",
    });
  },
});

export const updateAppointment = mutation({
  args: {
    appointmentId: v.id("appointments"),
    ...appointmentFields,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "appointments", "u")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const { appointmentId, ...fields } = args;
    await ctx.db.patch(appointmentId, { ...fields });
  },
});

export const updateAppointmentStatus = mutation({
  args: {
    appointmentId: v.id("appointments"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show"),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "appointments", "u")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const patch: Record<string, unknown> = { status: args.status };
    if (args.notes !== undefined) patch.notes = args.notes;
    await ctx.db.patch(args.appointmentId, patch);
  },
});

export const deleteAppointment = mutation({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "appointments", "d")) {
      throw new Error("Forbidden: insufficient permissions");
    }

    await ctx.db.patch(args.appointmentId, { status: "cancelled" });
  },
});
