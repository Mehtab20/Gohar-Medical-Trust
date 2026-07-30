import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { hasPermission } from "../constants";

export const admitPatient = mutation({
  args: {
    patientId: v.id("patients"),
    roomId: v.id("rooms"),
    diagnosis: v.optional(v.string()),
    expectedDischargeDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "patients", "u")) {
      throw new Error("Forbidden");
    }

    // Check patient isn't already admitted
    const activeAdmission = await ctx.db
      .query("bedAssignments")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();

    if (activeAdmission.some((a) => a.status === "active")) {
      throw new Error("Patient is already admitted");
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    if (room.status !== "available" && room.status !== "reserved") {
      throw new Error("Room is not available");
    }
    if (room.occupiedBeds >= room.capacity) {
      throw new Error("Room is at full capacity");
    }

    // Create bed assignment
    const assignmentId = await ctx.db.insert("bedAssignments", {
      patientId: args.patientId,
      roomId: args.roomId,
      admissionDate: Date.now(),
      expectedDischargeDate: args.expectedDischargeDate,
      admittedById: currentUser._id,
      status: "active",
      diagnosis: args.diagnosis,
    });

    // Update room occupancy
    const newOccupied = room.occupiedBeds + 1;
    await ctx.db.patch(args.roomId, {
      occupiedBeds: newOccupied,
      status: newOccupied >= room.capacity ? "occupied" : "reserved",
    });

    return assignmentId;
  },
});

export const dischargePatient = mutation({
  args: {
    assignmentId: v.id("bedAssignments"),
    dischargeNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "patients", "u")) {
      throw new Error("Forbidden");
    }

    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) throw new Error("Bed assignment not found");
    if (assignment.status !== "active") throw new Error("Patient is not currently admitted");

    // Mark as discharged
    await ctx.db.patch(args.assignmentId, {
      status: "discharged",
      actualDischargeDate: Date.now(),
    });

    // Update room
    const room = await ctx.db.get(assignment.roomId);
    if (room) {
      const newOccupied = Math.max(0, room.occupiedBeds - 1);
      await ctx.db.patch(assignment.roomId, {
        occupiedBeds: newOccupied,
        status: newOccupied === 0 ? "available" : "reserved",
      });
    }
  },
});

export const transferPatient = mutation({
  args: {
    assignmentId: v.id("bedAssignments"),
    newRoomId: v.id("rooms"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!currentUser || !hasPermission(currentUser.role, "patients", "u")) {
      throw new Error("Forbidden");
    }

    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) throw new Error("Bed assignment not found");
    if (assignment.status !== "active") throw new Error("Patient is not currently admitted");

    const newRoom = await ctx.db.get(args.newRoomId);
    if (!newRoom) throw new Error("New room not found");
    if (newRoom.status === "maintenance") throw new Error("New room is under maintenance");
    if (newRoom.occupiedBeds >= newRoom.capacity) throw new Error("New room is at full capacity");

    const oldRoom = await ctx.db.get(assignment.roomId);

    // Close old assignment
    await ctx.db.patch(args.assignmentId, {
      status: "transferred",
      actualDischargeDate: Date.now(),
    });

    // Create new assignment
    await ctx.db.insert("bedAssignments", {
      patientId: assignment.patientId,
      roomId: args.newRoomId,
      admissionDate: Date.now(),
      admittedById: currentUser._id,
      status: "active",
      diagnosis: assignment.diagnosis,
    });

    // Update old room
    if (oldRoom) {
      const oldOccupied = Math.max(0, oldRoom.occupiedBeds - 1);
      await ctx.db.patch(assignment.roomId, {
        occupiedBeds: oldOccupied,
        status: oldOccupied === 0 ? "available" : "reserved",
      });
    }

    // Update new room
    const newOccupied = newRoom.occupiedBeds + 1;
    await ctx.db.patch(args.newRoomId, {
      occupiedBeds: newOccupied,
      status: newOccupied >= newRoom.capacity ? "occupied" : "reserved",
    });
  },
});
