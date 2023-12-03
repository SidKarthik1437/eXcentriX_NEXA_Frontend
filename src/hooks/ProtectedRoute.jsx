import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const { user } = useContext(UserContext);

  return user && allowedRoles.includes(user.role) ? (
    Component
  ) : (
    <Navigate to="/login" />
  );
};
