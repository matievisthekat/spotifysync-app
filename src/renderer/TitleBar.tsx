import React, { useState } from "react";
import { remote } from "electron";
import { grey } from "@material-ui/core/colors";

import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from "@material-ui/icons/Close";
import MinimizeIcon from "@material-ui/icons/Minimize";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import theme from "./theme";
import { client } from "../common/spotify";
import store from "../common/store";

interface Props {
  showBack: boolean;
  disconnect(): void;
}

let version = "";
if (typeof window !== "undefined" && window.location) {
  const query = new URLSearchParams(window.location.search.substring(1));
  version = " v" + query.get("version") || "";
}

const height = theme.spacing(5);
const buttonStyle = { height, color: theme.palette.grey[300] };

const TitleBar: React.FC<Props> = ({ showBack, disconnect }) => {
  const current = remote.getCurrentWindow();
  const [loggedIn, setLoggedIn] = useState(!!client.accessToken);

  store.onDidChange("accessToken", (newVal) => setLoggedIn(!!newVal));

  return (
    <>
      <div className="titlebar" style={{ height, backgroundColor: grey[900] }}>
        <span className="title" style={{ height, lineHeight: `${height}px`, color: theme.palette.primary.main }}>
          TuneIn{version}
        </span>
        {showBack && (
          <Tooltip title="Back" arrow>
            <ArrowBackIcon className="button back" style={buttonStyle} onClick={() => disconnect()} />
          </Tooltip>
        )}
        <Tooltip title="Exit app" arrow>
          <CloseIcon className="button close" style={buttonStyle} onClick={() => current.close()} />
        </Tooltip>
        <Tooltip title="Minimize" arrow>
          <MinimizeIcon className="button minimize" style={buttonStyle} onClick={() => current.minimize()} />
        </Tooltip>
        {loggedIn && (
          <Tooltip title="Logout" arrow>
            <ExitToAppIcon
              className="button logout"
              style={buttonStyle}
              onClick={() => {
                store.delete("accessToken");
                store.delete("refreshToken");
                disconnect();
                setLoggedIn(false);
              }}
            />
          </Tooltip>
        )}
      </div>
      <div style={{ marginBottom: `${theme.spacing(10)}px` }}></div>
    </>
  );
};

export default TitleBar;
