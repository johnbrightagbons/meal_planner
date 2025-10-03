import { loadHeaderFooter } from "./utils.mjs";
import { registerUser } from "./auth.mjs";

loadHeaderFooter();

document.querySelector("#registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  try {
    registerUser(name, email, password);
    alert("✅ Registration successful! Please log in.");
    window.location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
});
