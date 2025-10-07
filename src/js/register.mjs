import { loadHeaderFooter } from "./utils.mjs";
import { registerUser } from "./auth.mjs";

loadHeaderFooter();

const registerForm = document.getElementById("register-form");

registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("register-name");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");

  if (!nameInput || !emailInput || !passwordInput) {
    alert("Form inputs not found.");
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    registerUser(name, email, password);
    // Success and redirect handled inside registerUser
  } catch (err) {
    alert(err.message);
  }
});
