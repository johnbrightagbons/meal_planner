// src/js/main.js
import { loadHeaderFooter } from "./utils.mjs";
import { updateAuthLinks } from "./auth.mjs";

// single app init that runs once per page
async function initApp() {
  try {
    // 1) Load header/footer partials into DOM
    await loadHeaderFooter();

    // 2) After header is injected, update auth links and year in footer
    try {
      updateAuthLinks();
    } catch (err) {
      console.warn("updateAuthLinks failed:", err);
    }

    // set year (footer)
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 3) Page specific bootstrapping
    const path = window.location.pathname;
    // for example: /recipes.html, /grocery.html etc
    if (path.includes("recipes.html")) {
      // lazy import recipe module only if needed
      import("./recipe.mjs").then((m) => {
        if (m.loadRecipes) m.loadRecipes();
      });
    } else if (path.includes("grocery.html")) {
      import("./grocery.mjs").then((m) => {
        if (m.loadGroceries) m.loadGroceries();
      });
    } else if (path.includes("planner.html")) {
      import("./planner.mjs").then((m) => {
        if (m.initPlanner) m.initPlanner();
      });
    } else if (path.includes("login.html") || path.includes("register.html")) {
      // auth pages might have their own module
      import("./auth.mjs").then((m) => {
        if (m.setupAuthPage) m.setupAuthPage();
      });
    }
  } catch (err) {
    console.error("App init failed:", err);
    const root = document.querySelector("main") || document.body;
    if (root) {
      const msg = document.createElement("div");
      msg.className = "alert";
      msg.textContent =
        "Failed to load header/footer. See console for details.";
      root.prepend(msg);
    }
  }
}

// run once DOM is ready
document.addEventListener("DOMContentLoaded", initApp);
