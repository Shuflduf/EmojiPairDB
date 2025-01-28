import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { Client } from "appwrite";

export default defineConfig({
  plugins: [sveltekit()],
});
