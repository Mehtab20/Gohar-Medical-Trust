import { internalMutation } from "./_generated/server";

export const seed = internalMutation({
  handler: async (ctx) => {
    // Check if already seeded
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) return;

    // Create departments
    const deptIds = await Promise.all([
      ctx.db.insert("departments", {
        code: "GEN",
        name: "General Medicine",
        description: "General medical care and diagnosis",
        isActive: true,
      }),
      ctx.db.insert("departments", {
        code: "CAR",
        name: "Cardiology",
        description: "Heart and cardiovascular care",
        isActive: true,
      }),
      ctx.db.insert("departments", {
        code: "ORT",
        name: "Orthopedics",
        description: "Bone and joint care",
        isActive: true,
      }),
      ctx.db.insert("departments", {
        code: "PED",
        name: "Pediatrics",
        description: "Child healthcare",
        isActive: true,
      }),
      ctx.db.insert("departments", {
        code: "EMG",
        name: "Emergency",
        description: "Emergency medical services",
        isActive: true,
      }),
      ctx.db.insert("departments", {
        code: "PHA",
        name: "Pharmacy",
        description: "Pharmaceutical services",
        isActive: true,
      }),
      ctx.db.insert("departments", {
        code: "LAB",
        name: "Laboratory",
        description: "Diagnostic laboratory services",
        isActive: true,
      }),
      ctx.db.insert("departments", {
        code: "RAD",
        name: "Radiology",
        description: "Medical imaging and radiology",
        isActive: true,
      }),
    ]);

    // Create admin user
    const adminUserId = await ctx.db.insert("users", {
      email: "admin@goharmedical.com",
      name: "Dr. Ahmad Khan",
      role: "super_admin",
      isActive: true,
    });

    await ctx.db.insert("staff", {
      userId: adminUserId,
      departmentId: deptIds[0]!,
      employeeId: "EMP-001",
      qualification: ["MBBS", "MD"],
      dateOfJoining: Date.now(),
      employmentType: "full_time",
      shiftPreference: "morning",
    });

    // Create some rooms
    await Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        ctx.db.insert("rooms", {
          roomNumber: `W${String(Math.floor(i / 5) + 1)}-${String((i % 5) + 1).padStart(2, "0")}`,
          departmentId: deptIds[0]!,
          roomType: i < 5 ? "general_ward" : i < 10 ? "private" : i < 15 ? "semi_private" : "icu",
          floor: Math.floor(i / 5) + 1,
          capacity: i < 5 ? 6 : 1,
          occupiedBeds: 0,
          ratePerDay: i < 5 ? 1500 : i < 10 ? 8000 : i < 15 ? 3500 : 15000,
          amenities: i < 10 ? ["AC", "TV", "Attached Bathroom"] : ["AC", "Monitor"],
          status: "available",
        }),
      ),
    );
  },
});
