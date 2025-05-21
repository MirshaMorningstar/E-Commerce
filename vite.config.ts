import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import ghPages from "vite-plugin-github-pages";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/E-Commerce/", // 👈 Required for GitHub Pages deployment
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    ghPages(), // 👈 Plugin for GitHub Pages deployment
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
