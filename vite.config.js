import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  base: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        login: resolve(__dirname, "src/login.html"),
        register: resolve(__dirname, "src/register.html"),
        grocery: resolve(__dirname, "src/grocery.html"),
        planner: resolve(__dirname, "src/planner.html"),
        recipes: resolve(__dirname, "src/recipes.html"),
      },
    },
  },
});
