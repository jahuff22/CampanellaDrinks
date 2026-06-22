function calculateDistance(userPreferences, drink) {
  let sum = 0;

  for (const trait of traits) {
    const difference = userPreferences[trait] - drink.scores[trait];
    const weightedDifference = difference * (drink.weights[trait]/10);

    sum += weightedDifference ** 2;
  }

  return Math.sqrt(sum);
}

function recommendDrinks(userPreferences, numberOfRecommendations = 3) {
  return drinks
    .map(drink => ({
      ...drink,
      distance: calculateDistance(userPreferences, drink)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, numberOfRecommendations);
}

function getUserPreferencesFromForm() {
  const userPreferences = {};

  for (const trait of traits) {
    const input = document.getElementById(trait);
    userPreferences[trait] = Number(input.value);
  }

  return userPreferences;
}

function displayResults(recommendations) {
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  for (const drink of recommendations) {
    const drinkElement = document.createElement("div");

    drinkElement.innerHTML = `
      <h3>${drink.name}</h3>
      <p><strong>Match score:</strong> ${drink.distance.toFixed(2)}</p>
      <p><strong>Description:</strong> ${drink.description}</p>
      <p><strong>Ingredients:</strong> ${drink.ingredients}</p>
      <hr>
    `;

    resultsDiv.appendChild(drinkElement);
  }
}

const quizForm = document.getElementById("quiz-form");

quizForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const userPreferences = getUserPreferencesFromForm();
  const recommendations = recommendDrinks(userPreferences, 3);

  displayResults(recommendations);
});