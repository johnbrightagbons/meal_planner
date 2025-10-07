export async function loadHeaderFooter() {
  const headerElement = document.getElementById("main-header");
  const footerElement = document.getElementById("main-footer");

  if (headerElement) {
    const headerResponse = await fetch("/header.html");
    const headerHTML = await headerResponse.text();
    headerElement.innerHTML = headerHTML;
  }

  if (footerElement) {
    const footerResponse = await fetch("/footer.html");
    const footerHTML = await footerResponse.text();
    footerElement.innerHTML = footerHTML;
  }
}
export function qs(selector) {
  return document.querySelector(selector);
}
