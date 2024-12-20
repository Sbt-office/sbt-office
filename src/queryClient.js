import { QueryClient } from "@tanstack/react-query";

// getQueryClient
export const getQueryClient = (() => {
  let client = null;
  return () => {
    if (!client)
      client = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 1, // 1분
            gcTime: 1000 * 60 * 5, // 5분
            retry: 2,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchInterval: 1000 * 60 * 1, // 1분마다 재요청
          },
        },
      });
    return client;
  };
})();

// QueryKeys
export const QueryKeys = {
  USER_INFO: "USER_INFO",
  DAILY_LIST: "DAILY_LIST",
  ALL_USER_LIST: "ALL_USER_LIST",
  INFINITE_USER_INFO: "INFINITE_USER_INFO",
  WIDGET_LIST: "WIDGET_LIST",
};
