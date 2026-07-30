import type { Doc } from "../_generated/dataModel";
import type { Role } from "../constants";

export function getCurrentUserOrThrow(_ctx: { auth: { getUserIdentity: () => Promise<{ email?: string } | null> }; db: { query: Function } }) {
  // Implementation in user queries
}

export function requireRole(user: Doc<"users"> | null | undefined, allowedRoles: Role[]) {
  if (!user) throw new Error("Unauthenticated");
  if (!allowedRoles.includes(user.role as Role)) {
    throw new Error("Forbidden: insufficient permissions");
  }
}

export function requirePermission(
  user: Doc<"users"> | null | undefined,
  module: string,
  action: string,
  permissions: Record<string, Partial<Record<Role, string>>>,
) {
  if (!user) throw new Error("Unauthenticated");
  const perms = permissions[module]?.[user.role as Role];
  if (!perms || !perms.includes(action)) {
    throw new Error("Forbidden: insufficient permissions");
  }
}
