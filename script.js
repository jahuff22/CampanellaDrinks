const testUserPreferences = {
    strength: 3,
    sweetness: 4,
    sourness: 5,
    bitterness: 2,
    thickness: 3,
    rarity: 6
};

function calculateDistance(userPreferences, drink) {
  let sum = 0;

  for (const trait of traits) {
    const difference = userPreferences[trait] - drink.scores[trait];
    const weightedDifference = difference * drink.weights[trait];

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

console.log(recommendDrinks(testUserPreferences));

console.log("JavaScript is connected");