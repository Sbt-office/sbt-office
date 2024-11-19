import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useRecoilValue, useSetRecoilState } from "recoil";
import dayjs from "dayjs";
import { alertHistoryState, newAlertState } from "../utils/recoil";

const HandleAlertList = () => {
  const [alertList, setAlertList] = useState([]);

  const newAlert = useRecoilValue(newAlertState);

  const setAlertHistory = useSetRecoilState(alertHistoryState);

  useEffect(() => {
    if (newAlert.message && newAlert.message) {
      // 알림 기록
      setAlertHistory((prevState) => {
        const newState = _.cloneDeep(prevState);
        newState.unshift({
          data: newAlert,
          time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        });
        return newState;
      });

      // 알림 노출
      setAlertList((prevState) => {
        const newState = _.cloneDeep(prevState);
        newState.push(newAlert);
        return newState;
      });

      // 알림 메세지 사라지게
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
    <>
      {alertList.length > 0 && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-4">
          {alertList.map((newAlert, idx) => (
            <div
              key={"newAlert" + idx}
              className={[
                "bg-white px-2 py-2 rounded-lg",
                newAlert.status || newAlert.code ? "text-red-600" : "text-black",
              ].join(" ")}
            >
              {newAlert.status && <div>{newAlert.status}</div>}
              {newAlert.code && <div>{newAlert.code}</div>}
              {newAlert.message && <div>{newAlert.message}</div>}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HandleAlertList;
