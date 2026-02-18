import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LauncherContextProvider } from "./context";
import "./i18n";
import "./index.css";

console.log(
  "%c[React] StrictMode is active. Double-invocations are expected in dev.",
  "color: #ff00ff; font-weight: bold;",
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LauncherContextProvider>
        <App />
      </LauncherContextProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
