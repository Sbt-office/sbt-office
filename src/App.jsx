import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import style from "./app.module.css";

import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Toast from "./components/Toast";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import LoginOffice from "./components/LoginOffice";

const App = () => {
  const ErrorFallback = (error) => <div>An error occurred: {error.message}</div>;

  return (
    <>
      <div className={style.main}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginOffice />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<SignIn />} />

            {/* Protected Routes */}
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
        </ErrorBoundary>
      </div>
      <Toast />
    </>
  );
};

export default App;
