import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { execSync } from "node:child_process";
import fs from "node:fs";

// Get App Version & Hash
const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const getGitHash = () => {
  try {
    const hash = execSync("git rev-parse --short HEAD").toString().trim();
    const isDirty =
      execSync("git status --porcelain").toString().trim().length > 0;
    return isDirty ? `${hash}-dirty` : hash;
  } catch (e) {
    return "unknown";
  }
};
const gitHash = getGitHash();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_HASH__: JSON.stringify(gitHash),
  },
  plugins: [
    react(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: "src/main/main.ts",
      },
      {
        entry: "src/main/preload.ts",
        onstart(options) {
          options.reload();
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 54321,
    strictPort: true,
  },
});
