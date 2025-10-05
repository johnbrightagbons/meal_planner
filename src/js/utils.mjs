// src/js/utils.mjs

export function qs(selector) {
  return document.querySelector(selector);
}

export async function loadHeaderFooter() {
  const header = document.getElementById("main-header");
  const footer = document.getElementById("main-footer");

  if (header) {
    header.innerHTML = `
      <nav class="navbar">
        <div class="logo">
          <a href="/index.html">Blu<span class="highlight">Meal</span></a>
        </div>
        <ul class="nav-links">
          <li><a href="/index.html">Home</a></li>
          <li><a href="/planner.html">Planner</a></li>
          <li><a href="/recipes.html">Recipes</a></li>
          <li><a href="/grocery.html">Grocery</a></li>
          <a href="/register.html">Register</a>
          <li><a href="/login.html">Login</a></li>
        </ul>
      </nav>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <footer>
        <p>&copy; ${new Date().getFullYear()} Blu Meal Planner. All rights reserved.</p>
      </footer>
    `;
  }
}
