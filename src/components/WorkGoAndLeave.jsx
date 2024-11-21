import { useEffect } from "react";
import useWorkStatusStore from "@/store/useWorkStatusStore";
import { useUserStore } from "@/store/userStore";
import { useUserQuery } from "@/hooks/useUserQuery";
import { IoWarningOutline } from "react-icons/io5";
import { useThrottle } from "../hooks/useThrottle";
import { useAuthStore } from "../store/authStore";
import { getWorkStatusStore, setWorkStatusStore } from "../hooks/useWorkStatus";

const WorkGoAndLeave = () => {
  const { isWorking } = useWorkStatusStore();
  const { logout } = useAuthStore();

  const getWorkStatus = getWorkStatusStore();
  const setWorkStatus = setWorkStatusStore();

  const { userInfo, setUserInfo } = useUserStore();
  const { data, isLoading, error } = useUserQuery();

  useEffect(() => {
    if (data) {
      setUserInfo(data);
    }
  }, [data, setUserInfo]);

  useEffect(() => {
    if (userInfo) getWorkStatus.mutate(userInfo.ou_sabeon);
  }, [userInfo]);

  const handleWorkStart = useThrottle(() => {
    setWorkStatus.mutate({ sabeon: userInfo.ou_sabeon, status: 1 });
  }, 1000);

  const handleWorkEnd = useThrottle(() => {
    setWorkStatus.mutate({ sabeon: userInfo.ou_sabeon, status: 2 });
  }, 1000);

  const parsedUserInfo = userInfo?.ou_insa_info ? JSON.parse(userInfo.ou_insa_info) : {};

  if (isLoading)
    return (
      <div className="text-center p-6 mb-10 text-sbtDarkBlue text-base font-semibold flex items-center justify-center gap-1">
        <p className="w-full">사용자 정보 불러오는 중</p>
        <span className="inline-block translate-y-4 animate-[bounce_1s_ease-in-out_0s_infinite]">.</span>
        <span className="inline-block translate-y-2 animate-[bounce_1s_ease-in-out_0.2s_infinite]">.</span>
        <span className="inline-block translate-y-0 animate-[bounce_1s_ease-in-out_0.4s_infinite]">.</span>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-sm font-semibold w-full p-6 flex items-center justify-center gap-2 mb-10">
        <IoWarningOutline size={30} />
        <span>사용자 정보를 불러오는데 실패했습니다.</span>
      </div>
    );
  if (!userInfo)
    return (
      <div className="text-red-500 text-sm font-semibold w-full p-6 flex items-center justify-center gap-2 mb-8">
        <IoWarningOutline size={25} />
        <span>사용자 정보가 없습니다.</span>
      </div>
    );

  return (
    <div className="w-full p-4 flex flex-col h-44 justify-center">
      <div className="flex flex-col justify-center items-start px-1 py-1 text-base font-semibold text-black/70 gap-1">
        <span className="text-black text-sm">안녕하세요. SBT Global입니다.</span>
        <span className="text-sbt">
          {userInfo.ou_nm} {parsedUserInfo?.level}님
        </span>
      </div>
      <div className="flex items-center w-full gap-2 py-2">
        <button
          onClick={handleWorkStart}
          disabled={isWorking !== 0}
          className={`flex-1 w-full text-center py-2 rounded-md text-sm 
            ${
              isWorking !== 0
                ? "bg-gray-200 cursor-not-allowed text-black/40"
                : "bg-sbtLightBlue hover:bg-sbtDarkBlue hover:text-white"
            }`}
        >
          출근
        </button>
        <button
          onClick={handleWorkEnd}
          disabled={isWorking !== 1}
          className={`flex-1 w-full text-center py-2 rounded-md text-sm
            ${
              isWorking !== 1
                ? "bg-gray-100 text-black/40 cursor-not-allowed"
                : "bg-red-200 hover:bg-red-400 hover:text-white"
            }`}
        >
          퇴근
        </button>
        <button
          onClick={logout}
          className="flex-1 w-full text-center py-2 rounded-md text-sm bg-sbtLightBlue hover:bg-sbtDarkBlue hover:text-white"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default WorkGoAndLeave;
