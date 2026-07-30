import type { Role } from "@/lib/constants";

// ────────────────────────────────────
// Navigation
// ────────────────────────────────────

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles?: Role[];
  children?: NavItem[];
}

// ────────────────────────────────────
// User & Auth
// ────────────────────────────────────

export interface CurrentUser {
  _id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  lastLoginAt?: number;
  phone?: string;
  avatarStorageId?: string;
}

// ────────────────────────────────────
// Pagination
// ────────────────────────────────────

export interface PaginationParams {
  cursor?: string | null;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  cursor: string | null;
  hasMore: boolean;
}

// ────────────────────────────────────
// Dashboard
// ────────────────────────────────────

export interface DashboardStats {
  totalPatients: number;
  totalAppointmentsToday: number;
  occupiedBeds: number;
  totalBeds: number;
  pendingLabResults: number;
  revenueToday: number;
  revenueThisMonth: number;
  newPatientsThisWeek: number;
}

// ────────────────────────────────────
// Address
// ────────────────────────────────────

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ────────────────────────────────────
// Emergency Contact
// ────────────────────────────────────

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}
