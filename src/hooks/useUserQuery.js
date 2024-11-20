import { useQuery } from "@tanstack/react-query";
import { getUserInfoFetch } from "@/utils/api";
import Cookies from "js-cookie";

export const useUserQuery = () => {
  const sabeon = Cookies.get("sabeon");

  return useQuery({
    queryKey: ["userInfo", sabeon],
    queryFn: () => getUserInfoFetch(sabeon),
    enabled: !!sabeon,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};
