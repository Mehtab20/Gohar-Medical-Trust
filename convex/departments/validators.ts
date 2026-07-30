import { v } from "convex/values";

export const departmentFields = {
  code: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  headOfDepartment: v.optional(v.id("users")),
  phone: v.optional(v.string()),
  location: v.optional(v.string()),
  isActive: v.boolean(),
};

export const roomFields = {
  roomNumber: v.string(),
  departmentId: v.id("departments"),
  roomType: v.union(
    v.literal("general_ward"),
    v.literal("private"),
    v.literal("semi_private"),
    v.literal("icu"),
    v.literal("nicu"),
    v.literal("operation_theatre"),
    v.literal("emergency"),
    v.literal("consultation"),
  ),
  floor: v.number(),
  capacity: v.number(),
  ratePerDay: v.number(),
  amenities: v.array(v.string()),
};
