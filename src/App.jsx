import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import style from "./app.module.css";
import BarLoader from "react-spinners/BarLoader";
import { ErrorBoundary } from "react-error-boundary";

import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Toast from "./components/Toast";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";

const ErrorFallback = (error) => <div>An error occurred: {error.message}</div>;

const App = () => {
  return (
    <>
      <div className={style.main}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className={style.loading}>
                <BarLoader color="#3485ff" height={8} speedMultiplier={0.8} width={150} />
              </div>
            }
          >
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
      <Toast />
    </>
  );
};

export default App;
