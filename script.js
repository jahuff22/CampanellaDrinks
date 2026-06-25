function getScaledDrinks() {
  const targetAverageWeight =
    drinks.reduce((total, drink) => {
      const drinkWeightTotal = traits.reduce((sum, trait) => {
        return sum + drink.weights[trait];
      }, 0);

      return total + drinkWeightTotal;
    }, 0) / (drinks.length * traits.length);

  const reweightingFactors = [];

  const scaledDrinks = drinks.map(drink => {
    const currentAverage =
      traits.reduce((sum, trait) => {
        return sum + drink.weights[trait];
      }, 0) / traits.length;

    const factor = targetAverageWeight / currentAverage;

    reweightingFactors.push({
      name: drink.name,
      oldAverage: currentAverage,
      factor: factor,
      newAverage: targetAverageWeight
    });

    const scaledWeights = {};

    for (const trait of traits) {
      scaledWeights[trait] = drink.weights[trait] * factor;
    }

    return {
      ...drink,
      weights: scaledWeights,
      scalingFactor: factor
    };
  });

  const highestFactor = Math.max(...reweightingFactors.map(item => item.factor));
  const lowestFactor = Math.min(...reweightingFactors.map(item => item.factor));

  console.log("Target average weight:", targetAverageWeight);
  console.log("Highest reweighting factor:", highestFactor);
  console.log("Lowest reweighting factor:", lowestFactor);
  console.table(reweightingFactors);

  return scaledDrinks;
}

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
      if (valueDisplay) {
        valueDisplay.textContent = slider.value;
      }
    });
  }
}

function calculateDistance(userPreferences, drink) {
  let sum = 0;

  for (const trait of traits) {
    const difference = userPreferences[trait] - drink.scores[trait];

    sum += (difference ** 2) * (drink.weights[trait] / 10);
  }

  return sum;
}

function recommendDrinks(userPreferences, drinkList, numberOfRecommendations = 3) {
  return drinkList
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

function createDrinkResultElement(drink) {
  const drinkElement = document.createElement("div");

  drinkElement.innerHTML = `
    <h3>${drink.name}</h3>
    <p><strong>Match score:</strong> ${drink.distance.toFixed(2)}</p>
    <p><strong>Description:</strong> ${drink.description}</p>
    <p><strong>Ingredients:</strong> ${drink.ingredients}</p>
    <hr>
  `;

  return drinkElement;
}

function displayResults(scaledRecommendations, standardRecommendations) {
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  const scaledTitle = document.createElement("h2");
  scaledTitle.textContent = "Scaled";
  resultsDiv.appendChild(scaledTitle);

  for (const drink of scaledRecommendations) {
    resultsDiv.appendChild(createDrinkResultElement(drink));
  }

  const divider = document.createElement("div");
  divider.style.borderTop = "6px solid black";
  divider.style.margin = "30px 0";
  resultsDiv.appendChild(divider);

  const standardTitle = document.createElement("h2");
  standardTitle.textContent = "Standard";
  resultsDiv.appendChild(standardTitle);

  for (const drink of standardRecommendations) {
    resultsDiv.appendChild(createDrinkResultElement(drink));
  }
}

function displayResults(scaledRecommendations) {
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  for (const drink of scaledRecommendations) {
    resultsDiv.appendChild(createDrinkResultElement(drink));
  }
}

const scaledDrinks = getScaledDrinks();

createSliders();

const quizForm = document.getElementById("quiz-form");

quizForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const userPreferences = getUserPreferencesFromForm();

  const scaledRecommendations = recommendDrinks(userPreferences, scaledDrinks, 3);
  const standardRecommendations = recommendDrinks(userPreferences, drinks, 3);

  displayResults(scaledRecommendations);
});