// src/js/planner.mjs

import { qs, loadHeaderFooter } from "./utils.mjs";
import { notify } from "./notification.mjs";
import { requireAuth, updateAuthLinks } from "./auth.mjs";

// Enforce authentication and update navigation links
requireAuth();
updateAuthLinks();

// --- Global state ---
let plannerData = JSON.parse(localStorage.getItem("planner")) || {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

let groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];

// --- Spoonacular API: Fetch ingredients for a meal ---
export async function fetchIngredients(mealName) {
  const apiKey = "4bdc100780064dc5981500d2602e59eb";

  try {
    // Step 1: Search for recipe by name
    const searchRes = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(mealName)}&number=1&apiKey=${apiKey}`
    );
    const searchData = await searchRes.json();
    const recipe = searchData.results?.[0];

    if (!recipe) {
      console.warn(`No recipe found for "${mealName}"`);
      return [];
    }

    // Step 2: Fetch ingredients using recipe ID
    const ingredientsRes = await fetch(
      `https://api.spoonacular.com/recipes/${recipe.id}/ingredientWidget.json?apiKey=${apiKey}`
    );
    const ingredientsData = await ingredientsRes.json();

    // Return array of ingredient names
    return ingredientsData.ingredients?.map((i) => i.name) || [];
  } catch (err) {
    console.error("Failed to fetch ingredients:", err);
    notify("⚠️ Could not fetch ingredients. Try again later.", "error");
    return [];
  }
}

// --- Initialize planner on page load ---
document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();
  await loadHeaderFooter();
  loadPlanner();
});

// --- Load planner UI ---
export function loadPlanner() {
  const container = qs("#planner-container");

  if (!container) {
    console.warn("planner-container not found in DOM");
    return;
  }

  container.innerHTML = `
    <h2>Weekly Meal Planner</h2>
    <p>Select meals for each day of the week.</p>
    <div class="planner-grid">
      ${Object.keys(plannerData)
        .map(
          (day) => `
          <div class="planner-day">
            <h3>${day}</h3>
            <ul id="${day}-meals">
              ${plannerData[day].length === 0 ? "<li>No meals planned</li>" : ""}
              ${plannerData[day]
                .map(
                  (meal) => `
                  <li>${meal}
                    <button class="remove-meal" data-day="${day}" data-meal="${meal}">❌</button>
                  </li>
                `
                )
                .join("")}
            </ul>
            <input type="text" id="input-${day}" placeholder="Add meal...">
            <button class="add-meal" data-day="${day}">Add</button>
          </div>
        `
        )
        .join("")}
    </div>
  `;

  attachPlannerEvents();
}

// --- Attach events for add/remove buttons ---
function attachPlannerEvents() {
  // Add meals to planner
  document.querySelectorAll(".add-meal").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const day = btn.dataset.day;
      const input = qs(`#input-${day}`);
      const meal = input.value.trim();

      if (!meal) return notify("⚠️ Please enter a meal name.", "warning");

      if (plannerData[day].includes(meal)) {
        return notify(`⚠️ ${meal} is already added to ${day}`, "warning");
      }

      // Save meal to planner
      plannerData[day].push(meal);
      localStorage.setItem("planner", JSON.stringify(plannerData));

      // Fetch ingredients and update grocery list
      const ingredients = await fetchIngredients(meal);
      groceryList.push(...ingredients);
      groceryList = [...new Set(groceryList)]; // Remove duplicates
      localStorage.setItem("groceryList", JSON.stringify(groceryList));

      notify(`✅ ${meal} added to ${day}`, "success");
      input.value = "";
      loadPlanner(); // Refresh UI
    });
  });

  // Remove meals from planner
  document.querySelectorAll(".remove-meal").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const { day, meal } = btn.dataset;

      // Remove meal from planner
      plannerData[day] = plannerData[day].filter((m) => m !== meal);
      localStorage.setItem("planner", JSON.stringify(plannerData));

      // Remove ingredients from grocery list
      const ingredients = await fetchIngredients(meal);
      groceryList = groceryList.filter((item) => !ingredients.includes(item));
      localStorage.setItem("groceryList", JSON.stringify(groceryList));

      notify(`❌ ${meal} removed from ${day}`, "info");
      loadPlanner(); // Refresh UI
    });
  });
}
