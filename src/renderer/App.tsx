import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { io as socketIo, Socket } from "socket.io-client";
import { css } from "@emotion/css";
import { ThemeProvider } from "@material-ui/core";
import { ipcRenderer } from "electron";

import TitleBar from "./TitleBar";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";

import Spotify from "../common/spotify-api";
import { PlayingType, SocketState } from "../common/types";
import theme from "./theme";
import store from "../common/store";
import { grey } from "@material-ui/core/colors";
import { client } from "../common/spotify";
import { IpcMainMessages } from "../common/ipcMessages";

const noActiveDevice = "No active device found. Make sure to open Spotify and start playing a track";

const App: React.FC = () => {
  const [url, setUrl] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, _setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [track, setTrack] = useState<Spotify.TrackObjectFull | null>(null);
  const [progress, setProgress] = useState<number | null>(0);
  const [playingType, setPlayingType] = useState<PlayingType | null>("unknown");
  const [isPlaying, setIsPlaying] = useState<boolean | null>(false);

  const setConnected = (c: boolean) => {
    store.set("connected", c);
    _setConnected(c);
  };

  const progressPercent = track && progress ? (progress / track.duration_ms) * 100 : 0;

  const connect = async () => {
    setConnecting(true);
    store.set("connectionUrl", url);

    const io = socketIo(url);
    io.connect()
      .on("connect_error", (err: any) => {
        if (!connected && !connecting) {
          console.error(err);
          setError("Failed to connect.");
          setConnecting(false);
          setConnected(false);
        }
      })
      .on("connect", async () => {
        console.log("WebSocket connected");
        setError(null);
        setConnecting(false);
        setConnected(true);
        setSocket(io);

        const user = await client.getUser();
        if (user.product !== "premium") setError("Premium is required to sync music with your account");
      })
      .on("disconnect", () => {
        console.log("WebSocket disconnected");
        setError("Disconnected from server");
        setConnected(false);
        setSocket(null);
      })
      .on("initial_state", (state: SocketState) => {
        setTrack(state.item);
        setPlayingType(state.currently_playing_type);
        setProgress(state.progress_ms);
        setIsPlaying(state.is_playing);
      })
      .on("track_change", async (_: Spotify.TrackObjectFull | null, track: Spotify.TrackObjectFull | null) => {
        setTrack(track);

        if (track) {
          await client
            .pushTrackToQueue(track.uri)
            .then(async () => {
              if (progressPercent < 99) await client.next().catch((err) => console.log("next():", err.response));
            })
            .catch((err) => {
              console.log("pushTrackToQueue():", err.response);
              if (err.response?.data?.error?.reason === "NO_ACTIVE_DEVICE") setError(noActiveDevice);
            });

          store.set("track", track.name);
          store.set("artist", track.artists[0].name);
          store.set("duration", track.duration_ms);
        } else {
          store.delete("track");
          store.delete("artist");
          store.delete("duration");
        }
      })
      .on("is_playing_change", async (old: boolean, playing: boolean) => {
        setIsPlaying(playing);

        if (playing === true && !old) {
          await client.resume().catch((err) => {
            console.log("resume():", err.response);
            if (err.response?.data?.error?.reason === "NO_ACTIVE_DEVICE") setError(noActiveDevice);
          });
        } else if (playing === false && old === true) {
          await client.pause().catch((err) => {
            console.log("pause():", err.response);
            if (err.response?.data?.error?.reason === "NO_ACTIVE_DEVICE") setError(noActiveDevice);
          });
        }

        if (playing) store.set("isPlaying", playing);
        else store.delete("isPlaying");
      })
      .on("progress_change", (_: number, progress: number) => {
        setProgress(progress);

        if (progress) store.set("progress", progress);
        else store.delete("progress");
      })
      .on("currently_playing_type_change", (_: PlayingType, type: PlayingType) => {
        setPlayingType(type);

        if (type) store.set("playingType", type);
        else store.delete("playingType");
      });
  };

  useEffect(() => {
    const storedUrl = store.get("connectionUrl");
    if (storedUrl) setUrl(storedUrl);
  }, []);

  const initialContent = (
    <>
      <Input
        placeholder="WebSocket server url"
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
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            const loggedIn = !!client.accessToken;
            if (!loggedIn) ipcRenderer.invoke(IpcMainMessages.LOGIN).then(() => connect());
            else connect();
          }}
          disabled={!url}>
          Connect
        </Button>
      )}
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <TitleBar showBack={connected} disconnect={() => (socket ? socket.disconnect() : undefined)} />
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
              src={playingType !== "track" ? "https://i.imgur.com/E5Nnsz8.png" : track?.album.images[1].url}
              width={300}
              height={300}
              className={css`
                margin-bottom: ${theme.spacing(2)}px;
              `}
            />
            <LinearProgress variant="determinate" value={progressPercent} style={{ marginBottom: "15px" }} />
            <span
              className={css`
                color: ${grey[400]};
              `}>
              {track?.name ||
                (playingType || "unknown")
                  .split("")
                  .map((p, i) => (i === 0 ? p.toUpperCase() : p))
                  .join("")}
            </span>
            <br />
            <span
              className={css`
                color: ${grey[700]};
              `}>
              {track?.artists[0].name || "Spotify"}
            </span>
            {!isPlaying ? (
              <PlayCircleOutlineIcon className="is-playing-icon" fontSize="large" />
            ) : (
              <PauseCircleOutlineIcon className="is-playing-icon" fontSize="large" />
            )}
          </Paper>
        ) : (
          <>
            {initialContent}
            <br />
          </>
        )}

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
