import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <AuthProvider>
    <ThemeProvider>
      <App />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="colored"
      />
    </ThemeProvider>
  </AuthProvider>
);