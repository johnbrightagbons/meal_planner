import { qs, loadHeaderFooter } from "./utils.mjs";
import { requireAuth, updateAuthLinks } from "./auth.mjs";
import { fetchIngredients } from "./planner.mjs"; // Import ingredient fetcher for planner integration

// Enforce authentication and update navigation links
requireAuth();
updateAuthLinks();

// Initialize page after DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  requireAuth(); // Ensure user is authenticated
  await loadHeaderFooter(); // Load shared header/footer
  loadGroceries(); // Load grocery items from API
  loadSavedGroceryList(); // Display saved grocery list
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

    // Render grocery cards with buttons
    container.innerHTML = products
      .map(
        (item) => `
        <div class="grocery-card">
          <img src="${item.image}" alt="${item.title}" />
          <h3>${item.title}</h3>
          <p>Price: N/A</p>
          <button class="add-to-list" data-id="${item.id}">Add to List</button>
          <button class="add-to-planner" data-title="${item.title}">Add to Planner</button>
        </div>
      `
      )
      .join("");

    // Handle "Add to List" button clicks
    container.querySelectorAll(".add-to-list").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const selected = products.find((p) => p.id === id);
        addToGroceryList(selected);
      });
    });

    // Handle "Add to Planner" button clicks with dropdown
    container.querySelectorAll(".add-to-planner").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const mealName = btn.dataset.title;

        // Create dropdown
        const dropdown = document.createElement("select");
        const validDays = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];

        validDays.forEach((day) => {
          const option = document.createElement("option");
          option.value = day;
          option.textContent = day;
          dropdown.appendChild(option);
        });

        // Create confirm button
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Confirm";

        // Create modal container
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.background = "#fff";
        modal.style.padding = "20px";
        modal.style.border = "1px solid #ccc";
        modal.style.zIndex = "1000";

        modal.appendChild(dropdown);
        modal.appendChild(confirmBtn);
        document.body.appendChild(modal);

        confirmBtn.addEventListener("click", async () => {
          const selectedDay = dropdown.value;

          let plannerData = JSON.parse(localStorage.getItem("planner")) || {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
          };

          if (!plannerData[selectedDay].includes(mealName)) {
            plannerData[selectedDay].push(mealName);
            localStorage.setItem("planner", JSON.stringify(plannerData));

            // Fetch ingredients and update grocery list
            const ingredients = await fetchIngredients(mealName);
            let groceryList =
              JSON.parse(localStorage.getItem("groceryList")) || [];
            groceryList.push(...ingredients);
            groceryList = [...new Set(groceryList)];
            localStorage.setItem("groceryList", JSON.stringify(groceryList));

            alert(
              `✅ ${mealName} added to ${selectedDay}'s planner and ingredients added to grocery list.`
            );
          } else {
            alert(
              `"${mealName}" is already in your planner for ${selectedDay}.`
            );
          }

          document.body.removeChild(modal); // Clean up
        });
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
    loadSavedGroceryList(); // Refresh list display
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

  // Render grocery list with remove buttons
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

  // Handle item removal
  listContainer.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      groceryList = groceryList.filter((item) => item.id !== id);
      localStorage.setItem("groceryList", JSON.stringify(groceryList));
      loadSavedGroceryList(); // Refresh list display
    });
  });
}
