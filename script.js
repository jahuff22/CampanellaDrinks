function createSliders() {
  const sliderContainer = document.getElementById("slider-container");

  for (const trait of traits) {
    const text = questionText[trait];

    const sliderBlock = document.createElement("div");
    sliderBlock.className = "slider-block";

    sliderBlock.innerHTML = `
      <div class="slider-content">
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
      </div>

      <div class="importance-control">
        <button
          class="importance-label"
          type="button"
          id="${trait}-important-label"
          aria-controls="${trait}-important"
          aria-pressed="false"
        >Click to prioritize this preference</button>
        <button
          class="importance-button"
          type="button"
          id="${trait}-important"
          aria-pressed="false"
          aria-label="Prioritize ${trait} preference"
        ></button>
      </div>
    `;

    sliderContainer.appendChild(sliderBlock);

    const slider = document.getElementById(trait);
    const valueDisplay = document.getElementById(`${trait}-value`);
    const importanceButton = document.getElementById(`${trait}-important`);
    const importanceLabel = document.getElementById(`${trait}-important-label`);

    slider.addEventListener("input", function() {
      if (valueDisplay) {
        valueDisplay.textContent = slider.value;
      }
    });

    function toggleImportance() {
      const isPressed = importanceButton.getAttribute("aria-pressed") === "true";
      const nextPressed = String(!isPressed);
      importanceButton.setAttribute("aria-pressed", nextPressed);
      importanceLabel.setAttribute("aria-pressed", nextPressed);
    }

    importanceButton.addEventListener("click", toggleImportance);
    importanceLabel.addEventListener("click", toggleImportance);
  }
}

function calculateDistance(userPreferences, importantTraits, drink) {
  let sum = 0;

  for (const trait of traits) {
    const difference = userPreferences[trait] - drink.scores[trait];

    let matchValue = difference ** 2;
    if (trait === "thickness") matchValue *= 0.75;
    else if(trait === "rarity") matchValue *= 0.5;

    if (userPreferences[trait] == 1 || userPreferences[trait] == 7) matchValue *= 1.25;

    if (importantTraits[trait]) matchValue *= 1.25;

    sum += matchValue;
  }

  return sum;
}

function getQualitativeInputFromForm() {
  return document.getElementById("qualitative-input").value.trim();
}

function getServiceContextFromPath() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const restaurantIndex = pathParts.indexOf("r");
  const tableIndex = pathParts.indexOf("t");

  return {
    restaurantSlug: restaurantIndex !== -1 ? pathParts[restaurantIndex + 1] || "unassigned" : "unassigned",
    tableSlug: tableIndex !== -1 ? pathParts[tableIndex + 1] || null : null,
    sourcePath: window.location.pathname
  };
}

function getGuestSessionId(context) {
  const storageKey = [
    "proofSession",
    context.restaurantSlug || "unassigned",
    context.tableSlug || "no-table"
  ].join(":");

  try {
    const existingSessionId = window.localStorage.getItem(storageKey);
    if (existingSessionId) return existingSessionId;

    const sessionId = createBrowserId("session");
    window.localStorage.setItem(storageKey, sessionId);
    return sessionId;
  } catch (error) {
    return createBrowserId("session");
  }
}

