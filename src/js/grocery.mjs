import { qs, loadHeaderFooter } from "./utils.mjs";
import { requireAuth, updateAuthLinks } from "./auth.mjs";

requireAuth();
updateAuthLinks();

document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();
  await loadHeaderFooter();
  loadGroceries();
  loadSavedGroceryList();
});

// --- Load grocery items from Spoonacular API ---
export async function loadGroceries() {
  const container = qs("#grocery-container");
  container.innerHTML = "<p>Loading grocery items...</p>";

  try {
    const response = await fetch(
      "https://api.spoonacular.com/food/products/search?query=chicken&number=10&apiKey=4bdc100780064dc5981500d2602e59eb"
    );

    if (!response.ok) throw new Error("Failed to fetch groceries");

    const data = await response.json();
    const products = data.products;

    if (!Array.isArray(products)) throw new Error("Unexpected response format");

    container.innerHTML = products
      .map(
        (item) => `
        <div class="grocery-card">
          <img src="${item.image}" alt="${item.title}" />
          <h3>${item.title}</h3>
          <p>Price: N/A</p>
          <button class="add-to-list" data-id="${item.id}">Add to List</button>
        </div>
      `
      )
      .join("");

    container.querySelectorAll(".add-to-list").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const selected = products.find((p) => p.id === id);
        addToGroceryList(selected);
      });
    });
  } catch (err) {
    console.error("Error loading groceries:", err);
    container.innerHTML = `<p class="error">Could not load grocery items. Please try again.</p>`;
  }
}

// --- Persistent grocery list ---
let groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];

// --- Add item to grocery list ---
function addToGroceryList(item) {
  if (!groceryList.some((i) => i.id === item.id)) {
    groceryList.push(item);
    localStorage.setItem("groceryList", JSON.stringify(groceryList));
    alert(`${item.title} added to your grocery list 🛒`);
    loadSavedGroceryList();
  } else {
    alert(`${item.title} is already in your grocery list.`);
  }
}

// --- Display saved grocery list ---
function loadSavedGroceryList() {
  const listContainer = qs("#saved-grocery-list");
  if (!listContainer) return;

  if (groceryList.length === 0) {
    listContainer.innerHTML = "<p>No items in your grocery list.</p>";
    return;
  }

  listContainer.innerHTML = `
    <h2>Your Grocery List</h2>
    <ul>
      ${groceryList
        .map(
          (item) => `
        <li>
          ${item.title}
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </li>
      `
        )
        .join("")}
    </ul>
  `;

  listContainer.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      groceryList = groceryList.filter((item) => item.id !== id);
      localStorage.setItem("groceryList", JSON.stringify(groceryList));
      loadSavedGroceryList();
    });
  });
}
