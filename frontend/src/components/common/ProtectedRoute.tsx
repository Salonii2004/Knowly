import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ("user" | "admin")[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, initialLoading } = useAuth();

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    console.log("ProtectedRoute: User role not authorized, redirecting to /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};