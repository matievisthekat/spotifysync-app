import React from "react";
import { ThemeProvider } from "@material-ui/core";

import Container from "@material-ui/core/Container";

import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" style={{ textAlign: "center" }}>
        <span>Coming soon!</span>
      </Container>
    </ThemeProvider>
  );
}

export default App;
