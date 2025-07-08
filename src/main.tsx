import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext"; // Adjust path as needed

const theme = createTheme({
  primaryColor: "gold",
  colors: {
    gold: [
      "#FFF9E0",
      "#FFF3C2",
      "#FFECA3",
      "#FFE585",
      "#FFDF66",
      "#FFD947",
      "#FFD328",
      "#E6BC1F",
      "#CCA518",
      "#B38E10",
    ],
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    </MantineProvider>
  </React.StrictMode>
);
