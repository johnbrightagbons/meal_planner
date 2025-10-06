import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  base: "./",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        login: resolve(__dirname, "src/account/login.html"),
        register: resolve(__dirname, "src/account/register.html"),
        grocery: resolve(__dirname, "src/grocery/grocery.html"),
        planner: resolve(__dirname, "src/planner/planner.html"),
        recipes: resolve(__dirname, "src/recipes/recipes.html"),
      },
    },
  },
});
