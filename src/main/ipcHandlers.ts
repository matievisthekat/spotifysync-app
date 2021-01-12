import { ipcMain } from "electron";
import { IpcMainMessages } from "../common/ipcMessages";
import { client } from "../common/spotify";

ipcMain.handle(IpcMainMessages.LOGIN, () => client.login());
