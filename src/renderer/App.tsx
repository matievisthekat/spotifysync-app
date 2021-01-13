import React, { useState } from "react";
import ReactDOM from "react-dom";
import { io as socketIo, Socket } from "socket.io-client";
import { css } from "@emotion/css";
import { ThemeProvider } from "@material-ui/core";

import TitleBar from "./components/TitleBar";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";

import Spotify from "../common/spotify-api";
import { PlayingType, SocketState } from "../common/types";
import theme from "./theme";
import { grey } from "@material-ui/core/colors";

const App: React.FC = () => {
  const [url, setUrl] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [track, setTrack] = useState<Spotify.TrackObjectFull | null>(null);
  const [volume, setVolume] = useState<number | null>(0);
  const [progress, setProgress] = useState<number | null>(0);
  const [playingType, setPlayingType] = useState<PlayingType | null>("unknown");

  const progressPercent = track && progress ? (progress / track.duration_ms) * 100 : 0;

  const connect = () => {
    setConnecting(true);
    const io = socketIo(url);
    io.connect()
      .on("connect_error", () => {
        setError("Failed to connect.");
        setConnecting(false);
        setConnected(false);
      })
      .on("connect", () => {
        setError(null);
        setConnecting(false);
        setConnected(true);
      })
      .on("disconnect", () => {
        setSocket(null);
        setConnected(false);
      })
      .on("initial_state", (state: SocketState) => {
        setTrack(state.item);
        setVolume(state.volume_percent);
        setPlayingType(state.currently_playing_type);
        setProgress(state.progress_ms);
      })
      .on("track_change", (_: any, newTrack: any) => setTrack(newTrack))
      .on("volume_change", (_: number, newVol: number) => setVolume(newVol))
      .on("progress_change", (_: number, newProg: number) => setProgress(newProg))
      .on("currently_playing_type_change", (_: PlayingType, newType: PlayingType) => setPlayingType(newType));

    setSocket(io);
  };

  const initialContent = (
    <>
      <Input
        placeholder="Connection url"
        value={url}
        onChange={(e) => {
          if (error) setError(null);
          setUrl(e.target.value);
        }}
        color="secondary"
        required
        autoFocus
      />
      <br />
      <br />
      {connecting ? (
        <CircularProgress size={30} />
      ) : (
        <Button variant="contained" color="secondary" onClick={() => connect()} disabled={!url}>
          Connect
        </Button>
      )}
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <TitleBar />
      <Container
        className={css`
          text-align: center;
        `}>
        {connected ? (
          <Paper
            elevation={3}
            className={css`
              padding: ${theme.spacing(2)}px;
              margin-top: -${theme.spacing(4)}px;
            `}>
            <img
              src={playingType === "ad" ? "/spotify-logo.png" : track?.album.images[1].url}
              className={css`
                margin-bottom: ${theme.spacing(2)}px;
              `}
            />
            <LinearProgress variant="determinate" value={progressPercent} style={{ marginBottom: "15px" }} />
            <span
              className={css`
                color: ${grey[400]};
              `}>
              {track?.name}
            </span>
            <br />
            <span
              className={css`
                color: ${grey[700]};
              `}>
              {track?.artists[0].name}
            </span>
          </Paper>
        ) : (
          initialContent
        )}
        <br />
        <br />
        {error && (
          <span
            className={css`
              color: red;
            `}>
            {error}
          </span>
        )}
      </Container>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
