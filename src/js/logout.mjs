// src/js/logout.mjs
export function setupLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    // reload to refresh UI links (or redirect to login)
    window.location.reload();
  });
}
