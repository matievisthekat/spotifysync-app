import React from "react";
import { grey } from "@material-ui/core/colors";

import theme from "./theme";

interface Props {
  version?: string;
}

const height = theme.spacing(5);
// const buttonStyle = { height, color: theme.palette.grey[300] };

const TitleBar: React.FC<Props> = ({ version }) => {
  return (
    <>
      <div className="titlebar" style={{ height, backgroundColor: grey[900] }}>
        <span className="title" style={{ height, lineHeight: `${height}px`, color: theme.palette.primary.main }}>
          SpotifySync {version}
        </span>
      </div>
      <div style={{ marginBottom: `${theme.spacing(5)}px` }}></div>
    </>
  );
};

export default TitleBar;
