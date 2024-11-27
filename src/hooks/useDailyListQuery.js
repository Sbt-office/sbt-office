import { useQuery } from "@tanstack/react-query";
import { getDailyListFetch } from "@/utils/api";
import { QueryKeys } from "@/queryClient";

export const useDailyListQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.DAILY_LIST],
    queryFn: getDailyListFetch,

  });
};