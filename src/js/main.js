// src/js/main.js
import { loadHeaderFooter } from "./utils.mjs";
import { updateAuthLinks, requireAuth, setupAuthPage } from "./auth.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Load header and footer everywhere
  await loadHeaderFooter();

  // 2️⃣ Always update header links
  updateAuthLinks();

  const path = window.location.pathname;

  // 3️⃣ Protect private pages (but NOT login/register)
  const protectedPages = ["planner.html", "recipes.html", "grocery.html"];
  const isProtected = protectedPages.some((p) => path.includes(p));

  if (isProtected) {
    requireAuth(); // if not logged in, go to login page
  }

  // 4️⃣ Initialize login/register form logic
  if (path.includes("login.html") || path.includes("register.html")) {
    setupAuthPage();
  }
});
