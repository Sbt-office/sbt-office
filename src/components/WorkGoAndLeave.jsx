/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";

import { useUserQuery } from "@/hooks/useUserQuery";
import { useThrottle } from "@/hooks/useThrottle";
import { useLogout } from "@/hooks/useAuth";
import { getWorkStatusStore, setWorkStatusStore } from "@/hooks/useWorkStatus";
import { useDailyListQuery } from "@/hooks/useDailyListQuery";

import useWorkStatusStore from "@/store/useWorkStatusStore";
import { useUserStore } from "@/store/userStore";
import useAdminStore from "@/store/adminStore";
import useThemeStore from "@/store/themeStore";
import basicProfileImg from "@/assets/images/profile.png";

const WorkGoAndLeave = () => {
  const isWorking = useWorkStatusStore((state) => state.isWorking);
  const handleLogout = useLogout();
  const userInfo = useUserStore((state) => state.userInfo);
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const { sabeon, setIsAdmin, setSabeon } = useAdminStore(
    useShallow((state) => ({
      sabeon: state.sabeon,
      setIsAdmin: state.setIsAdmin,
      setSabeon: state.setSabeon,
    }))
  );

  const getWorkStatus = getWorkStatusStore();
  const setWorkStatus = setWorkStatusStore();
  const isDark = useThemeStore((state) => state.isDark);

  const { data, isLoading, error, refetch } = useUserQuery();
  const { refetch: refetchDailyList } = useDailyListQuery();

  useEffect(() => {
    if (!data) {
      refetch();
    }
  }, [data, refetch]);

  useEffect(() => {
    try {
      if (data) {
        setUserInfo(data);
        setIsAdmin(data.ou_admin_yn);
        setSabeon(data.ou_sabeon);
      }
    } catch (err) {
      console.error("사용자 정보 설정 중 오류 발생:", err);
    }
  }, [data, setUserInfo, setIsAdmin, setSabeon]);

  useEffect(() => {
    if (userInfo) getWorkStatus.mutate(sabeon);
  }, [userInfo]);

  const handleWorkStart = useThrottle(() => {
    setWorkStatus.mutate(
      { sabeon, status: 1 },
      {
        onSuccess: () => {
          refetchDailyList();
        },
      }
    );
  }, 1000);

  const handleWorkEnd = useThrottle(() => {
    setWorkStatus.mutate(
      { sabeon, status: 2 },
      {
        onSuccess: () => {
          refetchDailyList();
        },
      }
    );
  }, 1000);

  const parsedUserInfo = userInfo?.ou_insa_info ? JSON.parse(userInfo.ou_insa_info) : {};

  if (isLoading)
    return (
      <div
        className={`text-center  text-sm font-medium flex items-center justify-center gap-1 px-8 ${
          isDark ? "text-blue-300" : "text-sbtDarkBlue"
        }`}
      >
        <p className="w-full">사용자 정보 불러오는 중</p>
        <span className="inline-block translate-y-4 animate-[bounce_1s_ease-in-out_0s_infinite]">.</span>
        <span className="inline-block translate-y-2 animate-[bounce_1s_ease-in-out_0.2s_infinite]">.</span>
        <span className="inline-block translate-y-0 animate-[bounce_1s_ease-in-out_0.4s_infinite]">.</span>
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 text-[0.73rem] font-medium flex items-center justify-center gap-1 px-8">
        <IoWarningOutline size={20} />
        <span>사용자 정보를 불러오는데 실패했습니다.</span>
      </div>
    );
  if (!userInfo)
    return (
      <div className="text-center text-red-500 text-sm font-medium flex items-center justify-center gap-1 px-8">
        <IoWarningOutline size={20} />
        <span>등록된 사용자 정보가 없습니다.</span>
      </div>
    );

  return (
    <div className="flex h-full justify-center items-center 2xl:gap-2 gap-1">
      <div className="justify-center items-center flex 2xl:w-[15rem] lg:w-[13rem]">
        {userInfo.ou_nm && (
          <div className="flex items-center gap-1 md:flex-col md:justify-center md:items-end">
            <div
              className={`2xl:text-sm lg:text-xs text-[0.65rem] flex justify-center truncate items-center gap-1 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              <img
                src={parsedUserInfo.profile_img ? parsedUserInfo.profile_img : basicProfileImg}
                alt="profile"
                className={`rounded-full w-5 h-5 ${parsedUserInfo.profile_img ? "" : "border-2 border-comGray"}`}
              />
              <p>{userInfo.ou_nm}</p>
              <p>
                {parsedUserInfo?.level === "Manager"
                  ? "매니저"
                  : parsedUserInfo?.level?.includes("Senior")
                  ? "S/M"
                  : parsedUserInfo?.level
                  ? parsedUserInfo.level
                  : ""}
                님
              </p>
              <span className={`2xl:text-sm lg:text-xs text-[0.65rem] ml-1 ${isDark ? "text-white" : "text-black"}`}>
                안녕하세요.
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={handleWorkStart}
          disabled={isWorking !== 0}
          className={`2xl:w-12 2xl:h-7 w-10 h-6 text-center rounded-md 2xl:text-sm text-xs
            ${
              isWorking !== 0
                ? `bg-comGray cursor-not-allowed ${isDark ? "text-white/50" : "text-black/50"}`
                : "bg-comBlue text-white hover:bg-sbtDarkBlue"
            }`}
        >
          출근
        </button>
        <button
          onClick={handleWorkEnd}
          disabled={isWorking !== 1}
          className={`2xl:w-12 2xl:h-7 w-10 h-6 text-center rounded-md 2xl:text-sm text-xs
            ${
              isWorking !== 1
                ? `bg-comGray cursor-not-allowed ${isDark ? "text-white/50" : "text-black/50"}`
                : "bg-comBlue text-white hover:bg-sbtDarkBlue"
            }`}
        >
          퇴근
        </button>
        <button
          onClick={handleLogout}
          className="2xl:w-[4.5rem] 2xl:h-7 w-[3.5rem] h-6 text-center rounded-md 2xl:text-sm text-xs bg-comBlue text-white hover:bg-sbtDarkBlue ml-1"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default WorkGoAndLeave;
