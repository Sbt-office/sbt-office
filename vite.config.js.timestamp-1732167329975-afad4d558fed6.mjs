// vite.config.js
import { defineConfig } from "file:///C:/Users/dowon/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/mvpOffice/office/sbt-office/node_modules/vite/dist/node/index.js";
import Inspect from "file:///C:/Users/dowon/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/mvpOffice/office/sbt-office/node_modules/vite-plugin-inspect/dist/index.mjs";
import react from "file:///C:/Users/dowon/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/mvpOffice/office/sbt-office/node_modules/@vitejs/plugin-react-swc/index.mjs";
import reactRefresh from "file:///C:/Users/dowon/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/mvpOffice/office/sbt-office/node_modules/@vitejs/plugin-react-refresh/index.js";
import env from "file:///C:/Users/dowon/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/mvpOffice/office/sbt-office/node_modules/vite-plugin-env-compatible/dist/index.mjs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url =
  "file:///C:/Users/dowon/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/mvpOffice/office/sbt-office/vite.config.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = dirname(__filename);
var outDir = resolve(__dirname, "dist");
var vite_config_default = defineConfig({
  base: "/",
  plugins: [react(), reactRefresh(), Inspect(), env()],
  assetsInclude: ["**/*.glb", "**/*.hdr", "**/*.wasm"],
  build: {
    outDir,
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ["es-toolkit"],
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
  },
  server: {
    host: "localhost",
    port: 3000,
    historyApiFallback: true,
    // 모든 요청을 index.html로 리다이렉트 (배포 시 필요)
    middleware: (app) => {
      app.use((req, res, next) => {
        if (req.method === "GET" && !req.path.startsWith("/api")) {
          req.url = "/index.html";
        }
        next();
      });
    },
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkb3dvblxcXFxPbmVEcml2ZVxcXFxcdUJDMTRcdUQwRDUgXHVENjU0XHVCQTc0XFxcXG12cE9mZmljZVxcXFxvZmZpY2VcXFxcc2J0LW9mZmljZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZG93b25cXFxcT25lRHJpdmVcXFxcXHVCQzE0XHVEMEQ1IFx1RDY1NFx1QkE3NFxcXFxtdnBPZmZpY2VcXFxcb2ZmaWNlXFxcXHNidC1vZmZpY2VcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2Rvd29uL09uZURyaXZlLyVFQiVCMCU5NCVFRCU4MyU5NSUyMCVFRCU5OSU5NCVFQiVBOSVCNC9tdnBPZmZpY2Uvb2ZmaWNlL3NidC1vZmZpY2Uvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgSW5zcGVjdCBmcm9tIFwidml0ZS1wbHVnaW4taW5zcGVjdFwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcmVhY3RSZWZyZXNoIGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1yZWZyZXNoXCI7XHJcbmltcG9ydCBlbnYgZnJvbSBcInZpdGUtcGx1Z2luLWVudi1jb21wYXRpYmxlXCI7XHJcbmltcG9ydCB7IHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xyXG5cclxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcclxuY29uc3QgX19kaXJuYW1lID0gZGlybmFtZShfX2ZpbGVuYW1lKTtcclxuXHJcbmNvbnN0IG91dERpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcImRpc3RcIik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2U6IFwiL1wiLFxyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCByZWFjdFJlZnJlc2goKSwgSW5zcGVjdCgpLCBlbnYoKV0sXHJcbiAgYXNzZXRzSW5jbHVkZTogW1wiKiovKi5nbGJcIiwgXCIqKi8qLmhkclwiLCBcIioqLyoud2FzbVwiXSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyLFxyXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFtcImxvZGFzaC1lc1wiXSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiBbeyBmaW5kOiBcIkBcIiwgcmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSB9XSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCJsb2NhbGhvc3RcIixcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgICBoaXN0b3J5QXBpRmFsbGJhY2s6IHRydWUsXHJcbiAgICAvLyBcdUJBQThcdUI0RTAgXHVDNjk0XHVDQ0FEXHVDNzQ0IGluZGV4Lmh0bWxcdUI4NUMgXHVCOUFDXHVCMkU0XHVDNzc0XHVCODA5XHVEMkI4IChcdUJDMzBcdUQzRUMgXHVDMkRDIFx1RDU0NFx1QzY5NClcclxuICAgIG1pZGRsZXdhcmU6IChhcHApID0+IHtcclxuICAgICAgYXBwLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgICAgICBpZiAocmVxLm1ldGhvZCA9PT0gXCJHRVRcIiAmJiAhcmVxLnBhdGguc3RhcnRzV2l0aChcIi9hcGlcIikpIHtcclxuICAgICAgICAgIHJlcS51cmwgPSBcIi9pbmRleC5odG1sXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStZLFNBQVMsb0JBQW9CO0FBQzVhLE9BQU8sYUFBYTtBQUNwQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxrQkFBa0I7QUFDekIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsU0FBUyxlQUFlO0FBQ2pDLFNBQVMscUJBQXFCO0FBTjJNLElBQU0sMkNBQTJDO0FBUTFSLElBQU0sYUFBYSxjQUFjLHdDQUFlO0FBQ2hELElBQU0sWUFBWSxRQUFRLFVBQVU7QUFFcEMsSUFBTSxTQUFTLFFBQVEsV0FBVyxNQUFNO0FBRXhDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVMsQ0FBQyxNQUFNLEdBQUcsYUFBYSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFBQSxFQUNuRCxlQUFlLENBQUMsWUFBWSxZQUFZLFdBQVc7QUFBQSxFQUNuRCxPQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0EsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxXQUFXO0FBQUEsRUFDdkI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU8sQ0FBQyxFQUFFLE1BQU0sS0FBSyxhQUFhLFFBQVEsV0FBVyxLQUFLLEVBQUUsQ0FBQztBQUFBLEVBQy9EO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixvQkFBb0I7QUFBQTtBQUFBLElBRXBCLFlBQVksQ0FBQyxRQUFRO0FBQ25CLFVBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO0FBQzFCLFlBQUksSUFBSSxXQUFXLFNBQVMsQ0FBQyxJQUFJLEtBQUssV0FBVyxNQUFNLEdBQUc7QUFDeEQsY0FBSSxNQUFNO0FBQUEsUUFDWjtBQUNBLGFBQUs7QUFBQSxNQUNQLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
