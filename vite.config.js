import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  preview: {
    allowedHosts: ["emojipairdb.shuflduf.hackclub.app"],
  },
  server: {
    cors: {
      origin: [
        "https://localhost",
        "https://emojipairdb.shuflduf.hackclub.app",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  },
});
