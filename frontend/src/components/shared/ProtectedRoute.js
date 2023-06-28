import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import React from "react";
 
const ProtectedRoute = ({ children, accessBy }) => {
  const { allinfo, token } = useContext(AuthContext);
 
  // For routes that should be accessible only by non-authenticated users (e.g., login page)
  if (accessBy === "non-authenticated") {
    if (!token) {
      return children;
    } else {
      // Redirect authenticated users to the planner page if they try to access a non-authenticated route
      return <Navigate to="/planner" replace />;
    }
  }
  
  // For routes that should be accessible only by authenticated users
  if (accessBy === "authenticated") {
    if (token) {
      return children;
    } else {
      // Redirect unauthenticated users to the login page
      return <Navigate to="/login" replace />;
    }
  }

  // Fallback to redirect to planner page
  return <Navigate to="/planner" replace />;
};
export default ProtectedRoute;