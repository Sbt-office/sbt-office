import { useQuery } from "@tanstack/react-query";
import { getUserInfoFetch } from "@/utils/api";

export const useUserQuery = (userSabeon) => {
  const localStorageUser = JSON.parse(localStorage.getItem('auth-storage'))?.state?.user;
  const sabeon = localStorageUser?.sabeon;
  const targetSabeon = userSabeon || sabeon;
  
  return useQuery({
    queryKey: ["userInfo", targetSabeon],
    queryFn: () => {
      if (!targetSabeon) {
        throw new Error("사번이 유효하지 않습니다.");
      }
      return getUserInfoFetch(targetSabeon);
    },
    enabled: Boolean(targetSabeon),
    staleTime: 5 * 60 * 1000, 
    cacheTime: 30 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("사용자 정보를 가져오는데 실패했습니다:", error);
    }
  });
};
