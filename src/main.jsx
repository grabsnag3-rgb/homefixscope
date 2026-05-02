import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

import "./styles/base.css";
import "./styles/tokens.css";
import "./pages/home.css";
import "./pages/decision.css";
import "./pages/share-situation.css";
import "./components/decision-cta.css";
import "./components/related-questions.css";
import "./styles/homefix-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);