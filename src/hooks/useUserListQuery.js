import { useQuery } from "@tanstack/react-query";
import { getUserListFetch } from "@/utils/api";
import { QueryKeys } from "@/queryClient";

export const useUserListQuery = (page = 1, pageSize = 16) => {
  return useQuery({
    queryKey: [QueryKeys.USER_INFO, page, pageSize],
    queryFn: async () => {
      const response = await getUserListFetch();
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const items = response.slice(start, end);
      const totalPages = Math.ceil(response.length / pageSize);

      return {
        items,
        totalItems: response.length,
        totalPages,
        currentPage: page,
      };
    },
  });
};
