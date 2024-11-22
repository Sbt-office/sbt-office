import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import react from "@vitejs/plugin-react-swc";
import reactRefresh from "@vitejs/plugin-react-refresh";
import obfuscator from "rollup-plugin-obfuscator";
import env from "vite-plugin-env-compatible";

import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outDir = resolve(__dirname, "dist");

export default defineConfig({
  base: "/",
  plugins: [
    obfuscator({
      compact: true,
      controlFlowFlattening: true,
    }),
    react(),
    reactRefresh(),
    Inspect(),
    env(),
    // {
    //   name: "generate-server-js",
    //   closeBundle() {
    //     const serverContent = `
    //           const express = require('express');
    //           const path = require('path');
    //           const app = express();

    //           app.use(express.static(path.join(__dirname, '.')));

    //           app.get('*', (req, res) => {
    //             res.sendFile(path.join(__dirname, 'index.html'));
    //           });

    //           const port = process.env.PORT || 8081;
    //           app.listen(port, () => {
    //             console.log(\`Server is running on port \${port}\`);
    //           });
    //       `;
    //     fs.writeFileSync(join(outDir, "server.js"), serverContent);
    //   },
    // },
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
});
