function createSliders() {
  const sliderContainer = document.getElementById("slider-container");

  for (const trait of traits) {
    const text = questionText[trait];
    const prompt = getQuestionPromptText(trait, text);

    const sliderBlock = document.createElement("div");
    sliderBlock.className = "slider-block";

    sliderBlock.innerHTML = `
      <div class="slider-content">
        <p class="question-prompt">${prompt}</p>

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

function getQuestionPromptText(trait, text) {
  if (!isCustomerMode()) return text.prompt;

  const customerPrompts = {
    strength: "When considering the strength of my ideal cocktail",
    sweetness: "When considering the sweetness of my ideal cocktail",
    sourness: "When considering the sourness of my ideal cocktail",
    bitterness: "When considering the bitterness of my ideal cocktail",
    thickness: "When considering the texture of my ideal cocktail",
    rarity: "When considering how adventurous my ideal cocktail is"
  };

  return customerPrompts[trait] || text.prompt;
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
  const cleanPathParts = getCleanRestaurantPathParts(pathParts);

  return {
    restaurantSlug: restaurantIndex !== -1 ? pathParts[restaurantIndex + 1] || "unassigned" : cleanPathParts.restaurantSlug,
    tableSlug: tableIndex !== -1 ? pathParts[tableIndex + 1] || null : cleanPathParts.tableSlug,
    sourcePath: window.location.pathname
  };
}

function getCleanRestaurantPathParts(pathParts) {
  const reservedPaths = new Set(["api", "alpha", "business", "customer", "dashboard", "landing", "shared"]);

  if (pathParts.length < 1 || pathParts.length > 2) {
    return {
      restaurantSlug: "unassigned",
      tableSlug: null
    };
  }

  if (reservedPaths.has(pathParts[0].toLowerCase()) || !pathParts.every(isCleanRouteSlug)) {
    return {
      restaurantSlug: "unassigned",
      tableSlug: null
    };
  }

  return {
    restaurantSlug: pathParts[0],
    tableSlug: pathParts[1] || null
  };
}

function isCleanRouteSlug(value) {
  return /^[a-zA-Z0-9_-]+$/.test(value);
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

  return expandedTerms.some(expandedTerm => normalizedTextIncludesTerm(normalizedSearchableText, expandedTerm));
}

function normalizedTextIncludesTerm(text, term) {
  const normalizedTerm = normalizeSearchText(term);
  if (!normalizedTerm) return false;

  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedTerm)}([^a-z0-9]|$)`).test(text);
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

  if (featurePreferences.masculinity === "masculine" && drink.scores.masculinity !== 1) {
    return true;
  }

  if (featurePreferences.masculinity === "feminine" && drink.scores.masculinity !== 0) {
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

  if (featurePreferences.masculinity === "masculine" && drink.scores.masculinity === 1) {
    multiplier *= 0.65;
  }

  if (featurePreferences.masculinity === "feminine" && drink.scores.masculinity === 0) {
    multiplier *= 0.65;
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
    intro: "You enjoy the warmth and burn of alcohol and gravitate toward strong, structured drinks that let the base spirit speak for itself.",
    avoidance: "You steer clear of excessive sweetness, acidity, and fussy ingredients that soften or conceal the star of the show: booze."
  },
  Sunseeker: {
    title: "Sunseeker",
    intro: "You gravitate toward bright, refreshing drinks where citrus and freshness take center stage. If it tastes like summer in a glass, you’ll take it!",
    avoidance: "You steer clear of cocktails that feel heavy, flat, or dominated by the harshness of alcohol."
  },
  Hedonist: {
    title: "Hedonist",
    intro: "You love lush, sweet, creamy cocktails with texture and a little drama.",
    avoidance: "You steer clear of dry, sharp, spirit-forward drinks that ask you to work too hard."
  },
  Bittersweet: {
    title: "Bittersweet",
    intro: "Most people are naturally wired to avoid bitterness. You’re drawn to it, especially when a touch of sweetness turns its sharp edges into something rich and compelling.",
    avoidance: "You want a drink with tension, depth, and a finish that gives you something new to notice with every sip."
  },
  Adventurer: {
    title: "Adventurer",
    intro: "You want your drink to surprise you. Maybe that means it has an ingredient you’ve never heard of, a flavor combination that shouldn’t work but does, or a surprising finish you didn’t see coming.",
    avoidance: "If you already know exactly how a cocktail will taste, you’ve probably lost interest."
  },
  Harmonist: {
    title: "Harmonist",
    intro: "You want your cocktails like we all want our people: even-keeled and dependable. If a cocktail is balanced - not drifting too far in any singular direction - that’s the drink for you.",
    avoidance: "You steer clear of cocktails with bold and overwhelming profiles, opting for something classic and easy drinking."
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
  return majorityCategory || "Harmonist";
}

function getDrinkCategories(drink) {
  if (Array.isArray(drink.category)) return drink.category;
  if (drink.category) return [drink.category];
  return [];
}

function createTasteProfile(userPreferences) {
  return [
    { label: "Strength", value: Number(userPreferences.strength) },
    { label: "Sweet", value: Number(userPreferences.sweetness) },
    { label: "Sour", value: Number(userPreferences.sourness) },
    { label: "Bitter", value: Number(userPreferences.bitterness) },
    { label: "Body", value: Number(userPreferences.thickness) },
    { label: "Rarity", value: Number(userPreferences.rarity) }
  ];
}

function createPalateChart(tasteProfile) {
  const center = 160;
  const radius = 98;
  const labelRadius = 130;
  const levels = 7;
  const sliceAngle = 360 / tasteProfile.length;
  const blobPoints = [];
  const labels = [];

  tasteProfile.forEach((dimension, index) => {
    const angle = -90 + index * sliceAngle;
    const labelPoint = polarPoint(center, center, labelRadius, angle);
    const value = clampPreferenceValue(dimension.value);
    const outerRadius = ((value + 0.35) / levels) * radius;

    blobPoints.push(polarPoint(center, center, outerRadius, angle));

    labels.push(`
      <text
        class="palate-label"
        x="${labelPoint.x.toFixed(2)}"
        y="${labelPoint.y.toFixed(2)}"
        text-anchor="middle"
        dominant-baseline="middle"
      >${dimension.label}</text>
    `);
  });

  return `
    <svg class="palate-wheel" viewBox="0 0 320 320" role="img" aria-label="Palate profile across six flavor dimensions">
      <circle class="palate-wheel-bg" cx="${center}" cy="${center}" r="${radius}"></circle>
      <path class="palate-blob" d="${createSmoothClosedPath(blobPoints)}"></path>
      <circle class="palate-outer-line" cx="${center}" cy="${center}" r="${radius}"></circle>
      <g>${labels.join("")}</g>
    </svg>
  `;
}

function clampPreferenceValue(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 0;
  return Math.min(Math.max(Math.round(numberValue), 0), 7);
}

function polarPoint(centerX, centerY, radius, angleDegrees) {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleRadians),
    y: centerY + radius * Math.sin(angleRadians)
  };
}

