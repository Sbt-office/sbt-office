import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const dehydratedState = window.__REACT_QUERY_STATE__;

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={dehydratedState}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HydrationBoundary>
  </QueryClientProvider>
);
