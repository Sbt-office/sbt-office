import { useQuery } from "@tanstack/react-query";
import { getUserListFetch } from "@/utils/api";

export const useAllUserListQuery = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserListFetch,
    staleTime: 0,
    cacheTime: 30 * 60 * 1000,
    refetchOnMount: false, 
    refetchOnWindowFocus: false, 
  });
};
