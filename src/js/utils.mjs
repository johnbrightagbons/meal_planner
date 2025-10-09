// src/js/utils.mjs

/**
 * Loads the header and footer HTML content into the page.
 * Fetches /header.html and /footer.html and injects them into
 * elements with IDs #main-header and #main-footer respectively.
 */
export async function loadHeaderFooter() {
  const headerElement = document.getElementById("main-header");
  const footerElement = document.getElementById("main-footer");

  // Load header if the element exists
  if (headerElement) {
    try {
      const headerResponse = await fetch("/header.html");
      const headerHTML = await headerResponse.text();
      headerElement.innerHTML = headerHTML;
    } catch (err) {
      console.error("Failed to load header:", err);
    }
  }

  // Load footer if the element exists
  if (footerElement) {
    try {
      const footerResponse = await fetch("/footer.html");
      const footerHTML = await footerResponse.text();
      footerElement.innerHTML = footerHTML;
    } catch (err) {
      console.error("Failed to load footer:", err);
    }
  }
}

/**
 * Shortcut for document.querySelector
 * @param {string} selector - CSS selector string
 * @returns {Element|null} - The first matching DOM element
 */
export function qs(selector) {
  return document.querySelector(selector);
}

/**
 * Prompts the user to select a day and adds the meal to the planner.
 * Updates localStorage with the new planner data.
 * @param {string} mealName - Name of the meal to add
 */
export function promptAddToPlanner(mealName) {
  const day = prompt(
    `Which day would you like to add "${mealName}" to? (e.g., Monday)`
  );

  const validDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  if (!day || !validDays.includes(day)) {
    alert("Invalid day. Please enter a valid weekday.");
    return;
  }

  let plannerData = JSON.parse(localStorage.getItem("planner")) || {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  if (plannerData[day].includes(mealName)) {
    alert(`${mealName} is already planned for ${day}.`);
    return;
  }

  plannerData[day].push(mealName);
  localStorage.setItem("planner", JSON.stringify(plannerData));
  alert(`✅ ${mealName} added to ${day}'s planner.`);
}
