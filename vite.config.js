import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

export default defineConfig({
  base: "/",
  plugins: [react()],
  assetsInclude: [],
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  publicDir: "public",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "localhost",
    port: 3000,
  },
});
