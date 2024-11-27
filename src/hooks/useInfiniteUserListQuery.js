import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserListFetch } from "@/utils/api";
import { QueryKeys } from "@/queryClient";

export const useInfiniteUserListQuery = (pageSize = 16) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.INFINITE_USER_INFO],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getUserListFetch();
      const start = (pageParam - 1) * pageSize;
      const end = start + pageSize;
      const items = response.slice(start, end);
      const totalPages = Math.ceil(response.length / pageSize);

      return {
        items,
        nextPage: pageParam < totalPages ? pageParam + 1 : undefined,
        totalItems: response.length,
        totalPages,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};