export const APP_NAME = "Gohar Medical Trust";
export const APP_SHORT_NAME = "GMT";
export const APP_VERSION = "1.0.0";

export const ROLES = [
  "super_admin",
  "admin",
  "doctor",
  "nurse",
  "receptionist",
  "pharmacist",
  "lab_technician",
  "radiologist",
  "billing_staff",
  "hr",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  doctor: "Doctor",
  nurse: "Nurse",
  receptionist: "Receptionist",
  pharmacist: "Pharmacist",
  lab_technician: "Lab Technician",
  radiologist: "Radiologist",
  billing_staff: "Billing Staff",
  hr: "HR Manager",
};

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

export const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
] as const;

export const APPOINTMENT_STATUS = [
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
] as const;

export const APPOINTMENT_TYPES = [
  "checkup",
  "followup",
  "emergency",
  "surgery",
  "consultation",
] as const;

export const PATIENT_STATUS = ["active", "inactive", "deceased"] as const;

export const BILLING_STATUS = [
  "draft",
  "issued",
  "partial_paid",
  "paid",
  "overdue",
  "cancelled",
  "refunded",
] as const;

export const LAB_ORDER_STATUS = [
  "ordered",
  "sample_collected",
  "in_analysis",
  "completed",
  "cancelled",
] as const;

export const RADIOLOGY_ORDER_STATUS = [
  "ordered",
  "scheduled",
  "performed",
  "report_pending",
  "completed",
  "cancelled",
] as const;

export const INVENTORY_CATEGORIES = [
  "medication",
  "surgical",
  "ppe",
  "equipment",
  "lab_supply",
  "general",
] as const;

export const PAYMENT_METHODS = [
  "cash",
  "card",
  "bank_transfer",
  "insurance",
  "online",
] as const;

export const EMPLOYMENT_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "visiting",
] as const;

export const SHIFT_PREFERENCES = [
  "morning",
  "evening",
  "night",
  "rotating",
] as const;

export const ROOM_TYPES = [
  "general_ward",
  "private",
  "semi_private",
  "icu",
  "nicu",
  "operation_theatre",
  "emergency",
  "consultation",
] as const;
