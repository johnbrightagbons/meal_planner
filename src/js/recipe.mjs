// src/js/recipe.mjs
import { qs, loadHeaderFooter } from "./utils.mjs";
import { requireAuth, updateAuthLinks } from "./auth.mjs";

requireAuth();
updateAuthLinks();

document.addEventListener("DOMContentLoaded", async () => {
  requireAuth(); //  kicks out guests
  await loadHeaderFooter();
  loadRecipes();
});

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

    container.innerHTML = recipes
      .map(
        (meal) => `
        <div class="recipe-card">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
          <p>${meal.strCategory} | ${meal.strArea}</p>
        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error("Error loading recipes:", err);
    container.innerHTML = `<p class="error"> Could not load Recipes. Please try again.</p>`;
  }
}
