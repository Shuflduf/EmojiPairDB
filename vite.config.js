import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  preview: {
    allowedHosts: ["emojipairdb.shuflduf.hackclub.app"],
  },
});
