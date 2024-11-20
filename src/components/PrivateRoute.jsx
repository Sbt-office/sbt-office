/* eslint-disable react/prop-types */
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getCookie } from "../utils/cookie";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  
  useEffect(() => {
    const sabeonCookie = getCookie("sabeon");
    if (!sabeonCookie && isAuthenticated) {
      logout(); 
    }
  }, [location.pathname, logout, isAuthenticated]);

  useEffect(() => {
    const sabeonCookie = getCookie("sabeon");
    if (!isAuthenticated || !sabeonCookie) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated && getCookie("sabeon") ? children : null;
};

export default PrivateRoute;
