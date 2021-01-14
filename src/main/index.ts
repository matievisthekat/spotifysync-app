require("dotenv").config();

import { app, protocol, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import windowStateKeeper from "electron-window-state";
import { join } from "path";
import { format as formatUrl } from "url";
import { ProgressInfo } from "builder-util-runtime";
import qs from "querystring";
import { IpcRendererMessages } from "../common/ipcMessages";
import "./ipcHandlers";
import { client } from "../common/spotify";

const isDevelopment = process.env.NODE_ENV !== "production";

let mainWindow: BrowserWindow | null;

function createMainWindow() {
  const state = windowStateKeeper({});

  const window = new BrowserWindow({
    width: 374,
    height: 530,
    x: state.x,
    y: state.y,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      enableRemoteModule: true,
      contextIsolation: false,
      devTools: true,
    },
  });

  state.manage(window);

  protocol.registerFileProtocol("tunein", async (req, callback) => {
    const { code } = qs.parse(req.url, "?");
    if (code) {
      client.setCode(code as string);
      await client.init(code as string);
      client.closeLoginWindow();
    } else client.closeLoginWindow();
    callback("");
  });

  if (isDevelopment) {
    window.webContents.openDevTools({
      mode: "detach",
    });

    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?version=DEV`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: join(__dirname, "index.html"),
        protocol: "file",
        query: {
          version: autoUpdater.currentVersion.version,
        },
        slashes: true,
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

const locked = app.requestSingleInstanceLock();
if (!locked) {
  app.quit();
} else {
  autoUpdater.checkForUpdates();

  autoUpdater.on("update-available", () => {
    mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
      state: "available",
    });
  });

  autoUpdater.on("error", (err: string) => {
    mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
      state: "error",
      error: err,
    });
  });
  autoUpdater.on("download-progress", (progress: ProgressInfo) => {
    mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
      state: "downloading",
      progress,
    });
  });
  autoUpdater.on("update-downloaded", () => {
    mainWindow?.webContents.send(IpcRendererMessages.AUTO_UPDATER_STATE, {
      state: "downloaded",
    });
    app.relaunch();
    autoUpdater.quitAndInstall();
  });

  app.on("second-instance", () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // quit application when all windows are closed
  app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
      mainWindow = createMainWindow();
    }
  });

  // create main BrowserWindow when electron is ready
  app.whenReady().then(() => {
    mainWindow = createMainWindow();
  });
}
