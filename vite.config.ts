// Main configuration file for the application
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

// Parse Repo Info
const repoUrl = pkg.repository?.url || "";
// Extract owner/name from https://github.com/OWNER/NAME.git or similar
const match = repoUrl.match(/github\.com\/([^/]+)\/([^/.]+)/);
const repoOwner = match ? match[1] : "NERDHEAD-lab";
const repoName = match ? match[2] : "Endfield-Optimization-for-Chen";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_HASH__: JSON.stringify(gitHash),
    __REPO_OWNER__: JSON.stringify(repoOwner),
    __REPO_NAME__: JSON.stringify(repoName),
  },
  plugins: [
    react(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: "src/main/main.ts",
        vite: {
          define: {
            __REPO_OWNER__: JSON.stringify(repoOwner),
            __REPO_NAME__: JSON.stringify(repoName),
          },
        },
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
