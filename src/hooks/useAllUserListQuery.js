import { useQuery } from "@tanstack/react-query";
import { getUserListFetch } from "@/utils/api";
import { QueryKeys } from "@/queryClient";

export const useAllUserListQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.ALL_USER_LIST],
    queryFn: getUserListFetch,
  });
};
