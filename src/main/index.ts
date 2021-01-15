require("dotenv").config();

import { app, protocol, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import windowStateKeeper from "electron-window-state";
import { join } from "path";
import { format as formatUrl } from "url";
import { ProgressInfo } from "builder-util-runtime";
import qs from "querystring";
import { IpcRendererMessages } from "../common/ipcMessages";
import { client } from "../common/spotify";
import { Client } from "discord-rpc";
import store from "../common/store";
import "./ipcHandlers";

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

  protocol.registerFileProtocol("spotifysync", async (req, callback) => {
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

const rpc = new Client({ transport: "ipc" });

function setActivity() {
  const track = store.get("track");
  const artist = store.get("artist");
  const progress = store.get("progress");
  const duration = store.get("duration");
  const isPlaying = store.get("isPlaying");
  const playingType = store.get("playingType");
  const connected = store.get("connected");
  const connectionUrl = store.get("connectionUrl");

  const presence = connected
    ? {
        details: playingType === "ad" ? "Advertisement" : track,
        state: `by ${artist}`,
        startTimestamp: isPlaying ? Date.now() - (duration - progress) : undefined,
        endTimestamp: isPlaying ? Date.now() + (duration - progress) : undefined,
        largeImageKey: "icon_1024x1024",
        largeImageText: connectionUrl,
        smallImageKey: isPlaying ? "pause_512x512" : "play_512x512",
        smallImageText: isPlaying ? "Playing" : "Paused",
        instance: false,
      }
    : {};

  rpc.setActivity(presence);
}

rpc.on("ready", () => {
  setActivity();
  setInterval(() => setActivity(), 15e3);
});

rpc.login({ clientId: "799582207479775273" });
