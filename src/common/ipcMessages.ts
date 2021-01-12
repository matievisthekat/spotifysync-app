import { ProgressInfo } from "builder-util-runtime";

// Main --> Renderer (send/on)
export enum IpcRendererMessages {
  ERROR = "ERROR",
  AUTO_UPDATER_STATE = "AUTO_UPDATER_STATE",
}

// Renderer --> Main (send/on)
export enum IpcMainMessages {
  LOGIN = "LOGIN",
}

export interface AutoUpdaterState {
  state: "error" | "available" | "downloading" | "downloaded" | "unavailable";
  error?: string;
  progress?: ProgressInfo;
}
