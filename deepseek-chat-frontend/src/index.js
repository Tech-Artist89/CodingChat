import React from "react";
import ReactDOM from "react-dom/client"; // <-- Beachte den geänderten Import
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // createRoot verwenden
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
