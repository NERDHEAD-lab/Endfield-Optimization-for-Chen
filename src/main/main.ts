import path from "path";

import { app, BrowserWindow, ipcMain, shell } from "electron";

import { eventBus } from "./events/EventBus";
import { PatchNoteHandler } from "./events/handlers/PatchNoteHandler";
import {
  startUpdateCheckInterval,
  UpdateCheckHandler,
  UpdateDownloadHandler,
  UpdateInstallHandler,
} from "./events/handlers/UpdateHandler";
import { EventType } from "./events/types";

// Event Bus Integration

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
    icon: path.join(__dirname, "../src/renderer/assets/icon.ico"), // Valid for Dev
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

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

// Register Handlers
eventBus.onEvent(EventType.APP_QUIT, () => {
  app.quit();
});

// Update Handlers
eventBus.onEvent(EventType.UI_UPDATE_CHECK, (event) =>
  UpdateCheckHandler(event.payload as { isSilent?: boolean }, { mainWindow }),
);
eventBus.onEvent(EventType.UI_UPDATE_DOWNLOAD, (event) =>
  UpdateDownloadHandler(event.payload, { mainWindow }),
);
eventBus.onEvent(EventType.UI_UPDATE_INSTALL, (event) =>
  UpdateInstallHandler(event.payload, { mainWindow }),
);

// Patch Note Handler
eventBus.onEvent(EventType.UI_PATCH_NOTES_REQUEST, (event) =>
  PatchNoteHandler(event.payload, { mainWindow }),
);

// IPC Bridge: Forward renderer events to EventBus
const registerIpcBridge = () => {
  const eventsToBridge = [
    EventType.UI_UPDATE_CHECK,
    EventType.UI_UPDATE_DOWNLOAD,
    EventType.UI_UPDATE_INSTALL,
    EventType.UI_PATCH_NOTES_REQUEST,
  ];

  eventsToBridge.forEach((type) => {
    ipcMain.on(type, (_, payload) => {
      eventBus.emitEvent(type, payload);
    });
  });
};

registerIpcBridge();

// Start background update check
app.whenReady().then(() => {
  startUpdateCheckInterval({ mainWindow });
});
