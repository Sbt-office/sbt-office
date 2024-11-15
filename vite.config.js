import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import react from "@vitejs/plugin-react-swc";
import reactRefresh from "@vitejs/plugin-react-refresh";
import env from "vite-plugin-env-compatible";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outDir = resolve(__dirname, "dist");

export default defineConfig({
  base: "/",
  plugins: [react(), reactRefresh(), Inspect(), env()],
  assetsInclude: ["**/*.glb", "**/*.hdr", "**/*.wasm"],
  build: {
    outDir,
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ["lodash-es"],
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
  },
  server: {
    host: "localhost",
    port: 3000,
    historyApiFallback: true,
  },
});
