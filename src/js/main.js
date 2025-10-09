// src/js/main.js

import { loadHeaderFooter } from "./utils.mjs";
import { updateAuthLinks, requireAuth, setupAuthPage } from "./auth.mjs"; // Removed promptAddToPlanner import — not needed here

document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Load shared header and footer into the page
  await loadHeaderFooter();

  // 2️⃣ Update navigation links based on authentication status
  updateAuthLinks();

  // Get the current page path
  const path = window.location.pathname;

  // 3️⃣ Protect private pages (but NOT login/register pages)
  const protectedPages = ["planner.html", "recipes.html", "grocery.html"];
  const isProtected = protectedPages.some((p) => path.includes(p));

  if (isProtected) {
    requireAuth(); // Redirects to login if user is not authenticated
  }

  // 4️⃣ Initialize login or register page logic
  if (path.includes("login.html") || path.includes("register.html")) {
    setupAuthPage(); // Handles form submission and validation
  }

  // ❌ Removed promptAddToPlanner() — not appropriate to call globally
});
