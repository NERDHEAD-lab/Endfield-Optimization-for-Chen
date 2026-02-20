import path from "node:path";

import { app, BrowserWindow, ipcMain, shell } from "electron";

import { eventBus } from "./events/EventBus";
import { ChangelogCheckHandler } from "./events/handlers/ChangelogCheckHandler";
import { ChangelogUISyncHandler } from "./events/handlers/ChangelogUISyncHandler";
import {
  ConfigChangeSyncHandler,
  ConfigDeleteSyncHandler,
} from "./events/handlers/ConfigSyncHandler";
import { PatchNoteHandler } from "./events/handlers/PatchNoteHandler";
import {
  startUpdateCheckInterval,
  UpdateCheckHandler,
  UpdateDownloadHandler,
  UpdateInstallHandler,
} from "./events/handlers/UpdateHandler";
import { AppContext, AppEvent, EventType } from "./events/types";
import { getConfig } from "./store";
import { setConfigWithEvent } from "./utils/config-utils";
import { rendererBridge } from "./utils/RendererBridge";

// Event Bus Integration

let mainWindow: BrowserWindow | null = null;

const context: AppContext = {
  get mainWindow() {
    return mainWindow;
  },
};

// Register Event Handlers
eventBus.registerHandler(ConfigChangeSyncHandler);
eventBus.registerHandler(ConfigDeleteSyncHandler);
eventBus.registerHandler(ChangelogCheckHandler);
eventBus.registerHandler(ChangelogUISyncHandler);

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

  // Register window with RendererBridge
  rendererBridge.setMainWindow(mainWindow);

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" }); // Always open in dev (detached)
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/**
 * Checks if the launcher version has changed since the last run.
 * If changed, triggers the Changelog check sequence.
 */
function checkLauncherVersionUpdate() {
  const currentVersion = app.getVersion();
  const storedVersion = getConfig("launcherVersion") as string;

  if (currentVersion !== storedVersion) {
    console.log(
      `[Main] Version changed: ${
        storedVersion || "none"
      } -> ${currentVersion}. Updating config.`,
    );

    // Use setConfigWithEvent (broadcasts change automatically)
    setConfigWithEvent(context, "launcherVersion", currentVersion);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Background update check does not need to wait for renderer
  startUpdateCheckInterval(context);
});

// Listener for when the Renderer is fully ready (React mounted)
ipcMain.on("UI_READY", () => {
  console.log("[Main] Renderer is ready. Enabling event bridge...");
  rendererBridge.setReady();

  // Now safe to check for updates or perform actions that might emit events
  checkLauncherVersionUpdate();
});

// IPC Handlers
ipcMain.on("window-minimize", () => {
  mainWindow?.minimize();
});

ipcMain.on("window-close", () => {
  mainWindow?.close();
});

// Config Handlers
ipcMain.handle("config:get", (_event, key) => {
  return getConfig(key);
});

ipcMain.handle("config:set", (_event, key, value) => {
  setConfigWithEvent(context, key, value);
});

// Register Handlers
eventBus.registerHandler({
  id: "AppQuitHandler",
  targetEvent: EventType.APP_QUIT,
  handle: () => app.quit(),
});

// Update Handlers
// Wrapping legacy/function-based handlers into object-based EventHandlers

const UpdateCheckEventHandler = {
  id: "UpdateCheckHandler",
  targetEvent: EventType.UI_UPDATE_CHECK,
  handle: (event: AppEvent<unknown>, ctx: AppContext) => {
    const payload = event.payload as { isSilent?: boolean };
    return UpdateCheckHandler(payload, ctx);
  },
};

const UpdateDownloadEventHandler = {
  id: "UpdateDownloadHandler",
  targetEvent: EventType.UI_UPDATE_DOWNLOAD,
  handle: (event: AppEvent<unknown>, ctx: AppContext) => {
    return UpdateDownloadHandler(event.payload, ctx);
  },
};

const UpdateInstallEventHandler = {
  id: "UpdateInstallHandler",
  targetEvent: EventType.UI_UPDATE_INSTALL,
  handle: (event: AppEvent<unknown>, ctx: AppContext) => {
    return UpdateInstallHandler(event.payload, ctx);
  },
};

const PatchNoteEventHandler = {
  id: "PatchNoteHandler",
  targetEvent: EventType.UI_PATCH_NOTES_REQUEST,
  handle: (event: AppEvent<unknown>, ctx: AppContext) => {
    return PatchNoteHandler(event.payload, ctx);
  },
};

eventBus.registerHandler(UpdateCheckEventHandler);
eventBus.registerHandler(UpdateDownloadEventHandler);
eventBus.registerHandler(UpdateInstallEventHandler);
eventBus.registerHandler(PatchNoteEventHandler);

// IPC Bridge: Forward renderer events to EventBus
const registerIpcBridge = () => {
  const eventsToBridge = [
    EventType.UI_UPDATE_CHECK,
    EventType.UI_UPDATE_DOWNLOAD,
    EventType.UI_UPDATE_INSTALL,
    EventType.UI_PATCH_NOTES_REQUEST,
  ];

  eventsToBridge.forEach((type) => {
    ipcMain.on(type, (_, payload: unknown) => {
      eventBus.emit(type, context, payload);
    });
  });
};

registerIpcBridge();
