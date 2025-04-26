import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // 👉 import the AuthProvider
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> {/* 👉 wrap App inside AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);
