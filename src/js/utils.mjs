export async function loadHeaderFooter() {
  const headerElement = document.getElementById("main-header");
  const footerElement = document.getElementById("main-footer");

  if (headerElement) {
    const headerResponse = await fetch("/public/partials/header.html");
    const headerHTML = await headerResponse.text();
    headerElement.innerHTML = headerHTML;
  }

  if (footerElement) {
    const footerResponse = await fetch("/public/partials/footer.html");
    const footerHTML = await footerResponse.text();
    footerElement.innerHTML = footerHTML;
  }
}
export function qs(selector) {
  return document.querySelector(selector);
}
