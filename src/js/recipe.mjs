import { qs, loadHeaderFooter } from "./utils.mjs";
import { requireAuth, updateAuthLinks } from "./auth.mjs";
import { fetchIngredients } from "./planner.mjs"; // Reuse ingredient fetcher from planner

// Enforce authentication and update navigation links
requireAuth();
updateAuthLinks();

// Initialize page after DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  requireAuth(); // Prevent access for unauthenticated users
  await loadHeaderFooter(); // Load shared header/footer
  loadRecipes(); // Load recipe data from API
});

// --- Load recipes from TheMealDB API ---
export async function loadRecipes() {
  const container = qs("#recipes-container");
  container.innerHTML = "<p>Loading recipes...</p>";

  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken"
    );

    if (!response.ok) throw new Error("Failed to fetch recipes");

    const data = await response.json();
    const recipes = data.meals;

    if (!recipes) {
      container.innerHTML = "<p>No Recipes Found.</p>";
      return;
    }

    // Render recipe cards with "Add to Planner" buttons
    container.innerHTML = recipes
      .map(
        (meal) => `
        <div class="recipe-card">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
          <p>${meal.strCategory} | ${meal.strArea}</p>
          <button class="add-to-planner" data-title="${meal.strMeal}">Add to Planner</button>
        </div>
      `
      )
      .join("");

    // Handle "Add to Planner" button clicks with dropdown modal
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

          if (plannerData[selectedDay].includes(mealName)) {
            alert(`${mealName} is already planned for ${selectedDay}.`);
            document.body.removeChild(modal);
            return;
          }

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
          document.body.removeChild(modal);
        });
      });
    });
  } catch (err) {
    console.error("Error loading recipes:", err);
    container.innerHTML = `<p class="error">Could not load Recipes. Please try again.</p>`;
  }
}
