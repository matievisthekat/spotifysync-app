import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { ipcRenderer } from "electron";
import { io as socketIo } from "socket.io-client";
import { css } from "@emotion/css";
import { ThemeProvider } from "@material-ui/core";

import TitleBar from "./components/TitleBar";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import { IpcMainMessages } from "../common/ipcMessages";
import { client } from "../common/spotify";
import theme from "./theme";

const App: React.FC = () => {
  const io = socketIo("http://localhost:3000");

  io.connect()
    .on("connect", () => console.log("socket connected"))
    .on("initial_state", (state: any) => console.log("initial_state", state))
    .on("track_change", (track: string) => console.log("track_change", track))
    .on("seek", (progress: number, timestamp: number) => console.log("seek", progress, timestamp))
    .on("playback_started", () => console.log("playback_started"))
    .on("playback_paused", () => console.log("playback_paused"))
    .on("device_change", (device: string) => console.log("device_change", device))
    .on("volume_change", (volume: number) => console.log("volume_change", volume))
    .on("track_end", () => console.log("track_end"))
    .on("connect_error", (err: any) => console.error(err));

  return (
    <ThemeProvider theme={theme}>
      <TitleBar />
      <Container
        maxWidth="md"
        className={css`
          text-align: center;
        `}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            ipcRenderer
              .invoke(IpcMainMessages.LOGIN)
              .then((success) => {
                if (success) {
                  io.emit("initiate", { accessToken: client.accessToken });
                } else console.warn("A failed login occured!");
              })
              .catch(console.error)
          }>
          Login
        </Button>
      </Container>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
