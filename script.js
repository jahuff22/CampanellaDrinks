function createSliders() {
  const sliderContainer = document.getElementById("slider-container");

  for (const trait of traits) {
    const text = questionText[trait];

    const sliderBlock = document.createElement("div");
    sliderBlock.className = "slider-block";

    sliderBlock.innerHTML = `
      <p class="question-prompt">${text.prompt}</p>

      <div class="slider-labels">
        <span>${text.low}</span>
        <span>${text.high}</span>
      </div>

      <div class="number-labels">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
      </div>

      <input
        type="range"
        id="${trait}"
        min="1"
        max="7"
        value="4"
        step="1"
      >
    `;

    sliderContainer.appendChild(sliderBlock);

    const slider = document.getElementById(trait);
    const valueDisplay = document.getElementById(`${trait}-value`);

    slider.addEventListener("input", function() {
      valueDisplay.textContent = slider.value;
    });
  }
}

function calculateDistance(userPreferences, drink) {
  let sum = 0;

  for (const trait of traits) {
    const difference = userPreferences[trait] - drink.scores[trait];

    sum += (difference ** 2) * (drink.weights[trait]/10);
  }

  return sum;
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

createSliders();

const quizForm = document.getElementById("quiz-form");

quizForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const userPreferences = getUserPreferencesFromForm();
  const recommendations = recommendDrinks(userPreferences, 3);

  displayResults(recommendations);
});