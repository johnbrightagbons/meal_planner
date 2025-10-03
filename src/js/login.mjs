import { loadHeaderFooter } from "./utils.mjs";
import { loginUser } from "./auth.mjs";

loadHeaderFooter();

document.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  try {
    const user = loginUser(email, password);
    alert(`✅ Welcome, ${user.name}`);
    window.location.href = "grocery.html"; // redirect after login
  } catch (err) {
    alert(err.message);
  }
});
