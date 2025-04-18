
import { useAuth } from "./useAuth";

// This hook returns the user's role from the authentication context
export function useUserRole() {
  const { profile } = useAuth();
  return profile?.role?.toLowerCase() || "public";
}

// A hook to check if the current user role has access to a specific feature
export function useHasAccess(requiredRoles: string[]) {
  const role = useUserRole();
  return requiredRoles.includes(role);
}
