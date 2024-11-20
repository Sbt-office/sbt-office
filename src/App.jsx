import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import style from "./app.module.css";
import { ErrorBoundary } from "react-error-boundary";
import { useAuthStore } from "./store/authStore";
import { getCookie } from "./utils/cookie";

import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Toast from "./components/Toast";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const ErrorFallback = (error) => <div>An error occurred: {error.message}</div>;

  useEffect(() => {
    const publicPaths = ["/", "/signin"]; // 인증이 필요없는 경로들
    const sabeonCookie = getCookie("sabeon");

    if (!publicPaths.includes(location.pathname)) {
      if (!isAuthenticated || !sabeonCookie) {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return (
    <>
      <div className={style.main}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/main"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </div>
      <Toast />
    </>
  );
};

export default App;
