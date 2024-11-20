import { StaticRouter } from "react-router-dom/server";
import ReactDOMServer from "react-dom/server";
import App from "./App";
import "./main.css";
import { dehydrate, HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const getServerRender = (queryClient = new QueryClient()) => {
  console.log(queryClient.getQueryCache());
  return (url, context) => {
    let dehydratedState = dehydrate(queryClient);
    return ReactDOMServer.renderToString(
      <StaticRouter location={url} context={context}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            <App />
          </HydrationBoundary>
        </QueryClientProvider>
      </StaticRouter>
    );
  };
};
