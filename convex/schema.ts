import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ────────────────────────────────────
  // Users & Authentication
  // ────────────────────────────────────
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("super_admin"),
      v.literal("admin"),
      v.literal("doctor"),
      v.literal("nurse"),
      v.literal("receptionist"),
      v.literal("pharmacist"),
      v.literal("lab_technician"),
      v.literal("radiologist"),
      v.literal("billing_staff"),
      v.literal("hr"),
    ),
    isActive: v.boolean(),
    lastLoginAt: v.optional(v.number()),
    phone: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // ────────────────────────────────────
  // Patients
  // ────────────────────────────────────
  patients: defineTable({
    medicalRecordNumber: v.string(),
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
    registrationDate: v.number(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("deceased")),
    profilePhotoStorageId: v.optional(v.id("_storage")),
  })
    .index("by_mrn", ["medicalRecordNumber"])
    .index("by_name", ["lastName", "firstName"])
    .index("by_phone", ["phone"])
    .index("by_status", ["status"])
    .index("by_registration_date", ["registrationDate"]),

  // ────────────────────────────────────
  // Appointments
  // ────────────────────────────────────
  appointments: defineTable({
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
    status: v.union(
      v.literal("scheduled"),
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show"),
    ),
    reason: v.string(),
    notes: v.optional(v.string()),
    priority: v.union(v.literal("routine"), v.literal("urgent"), v.literal("emergency")),
    roomId: v.optional(v.id("rooms")),
  })
    .index("by_patient", ["patientId"])
    .index("by_doctor", ["doctorId"])
    .index("by_date", ["scheduledDate"])
    .index("by_status", ["status"])
    .index("by_doctor_date", ["doctorId", "scheduledDate"])
    .index("by_department_date", ["departmentId", "scheduledDate"]),

  // ────────────────────────────────────
  // Medical Records (EHR / EMR)
  // ────────────────────────────────────
  medicalRecords: defineTable({
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
    createdAt: v.number(),
  })
    .index("by_patient", ["patientId"])
    .index("by_doctor", ["doctorId"])
    .index("by_type", ["recordType"]),

  // ────────────────────────────────────
  // Billing Invoices
  // ────────────────────────────────────
  billingInvoices: defineTable({
    invoiceNumber: v.string(),
    patientId: v.id("patients"),
    appointmentId: v.optional(v.id("appointments")),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        total: v.number(),
        category: v.string(),
        code: v.optional(v.string()),
      }),
    ),
    subtotal: v.number(),
    taxAmount: v.number(),
    discountAmount: v.number(),
    totalAmount: v.number(),
    insuranceClaimed: v.boolean(),
    insuranceApprovedAmount: v.optional(v.number()),
    patientResponsibility: v.number(),
    amountPaid: v.number(),
    balanceDue: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("issued"),
      v.literal("partial_paid"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled"),
      v.literal("refunded"),
    ),
    dueDate: v.number(),
    issuedBy: v.id("users"),
  })
    .index("by_invoice_number", ["invoiceNumber"])
    .index("by_patient", ["patientId"])
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"]),

  // ────────────────────────────────────
  // Payments
  // ────────────────────────────────────
  payments: defineTable({
    invoiceId: v.id("billingInvoices"),
    patientId: v.id("patients"),
    amount: v.number(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("card"),
      v.literal("bank_transfer"),
      v.literal("insurance"),
      v.literal("online"),
    ),
    transactionReference: v.optional(v.string()),
    paymentDate: v.number(),
    receivedBy: v.id("users"),
    notes: v.optional(v.string()),
  })
    .index("by_invoice", ["invoiceId"])
    .index("by_patient", ["patientId"])
    .index("by_date", ["paymentDate"]),

  // ────────────────────────────────────
  // Prescriptions (Pharmacy)
  // ────────────────────────────────────
  prescriptions: defineTable({
    patientId: v.id("patients"),
    doctorId: v.id("users"),
    medicationName: v.string(),
    dosage: v.string(),
    frequency: v.string(),
    route: v.string(),
    duration: v.string(),
    quantity: v.number(),
    refills: v.number(),
    instructions: v.string(),
    status: v.union(v.literal("active"), v.literal("dispensed"), v.literal("completed"), v.literal("cancelled")),
    dispensedById: v.optional(v.id("users")),
    dispensedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_patient", ["patientId"])
    .index("by_doctor", ["doctorId"])
    .index("by_status", ["status"]),

  // ────────────────────────────────────
  // Lab Orders
  // ────────────────────────────────────
  labOrders: defineTable({
    patientId: v.id("patients"),
    doctorId: v.id("users"),
    testType: v.string(),
    priority: v.union(v.literal("routine"), v.literal("urgent"), v.literal("stat")),
    sampleType: v.optional(v.string()),
    sampleCollectedAt: v.optional(v.number()),
    sampleCollectedById: v.optional(v.id("users")),
    resultValue: v.optional(v.string()),
    referenceRange: v.optional(v.string()),
    isAbnormal: v.optional(v.boolean()),
    resultNotes: v.optional(v.string()),
    resultFileStorageId: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("ordered"),
      v.literal("sample_collected"),
      v.literal("in_analysis"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    verifiedById: v.optional(v.id("users")),
    completedAt: v.optional(v.number()),
  })
    .index("by_patient", ["patientId"])
    .index("by_doctor", ["doctorId"])
    .index("by_status", ["status"])
    .index("by_type", ["testType"]),

  // ────────────────────────────────────
  // Radiology Orders
  // ────────────────────────────────────
  radiologyOrders: defineTable({
    patientId: v.id("patients"),
    doctorId: v.id("users"),
    imagingType: v.string(),
    bodyPart: v.string(),
    priority: v.union(v.literal("routine"), v.literal("urgent"), v.literal("stat")),
    clinicalHistory: v.optional(v.string()),
    technicianId: v.optional(v.id("users")),
    performedAt: v.optional(v.number()),
    report: v.optional(v.string()),
    reportFileStorageId: v.optional(v.id("_storage")),
    radiologistId: v.optional(v.id("users")),
    status: v.union(
      v.literal("ordered"),
      v.literal("scheduled"),
      v.literal("performed"),
      v.literal("report_pending"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
  })
    .index("by_patient", ["patientId"])
    .index("by_doctor", ["doctorId"])
    .index("by_status", ["status"])
    .index("by_type", ["imagingType"]),

  // ────────────────────────────────────
  // Inventory Items
  // ────────────────────────────────────
  inventoryItems: defineTable({
    itemCode: v.string(),
    name: v.string(),
    category: v.union(
      v.literal("medication"),
      v.literal("surgical"),
      v.literal("ppe"),
      v.literal("equipment"),
      v.literal("lab_supply"),
      v.literal("general"),
    ),
    departmentId: v.optional(v.id("departments")),
    supplierId: v.optional(v.id("suppliers")),
    unitOfMeasure: v.string(),
    unitPrice: v.number(),
    sellingPrice: v.number(),
    currentStock: v.number(),
    minimumStock: v.number(),
    maximumStock: v.number(),
    batchNumber: v.optional(v.string()),
    expiryDate: v.optional(v.number()),
    location: v.optional(v.string()),
    status: v.union(v.literal("in_stock"), v.literal("low_stock"), v.literal("out_of_stock"), v.literal("expired")),
  })
    .index("by_code", ["itemCode"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_expiry", ["expiryDate"]),

  // ────────────────────────────────────
  // Inventory Transactions
  // ────────────────────────────────────
  inventoryTransactions: defineTable({
    itemId: v.id("inventoryItems"),
    type: v.union(
      v.literal("purchase"),
      v.literal("sale"),
      v.literal("transfer"),
      v.literal("adjustment"),
      v.literal("expiry"),
    ),
    quantity: v.number(),
    unitPrice: v.number(),
    totalPrice: v.number(),
    referenceType: v.optional(v.string()),
    referenceId: v.optional(v.string()),
    performedById: v.id("users"),
    notes: v.optional(v.string()),
    transactionDate: v.number(),
  })
    .index("by_item", ["itemId"])
    .index("by_type", ["type"])
    .index("by_date", ["transactionDate"]),

  // ────────────────────────────────────
  // Suppliers
  // ────────────────────────────────────
  suppliers: defineTable({
    name: v.string(),
    contactPerson: v.optional(v.string()),
    phone: v.string(),
    email: v.optional(v.string()),
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    isActive: v.boolean(),
  }),

  // ────────────────────────────────────
  // Departments
  // ────────────────────────────────────
  departments: defineTable({
    code: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    headOfDepartment: v.optional(v.id("users")),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    isActive: v.boolean(),
  }),

  // ────────────────────────────────────
  // Rooms / Beds
  // ────────────────────────────────────
  rooms: defineTable({
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
    occupiedBeds: v.number(),
    ratePerDay: v.number(),
    amenities: v.array(v.string()),
    status: v.union(v.literal("available"), v.literal("occupied"), v.literal("maintenance"), v.literal("reserved")),
  })
    .index("by_department", ["departmentId"])
    .index("by_type", ["roomType"])
    .index("by_status", ["status"]),

  // ────────────────────────────────────
  // Bed Assignments (ADT)
  // ────────────────────────────────────
  bedAssignments: defineTable({
    patientId: v.id("patients"),
    roomId: v.id("rooms"),
    admissionDate: v.number(),
    expectedDischargeDate: v.optional(v.number()),
    actualDischargeDate: v.optional(v.number()),
    admittedById: v.id("users"),
    status: v.union(v.literal("active"), v.literal("discharged"), v.literal("transferred")),
    diagnosis: v.optional(v.string()),
  })
    .index("by_patient", ["patientId"])
    .index("by_room", ["roomId"])
    .index("by_status", ["status"]),

  // ────────────────────────────────────
  // Staff Profiles
  // ────────────────────────────────────
  staff: defineTable({
    userId: v.id("users"),
    departmentId: v.id("departments"),
    employeeId: v.string(),
    specialization: v.optional(v.string()),
    qualification: v.array(v.string()),
    licenseNumber: v.optional(v.string()),
    licenseExpiryDate: v.optional(v.number()),
    dateOfJoining: v.number(),
    employmentType: v.union(v.literal("full_time"), v.literal("part_time"), v.literal("contract"), v.literal("visiting")),
    shiftPreference: v.union(v.literal("morning"), v.literal("evening"), v.literal("night"), v.literal("rotating")),
    consultationFee: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_department", ["departmentId"])
    .index("by_employee_id", ["employeeId"]),

  // ────────────────────────────────────
  // Staff Schedules
  // ────────────────────────────────────
  staffSchedules: defineTable({
    staffId: v.id("staff"),
    date: v.string(),
    shiftStart: v.string(),
    shiftEnd: v.string(),
    departmentId: v.id("departments"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("checked_in"),
      v.literal("checked_out"),
      v.literal("absent"),
      v.literal("on_leave"),
    ),
    notes: v.optional(v.string()),
  })
    .index("by_staff_date", ["staffId", "date"])
    .index("by_date", ["date"]),

  // ────────────────────────────────────
  // Insurance Claims
  // ────────────────────────────────────
  insuranceClaims: defineTable({
    patientId: v.id("patients"),
    invoiceId: v.id("billingInvoices"),
    claimNumber: v.string(),
    insuranceProvider: v.string(),
    policyNumber: v.string(),
    claimAmount: v.number(),
    approvedAmount: v.optional(v.number()),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("approved"),
      v.literal("denied"),
      v.literal("partially_approved"),
    ),
    submittedDate: v.number(),
    responseDate: v.optional(v.number()),
    documents: v.array(v.id("_storage")),
    notes: v.optional(v.string()),
  })
    .index("by_patient", ["patientId"])
    .index("by_invoice", ["invoiceId"])
    .index("by_status", ["status"]),

  // ────────────────────────────────────
  // Audit Logs
  // ────────────────────────────────────
  auditLogs: defineTable({
    action: v.union(v.literal("create"), v.literal("read"), v.literal("update"), v.literal("delete")),
    entityType: v.string(),
    entityId: v.string(),
    userId: v.id("users"),
    changes: v.optional(v.object({})),
    ipAddress: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_entity", ["entityType", "entityId"])
    .index("by_timestamp", ["timestamp"]),

  // ────────────────────────────────────
  // Reports
  // ────────────────────────────────────
  reports: defineTable({
    name: v.string(),
    type: v.union(v.literal("financial"), v.literal("clinical"), v.literal("operational"), v.literal("custom")),
    parameters: v.object({}),
    generatedById: v.id("users"),
    generatedAt: v.number(),
    fileStorageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("pending"), v.literal("generating"), v.literal("completed"), v.literal("failed")),
  }),
});
