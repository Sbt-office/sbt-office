import { useQuery } from "@tanstack/react-query";
import { getUserInfoFetch } from "@/utils/api";
import { QueryKeys } from "@/queryClient";

export const useUserQuery = (userSabeon) => {
  const localStorageUser = JSON.parse(localStorage.getItem("auth-storage"))?.state?.user;
  const sabeon = localStorageUser?.sabeon;
  const targetSabeon = userSabeon || sabeon;

  return useQuery({
    queryKey: [QueryKeys.USER_INFO, targetSabeon],
    queryFn: () => {
      if (!targetSabeon) {
        throw new Error("사번이 유효하지 않습니다.");
      }
      return getUserInfoFetch(targetSabeon);
    },
    enabled: Boolean(targetSabeon),
    onError: (error) => {
      console.error("사용자 정보를 가져오는데 실패했습니다:", error);
    },
  });
};
