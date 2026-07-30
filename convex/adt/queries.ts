import { v } from "convex/values";
import { query } from "../_generated/server";

export const getActiveAdmission = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("bedAssignments")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();

    return assignments.find((a) => a.status === "active") ?? null;
  },
});

export const listActiveAdmissions = query({
  handler: async (ctx) => {
    const allAssignments = await ctx.db.query("bedAssignments").collect();
    const active = allAssignments.filter((a) => a.status === "active");

    // Enrich with patient and room data
    const enriched = await Promise.all(
      active.map(async (a) => {
        const patient = await ctx.db.get(a.patientId);
        const room = await ctx.db.get(a.roomId);
        return { assignment: a, patient, room };
      }),
    );

    return enriched;
  },
});

export const getPatientAdmissions = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    const assignments = await ctx.db
      .query("bedAssignments")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();

    const enriched = await Promise.all(
      assignments.map(async (a) => {
        const room = await ctx.db.get(a.roomId);
        return { assignment: a, room };
      }),
    );

    // Sort by admission date descending
    return enriched.sort((a, b) => b.assignment.admissionDate - a.assignment.admissionDate);
  },
});

export const getAvailableBeds = query({
  args: {
    departmentId: v.optional(v.id("departments")),
    roomType: v.optional(
      v.union(
        v.literal("general_ward"),
        v.literal("private"),
        v.literal("semi_private"),
        v.literal("icu"),
        v.literal("nicu"),
        v.literal("operation_theatre"),
        v.literal("emergency"),
        v.literal("consultation"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    let rooms = await ctx.db.query("rooms").collect();

    // Only available or reserved rooms with open beds
    rooms = rooms.filter(
      (r) =>
        (r.status === "available" || r.status === "reserved") &&
        r.occupiedBeds < r.capacity,
    );

    if (args.departmentId) {
      rooms = rooms.filter((r) => r.departmentId === args.departmentId);
    }
    if (args.roomType) {
      rooms = rooms.filter((r) => r.roomType === args.roomType);
    }

    // Enrich with department name
    const enriched = await Promise.all(
      rooms.map(async (r) => {
        const dept = await ctx.db.get(r.departmentId);
        return { ...r, departmentName: dept?.name ?? "Unknown" };
      }),
    );

    return enriched;
  },
});

export const getWardStats = query({
  handler: async (ctx) => {
    const rooms = await ctx.db.query("rooms").collect();
    const assignments = await ctx.db.query("bedAssignments").collect();
    const activeAdmissions = assignments.filter((a) => a.status === "active");

    const totalBeds = rooms.reduce((s, r) => s + r.capacity, 0);
    const occupiedBeds = rooms.reduce((s, r) => s + r.occupiedBeds, 0);

    // Group by department
    const deptIds = [...new Set(rooms.map((r) => r.departmentId))];
    const departments = await Promise.all(
      deptIds.map(async (deptId) => {
        const dept = await ctx.db.get(deptId);
        const deptRooms = rooms.filter((r) => r.departmentId === deptId);
        return {
          departmentId: deptId,
          departmentName: dept?.name ?? "Unknown",
          totalBeds: deptRooms.reduce((s, r) => s + r.capacity, 0),
          occupiedBeds: deptRooms.reduce((s, r) => s + r.occupiedBeds, 0),
          availableBeds: deptRooms.reduce(
            (s, r) => s + (r.capacity - r.occupiedBeds),
            0,
          ),
        };
      }),
    );

    return {
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
      activeAdmissions: activeAdmissions.length,
      departments,
    };
  },
});