function createBrowserId(prefix) {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${randomPart}`;
}

async function parseQualitativeInput(text) {
  if (!text) {
    return {
      preferences: {
        remove: [],
        like: [],
        require: []
      },
      notice: ""
    };
  }

  try {
    const response = await fetch("/api/parse-preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (data.code === "AI_USAGE_LIMIT_REACHED") {
      return {
        preferences: parseQualitativeInputLocally(text),
        notice: "AI usage limit reached"
      };
    }

    if (!response.ok) {
      return {
        preferences: parseQualitativeInputLocally(text),
        notice: "AI preferences unavailable, using basic text matching."
      };
    }

    return {
      preferences: normalizeQualitativePreferences(data.preferences),
      notice: ""
    };
  } catch (error) {
    return {
      preferences: parseQualitativeInputLocally(text),
      notice: "AI preferences unavailable, using basic text matching."
    };
  }
}

function parseQualitativeInputLocally(text) {
  const normalizedText = normalizeSearchText(text);
  const knownTerms = getKnownPreferenceTerms();
  const remove = getTermsNearPreferenceWords(normalizedText, knownTerms, [
    "allergic",
    "allergy",
    "avoid",
    "dislike",
    "don't like",
    "do not like",
    "don't drink",
    "do not drink",
    "hate",
    "no",
    "not"
  ]);
  const require = getTermsNearPreferenceWords(normalizedText, knownTerms, [
    "only",
    "must",
    "must have",
    "has to",
    "have to",
    "need",
    "needs",
    "require",
    "requires",
    "required"
  ]).filter(term => !remove.includes(term));
  const like = getTermsNearPreferenceWords(normalizedText, knownTerms, [
    "like",
    "love",
    "want",
    "prefer",
    "enjoy"
  ]).filter(term => !remove.includes(term) && !require.includes(term));

  return {
    remove,
    like,
    require,
    featurePreferences: detectFeaturePreferences(normalizedText)
  };
}

function detectFeaturePreferences(text) {
  const featurePreferences = {
    masculinity: null,
    calories: null
  };

  if (/\b(manly|masculine|macho|tough|rugged)\b/.test(text)) {
    featurePreferences.masculinity = "masculine";
  } else if (/\b(feminine|girly|pretty|pink|floral|delicate)\b/.test(text)) {
    featurePreferences.masculinity = "feminine";
  }

  if (/\b(low calorie|low cal|lower calorie|fewer calories|skinny|light drink|diet)\b/.test(text)) {
    featurePreferences.calories = "low";
  } else if (/\b(high calorie|rich|creamy|dessert|indulgent)\b/.test(text)) {
    featurePreferences.calories = "high";
  }

  return featurePreferences;
}

function getKnownPreferenceTerms() {
  const conceptTerms = [
    "spicy",
    "smoky",
    "sweet",
    "sour",
    "bitter",
    "creamy",
    "citrus",
    "fruity",
    "herbal",
    "strong",
    "light",
    "coffee",
    "ginger"
  ];
  const drinkTerms = drinks.flatMap(drink => {
    return [
      drink.name,
      drink.liquor,
      ...drink.ingredients.split(/[,.]|\bor\b|\band\b/gi)
    ];
  });

  return [...conceptTerms, ...drinkTerms]
    .map(normalizeSearchText)
    .filter(term => term && term !== "bespoke")
    .filter((term, index, terms) => terms.indexOf(term) === index)
    .sort((a, b) => b.length - a.length);
}

function getTermsNearPreferenceWords(text, knownTerms, preferenceWords) {
  const matches = [];

  for (const term of knownTerms) {
    const termIndex = text.indexOf(term);
    if (termIndex === -1) continue;

    const nearbyText = text.slice(Math.max(0, termIndex - 35), termIndex + term.length + 35);
    const hasPreferenceWord = preferenceWords.some(word => {
      return new RegExp(`\\b${escapeRegExp(word)}\\b`).test(nearbyText);
    });

    if (hasPreferenceWord && !matches.includes(term)) {
      matches.push(term);
    }
  }

  return matches;
}

function normalizeQualitativePreferences(preferences) {
  return {
    remove: Array.isArray(preferences?.remove) ? preferences.remove : [],
    like: Array.isArray(preferences?.like) ? preferences.like : [],
    require: Array.isArray(preferences?.require) ? preferences.require : [],
    featurePreferences: normalizeFeaturePreferences(preferences?.featurePreferences)
  };
}

function normalizeFeaturePreferences(featurePreferences) {
  const normalized = {
    masculinity: null,
    calories: null
  };

  if (featurePreferences?.masculinity === "masculine" || featurePreferences?.masculinity === "feminine") {
    normalized.masculinity = featurePreferences.masculinity;
  }

  if (featurePreferences?.calories === "low" || featurePreferences?.calories === "medium" || featurePreferences?.calories === "high") {
    normalized.calories = featurePreferences.calories;
  }

  return normalized;
}

function drinkMatchesTerm(drink, term) {
  const searchableText = [
    drink.name,
    drink.liquor,
    drink.description,
    drink.ingredients
  ].join(" ");
  const expandedTerms = expandPreferenceTerm(term);
  const normalizedSearchableText = normalizeSearchText(searchableText);

  return expandedTerms.some(expandedTerm => normalizedSearchableText.includes(expandedTerm));
}

function hasMatchingTerm(drink, terms) {
  return terms.some(term => drinkMatchesTerm(drink, term));
}

function hasAllRequiredTerms(drink, terms) {
  return terms.every(term => drinkMatchesTerm(drink, term));
}

function expandPreferenceTerm(term) {
  const normalizedTerm = normalizeSearchText(term);
  const conceptMatches = {
    spicy: ["spicy", "jalapeno", "habanero", "chili", "cayenne", "hot sauce", "horseradish", "black pepper", "ginger beer"],
    smoky: ["smoky", "mezcal", "smoked", "charred"],
    creamy: ["creamy", "cream", "coconut", "egg white", "whole egg"],
    citrus: ["citrus", "lime", "lemon", "orange", "grapefruit"],
    fruity: ["fruity", "fruit", "pineapple", "apple", "berries", "grapefruit", "orange"],
    herbal: ["herbal", "mint", "basil", "rosemary", "thyme", "sage", "chartreuse"],
    bitter: ["bitter", "bitters", "campari", "aperol", "amaro"],
    coffee: ["coffee", "espresso"],
    whiskey: ["whiskey", "whisky", "bourbon", "rye", "scotch", "irish whiskey", "rittenhouse", "buffalo trace"],
    whisky: ["whiskey", "whisky", "bourbon", "rye", "scotch", "irish whiskey", "rittenhouse", "buffalo trace"],
    bourbon: ["bourbon", "buffalo trace"],
    rye: ["rye", "rittenhouse"],
    rum: ["rum", "rhum", "clairin", "smith & cross"],
    gin: ["gin"],
    tequila: ["tequila", "reposado tequila"],
    mezcal: ["mezcal"],
    brandy: ["brandy", "cognac", "calvados"],
    cognac: ["cognac", "hine h"],
    vodka: ["vodka"]
  };

  return conceptMatches[normalizedTerm] || [normalizedTerm];
}

function normalizeSearchText(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 '&-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function recommendDrinks(
  userPreferences,
  importantTraits,
  drinkList,
  qualitativePreferences = { remove: [], like: [], require: [] },
  numberOfRecommendations = 3
) {
  return drinkList
    .map(drink => {
      if (
        hasMatchingTerm(drink, qualitativePreferences.remove) ||
        !hasAllRequiredTerms(drink, qualitativePreferences.require || []) ||
        isRemovedByFeaturePreference(drink, qualitativePreferences)
      ) {
        return null;
      }

      let distance = calculateDistance(userPreferences, importantTraits, drink);

      if (hasMatchingTerm(drink, qualitativePreferences.like)) {
        distance *= 2 / 3;
      }

      distance *= getFeaturePreferenceMultiplier(drink, qualitativePreferences);

      return {
        ...drink,
        distance
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, numberOfRecommendations);
}

function isRemovedByFeaturePreference(drink, qualitativePreferences) {
  const featurePreferences = qualitativePreferences.featurePreferences || {};

  if (featurePreferences.masculinity === "masculine" && drink.scores.masculinity <= 2) {
    return true;
  }

  if (featurePreferences.masculinity === "feminine" && drink.scores.masculinity >= 6) {
    return true;
  }

  if (featurePreferences.calories === "low" && drink.scores.calories >= 6) {
    return true;
  }

  return false;
}

function getFeaturePreferenceMultiplier(drink, qualitativePreferences) {
  const featurePreferences = qualitativePreferences.featurePreferences || {};
  let multiplier = 1;

  if (featurePreferences.masculinity === "masculine" && drink.scores.masculinity >= 6) {
    multiplier *= 0.65;
  } else if (featurePreferences.masculinity === "masculine" && drink.scores.masculinity === 5) {
    multiplier *= 0.8;
  }

  if (featurePreferences.masculinity === "feminine" && drink.scores.masculinity <= 2) {
    multiplier *= 0.65;
  } else if (featurePreferences.masculinity === "feminine" && drink.scores.masculinity === 3) {
    multiplier *= 0.8;
  }

  if (featurePreferences.calories === "low" && drink.scores.calories <= 2) {
    multiplier *= 0.25;
  } else if (featurePreferences.calories === "low" && drink.scores.calories === 3) {
    multiplier *= 0.45;
  } else if (featurePreferences.calories === "low" && drink.scores.calories >= 4) {
    multiplier *= 1.25;
  }

  if (featurePreferences.calories === "high" && drink.scores.calories >= 6) {
    multiplier *= 0.7;
  }

  return multiplier;
}

function getUserPreferencesFromForm() {
  const userPreferences = {};

  for (const trait of traits) {
    const input = document.getElementById(trait);
    userPreferences[trait] = Number(input.value);
  }

  return userPreferences;
}

function getImportantTraitsFromForm() {
  const importantTraits = {};

  for (const trait of traits) {
    const button = document.getElementById(`${trait}-important`);
    importantTraits[trait] = button.getAttribute("aria-pressed") === "true";
  }

  return importantTraits;
}

function formatMatchPercentage(score) {
  return `${(100 - score * 0.75).toFixed(0)}%`;
}

function createRecommendationEventPayload(
  userPreferences,
  importantTraits,
  qualitativeText,
  qualitativePreferences,
  recommendations
) {
  const context = getServiceContextFromPath();

  return {
    ...context,
    sessionId: getGuestSessionId(context),
    sliderPreferences: userPreferences,
    importantTraits,
    qualitativeText,
    parsedPreferences: qualitativePreferences,
    recommendations: recommendations.map(drink => ({
      name: drink.name,
      liquor: drink.liquor,
      category: drink.category,
      distance: drink.distance,
      matchPercentage: formatMatchPercentage(drink.distance)
    }))
  };
}

async function saveRecommendationEvent(payload) {
  try {
    await fetch("/api/recommendation-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch (error) {
    console.warn("Could not save recommendation event.", error);
  }
}

const personaProfiles = {
  Purist: {
    title: "Purist",
    intro: "You like strong, classic drinks with structure and restraint.",
    avoidance: "You steer clear of overly sweet, overly sour, and fussier drinks that hide the base spirit.",
    closing: "...then your matches."
  },
  Sunseeker: {
    title: "Sunseeker",
    intro: "You love citrus, neutral spirits, and refreshing flavors.",
    avoidance: "You steer clear of smoky flavors, bitter aperitivos, and the harsh flavor of alcohol.",
    closing: "...then your matches."
  },
  Hedonist: {
    title: "Hedonist",
    intro: "You love lush, sweet, creamy cocktails with texture and a little drama.",
    avoidance: "You steer clear of dry, sharp, spirit-forward drinks that ask you to work too hard.",
    closing: "...then your matches."
  },
  Bittersweet: {
    title: "Bittersweet",
    intro: "You love bitter complexity when it has sweetness, depth, and a real point of view.",
    avoidance: "You steer clear of one-note strong drinks and simple sours that do not linger.",
    closing: "...then your matches."
  },
  Adventurer: {
    title: "Adventurer",
    intro: "You like drinks with unusual ingredients, bold structure, and a little edge.",
    avoidance: "You steer clear of overly predictable cocktails that do exactly what you expect.",
    closing: "...then your matches."
  },
  "Easy going": {
    title: "Easy Going",
    intro: "You are open-ended, flexible, and happy across a wide range of drinks.",
    avoidance: "You steer clear of being pinned down too tightly, and your matches can move in a few directions.",
    closing: "...then your matches."
  }
};

function calculatePersona(recommendations) {
  const categories = recommendations
    .slice(0, 3)
    .flatMap(drink => getDrinkCategories(drink));

  const categoryCounts = categories.reduce((counts, category) => {
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  const majorityCategory = Object.keys(categoryCounts).find(category => categoryCounts[category] >= 2);
  return majorityCategory || "Easy going";
}

function getDrinkCategories(drink) {
  if (Array.isArray(drink.category)) return drink.category;
  if (drink.category) return [drink.category];
  return [];
}

function createTasteProfile(userPreferences) {
  return {
    Strength: getPreferencePercentage(userPreferences.strength),
    Sweet: getPreferencePercentage(userPreferences.sweetness),
    Sour: getPreferencePercentage(userPreferences.sourness),
    Bitter: getPreferencePercentage(userPreferences.bitterness),
    Body: getPreferencePercentage(userPreferences.thickness),
    Rarity: getPreferencePercentage(userPreferences.rarity)
  };
}

function getPreferencePercentage(value) {
  return Math.round((Number(value) / 7) * 100);
}

function createTasteProfileRows(tasteProfile) {
  return Object.entries(tasteProfile).map(([label, value]) => `
    <div class="taste-row">
      <span>${label}</span>
      <div class="taste-meter" aria-label="${label}: ${value}%">
        <span style="width: ${value}%"></span>
      </div>
    </div>
  `).join("");
}

function displayPersonaProfile(personaCategory, userPreferences) {
  const profile = personaProfiles[personaCategory] || personaProfiles["Easy going"];
  const profileElement = document.getElementById("persona-profile");
  const tasteProfile = createTasteProfile(userPreferences);

  profileElement.innerHTML = `
    <div class="persona-summary">
      <p class="eyebrow">YOU'RE A</p>
      <h2>${profile.title}</h2>
      <p class="persona-intro">${profile.intro}</p>
      <p class="persona-avoidance">${profile.avoidance}</p>
      <p class="persona-closing">${profile.closing}</p>
    </div>
    <div class="taste-profile-card">
      <p class="eyebrow">YOUR TASTE PROFILE</p>
      <div class="taste-profile-bars">
        ${createTasteProfileRows(tasteProfile)}
      </div>
    </div>
  `;
}

function createDrinkResultElement(drink) {
  const drinkElement = document.createElement("div");

  drinkElement.innerHTML = `
    <h3>${drink.name}</h3>
    <p><strong>Match:</strong> ${formatMatchPercentage(drink.distance)}</p>
    <p><strong>Description:</strong> ${drink.description}</p>
    <p><strong>Ingredients:</strong> ${drink.ingredients}</p>
    <hr>
  `;

  return drinkElement;
}

function displayBothResults(scaledRecommendations, standardRecommendations) {
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

function displayResults(recommendations, userPreferences) {
  const resultsDiv = document.getElementById("results");
  const personaCategory = calculatePersona(recommendations);

  displayPersonaProfile(personaCategory, userPreferences);
  resultsDiv.innerHTML = "";

  for (const drink of recommendations) {
    resultsDiv.appendChild(createDrinkResultElement(drink));
  }

  document.getElementById("quiz-screen").hidden = true;
  document.getElementById("results-screen").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function displayNotice(message) {
  const noticeElement = document.getElementById("ai-notice");
  noticeElement.textContent = message;
  noticeElement.hidden = !message;
}

createSliders();

const quizForm = document.getElementById("quiz-form");
const retakeButton = document.getElementById("retake-button");

retakeButton.addEventListener("click", function() {
  document.getElementById("results-screen").hidden = true;
  document.getElementById("quiz-screen").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

quizForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const userPreferences = getUserPreferencesFromForm();
  const importantTraits = getImportantTraitsFromForm();
  const qualitativeText = getQualitativeInputFromForm();
  const qualitativeResult = await parseQualitativeInput(qualitativeText);
  const qualitativePreferences = qualitativeResult.preferences;

  const standardRecommendations = recommendDrinks(userPreferences, importantTraits, drinks, qualitativePreferences, 3);
  const recommendationEventPayload = createRecommendationEventPayload(
    userPreferences,
    importantTraits,
    qualitativeText,
    qualitativePreferences,
    standardRecommendations
  );

  displayNotice(qualitativeResult.notice);
  displayResults(standardRecommendations, userPreferences);
  saveRecommendationEvent(recommendationEventPayload);
});
