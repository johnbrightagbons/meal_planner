import { loginUser } from "./auth.mjs";
import { qs } from "./utils.mjs";

const loginForm = qs("#login-form");
const params = new URLSearchParams(window.location.search);
const redirectPath = params.get("redirect") || "/index.html";
const message = params.get("message");

if (message) alert(message);

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      loginUser(email, password);
      alert("✅ Login successful!");
      window.location.href = redirectPath;
    } catch (err) {
      alert(err.message);
    }
  });
}
