import React from "react";
import { remote } from "electron";
import { grey } from "@material-ui/core/colors";

import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from "@material-ui/icons/Close";
import MinimizeIcon from "@material-ui/icons/Minimize";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import theme from "./theme";

interface Props {
  showBack: boolean;
  back(): void;
}

let version = "";
if (typeof window !== "undefined" && window.location) {
  const query = new URLSearchParams(window.location.search.substring(1));
  version = " v" + query.get("version") || "";
}

const height = theme.spacing(5);
const buttonStyle = { height, color: theme.palette.grey[300] };

const TitleBar: React.FC<Props> = ({ showBack, back }) => {
  const current = remote.getCurrentWindow();

  return (
    <>
      <div className="titlebar" style={{ height, backgroundColor: grey[900] }}>
        <span className="title" style={{ height, lineHeight: `${height}px`, color: theme.palette.primary.main }}>
          TuneIn{version}
        </span>
        {showBack && (
          <Tooltip title="Back" arrow>
            <ArrowBackIcon className="button back" style={buttonStyle} onClick={() => back()} />
          </Tooltip>
        )}
        <Tooltip title="Exit app" arrow>
          <CloseIcon className="button close" style={buttonStyle} onClick={() => current.close()} />
        </Tooltip>
        <Tooltip title="Minimize" arrow>
          <MinimizeIcon className="button minimize" style={buttonStyle} onClick={() => current.minimize()} />
        </Tooltip>
      </div>
      <div style={{ marginBottom: `${theme.spacing(10)}px` }}></div>
    </>
  );
};

export default TitleBar;
