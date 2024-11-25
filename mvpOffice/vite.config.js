/* eslint-disable no-undef */
import { defineConfig, loadEnv } from "vite";
import Inspect from "vite-plugin-inspect";
import react from "@vitejs/plugin-react-swc";
import reactRefresh from "@vitejs/plugin-react-refresh";
import obfuscator from "rollup-plugin-obfuscator";

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outDir = resolve(__dirname, "build");

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    plugins: [
      obfuscator({
        compact: true,
        controlFlowFlattening: true,
      }),
      react(),
      reactRefresh(),
      Inspect(),
    ],
    assetsInclude: ["**/*.glb", "**/*.hdr", "**/*.wasm"],
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    optimizeDeps: {
      include: ["es-toolkit"],
    },
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
    },
    // 환경 변수를 define 옵션을 통해 전역으로 사용 가능하게 설정
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
    },
  };
});
