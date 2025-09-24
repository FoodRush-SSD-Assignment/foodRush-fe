import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), 
    },
  },
  server: {
    fs: {
      strict: true,
      allow: [
        path.resolve(__dirname, "public"),
        path.resolve(__dirname, "src"), //
        path.resolve(__dirname, "node_modules")
      ],
    },
  },
});