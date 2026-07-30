import type { Role } from "@/lib/constants";

type Action = "c" | "r" | "u" | "d";
type CrudString = string;

const PERMISSIONS: Record<string, Partial<Record<Role, CrudString>>> = {
  dashboard: {
    super_admin: "crud",
    admin: "crud",
    doctor: "r",
    nurse: "r",
    receptionist: "r",
    pharmacist: "r",
    lab_technician: "r",
    radiologist: "r",
    billing_staff: "r",
    hr: "r",
  },
  patients: {
    super_admin: "crud",
    admin: "crud",
    doctor: "crud",
    nurse: "cru",
    receptionist: "cru",
    pharmacist: "r",
    lab_technician: "r",
    radiologist: "r",
    billing_staff: "r",
  },
  appointments: {
    super_admin: "crud",
    admin: "crud",
    doctor: "crud",
    nurse: "cru",
    receptionist: "crud",
  },
  medicalRecords: {
    super_admin: "crud",
    admin: "crud",
    doctor: "crud",
    nurse: "crud",
    receptionist: "r",
    pharmacist: "r",
    lab_technician: "r",
    radiologist: "r",
  },
  billing: {
    super_admin: "crud",
    admin: "crud",
    billing_staff: "crud",
    receptionist: "r",
  },
  pharmacy: {
    super_admin: "crud",
    admin: "crud",
    doctor: "cru",
    pharmacist: "crud",
  },
  lab: {
    super_admin: "crud",
    admin: "crud",
    doctor: "cru",
    lab_technician: "crud",
  },
  radiology: {
    super_admin: "crud",
    admin: "crud",
    doctor: "cru",
    radiologist: "crud",
  },
  inventory: {
    super_admin: "crud",
    admin: "crud",
    pharmacist: "cru",
    lab_technician: "cru",
    nurse: "r",
  },
  staff: {
    super_admin: "crud",
    admin: "cru",
    hr: "crud",
    doctor: "r",
    nurse: "r",
    pharmacist: "r",
    lab_technician: "r",
    radiologist: "r",
    billing_staff: "r",
    receptionist: "r",
  },
  hr: {
    super_admin: "crud",
    admin: "cru",
    hr: "crud",
  },
  reports: {
    super_admin: "crud",
    admin: "crud",
    doctor: "r",
    nurse: "r",
    receptionist: "r",
    pharmacist: "r",
    lab_technician: "r",
    radiologist: "r",
    billing_staff: "r",
    hr: "r",
  },
  admin: {
    super_admin: "crud",
    admin: "cru",
  },
  auditLogs: {
    super_admin: "crud",
    admin: "r",
  },
} as const;

export function hasPermission(
  role: Role,
  module: keyof typeof PERMISSIONS,
  action: Action,
): boolean {
  const modulePerms = PERMISSIONS[module]?.[role];
  if (!modulePerms) return false;
  return modulePerms.includes(action);
}

export function canAccess(
  role: Role | undefined,
  module: keyof typeof PERMISSIONS,
  action: Action = "r",
): boolean {
  if (!role) return false;
  return hasPermission(role, module, action);
}

export function getModuleRoles(module: keyof typeof PERMISSIONS): Role[] {
  const modulePerms = PERMISSIONS[module];
  if (!modulePerms) return [];
  return (Object.entries(modulePerms) as [string, string | undefined][])
    .filter(([, perms]) => perms && perms.length > 0)
    .map(([role]) => role as Role);
}
