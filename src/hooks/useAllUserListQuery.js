import { useQuery } from "@tanstack/react-query";
import { getUserListFetch } from "@/utils/api";

export const useAllUserListQuery = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserListFetch,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};
