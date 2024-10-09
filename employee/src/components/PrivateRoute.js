import React from "react";
import { Navigate } from "react-router-dom";

// A wrapper component to protect routes
function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
