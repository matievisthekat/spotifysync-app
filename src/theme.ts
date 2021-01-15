import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { green, grey } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: { main: green["A700"] },
    secondary: { main: grey["A700"] },
    background: {
      default: "#2b2e2e",
      paper: "#272727",
    },
    type: "dark",
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: 12,
      },
    },
  },
});

export default theme;
