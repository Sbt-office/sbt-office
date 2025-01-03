// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/dowon/OneDrive/desktop/office/sbt-office/node_modules/vite/dist/node/index.js";
import Inspect from "file:///C:/Users/dowon/OneDrive/desktop/office/sbt-office/node_modules/vite-plugin-inspect/dist/index.mjs";
import react from "file:///C:/Users/dowon/OneDrive/desktop/office/sbt-office/node_modules/@vitejs/plugin-react-swc/index.mjs";
import reactRefresh from "file:///C:/Users/dowon/OneDrive/desktop/office/sbt-office/node_modules/@vitejs/plugin-react-refresh/index.js";
import obfuscator from "file:///C:/Users/dowon/OneDrive/desktop/office/sbt-office/node_modules/rollup-plugin-obfuscator/dist/rollup-plugin-obfuscator.js";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///C:/Users/dowon/OneDrive/desktop/office/sbt-office/vite.config.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = dirname(__filename);
var outDir = resolve(__dirname, "build");
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "/",
    plugins: [
      obfuscator({
        compact: true,
        controlFlowFlattening: true
      }),
      react(),
      reactRefresh(),
      Inspect()
    ],
    assetsInclude: ["**/*.glb", "**/*.hdr", "**/*.wasm"],
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: void 0
        }
      }
    },
    optimizeDeps: {
      include: ["es-toolkit"]
    },
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "src") }]
    },
    // 환경 변수를 define 옵션을 통해 전역으로 사용 가능하게 설정
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV)
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkb3dvblxcXFxPbmVEcml2ZVxcXFxkZXNrdG9wXFxcXG9mZmljZVxcXFxzYnQtb2ZmaWNlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkb3dvblxcXFxPbmVEcml2ZVxcXFxkZXNrdG9wXFxcXG9mZmljZVxcXFxzYnQtb2ZmaWNlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9kb3dvbi9PbmVEcml2ZS9kZXNrdG9wL29mZmljZS9zYnQtb2ZmaWNlL3ZpdGUuY29uZmlnLmpzXCI7LyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IEluc3BlY3QgZnJvbSBcInZpdGUtcGx1Z2luLWluc3BlY3RcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHJlYWN0UmVmcmVzaCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3QtcmVmcmVzaFwiO1xyXG5pbXBvcnQgb2JmdXNjYXRvciBmcm9tIFwicm9sbHVwLXBsdWdpbi1vYmZ1c2NhdG9yXCI7XHJcblxyXG5pbXBvcnQgeyByZXNvbHZlLCBkaXJuYW1lIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcclxuXHJcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XHJcbmNvbnN0IF9fZGlybmFtZSA9IGRpcm5hbWUoX19maWxlbmFtZSk7XHJcblxyXG5jb25zdCBvdXREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJidWlsZFwiKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICAvLyBcdUQ2NThcdUFDQkQgXHVCQ0MwXHVDMjE4IFx1Qjg1Q1x1QjREQ1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgXCJcIik7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBiYXNlOiBcIi9cIixcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgb2JmdXNjYXRvcih7XHJcbiAgICAgICAgY29tcGFjdDogdHJ1ZSxcclxuICAgICAgICBjb250cm9sRmxvd0ZsYXR0ZW5pbmc6IHRydWUsXHJcbiAgICAgIH0pLFxyXG4gICAgICByZWFjdCgpLFxyXG4gICAgICByZWFjdFJlZnJlc2goKSxcclxuICAgICAgSW5zcGVjdCgpLFxyXG4gICAgXSxcclxuICAgIGFzc2V0c0luY2x1ZGU6IFtcIioqLyouZ2xiXCIsIFwiKiovKi5oZHJcIiwgXCIqKi8qLndhc21cIl0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBvdXREaXIsXHJcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHVuZGVmaW5lZCxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICBpbmNsdWRlOiBbXCJlcy10b29sa2l0XCJdLFxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IFt7IGZpbmQ6IFwiQFwiLCByZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpIH1dLFxyXG4gICAgfSxcclxuICAgIC8vIFx1RDY1OFx1QUNCRCBcdUJDQzBcdUMyMThcdUI5N0MgZGVmaW5lIFx1QzYzNVx1QzE1OFx1Qzc0NCBcdUQxQjVcdUQ1NzQgXHVDODA0XHVDNUVEXHVDNzNDXHVCODVDIFx1QzBBQ1x1QzZBOSBcdUFDMDBcdUIyQTVcdUQ1NThcdUFDOEMgXHVDMTI0XHVDODE1XHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgX19BUFBfRU5WX186IEpTT04uc3RyaW5naWZ5KGVudi5WSVRFX0FQUF9FTlYpLFxyXG4gICAgfSxcclxuICB9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8sYUFBYTtBQUNwQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxrQkFBa0I7QUFDekIsT0FBTyxnQkFBZ0I7QUFFdkIsU0FBUyxTQUFTLGVBQWU7QUFDakMsU0FBUyxxQkFBcUI7QUFSeUwsSUFBTSwyQ0FBMkM7QUFVeFEsSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLFFBQVEsVUFBVTtBQUVwQyxJQUFNLFNBQVMsUUFBUSxXQUFXLE9BQU87QUFFekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFFeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxNQUNQLFdBQVc7QUFBQSxRQUNULFNBQVM7QUFBQSxRQUNULHVCQUF1QjtBQUFBLE1BQ3pCLENBQUM7QUFBQSxNQUNELE1BQU07QUFBQSxNQUNOLGFBQWE7QUFBQSxNQUNiLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxlQUFlLENBQUMsWUFBWSxZQUFZLFdBQVc7QUFBQSxJQUNuRCxPQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0EsYUFBYTtBQUFBLE1BQ2IsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sY0FBYztBQUFBLFFBQ2hCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxZQUFZO0FBQUEsSUFDeEI7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU8sQ0FBQyxFQUFFLE1BQU0sS0FBSyxhQUFhLFFBQVEsV0FBVyxLQUFLLEVBQUUsQ0FBQztBQUFBLElBQy9EO0FBQUE7QUFBQSxJQUVBLFFBQVE7QUFBQSxNQUNOLGFBQWEsS0FBSyxVQUFVLElBQUksWUFBWTtBQUFBLElBQzlDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
