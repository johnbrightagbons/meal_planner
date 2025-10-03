// Import auth helper (from auth.mjs)
import { updateAuthLinks } from "./auth.mjs";
// Query selector shortcut
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Fetch HTML partials
async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load: ${path}`);
  return await response.text();
}

// Insert template into DOM
export function renderWithTemplate(template, parent, data = {}, callback) {
  parent.innerHTML = template;
  if (callback) callback(data);
}

// Load Header and Footer
export async function loadHeaderFooter() {
  const header = await loadTemplate("/src/public/partials/header.html");
  const footer = await loadTemplate("/src/public/partials/footer.html");

  renderWithTemplate(header, qs("#main-header"));
  renderWithTemplate(footer, qs("#main-footer"), null, () => {
    const year = qs("#year");
    if (year) year.textContent = new Date().getFullYear();
  });

  function updateAuthLinks() {
    const authLinks = document.querySelector("#authLinks");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!authLinks) return;

    if (user) {
      authLinks.innerHTML = `
      <span>👋 Hello, ${user.name}</span>
      <button id="logoutBtn" class="btn btn-small">Logout</button>
    `;

      // Attach logout behavior
      import("./logout.mjs").then((module) => {
        module.setupLogout();
      });
    } else {
      authLinks.innerHTML = `
      <a href="login.html">Login</a> | <a href="register.html">Register</a>
    `;
    }
  }
}

/**
 * Render HTML into a container
 * @param {string} selector - target element (e.g., '#recipes-container')
 * @param {string} template - HTML string to inject
 */
export function renderTemplate(selector, template) {
  const container = document.querySelector(selector);
  if (container) {
    container.innerHTML = template;
  }
}
