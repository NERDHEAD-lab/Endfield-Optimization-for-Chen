import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { eventBus } from "./events/EventBus";
import { EventType } from "./events/types";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC Handlers
ipcMain.on("window-minimize", () => {
  mainWindow?.minimize();
});

ipcMain.on("window-close", () => {
  mainWindow?.close();
});

// Event Bus Integration
eventBus.onEvent(EventType.APP_QUIT, () => {
  app.quit();
});
