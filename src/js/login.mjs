const loginForm = qs("#loginForm");
const params = new URLSearchParams(window.location.search);
const redirectPath = params.get("redirect") || "/index.html";

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
