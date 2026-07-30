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

export const PERMISSIONS: Record<string, Partial<Record<Role, string>>> = {
  patients: { super_admin: "crud", admin: "crud", doctor: "crud", nurse: "cru", receptionist: "cru", pharmacist: "r", lab_technician: "r", radiologist: "r", billing_staff: "r" },
  appointments: { super_admin: "crud", admin: "crud", doctor: "crud", nurse: "cru", receptionist: "crud" },
  medicalRecords: { super_admin: "crud", admin: "crud", doctor: "crud", nurse: "crud", receptionist: "r", pharmacist: "r", lab_technician: "r", radiologist: "r" },
  billing: { super_admin: "crud", admin: "crud", billing_staff: "crud", receptionist: "r" },
  pharmacy: { super_admin: "crud", admin: "crud", doctor: "cru", pharmacist: "crud" },
  lab: { super_admin: "crud", admin: "crud", doctor: "cru", lab_technician: "crud" },
  radiology: { super_admin: "crud", admin: "crud", doctor: "cru", radiologist: "crud" },
  inventory: { super_admin: "crud", admin: "crud", pharmacist: "cru", lab_technician: "cru", nurse: "r" },
  staff: { super_admin: "crud", admin: "cru", hr: "crud" },
  hr: { super_admin: "crud", admin: "cru", hr: "crud" },
  reports: { super_admin: "crud", admin: "crud", doctor: "r", nurse: "r", billing_staff: "r" },
  admin: { super_admin: "crud", admin: "cru" },
};

export function hasPermission(role: Role, module: string, action: string): boolean {
  const perms = PERMISSIONS[module]?.[role];
  if (!perms) return false;
  return perms.includes(action);
}