function createSmoothClosedPath(points) {
  if (!points.length) return "";

  const commands = [`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`];

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const midpoint = {
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2
    };

    commands.push(`Q ${current.x.toFixed(2)} ${current.y.toFixed(2)} ${midpoint.x.toFixed(2)} ${midpoint.y.toFixed(2)}`);
  }

  commands.push("Z");
  return commands.join(" ");
}

function displayPersonaProfile(personaCategory, userPreferences) {
  const profile = personaProfiles[personaCategory] || personaProfiles.Harmonist;
  const profileElement = document.getElementById("persona-profile");
  const tasteProfile = createTasteProfile(userPreferences);

  profileElement.hidden = false;
  profileElement.innerHTML = `
    <div class="persona-summary">
      <p class="eyebrow">YOU'RE ${getPersonaArticle(profile.title).toUpperCase()}</p>
      <h2>${profile.title}</h2>
      <p class="persona-intro">${profile.intro}</p>
      <p class="persona-avoidance">${profile.avoidance}</p>
    </div>
    <div class="taste-profile-card">
      <p class="eyebrow">Palate Profile</p>
      <div class="palate-chart">
        ${createPalateChart(tasteProfile)}
      </div>
    </div>
  `;
}

function getPersonaArticle(persona) {
  return persona === "Adventurer" ? "an" : "a";
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

function isCustomerMode() {
  return window.location.pathname.split("/").filter(Boolean)[0] === "customer";
}

async function createCustomerProfileData(userPreferences, qualitativeText, qualitativePreferences, recommendations) {
  const persona = calculatePersona(recommendations);
  const strongLikes = getStrongPreferencePhrases(userPreferences, "high");
  const strongAvoids = [
    ...getStrongPreferencePhrases(userPreferences, "low"),
    ...(qualitativePreferences.remove || [])
  ];
  const aboutYou = createAboutYouSentence(persona, userPreferences);
  const bartenderScript = await createBartenderScript(userPreferences, strongLikes, strongAvoids);
  const spiritsAndModifiers = createSpiritsAndModifiers(recommendations, userPreferences);
  const recipe = createCustomRecipe(persona, userPreferences, spiritsAndModifiers);

  return {
    eventId: createBrowserId("cust"),
    sourcePath: window.location.pathname,
    persona,
    aboutYou,
    bartenderScript,
    spiritsAndModifiers,
    recipe,
    sliderPreferences: userPreferences,
    importantTraits: getImportantTraitsFromForm(),
    qualitativeText,
    parsedPreferences: qualitativePreferences,
    recommendations
  };
}

function displayCustomerResults(profileData, notice) {
  displayPersonaProfile(profileData.persona, profileData.sliderPreferences);
  displayNotice(notice);

  const resultsDiv = document.getElementById("results");
  resultsDiv.className = "customer-results";
  resultsDiv.innerHTML = `
    <section class="customer-card customer-intro-card">
      <form id="customer-email-form" class="customer-email-form">
        <p>Your personalized palate profile is based on your preferences and sensitivities within the flavor dimensions.</p>
        <p>Enter your email and we’ll send you three classic cocktail matches, a personal script for ordering at bars and restaurants, and a custom cocktail recipe built for your palate.</p>
        <label for="customer-email">Email address</label>
        <div class="customer-email-row">
          <input id="customer-email" type="email" autocomplete="email" required placeholder="you@example.com">
          <button type="submit">Send my drinks</button>
        </div>
      </form>
    </section>
  `;

  document.getElementById("customer-email-form").addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.dataset.submitted === "true") return;

    form.dataset.submitted = "true";
    const submitButton = form.querySelector("button[type='submit']");
    const email = document.getElementById("customer-email").value.trim();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      await showCustomerSubscriptionConfirmation(profileData, email);
      if (submitButton) {
        submitButton.textContent = "Sent";
      }
    } catch (error) {
      form.dataset.submitted = "false";
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send my drinks";
      }
    }
  });

  document.querySelector(".recommendations-heading h2").textContent = "";
  document.getElementById("quiz-screen").hidden = true;
  document.getElementById("results-screen").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function showCustomerSubscriptionConfirmation(profileData, email) {
  document.getElementById("persona-profile").hidden = true;
  displayNotice("");

  const resultsDiv = document.getElementById("results");
  resultsDiv.className = "customer-results";
  resultsDiv.innerHTML = createCustomerConfirmationHtml(profileData);
  populateInterestingDrinkOptions(profileData.recommendations);
  await saveCustomerEvent(profileData, email, {}, {}, "email");

  document.getElementById("customer-feedback-form").addEventListener("submit", async event => {
    event.preventDefault();
    await saveCustomerEvent(profileData, email, getCustomerFeedback(), getCustomerDetails(), "details");
    document.getElementById("customer-save-status").textContent = "Saved. Thank you.";
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createCustomerConfirmationHtml(profileData) {
  return `
    <section class="customer-card">
      <h2>Thank you for subscribing to PROOF!</h2>
      <p>Your results have been emailed to you.</p>
    </section>
    <section class="customer-card">
      <h2>Your Perfect Classics</h2>
      <div class="customer-drink-grid">
        ${profileData.recommendations.map(createCustomerDrinkCard).join("")}
      </div>
      <p class="customer-classics-note">Any decent bar in America can make these. Just ask!</p>
    </section>
    <section class="customer-card">
      <h2>Your Bartender Script</h2>
      <p>${escapeHtml(profileData.bartenderScript)}</p>
    </section>
    <section class="customer-card">
      <h2>A recipe for your palate</h2>
      <h3>${escapeHtml(profileData.recipe.name)}</h3>
      <p>${escapeHtml(profileData.recipe.description)}</p>
      <ul>${profileData.recipe.ingredients.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p>${escapeHtml(profileData.recipe.method)}</p>
    </section>
    <form id="customer-feedback-form" class="customer-card customer-feedback-form">
      <h2>Tell us how we did</h2>
      <label>Which of the drinks interests you most?
        <select id="customer-interesting-drink"></select>
      </label>
      <label class="rating-field">How happy are you with the recommendations?
        <input id="customer-drink-rating" type="range" min="1" max="7" value="4" aria-describedby="customer-rating-scale">
        <div id="customer-rating-scale" class="rating-scale" aria-hidden="true">
          <span><b>1</b><small>I hate this</small></span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span><b>7</b><small>I love this</small></span>
        </div>
      </label>
      <label>What is your favorite drink?
        <input id="customer-favorite-drink" type="text">
      </label>
      <label>Anything else we should know or change?
        <textarea id="customer-feedback-notes" rows="4"></textarea>
      </label>
      <p>Thanks for letting us read your palate. We'll keep you up to date with PROOF bars near you, plus the occasional thought on why people like what they like.</p>
      <h2>One more thing.</h2>
      <div class="customer-name-birthday-group">
        <p>Tell us your name and birthday and we'll send you a celebratory cocktail built for your palate.</p>
        <div class="customer-name-birthday-row">
          <label>First name
            <input id="customer-first-name" type="text" autocomplete="given-name">
          </label>
          <label>Last name
            <input id="customer-last-name" type="text" autocomplete="family-name">
          </label>
          <label>Birthday
            <input id="customer-birthday" type="date">
          </label>
        </div>
      </div>
      <button type="submit">Save details</button>
      <span id="customer-save-status"></span>
    </form>
    <section class="customer-card">
      <h2>What is PROOF?</h2>
      <p>A simple fix for a familiar problem: I don't know which drink on this menu is for me. We read your palate, then point you to the right one. We partner with restaurants and bars across America.</p>
      <p>Know a bar that needs us? Make the introduction. If it works out, we'll send you $1,000. -> outreach@joinproof.bar</p>
      <p>Ideas, thoughts, or looking to collaborate? The door's always open.</p>
      <p>Cheers,<br>Michael and Jake</p>
    </section>
  `;
}

function createCustomerDrinkCard(drink) {
  return `
    <article>
      <h3>${escapeHtml(drink.name)}</h3>
      <p>${escapeHtml(drink.description)}</p>
    </article>
  `;
}

function populateInterestingDrinkOptions(recommendations) {
  const select = document.getElementById("customer-interesting-drink");
  const placeholder = '<option value="" selected disabled>Choose a recommendation</option>';
  select.innerHTML = placeholder + recommendations.map(drink => `<option value="${escapeHtml(drink.name)}">${escapeHtml(drink.name)}</option>`).join("");
}

function getCustomerFeedback() {
  return {
    mostInterestingDrink: document.getElementById("customer-interesting-drink")?.value || "",
    drinkRating: document.getElementById("customer-drink-rating")?.value || "",
    favoriteDrink: document.getElementById("customer-favorite-drink")?.value || "",
    notes: document.getElementById("customer-feedback-notes")?.value || ""
  };
}

function getCustomerDetails() {
  return {
    firstName: document.getElementById("customer-first-name")?.value.trim() || "",
    lastName: document.getElementById("customer-last-name")?.value.trim() || "",
    birthday: document.getElementById("customer-birthday")?.value || ""
  };
}

async function saveCustomerEvent(profileData, email, feedback = {}, details = {}, saveAction = "update") {
  try {
    const response = await fetch("/api/customer-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...profileData,
        customerRecordId: profileData.eventId,
        saveAction,
        email,
        firstName: details.firstName || "",
        lastName: details.lastName || "",
        birthday: details.birthday || "",
        feedback,
        recommendations: profileData.recommendations.map(drink => ({
          name: drink.name,
          liquor: drink.liquor,
          category: drink.category,
          distance: drink.distance,
          matchPercentage: formatMatchPercentage(drink.distance)
        }))
      }),
      keepalive: true
    });

    if (!response.ok) {
      throw new Error(`Customer save failed with status ${response.status}`);
    }
  } catch (error) {
    console.warn("Could not save customer event.", error);
    throw error;
  }
}

