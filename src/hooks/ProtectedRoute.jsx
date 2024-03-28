import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const { user } = useContext(UserContext);

  // Check if the user is logged in (user exists)
  const isLoggedIn = user !== null; // or any other logic you use to determine if the user is logged in

  // If allowedRoles are provided, we additionally check if the user's role is allowed.
  // If allowedRoles are not provided, we simply check for login.
  const isAllowed = allowedRoles ? allowedRoles.includes(user?.role) : true;

  return isLoggedIn && isAllowed ? Component : <Navigate to="/login" />;
};
