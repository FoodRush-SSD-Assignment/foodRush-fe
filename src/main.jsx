import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // 👉 import the AuthProvider
import "./index.css";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </StrictMode>
);