function createAboutYouSentence(persona, preferences) {
  const high = getStrongPreferencePhrases(preferences, "high").slice(0, 2);
  const low = getStrongPreferencePhrases(preferences, "low").slice(0, 1);
  const likes = high.length ? high.join(", ") : "balanced cocktails";
  const avoids = low.length ? ` and you tend to avoid ${low[0]}` : "";
  return `You lean ${persona.toLowerCase()}: you like ${likes}${avoids}.`;
}

function getStrongPreferencePhrases(preferences, direction) {
  const labels = {
    strength: "strong structure",
    sweetness: "sweetness",
    sourness: "bright acidity",
    bitterness: "bitterness",
    thickness: "rich texture",
    rarity: "adventurous flavors"
  };

  return Object.entries(preferences)
    .filter(([, value]) => direction === "high" ? Number(value) >= 6 : Number(value) <= 2)
    .map(([trait]) => labels[trait])
    .filter(Boolean);
}

const bartenderScriptSamples = [
  { preferences: { sweetness: 1, sourness: 1, bitterness: 1, strength: 2, thickness: 2, rarity: 1 }, script: "I want something light and easy. Nothing sweet, nothing bitter, just crisp and refreshing I can sip all night." },
  { preferences: { sweetness: 7, sourness: 2, bitterness: 2, strength: 2, thickness: 6, rarity: 1 }, script: "I have a sweet tooth and I want something rich and creamy, more dessert than drink, and I don't wanna taste the alcohol." },
  { preferences: { sweetness: 2, sourness: 6, bitterness: 1, strength: 4, thickness: 2, rarity: 2 }, script: "Make me something tart and bone-dry. heavy on the citrus, barely any sugar." },
  { preferences: { sweetness: 1, sourness: 2, bitterness: 7, strength: 6, thickness: 3, rarity: 3 }, script: "Give me the most bitter and spirit forward thing you make." },
  { preferences: { sweetness: 4, sourness: 4, bitterness: 4, strength: 4, thickness: 4, rarity: 4 }, script: "I like a well-balanced drink — a little sweet, a little sour, moderately strong, where no flavor profile takes over." },
  { preferences: { sweetness: 6, sourness: 5, bitterness: 1, strength: 3, thickness: 5, rarity: 2 }, script: "Something sweet and tart, ideally with a nice foam on top." },
  { preferences: { sweetness: 1, sourness: 3, bitterness: 6, strength: 7, thickness: 2, rarity: 6 }, script: "I want the strongest, driest, most bitter cocktail you have." },
  { preferences: { sweetness: 3, sourness: 6, bitterness: 5, strength: 5, thickness: 3, rarity: 7 }, script: "Surprise me with something obscure and herbal — tart with some bitterness." },
  { preferences: { sweetness: 7, sourness: 1, bitterness: 1, strength: 1, thickness: 7, rarity: 3 }, script: "I want dessert in a glass. Thick, creamy, very sweet, and barely alcoholic." },
  { preferences: { sweetness: 2, sourness: 5, bitterness: 2, strength: 3, thickness: 1, rarity: 1 }, script: "Something and fizzy and citrusy and refreshing — a classic, low ABV spritz would be ideal." },
  { preferences: { sweetness: 5, sourness: 4, bitterness: 6, strength: 4, thickness: 3, rarity: 5 }, script: "I love something fruity, sour, bitter — something that is bold and unexpected." },
  { preferences: { sweetness: 1, sourness: 1, bitterness: 3, strength: 7, thickness: 3, rarity: 2 }, script: "I like an intense, spirit forward cocktail with a touch of bitterness if possible." },
  { preferences: { sweetness: 6, sourness: 2, bitterness: 2, strength: 6, thickness: 4, rarity: 6 }, script: "Something rich, sweet, and strong and ideally, unique and unexpected." },
  { preferences: { sweetness: 3, sourness: 7, bitterness: 3, strength: 3, thickness: 2, rarity: 4 }, script: "As sour as you can make it — I want my mouth to pucker!" },
  { preferences: { sweetness: 2, sourness: 3, bitterness: 7, strength: 5, thickness: 2, rarity: 5 }, script: "Bitter and strong is my thing, and I'm not afraid of some funk or unexpected flavors." },
  { preferences: { sweetness: 7, sourness: 5, bitterness: 3, strength: 2, thickness: 5, rarity: 7 }, script: "I'm looking for something sweet and tart and unusual, with a silky texture or foam." },
  { preferences: { sweetness: 4, sourness: 2, bitterness: 2, strength: 6, thickness: 6, rarity: 1 }, script: "I'll take somehing smooth and creamy — and ideally, strong and boozy." },
  { preferences: { sweetness: 5, sourness: 6, bitterness: 4, strength: 5, thickness: 4, rarity: 3 }, script: "I like a proper sour — plenty of citrus, some sweetness, and ideally, a nice foam!" },
  { preferences: { sweetness: 1, sourness: 4, bitterness: 5, strength: 3, thickness: 1, rarity: 4 }, script: "A bitter, low ABV spritz is perfect, and I'm not afraid of unique or unfamiliar flavors if possible." },
  { preferences: { sweetness: 6, sourness: 3, bitterness: 1, strength: 7, thickness: 5, rarity: 2 }, script: "Tropical and sweet, and don't hold back on the booze." },
  { preferences: { sweetness: 3, sourness: 5, bitterness: 6, strength: 6, thickness: 2, rarity: 6 }, script: "Bartender's choice, as long as it's obscure and not too sweet." },
  { preferences: { sweetness: 5, sourness: 4, bitterness: 2, strength: 2, thickness: 7, rarity: 1 }, script: "Something creamy and/or frothy with a bit of sweetness and citrus, and light on the alcohol." },
  { preferences: { sweetness: 2, sourness: 2, bitterness: 4, strength: 7, thickness: 4, rarity: 7 }, script: "Give me something rare and boozy — dry, a touch bitter, and complex." },
  { preferences: { sweetness: 7, sourness: 7, bitterness: 1, strength: 4, thickness: 3, rarity: 4 }, script: "I want a sour: sweet, refreshing, tropical - summer in a glass!" },
  { preferences: { sweetness: 4, sourness: 3, bitterness: 7, strength: 7, thickness: 6, rarity: 5 }, script: "I'll take the biggest, boldest, most unexpected thing thing on your menu. Bitter, bold, high-proof." }
];

