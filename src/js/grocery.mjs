// src/js/grocery.mjs
import { qs, loadHeaderFooter } from "./utils.mjs";
import { requireAuth } from "./auth.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  requireAuth(); // protect groceries
  await loadHeaderFooter();
  loadGroceries();
});

export async function loadGroceries() {
  const container = qs("#grocery-container");
  container.innerHTML = "<p>Loading grocery items...</p>";

  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=10");
    if (!response.ok) throw new Error("Failed to fetch groceries");

    const data = await response.json();

    container.innerHTML = data
      .map(
        (item) => `
      <div class="grocery-card">
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>$${item.price.toFixed(2)}</p>
        <button class="add-to-list" data-id="${item.id}">Add to List</button>
      </div>
    `
      )
      .join("");

    const buttons = container.querySelectorAll(".add-to-list");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const selected = data.find((d) => d.id == id);
        addToGroceryList(selected);
      });
    });
  } catch (err) {
    console.error("Error loading groceries:", err);
    container.innerHTML = `<p class="error">Could not load Grocery items. Please try again.</p>`;
  }
}

// In-memory grocery list
let groceryList = [];

function addToGroceryList(item) {
  groceryList.push(item);
  alert(`${item.title} added to your grocery list 🛒`);
  console.log("Current Grocery List:", groceryList);
}
