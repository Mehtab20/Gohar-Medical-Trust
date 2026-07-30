import { v } from "convex/values";
import { query } from "../_generated/server";
import { hasPermission } from "../constants";

export const getAppointment = query({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "appointments", "r")) return null;

    return await ctx.db.get(args.appointmentId);
  },
});

export const listAppointmentsByDate = query({
  args: {
    date: v.number(),
    doctorId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("scheduledDate", args.date))
      .collect();

    if (args.doctorId) {
      return appointments.filter((a) => a.doctorId === args.doctorId);
    }

    return appointments;
  },
});

export const listAppointmentsByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("appointments")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
  },
});

export const listAppointmentsByDoctor = query({
  args: { doctorId: v.id("users"), startDate: v.number(), endDate: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .collect();

    return appointments.filter(
      (a) => a.scheduledDate >= args.startDate && a.scheduledDate <= args.endDate,
    );
  },
});

export const listUpcomingAppointments = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTs = today.getTime();
    const endOfWeek = today.getTime() + 7 * 24 * 60 * 60 * 1000;

    const all = await ctx.db.query("appointments").collect();
    return all.filter(
      (a) =>
        a.scheduledDate >= todayTs &&
        a.scheduledDate <= endOfWeek &&
        a.status !== "cancelled" &&
        a.status !== "no_show" &&
        a.status !== "completed",
    );
  },
});

export const getAvailableSlots = query({
  args: {
    doctorId: v.id("users"),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const slots: string[] = [];
    const startHour = 9; // 9:00 AM
    const endHour = 17; // 5:00 PM
    const slotDuration = 30; // 30 minutes

    // Generate all possible slots
    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += slotDuration) {
        const start = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
        const endMin = min + slotDuration;
        const endHourAdjusted = hour + Math.floor(endMin / 60);
        const end = `${String(endHourAdjusted).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
        slots.push(`${start}-${end}`);
      }
    }

    // Get booked slots
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_doctor_date", (q) => q.eq("doctorId", args.doctorId).eq("scheduledDate", args.date))
      .collect();

    const bookedSlots = appointments
      .filter((a) => a.status !== "cancelled" && a.status !== "no_show")
      .map((a) => `${a.startTime}-${a.endTime}`);

    return slots.filter((slot) => !bookedSlots.includes(slot));
  },
});
