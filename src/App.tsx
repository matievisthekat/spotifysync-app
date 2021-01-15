import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { Button, ThemeProvider } from "@material-ui/core";

import Container from "@material-ui/core/Container";
import TitleBar from "./TitleBar";

import diagram from "./diagram.jpg";
import theme from "./theme";

type OS = "Unknown" | "Windows" | "MacOS" | "Linux" | "UNIX";

const App: React.FC = () => {
  const [latest, setLatest] = useState<any>(undefined);

  useEffect(() => {
    Axios.get("https://api.github.com/repos/MatievisTheKat/spotifysync-app/releases")
      .then((res) => setLatest(res.data[0]))
      .catch(console.error);
  }, []);

  let osName: OS = "Unknown";
  if (navigator.appVersion.indexOf("Win") !== -1) osName = "Windows";
  if (navigator.appVersion.indexOf("Mac") !== -1) osName = "MacOS";
  if (navigator.appVersion.indexOf("X11") !== -1) osName = "UNIX";
  if (navigator.appVersion.indexOf("Linux") !== -1) osName = "Linux";

  const assets: Record<OS, any> | undefined = latest
    ? {
        Windows: latest.assets.find((a: any) => a.name.endsWith(".exe")),
        MacOS: latest.assets.find((a: any) => a.name.endsWith(".dmg")),
        Linux: latest.assets.find((a: any) => a.name.endsWith(".deb")),
        UNIX: undefined,
        Unknown: undefined,
      }
    : undefined;

  return (
    <>
      <Helmet>
        <title>SpotifySync {latest ? latest.tag_name : ""}</title>
      </Helmet>
      <ThemeProvider theme={theme}>
        <TitleBar version={latest?.tag_name} />
        <Container maxWidth="md">
          <span>
            The SpotifySync app allows anyone to connect to a{" "}
            <a href="https://github.com/MatievisTheKat/spotifysync-server" rel="noreferrer" target="_blank">
              SpotifySync Server
            </a>{" "}
            via a HTTP(s) URL.
            <br />A{" "}
            <a href="https://github.com/MatievisTheKat/spotifysync-server" rel="noreferrer" target="_blank">
              SpotifySync Server
            </a>{" "}
            will periodically broadcast updates on the set user's Spotify track, progress, etc to all connected clients.
            <br />
            Each{" "}
            <a href="https://github.com/MatievisTheKat/spotifysync-server" rel="noreferrer" target="_blank">
              SpotifySync Server
            </a>{" "}
            can only send updates for <strong>one</strong> Spotify user at a time
            <br />
            So if you want to broadcast what you're listening to on Spotify to anyone you will need to set up your own
            <a href="https://github.com/MatievisTheKat/spotifysync-server" rel="noreferrer" target="_blank">
              SpotifySync Server
            </a>
          </span>
          <br />
          <br />
          <span>Here's a useful diagram to help you understand exactly what goes on behind the scenes</span>
          <img src={diagram} alt="A useful diagram" width="80%" style={{ marginTop: `${theme.spacing(2)}px` }} />

          <hr />

          <Button
            variant="contained"
            color="secondary"
            href={
              assets && assets[osName]
                ? assets[osName].browser_download_url
                : "https://github.com/MatievisTheKat/spotifysync-app/releases/latest"
            }>
            Download{assets && assets[osName] ? ` for ${osName}` : ""}
          </Button>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;
