// src/js/ui.mjs

export function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const mode = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", mode);
}

export function initDarkMode() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
  }
}

export function setupMobileMenu() {
  const menuBtn = document.querySelector("#menuBtn");
  const nav = document.querySelector("nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }
}
