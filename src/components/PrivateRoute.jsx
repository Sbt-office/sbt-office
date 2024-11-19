/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