async function createBartenderScript(preferences, likes, avoids) {
  const nearestSamples = getNearestBartenderScriptSamples(preferences);
  const nearestSample = nearestSamples[0];

  if (nearestSample && nearestSample.distance <= 2) {
    return nearestSample.script;
  }

  try {
    const response = await fetch("/api/bartender-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        preferences,
        examples: nearestSamples.slice(0, 5).map(sample => ({
          preferences: sample.preferences,
          script: sample.script
        }))
      })
    });
    const data = await response.json();

    if (response.ok && typeof data.script === "string" && data.script.trim()) {
      return data.script.trim();
    }
  } catch (error) {
    console.warn("Could not generate bartender script.", error);
  }

  return createFallbackBartenderScript(likes, avoids, nearestSample);
}

function getNearestBartenderScriptSamples(preferences) {
  return bartenderScriptSamples
    .map(sample => ({
      ...sample,
      distance: calculateBartenderScriptDistance(preferences, sample.preferences)
    }))
    .sort((a, b) => a.distance - b.distance);
}

function calculateBartenderScriptDistance(preferences, samplePreferences) {
  return ["sweetness", "sourness", "bitterness", "strength", "thickness", "rarity"].reduce((total, trait) => {
    return total + Math.abs(Number(preferences[trait]) - Number(samplePreferences[trait]));
  }, 0);
}

