import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllUserFetch } from "@/utils/api";

export const useInfiniteUserListQuery = (pageSize = 16) => {
  return useInfiniteQuery({
    queryKey: ['infiniteUserInfo'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getAllUserFetch();
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
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}; 