/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getCookie } from "../utils/cookie";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  
  useEffect(() => {
    const sabeonCookie = getCookie("sabeon");
    if (!sabeonCookie && isAuthenticated) {
      logout(); // 쿠키가 없지만 인증 상태가 true인 경우 로그아웃
    }
  }, [location.pathname, logout]);

  const sabeonCookie = getCookie("sabeon");
  if (!isAuthenticated || !sabeonCookie) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
