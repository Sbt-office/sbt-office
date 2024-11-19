import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import style from "./app.module.css";
import BarLoader from "react-spinners/BarLoader";
import { ErrorBoundary } from "react-error-boundary";

// import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { alertHistoryState, newAlertState } from "./utils/recoil";
import _ from "lodash";
import CustomAlert from "./utils/CustomAlert/CustomAlert";
import dayjs from "dayjs";

const ErrorFallback = (error) => <div>An error occurred: {error.message}</div>;

const App = () => {
  const [alertList, setAlertList] = useState([]);

  const newAlert = useRecoilValue(newAlertState);

  const setAlertHistory = useSetRecoilState(alertHistoryState);

  useEffect(() => {
    if (newAlert !== "") {
      setAlertHistory((prevState) => {
        const newState = _.cloneDeep(prevState);
        newState.push(newAlert);
        return newState;
      });

      setAlertList((prevState) => {
        const newState = _.cloneDeep(prevState);
        newState.unshift({
          message: newAlert,
          time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        });
        return newState;
      });

      setTimeout(() => {
        setAlertList((prevState) => {
          const newState = _.cloneDeep(prevState);
          newState.splice(0, 1);
          return newState;
        });
      }, 5000);
    }
  }, [newAlert]);

  return (
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
            {/* <Route path="/" element={<Login />} />  로그인이 추후 개발 진행 시 다시 사용 예정 */}
            <Route path="/" element={<MainLayout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      {alertList.length > 0 && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-4">
          {alertList.map((message, idx) => (
            <CustomAlert key={"newAlert" + idx} message={message} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