function createFallbackBartenderScript(likes, avoids, nearestSample) {
  if (nearestSample?.script) return nearestSample.script;

  const likeParts = likes.length ? likes.slice(0, 3) : ["balanced", "refreshing", "well-structured"];
  const skip = avoids.length ? avoids[0] : "anything too far from your mood";
  return `Ask for something ${likeParts.join(", ")} - and skip anything with ${skip}.`;
}

function createSpiritsAndModifiers(recommendations, preferences) {
  const liquors = recommendations.map(drink => drink.liquor).filter(Boolean);
  const modifiers = [];
  if (preferences.sourness >= 5) modifiers.push("fresh lime or lemon");
  if (preferences.bitterness >= 5) modifiers.push("Campari, amaro, or bitters");
  if (preferences.sweetness >= 5) modifiers.push("honey, pineapple, or orange liqueur");
  if (preferences.thickness >= 5) modifiers.push("egg white, cream, or coconut");
  if (preferences.rarity >= 5) modifiers.push("Chartreuse, mezcal, or sherry");
  return [...new Set([...liquors, ...modifiers])].slice(0, 6);
}

function createCustomRecipe(persona, preferences, spiritsAndModifiers) {
  const matchedCocktail = findCustomCocktailMatch(persona, preferences);

  if (matchedCocktail) {
    return {
      name: matchedCocktail.name,
      description: createCustomCocktailDescription(matchedCocktail),
      ingredients: splitRecipeLines(matchedCocktail.recipe),
      method: matchedCocktail.process || "Build, shake, or stir according to the drink's service style."
    };
  }

  const base = spiritsAndModifiers[0] || "gin";
  const citrus = preferences.sourness >= 4 ? "3/4 oz fresh lemon or lime" : "1/4 oz citrus";
  const sweet = preferences.sweetness >= 5 ? "3/4 oz honey syrup" : "1/2 oz simple syrup";
  const texture = preferences.thickness >= 5 ? "1 egg white or 1/2 oz cream" : "soda or stirred dilution";

  return {
    name: `${persona} House Sour`,
    description: "A custom starting point built from your strongest palate signals.",
    ingredients: [`2 oz ${base}`, citrus, sweet, texture, "1 dash bitters or saline"],
    method: "Shake with ice, strain into a chilled glass, and adjust the sweet/sour balance to taste."
  };
}

