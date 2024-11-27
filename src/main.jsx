import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "./queryClient";

const queryClient = getQueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>
);
