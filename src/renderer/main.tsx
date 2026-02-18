import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LauncherContextProvider } from "./context";
import "./i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LauncherContextProvider>
        <App />
      </LauncherContextProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
