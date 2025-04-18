
import { useState, useEffect } from "react";

// This is a mock hook that would be replaced with actual authentication logic
// In a real app, this would connect to the authentication system
export function useUserRole() {
  // For demo purposes, we'll use a state to simulate different roles
  // In a real app, this would come from your auth provider
  const [role, setRole] = useState<"judge" | "lawyer" | "clerk" | "public" | "admin">("judge");

  // This simulates getting the user role from a persistent store or context
  useEffect(() => {
    // In a real app, you'd fetch this from your auth system
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setRole(storedRole as "judge" | "lawyer" | "clerk" | "public" | "admin");
    }
  }, []);

  // For demo purposes - allows changing roles in the app
  // This would be removed in a real application
  const changeRole = (newRole: "judge" | "lawyer" | "clerk" | "public" | "admin") => {
    localStorage.setItem("userRole", newRole);
    setRole(newRole);
  };

  return role;
}

// A hook to check if the current user role has access to a specific feature
export function useHasAccess(requiredRoles: string[]) {
  const role = useUserRole();
  return requiredRoles.includes(role);
}
