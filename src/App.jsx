import { Suspense } from "react";
import style from "./app.module.css";

import OfficeThree from "./components/OfficeThree";
import SideBar from "./components/SideBar";
import BarLoader from "react-spinners/BarLoader";

import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = (error) => <div>An error occurred: {error.message}</div>;

const App = () => {
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
          <SideBar />
          <OfficeThree />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
