import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { HTML_LANG, localeFromPath } from "./data";
import "./index.css";
import "./styles.css";

// Prerendered pages already ship the right <html lang>; this covers the Vite
// dev server, which serves the zh index.html for /en routes too.
document.documentElement.lang = HTML_LANG[localeFromPath(window.location.pathname)];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
