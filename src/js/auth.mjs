// src/js/auth.mjs
import { qs } from "./utils.mjs";

// --- Check if user is logged in ---
export function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

// --- Protect private pages ---
export function requireAuth() {
  if (!isLoggedIn()) {
    alert("⚠️ You must log in to access this page.");
    window.location.href = "/login.html"; // force absolute path
    throw new Error("Not logged in"); // stop further script execution
  }
}

// --- Update header links (called after header loads) ---
export function updateAuthLinks() {
  const authLinks = qs("#authLinks");
  if (!authLinks) return;

  const raw = localStorage.getItem("currentUser");
  const user = raw ? JSON.parse(raw) : null;

  if (user && user.name) {
    authLinks.innerHTML = `
      <span class="hello">👋 ${user.name}</span>
      <button id="logoutBtn" class="btn btn-small">Logout</button>
    `;

    // attach logout logic dynamically
    import("./logout.mjs").then((m) => {
      if (m.setupLogout) m.setupLogout();
    });
  } else {
    authLinks.innerHTML = `
      <a href="/login.html">Login</a> | 
      <a href="/register.html">Register</a>
    `;
  }
}
