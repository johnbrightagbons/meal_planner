// ==========================
// src/js/auth.mjs
// Handles login, register, logout, and route protection
// ==========================

import { qs } from "./utils.mjs";

// --- Check if a user is logged in ---
export function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

// --- Protect private pages (redirect if not logged in) ---
export function requireAuth() {
  if (!isLoggedIn()) {
    alert("⚠️ You must log in to access this page.");
    window.location.href = "/login.html";
    throw new Error("Not logged in");
  }
}

// --- Login a user ---
export function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) throw new Error("Invalid email or password.");

  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
}

// --- Register a new user ---
export function registerUser(name, email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some((u) => u.email === email))
    throw new Error("Email already registered.");

  const newUser = { name, email, password };
  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));
}

// --- Update header auth links (Login/Register or Welcome + Logout) ---
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

    // Attach logout handler
    const logoutBtn = qs("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        alert("Logged out successfully.");
        window.location.href = "/login.html";
      });
    }
  } else {
    authLinks.innerHTML = `
      <a href="/src/login.html">Login</a> |
      <a href="/sr/register.html">Register</a>
    `;
  }
}

// --- Handle login & register page form logic ---
export function setupAuthPage() {
  const loginForm = qs("#loginForm");
  const registerForm = qs("#registerForm");

  // LOGIN FORM
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      try {
        loginUser(email, password);
        alert("✅ Login successful!");
        window.location.href = "/src/index.html";
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // REGISTER FORM
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = registerForm.name.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();

      try {
        registerUser(name, email, password);
        alert("🎉 Account created successfully!");
        window.location.href = "/src/index.html";
      } catch (err) {
        alert(err.message);
      }
    });

    document
      .getElementById("toggle-password")
      ?.addEventListener("change", (e) => {
        const passwordInput = document.getElementById("register-password");
        passwordInput.type = e.target.checked ? "text" : "password";
      });
  }
}