function findCustomCocktailMatch(persona, preferences) {
  const rows = typeof window !== "undefined" && Array.isArray(window.customCocktailRows)
    ? window.customCocktailRows
    : [];

  return rows
    .filter(row => normalizeSearchText(row.complexity) !== "expert")
    .map(row => ({
      row,
      distance: calculateCustomCocktailDistance(persona, preferences, row)
    }))
    .sort((a, b) => a.distance - b.distance)[0]?.row || null;
}

function calculateCustomCocktailDistance(persona, preferences, cocktail) {
  const traitDistance = ["strength", "sweetness", "sourness", "bitterness", "thickness", "rarity"].reduce((total, trait) => {
    const userValue = Number(preferences[trait]);
    const cocktailValue = Number(cocktail[trait]);
    if (!Number.isFinite(userValue) || !Number.isFinite(cocktailValue)) return total + 9;
    return total + (userValue - cocktailValue) ** 2;
  }, 0);
  const personaPenalty = normalizeSearchText(cocktail.persona) === normalizeSearchText(persona) ? 0 : 4;

  return traitDistance + personaPenalty;
}

function createCustomCocktailDescription(cocktail) {
  const style = cocktail.style ? `${cocktail.style.toLowerCase()}-style ` : "";
  return `A ${style}custom cocktail from the PROOF master sheet, matched to your palate profile.`;
}

