import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/haikou_quantu_scroll/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        globe: resolve(__dirname, "globe/index.html"),
      },
    },
  },
});
