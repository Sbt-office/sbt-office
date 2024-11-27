/* eslint-disable react/prop-types */
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getCookie } from "@/utils/cookie";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const publicPaths = ["/", "/signin"];
    const loginCookie = getCookie("isLogin");

    // 쿠키가 없는데 인증된 상태라면 로그아웃
    if (!loginCookie && isAuthenticated) {
      logout();
    }

    // 현재 경로가 public이 아닌데 인증이 안되어있거나 쿠키가 없다면
    if (!publicPaths.includes(location.pathname)) {
      if (!isAuthenticated || !loginCookie) {
        navigate("/", { replace: true });
      }
    }
  }, [location.pathname, logout, isAuthenticated, navigate]);

  return isAuthenticated && getCookie("isLogin") ? children : null;
};

export default PrivateRoute;