function splitRecipeLines(recipe) {
  return String(recipe || "")
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function displayNotice(message) {
  const noticeElement = document.getElementById("ai-notice");
  noticeElement.textContent = message;
  noticeElement.hidden = !message;
}

let activeDrinkSetPromise = Promise.resolve(drinks);

initializeQuiz();

async function initializeQuiz() {
  if (isCustomerMode()) {
    document.body.classList.add("customer-mode");
    document.querySelector("button[type='submit']").textContent = "Read my palate";
  }

  createSliders();
  hideSurveyLoader();
  activeDrinkSetPromise = loadActiveDrinkSet();

  const quizForm = document.getElementById("quiz-form");
  const retakeButton = document.getElementById("retake-button");

  retakeButton.addEventListener("click", function() {
    document.getElementById("results-screen").hidden = true;
    document.getElementById("quiz-screen").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  quizForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    setSurveySubmitting(true);

    try {
      await activeDrinkSetPromise;

      const userPreferences = getUserPreferencesFromForm();
      const importantTraits = getImportantTraitsFromForm();
      const qualitativeText = getQualitativeInputFromForm();
      const qualitativeResult = await parseQualitativeInput(qualitativeText);
      const qualitativePreferences = qualitativeResult.preferences;

      const standardRecommendations = recommendDrinks(userPreferences, importantTraits, drinks, qualitativePreferences, 3);
      displayNotice(qualitativeResult.notice);

      if (isCustomerMode()) {
        displayCustomerResults(
          await createCustomerProfileData(userPreferences, qualitativeText, qualitativePreferences, standardRecommendations),
          qualitativeResult.notice
        );
        return;
      }

      const recommendationEventPayload = createRecommendationEventPayload(
        userPreferences,
        importantTraits,
        qualitativeText,
        qualitativePreferences,
        standardRecommendations
      );

      displayResults(standardRecommendations, userPreferences);
      saveRecommendationEvent(recommendationEventPayload);
    } finally {
      setSurveySubmitting(false);
    }
  });
}

async function loadActiveDrinkSet() {
  if (typeof loadSavedDrinkSetForActiveRestaurant !== "function" || !shouldLoadSavedRestaurantMenu()) {
    return drinks;
  }

  return loadSavedDrinkSetForActiveRestaurant();
}

function shouldLoadSavedRestaurantMenu() {
  const context = getServiceContextFromPath();
  return context.restaurantSlug && context.restaurantSlug !== "unassigned" && !isCustomerMode();
}

function hideSurveyLoader() {
  const loader = document.getElementById("survey-loader");
  if (loader) loader.hidden = true;
}

function setSurveySubmitting(isSubmitting) {
  const submitButton = document.querySelector("#quiz-form button[type='submit']");
  if (!submitButton) return;

  if (!submitButton.dataset.readyLabel) {
    submitButton.dataset.readyLabel = submitButton.textContent;
  }

  submitButton.disabled = isSubmitting;
  submitButton.setAttribute("aria-busy", String(isSubmitting));
  submitButton.textContent = isSubmitting ? "Loading..." : submitButton.dataset.readyLabel;
}
