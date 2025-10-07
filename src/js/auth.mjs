import { qs } from "./utils.mjs";

// --- Check if a user is logged in ---
export function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

// --- Protect private pages ---
export function requireAuth() {
  if (!isLoggedIn()) {
    const currentPath = window.location.pathname.replace("/dist", "");
    const redirectUrl = `/login.html?redirect=${encodeURIComponent(currentPath)}`;
    alert("⚠️ You must log in to access this page.");
    window.location.href = redirectUrl;
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

  if (users.some((u) => u.email === email)) {
    throw new Error("Email already registered.");
  }

  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("🎉 Account Created Successfully");

  const redirectUrl = `/login.html?message=${encodeURIComponent("Please Login")}`;
  window.location.href = redirectUrl;
}

// --- Update header auth links ---
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
    const logoutBtn = qs("#logoutBtn");
    logoutBtn?.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      alert("Logged out successfully.");
      window.location.href = "login.html";
    });
  } else {
    authLinks.innerHTML = `
      <a href="/login.html">Login</a> |
      <a href="/register.html">Register</a>
    `;
  }
}

// --- Setup login & register page logic ---
export function setupAuthPage() {
  const loginForm = qs("#login-form");
  const registerForm = qs("#register-form");

  const params = new URLSearchParams(window.location.search);
  const redirectPath = params.get("redirect") || "/index.html";
  const message = params.get("message");

  if (message) alert(message);

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      try {
        loginUser(email, password);
        alert("✅ Login successful!");
        window.location.href = redirectPath;
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // REGISTER
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = registerForm.name.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();

      try {
        registerUser(name, email, password);
      } catch (err) {
        alert(err.message);
      }
    });
  }
}
