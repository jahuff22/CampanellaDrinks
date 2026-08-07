const traitLabels = {
  strength: "Strength",
  sweetness: "Sweet",
  sourness: "Sour",
  bitterness: "Bitter",
  thickness: "Thick",
  rarity: "Rarity"
};

const segmentNames = ["Purist", "Sunseeker", "Hedonist", "Bittersweet", "Adventurer", "Harmonist"];
let menuDrinks = Array.isArray(window.drinks) ? window.drinks : [];

const state = {
  restaurantSlug: getRestaurantSlugFromPath(),
  events: [],
  activeTab: "personas",
  mapXAxis: "bitterness",
  mapYAxis: "sweetness",
  barIngredients: [],
  menuLabComplexity: "simple",
  expandedDrinkIndex: null
};

document.getElementById("refresh-button").addEventListener("click", loadDashboard);
document.getElementById("logout-button").addEventListener("click", logoutDashboard);

for (const button of document.querySelectorAll(".tab-button")) {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
}

document.getElementById("map-x-axis").addEventListener("change", event => {
  state.mapXAxis = event.target.value;
  renderMenuMap(state.events);
});

document.getElementById("map-y-axis").addEventListener("change", event => {
  state.mapYAxis = event.target.value;
  renderMenuMap(state.events);
});
document.getElementById("add-drink-button").addEventListener("click", addDrink);
document.getElementById("save-menu-button").addEventListener("click", saveMenu);
document.getElementById("coordinate-table").addEventListener("input", handleCoordinateInput);
document.getElementById("coordinate-table").addEventListener("change", handleCoordinateInput);
document.getElementById("coordinate-table").addEventListener("click", handleCoordinateClick);
document.getElementById("bar-ingredients-input").addEventListener("input", handleBarIngredientsInput);

for (const button of document.querySelectorAll(".complexity-button")) {
  button.addEventListener("click", () => setMenuLabComplexity(button.dataset.complexity));
}

initializeDashboard();

async function initializeDashboard() {
  const restaurantName = formatSlug(state.restaurantSlug);
  document.getElementById("restaurant-title").textContent = restaurantName || "Restaurant";
  document.getElementById("quiz-link").href = `/${state.restaurantSlug}`;
  initializeMapControls();

  if (typeof loadSavedDrinkSetForActiveRestaurant === "function") {
    await loadSavedDrinkSetForActiveRestaurant();
    menuDrinks = Array.isArray(window.drinks) ? window.drinks : menuDrinks;
  }

  await loadRestaurantMenuSettings();
  renderBarIngredientsInput();

  await loadDashboard();
}

async function loadDashboard() {
  showStatus("Loading dashboard data...");

  try {
    const response = await fetch(`/api/dashboard-data?restaurant=${encodeURIComponent(state.restaurantSlug)}`);
    const data = await response.json();

    if (response.status === 401) {
      window.location.reload();
      return;
    }

    if (!response.ok) throw new Error(data.error || "Dashboard data failed");

    state.events = Array.isArray(data.events) ? data.events : [];
    renderDashboard(data);
    showStatus(`Showing ${state.events.length} PROOF sessions for ${formatSlug(state.restaurantSlug)}. Source: ${data.source}.`);
  } catch (error) {
    state.events = [];
    renderDashboard({ events: [], receiptDataAvailable: false });
    showStatus("Dashboard data is unavailable. Check the read webhook setup or local event file.");
  }
}

async function logoutDashboard() {
  await fetch("/api/dashboard-logout", { method: "POST" });
  window.location.reload();
}

async function loadRestaurantMenuSettings() {
  try {
    const response = await fetch(`/api/menu-data?restaurant=${encodeURIComponent(state.restaurantSlug)}`);
    if (response.status === 401) {
      window.location.reload();
      return;
    }

    const data = await response.json();
    if (!response.ok) return;

    if (Array.isArray(data.drinks) && data.drinks.length) {
      menuDrinks = data.drinks;
      setActiveMenuDrinks(menuDrinks);
    }

    state.barIngredients = Array.isArray(data.barIngredients) && data.barIngredients.length
      ? normalizeIngredientList(data.barIngredients)
      : deriveBarIngredientsFromMenu(menuDrinks);
  } catch (error) {
    state.barIngredients = deriveBarIngredientsFromMenu(menuDrinks);
  }
}

function renderBarIngredientsInput() {
  document.getElementById("bar-ingredients-input").value = state.barIngredients.join("\n");
}

function handleBarIngredientsInput(event) {
  state.barIngredients = parseIngredientInput(event.target.value);
  markMenuDirty();
  renderMenuLab(state.events);
}

function setMenuLabComplexity(complexity) {
  if (!["simple", "standard", "advanced"].includes(complexity)) return;

  state.menuLabComplexity = complexity;

  for (const button of document.querySelectorAll(".complexity-button")) {
    button.classList.toggle("is-active", button.dataset.complexity === complexity);
  }

  renderMenuLab(state.events);
}

function renderDashboard(data) {
  const events = state.events;
  const tables = new Set(events.map(event => event.table?.slug).filter(Boolean));
  const segmentCounts = countSegments(events);
  const topSegment = getTopEntry(segmentCounts);

  document.getElementById("total-events").textContent = events.length;
  document.getElementById("total-tables").textContent = tables.size;
  document.getElementById("coverage-rate").textContent = `${calculateCoverage(events)}%`;
  document.getElementById("top-segment").textContent = topSegment ? topSegment[0].toUpperCase() : "NONE";

  renderReceiptSection(events, Boolean(data.receiptDataAvailable));
  renderPersonas(events, segmentCounts);
  renderMenuMap(events);
  renderPerDrink(events);
  renderCoordinates();
  renderMenuLab(events);
}

function setActiveTab(tabId) {
  state.activeTab = tabId;

  for (const button of document.querySelectorAll(".tab-button")) {
    button.classList.toggle("is-active", button.dataset.tab === tabId);
  }

  for (const panel of document.querySelectorAll(".tab-panel")) {
    panel.classList.toggle("is-active", panel.id === tabId);
  }
}

function getRestaurantSlugFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts[0] === "dashboard" && parts[1]) return sanitizeSlug(parts[1]);
  if (parts[1] === "dashboard" && parts[0]) return sanitizeSlug(parts[0]);
  return "unassigned";
}

function sanitizeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatSlug(slug) {
  return String(slug || "Restaurant")
    .split(/[-_]/g)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function showStatus(message) {
  const statusPanel = document.getElementById("status-panel");
  statusPanel.textContent = message;
  statusPanel.hidden = false;
}

function initializeMapControls() {
  const options = Object.entries(traitLabels)
    .map(([trait, label]) => `<option value="${trait}">${escapeHtml(label)}</option>`)
    .join("");

  const xAxis = document.getElementById("map-x-axis");
  const yAxis = document.getElementById("map-y-axis");
  xAxis.innerHTML = options;
  yAxis.innerHTML = options;
  xAxis.value = state.mapXAxis;
  yAxis.value = state.mapYAxis;
}

function countSegments(events) {
  const counts = {};
  for (const event of events) {
    const segment = inferEventSegment(event);
    counts[segment] = (counts[segment] || 0) + 1;
  }
  return counts;
}

function inferEventSegment(event) {
  const categories = (event.recommendations || [])
    .slice(0, 3)
    .flatMap(recommendation => Array.isArray(recommendation.category) ? recommendation.category : [recommendation.category])
    .filter(Boolean);

  const counts = categories.reduce((totals, category) => {
    totals[category] = (totals[category] || 0) + 1;
    return totals;
  }, {});

  return Object.keys(counts).find(category => counts[category] >= 2) || categories[0] || "Harmonist";
}

function calculateCoverage(events) {
  if (!events.length) return 0;
  const covered = events.filter(event => {
    const topMatch = parseMatchPercent(event.recommendations?.[0]?.matchPercentage);
    return topMatch >= 75;
  }).length;
  return Math.round((covered / events.length) * 100);
}

function renderReceiptSection(events, receiptDataAvailable) {
  const container = document.getElementById("receipt-content");
  const proofChecks = events
    .filter(event => event.pos?.usedProof === true || event.pos?.usedProof === undefined)
    .map(event => event.pos?.drinkSubtotal)
    .filter(value => Number.isFinite(Number(value)))
    .map(Number);
  const nonProofChecks = events
    .filter(event => event.pos?.usedProof === false)
    .map(event => event.pos?.drinkSubtotal)
    .filter(value => Number.isFinite(Number(value)))
    .map(Number);

  if (!receiptDataAvailable || (!proofChecks.length && !nonProofChecks.length)) {
    container.innerHTML = `<div class="no-data">NO RECEIPT DATA</div>`;
    return;
  }

  const proofAverage = proofChecks.length ? average(proofChecks) : null;
  const nonProofAverage = nonProofChecks.length ? average(nonProofChecks) : null;
  const lift = proofAverage !== null && nonProofAverage !== null ? proofAverage - nonProofAverage : null;

  container.innerHTML = `
    <div class="spend-grid">
      <article class="spend-metric">
        <span>PROOF tables</span>
        <strong>${proofAverage === null ? "NO DATA" : formatMoney(proofAverage)}</strong>
      </article>
      <article class="spend-metric">
        <span>Non-PROOF tables</span>
        <strong>${nonProofAverage === null ? "NO RECEIPT DATA" : formatMoney(nonProofAverage)}</strong>
      </article>
      <article class="spend-metric">
        <span>Linked checks</span>
        <strong>${proofChecks.length + nonProofChecks.length}</strong>
      </article>
      <article class="spend-metric">
        <span>Difference</span>
        <strong>${lift === null ? "NO RECEIPT DATA" : formatSignedMoney(lift)}</strong>
      </article>
    </div>
  `;
}

function renderPersonas(events, segmentCounts) {
  const container = document.getElementById("persona-list");
  const maxCount = Math.max(...Object.values(segmentCounts), 1);
  const gapsBySegment = findMenuGaps(events).reduce((lookup, gap) => {
    if (gap.segment) lookup[gap.segment] = gap;
    return lookup;
  }, {});

  if (!events.length) {
    container.innerHTML = `<p class="empty-note">No drink sessions yet.</p>`;
    return;
  }

  container.innerHTML = segmentNames.map(segment => {
    const count = segmentCounts[segment] || 0;
    const percent = Math.round((count / events.length) * 100);
    const gap = gapsBySegment[segment];
    const note = gap
      ? `<span class="gap-text">Your menu has limited coverage</span>`
      : getPersonaNote(segment);

    return `
      <article class="persona-row">
        <div class="persona-name">The ${escapeHtml(segment)}</div>
        <div class="persona-track"><span class="persona-fill" style="width:${Math.max((count / maxCount) * 100, count ? 4 : 0)}%"></span></div>
        <div class="persona-note">${note}</div>
        <div class="persona-percent">${percent}%</div>
      </article>
    `;
  }).join("");
}

function getPersonaNote(segment) {
  const examples = {
    Purist: "Usually shown / Old Fashioned",
    Sunseeker: "Usually shown / Margarita",
    Hedonist: "Usually shown / Espresso Martini",
    Bittersweet: "Usually shown / Negroni",
    Adventurer: "Usually shown / Last Word",
    Harmonist: "Usually shown / Vodka Soda"
  };
  return escapeHtml(examples[segment] || "Covered by current menu");
}

function renderMenuMap(events) {
  const plot = document.getElementById("menu-map-plot");
  const xAxis = state.mapXAxis;
  const yAxis = state.mapYAxis;
  const xLabel = traitLabels[xAxis] || "X";
  const yLabel = traitLabels[yAxis] || "Y";
  const guestPoints = events
    .map((event, index) => {
      const preferences = event.guestInput?.sliderPreferences || {};
      const x = Number(preferences[xAxis]);
      const y = Number(preferences[yAxis]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      return {
        label: `${event.table?.label || event.table?.slug || "Guest"} / ${xLabel} ${x}, ${yLabel} ${y}`,
        x: normalizeScore(x),
        y: normalizeScore(y),
        type: "guest",
        index
      };
    })
    .filter(Boolean);

  const drinkPoints = menuDrinks.map(drink => ({
    label: drink.name,
    x: normalizeScore(drink.scores?.[xAxis]),
    y: normalizeScore(drink.scores?.[yAxis]),
    type: "drink"
  }));

  plot.innerHTML = `
    <span class="axis-label axis-left">LESS ${escapeHtml(xLabel).toUpperCase()}</span>
    <span class="axis-label axis-right">MORE ${escapeHtml(xLabel).toUpperCase()}</span>
    <span class="axis-label axis-top">MORE ${escapeHtml(yLabel).toUpperCase()}</span>
    <span class="axis-label axis-bottom">LESS ${escapeHtml(yLabel).toUpperCase()}</span>
    ${drinkPoints.map(point => renderPoint(point)).join("")}
    ${guestPoints.map(point => renderPoint(point)).join("")}
  `;

  renderMapSummary(guestPoints, drinkPoints, xLabel, yLabel);
}

function renderPoint(point) {
  const left = clamp(point.x, 4, 96);
  const top = clamp(100 - point.y, 4, 96);
  return `<i class="map-point ${point.type}" title="${escapeHtml(point.label)}" style="left:${left}%;top:${top}%"></i>`;
}

function renderMapSummary(guestPoints, drinkPoints, xLabel, yLabel) {
  const container = document.getElementById("map-gaps");
  const guestSummary = summarizePointCloud(guestPoints);
  const drinkSummary = summarizePointCloud(drinkPoints);
  container.innerHTML = `
    <article class="callout">
      <strong>${guestPoints.length} guests plotted</strong>
      <span>White dots use each guest's ${escapeHtml(xLabel)} and ${escapeHtml(yLabel)} slider answers.</span>
    </article>
    <article class="callout">
      <strong>${drinkPoints.length} drinks plotted</strong>
      <span>Gold diamonds use the menu score for those same two axes.</span>
    </article>
    <article class="callout">
      <strong>Current center</strong>
      <span>Guests: ${guestSummary}. Drinks: ${drinkSummary}.</span>
    </article>
  `;
}

function renderPerDrink(events) {
  const tbody = document.getElementById("drink-performance");
  const stats = calculateDrinkPerformance(events);

  if (!stats.length) {
    tbody.innerHTML = `<tr><td colspan="6">No recommendations yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = stats.slice(0, 14).map(row => `
    <tr>
      <td><span class="drink-name">${escapeHtml(row.name)}</span></td>
      <td>${escapeHtml(row.liquor || "")}</td>
      <td>${row.shown}</td>
      <td>${row.averageMatch}%</td>
      <td>${row.orders === null ? "NO RECEIPT DATA" : row.orders}</td>
      <td><span class="pill ${row.actionClass}">${row.action}</span></td>
    </tr>
  `).join("");
}

function calculateDrinkPerformance(events) {
  const stats = new Map();

  for (const event of events) {
    const orderedNames = new Set((event.pos?.orderedDrinks || []).map(item => sanitizeName(item.name || item)));
    for (const recommendation of event.recommendations || []) {
      const name = recommendation.name;
      if (!name) continue;
      const key = sanitizeName(name);
      const existing = stats.get(key) || {
        name,
        liquor: recommendation.liquor,
        shown: 0,
        matches: [],
        orders: 0,
        hasReceiptOrderData: false
      };
      existing.shown += 1;
      existing.matches.push(parseMatchPercent(recommendation.matchPercentage));
      if (Array.isArray(event.pos?.orderedDrinks)) {
        existing.hasReceiptOrderData = true;
        if (orderedNames.has(key)) existing.orders += 1;
      }
      stats.set(key, existing);
    }
  }

  return [...stats.values()]
    .map(row => {
      const averageMatch = Math.round(average(row.matches.filter(Number.isFinite)) || 0);
      const orders = row.hasReceiptOrderData ? row.orders : null;
      const action = getDrinkAction(row.shown, orders, averageMatch);
      return { ...row, averageMatch, orders, ...action };
    })
    .sort((a, b) => b.shown - a.shown || b.averageMatch - a.averageMatch);
}

function getDrinkAction(shown, orders, averageMatch) {
  if (orders === null) {
    if (shown >= 3 && averageMatch >= 75) return { action: "WATCH", actionClass: "watch" };
    return { action: "LEARN", actionClass: "watch" };
  }
  if (shown >= 3 && orders / shown >= 0.35) return { action: "KEEP", actionClass: "keep" };
  if (shown >= 3 && averageMatch >= 75 && orders / shown < 0.2) return { action: "FIX", actionClass: "fix" };
  return { action: "WATCH", actionClass: "watch" };
}

function renderCoordinates() {
  const tbody = document.getElementById("coordinate-table");
  tbody.innerHTML = menuDrinks.map((drink, drinkIndex) => `
    <tr>
      <td>
        <input class="coordinate-text-input" data-drink-index="${drinkIndex}" data-field="name" value="${escapeAttribute(drink.name)}" aria-label="Drink name">
      </td>
      <td>
        <input class="coordinate-text-input" data-drink-index="${drinkIndex}" data-field="type" value="${escapeAttribute(drink.type || drink.liquor || "")}" aria-label="Drink type">
      </td>
      <td>
        <input class="coordinate-text-input" data-drink-index="${drinkIndex}" data-field="category" value="${escapeAttribute(getCategoryText(drink))}" aria-label="Drink personas">
      </td>
      ${Object.keys(traitLabels).map(trait => renderScoreCell(drinkIndex, trait, drink.scores?.[trait])).join("")}
      <td>
        <button class="drink-info-button" type="button" data-drink-index="${drinkIndex}" aria-expanded="${state.expandedDrinkIndex === drinkIndex}" aria-label="Edit ${escapeAttribute(drink.name)} details">i</button>
        <button class="remove-drink-button" type="button" data-drink-index="${drinkIndex}">Remove</button>
      </td>
    </tr>
    ${state.expandedDrinkIndex === drinkIndex ? renderDrinkDetailRow(drink, drinkIndex) : ""}
  `).join("");
}

function renderDrinkDetailRow(drink, drinkIndex) {
  return `
    <tr class="drink-detail-row">
      <td colspan="10">
        <div class="drink-detail-editor">
          <label>
            <span>Description</span>
            <textarea data-drink-index="${drinkIndex}" data-field="description" rows="3">${escapeHtml(drink.description || "")}</textarea>
          </label>
          <label>
            <span>Ingredients</span>
            <textarea data-drink-index="${drinkIndex}" data-field="ingredients" rows="3">${escapeHtml(drink.ingredients || "")}</textarea>
          </label>
          <label>
            <span>Process</span>
            <textarea data-drink-index="${drinkIndex}" data-field="process" rows="3">${escapeHtml(drink.process || "")}</textarea>
          </label>
          <label>
            <span>Recipe</span>
            <textarea data-drink-index="${drinkIndex}" data-field="recipe" rows="3">${escapeHtml(drink.recipe || "")}</textarea>
          </label>
          <label>
            <span>Segment</span>
            <input data-drink-index="${drinkIndex}" data-field="category" value="${escapeAttribute(getCategoryText(drink))}">
          </label>
          <label>
            <span>Complexity</span>
            <select data-drink-index="${drinkIndex}" data-field="complexity">
              ${["", "Accessible", "Craft", "Expert"].map(value => `
                <option value="${escapeAttribute(value)}" ${String(drink.complexity || "") === value ? "selected" : ""}>${value || "None"}</option>
              `).join("")}
            </select>
          </label>
          <label>
            <span>Base / Type</span>
            <input data-drink-index="${drinkIndex}" data-field="type" value="${escapeAttribute(drink.type || drink.liquor || "")}">
          </label>
          <label>
            <span>Masculinity</span>
            <input type="number" min="0" max="1" step="1" data-drink-index="${drinkIndex}" data-score="masculinity" value="${Number(drink.scores?.masculinity) || 0}">
          </label>
          <label>
            <span>Calories</span>
            <input type="number" min="1" max="7" step="1" data-drink-index="${drinkIndex}" data-score="calories" value="${Number(drink.scores?.calories) || 4}">
          </label>
        </div>
      </td>
    </tr>
  `;
}

function renderScoreCell(drinkIndex, trait, value) {
  const numberValue = Number(value) || 0;
  return `
    <td class="score-cell">
      <input
        class="coordinate-score-input"
        type="number"
        min="1"
        max="7"
        step="1"
        value="${numberValue}"
        data-drink-index="${drinkIndex}"
        data-score="${trait}"
        aria-label="${traitLabels[trait]} score"
      >
      <span class="score-bar"><i style="width:${normalizeScore(numberValue)}%"></i></span>
    </td>
  `;
}

function handleCoordinateInput(event) {
  const input = event.target;
  const drinkIndex = Number(input.dataset.drinkIndex);
  const drink = menuDrinks[drinkIndex];
  if (!drink) return;

  if (input.dataset.score) {
    const score = input.dataset.score;
    const min = score === "masculinity" ? 0 : 1;
    const max = score === "masculinity" ? 1 : 7;
    const value = clamp(Math.round(Number(input.value) || min), min, max);
    input.value = value;
    drink.scores = drink.scores || {};
    drink.scores[score] = value;
    const bar = input.parentElement.querySelector(".score-bar i");
    if (bar) bar.style.width = `${normalizeScore(value)}%`;
  } else if (input.dataset.field === "name") {
    drink.name = input.value.trim() || "Untitled Drink";
  } else if (input.dataset.field === "type") {
    drink.type = input.value.trim();
    drink.liquor = drink.type;
  } else if (input.dataset.field === "category") {
    drink.category = parseCategoryInput(input.value);
  } else if (input.dataset.field === "description") {
    drink.description = input.value.trim();
  } else if (input.dataset.field === "ingredients") {
    drink.ingredients = input.value.trim();
    drink.customIngredients = parseIngredientInput(input.value);
    state.barIngredients = mergeIngredientLists(state.barIngredients, drink.customIngredients);
    renderBarIngredientsInput();
  } else if (input.dataset.field === "process") {
    drink.process = input.value.trim();
  } else if (input.dataset.field === "recipe") {
    drink.recipe = input.value.trim();
  } else if (input.dataset.field === "complexity") {
    drink.complexity = input.value;
  }

  markMenuDirty();
  renderMenuMap(state.events);
  renderMenuLab(state.events);
}

function handleCoordinateClick(event) {
  const infoButton = event.target.closest(".drink-info-button");
  if (infoButton) {
    const drinkIndex = Number(infoButton.dataset.drinkIndex);
    state.expandedDrinkIndex = state.expandedDrinkIndex === drinkIndex ? null : drinkIndex;
    renderCoordinates();
    return;
  }

  const button = event.target.closest(".remove-drink-button");
  if (!button) return;

  const drinkIndex = Number(button.dataset.drinkIndex);
  if (!menuDrinks[drinkIndex]) return;

  menuDrinks.splice(drinkIndex, 1);
  if (state.expandedDrinkIndex === drinkIndex) {
    state.expandedDrinkIndex = null;
  } else if (state.expandedDrinkIndex > drinkIndex) {
    state.expandedDrinkIndex -= 1;
  }
  setActiveMenuDrinks(menuDrinks);
  markMenuDirty();
  renderCoordinates();
  renderMenuMap(state.events);
  renderMenuLab(state.events);
  renderPerDrink(state.events);
}

function addDrink() {
  const newDrinkIndex = menuDrinks.length;
  menuDrinks.push({
    name: `New Drink ${newDrinkIndex + 1}`,
    liquor: "Custom",
    type: "Custom",
    category: ["Harmonist"],
    scores: {
      strength: 4,
      sweetness: 4,
      sourness: 4,
      bitterness: 4,
      thickness: 4,
      rarity: 4,
      masculinity: 0,
      calories: 4
    },
    description: "Custom drink added from the dashboard.",
    ingredients: "",
    process: "",
    recipe: "",
    complexity: "Accessible"
  });

  setActiveMenuDrinks(menuDrinks);
  state.expandedDrinkIndex = newDrinkIndex;
  markMenuDirty();
  renderCoordinates();
  renderMenuMap(state.events);
  renderMenuLab(state.events);
  const newInput = document.querySelector(`[data-drink-index="${newDrinkIndex}"][data-field="name"]`);
  if (newInput) {
    newInput.focus();
    newInput.select();
  }
}

async function saveMenu() {
  const status = document.getElementById("menu-save-status");
  status.textContent = "Saving...";

  try {
    const response = await fetch("/api/menu-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        restaurantSlug: state.restaurantSlug,
        drinks: menuDrinks,
        barIngredients: state.barIngredients
      })
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Menu save failed");

    menuDrinks = data.drinks;
    state.barIngredients = Array.isArray(data.barIngredients) && data.barIngredients.length
      ? normalizeIngredientList(data.barIngredients)
      : deriveBarIngredientsFromMenu(menuDrinks);
    setActiveMenuDrinks(menuDrinks);
    renderBarIngredientsInput();
    renderCoordinates();
    renderMenuMap(state.events);
    renderMenuLab(state.events);
    status.textContent = `Saved. Source: ${data.storage.provider}.`;
  } catch (error) {
    status.textContent = "Save failed.";
  }
}

function setActiveMenuDrinks(nextDrinks) {
  menuDrinks = nextDrinks;
  if (typeof setActiveDrinkSet === "function") {
    setActiveDrinkSet(menuDrinks);
  } else {
    window.drinks = menuDrinks;
  }
}

function markMenuDirty() {
  document.getElementById("menu-save-status").textContent = "Unsaved changes.";
}

function getCategoryText(drink) {
  return Array.isArray(drink.category) ? drink.category.join(", ") : String(drink.category || "");
}

function parseCategoryInput(value) {
  const allowed = ["Purist", "Sunseeker", "Hedonist", "Bittersweet", "Adventurer", "Harmonist"];
  const normalizedParts = String(value || "")
    .split(/[,/]/g)
    .map(part => part.trim().toLowerCase())
    .filter(Boolean);
  const categories = allowed.filter(persona => normalizedParts.includes(persona.toLowerCase()));
  return categories.length ? categories : ["Harmonist"];
}

function renderMenuLab(events) {
  const container = document.getElementById("menu-lab-list");
  const gaps = findMenuGaps(events);
  const inventory = state.barIngredients;

  if (!inventory.length) {
    container.innerHTML = `<p class="empty-note">Add bar ingredients to generate Menu Lab recommendations.</p>`;
    return;
  }

  const recommendations = gaps
    .map(gap => ({ ...gap, labRecipe: findCustomCocktailForGap(gap, inventory) }))
    .filter(gap => gap.labRecipe);

  if (!recommendations.length) {
    container.innerHTML = `<p class="empty-note">No in-inventory Menu Lab recommendations at this complexity. Add ingredients or raise the complexity setting.</p>`;
    return;
  }

  container.innerHTML = recommendations.slice(0, 6).map(gap => `
    <article class="lab-card">
      <div class="lab-title">${escapeHtml(gap.shortTitle)}</div>
      <p>${escapeHtml(gap.brief)}</p>
      <p class="lab-ingredients"><strong>${escapeHtml(gap.labRecipe.name)}</strong><br>${escapeHtml(gap.labRecipe.ingredients.join(", "))}</p>
      <p>${escapeHtml(gap.labRecipe.process)}</p>
      <p class="lab-complexity-note">${escapeHtml(gap.labRecipe.complexityLabel)} complexity. Uses only saved bar ingredients. Match distance: ${gap.labRecipe.distance.toFixed(1)}.</p>
    </article>
  `).join("");
}

function findMenuGaps(events) {
  const groups = {};

  for (const event of events) {
    const profile = getDemandProfile(event);
    if (!profile) continue;
    if (!groups[profile.key]) {
      groups[profile.key] = { ...profile, count: 0, totals: {}, segmentCounts: {} };
    }
    groups[profile.key].count += 1;

    for (const trait of Object.keys(traitLabels)) {
      groups[profile.key].totals[trait] = (groups[profile.key].totals[trait] || 0) + Number(event.guestInput?.sliderPreferences?.[trait] || 0);
    }

    const segment = inferEventSegment(event);
    groups[profile.key].segmentCounts[segment] = (groups[profile.key].segmentCounts[segment] || 0) + 1;
  }

  return Object.values(groups)
    .map(group => {
      const averageScores = {};
      for (const trait of Object.keys(traitLabels)) {
        averageScores[trait] = group.totals[trait] / group.count;
      }
      const matches = countMenuMatches(averageScores);
      const topSegment = getTopEntry(group.segmentCounts);
      return {
        ...group,
        average: averageScores,
        menuMatches: matches,
        segment: topSegment ? topSegment[0] : null
      };
    })
    .filter(group => group.menuMatches <= 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map(group => ({
      ...group,
      shortTitle: buildGapShortTitle(group),
      note: `${group.count} sessions. ${group.menuMatches} close menu matches found from the current drink list.`,
      brief: buildLabBrief(group)
    }));
}

function getDemandProfile(event) {
  const preferences = event.guestInput?.sliderPreferences || {};
  const highTraits = [];
  const lowTraits = [];

  for (const trait of Object.keys(traitLabels)) {
    const value = Number(preferences[trait]);
    if (!Number.isFinite(value)) continue;
    if (value >= 6) highTraits.push(trait);
    if (value <= 2) lowTraits.push(trait);
  }

  const interestingTraits = [...highTraits.map(trait => `high:${trait}`), ...lowTraits.map(trait => `low:${trait}`)];
  if (interestingTraits.length < 2) return null;

  return {
    key: interestingTraits.sort().join("|"),
    highTraits,
    lowTraits
  };
}

function countMenuMatches(averageScores) {
  return menuDrinks.filter(drink => {
    const distance = Object.keys(traitLabels).reduce((sum, trait) => {
      return sum + Math.abs(Number(drink.scores?.[trait] || 0) - Number(averageScores[trait] || 0));
    }, 0);
    return distance <= 7;
  }).length;
}

function buildGapShortTitle(group) {
  const high = group.highTraits.map(trait => traitLabels[trait]).slice(0, 2);
  const low = group.lowTraits.map(trait => `low ${traitLabels[trait].toLowerCase()}`).slice(0, 2);
  return [...high, ...low].join(" + ") || "Underserved palate";
}

function buildLabBrief(group) {
  const traits = buildGapShortTitle(group).toLowerCase();
  return `A drink for guests asking for ${traits}. The current menu is not giving this cluster a strong match.`;
}

function findCustomCocktailForGap(group, inventory) {
  const customDrinks = getCustomCocktailPool();
  const maxComplexity = getMenuLabMaxComplexity();
  const candidates = customDrinks
    .filter(drink => getDrinkComplexityRank(drink) <= maxComplexity)
    .map(drink => ({
      drink,
      ingredients: getDrinkIngredientList(drink),
      distance: calculateDrinkGapDistance(drink, group.average)
    }))
    .filter(candidate => candidate.ingredients.length && candidate.ingredients.every(ingredient => inventoryHasIngredient(inventory, ingredient)))
    .sort((a, b) => a.distance - b.distance);

  return candidates[0] ? buildLabRecipeFromCandidate(candidates[0]) : null;
}

function buildLabRecipeFromCandidate(candidate) {
  return {
    name: candidate.drink.name,
    ingredients: candidate.ingredients,
    process: candidate.drink.process || candidate.drink.description || "",
    complexityLabel: candidate.drink.complexity || "Accessible",
    distance: candidate.distance
  };
}

function getCustomCocktailPool() {
  return Array.isArray(window.restaurantDrinkSets?.custom) ? window.restaurantDrinkSets.custom : [];
}

function getMenuLabMaxComplexity() {
  const rankBySetting = {
    simple: 1,
    standard: 2,
    advanced: 3
  };
  return rankBySetting[state.menuLabComplexity] || rankBySetting.simple;
}

function getDrinkComplexityRank(drink) {
  const normalized = String(drink.complexity || "").toLowerCase();
  if (normalized === "accessible") return 1;
  if (normalized === "craft") return 2;
  if (normalized === "expert") return 3;
  return 2;
}

function getDrinkIngredientList(drink) {
  if (Array.isArray(drink.customIngredients) && drink.customIngredients.length) {
    return normalizeIngredientList(drink.customIngredients);
  }

  return normalizeIngredientList(splitIngredientText(drink.recipe || drink.ingredients));
}

function calculateDrinkGapDistance(drink, averageScores) {
  return Object.keys(traitLabels).reduce((sum, trait) => {
    return sum + Math.abs(Number(drink.scores?.[trait] || 0) - Number(averageScores[trait] || 0));
  }, 0);
}

function inventoryHasIngredient(inventory, ingredient) {
  const normalizedIngredient = normalizeIngredientName(ingredient);
  if (!normalizedIngredient) return false;

  return inventory.some(item => {
    const normalizedItem = normalizeIngredientName(item);
    return normalizedItem === normalizedIngredient ||
      normalizedItem.includes(normalizedIngredient) ||
      normalizedIngredient.includes(normalizedItem);
  });
}

function deriveBarIngredientsFromMenu(drinks) {
  return normalizeIngredientList(
    drinks.flatMap(drink => splitIngredientText(drink.ingredients))
  );
}

function parseIngredientInput(value) {
  return normalizeIngredientList(splitIngredientText(value));
}

function normalizeIngredientList(ingredients) {
  return [...new Set((ingredients || [])
    .map(cleanIngredientName)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b)))];
}

function mergeIngredientLists(...ingredientLists) {
  return normalizeIngredientList(ingredientLists.flat());
}

function splitIngredientText(value) {
  return String(value || "")
    .split(/\r?\n|,|;|\band\b|\bor\b/gi)
    .map(cleanIngredientName)
    .filter(Boolean);
}

function cleanIngredientName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/\btop with\b/g, "")
    .replace(/\b(optional|fresh|grated|slice|wedge|wheel|twist|leaves|cube|crushed|rinse|rim)\b/g, "")
    .replace(/\b\d+(?:\.\d+)?\s*(?:\/\s*\d+)?\s*(?:oz|ml|g|tsp|tbsp|barspoons?|barspoon|dashes|dash|drops|drop|pinch|slices?|wedges?|cups?|cup|bottle|gallon)\b/g, "")
    .replace(/\b\d+\s*\/\s*\d+\s*(?:oz|ml|g|tsp|tbsp|barspoons?|barspoon|dashes|dash|drops|drop|pinch|slices?|wedges?|cups?|cup)?\b/g, "")
    .replace(/\b\d+(?:\.\d+)?\b/g, "")
    .replace(/\s+/g, " ")
    .replace(/^\s+|\s+$/g, "");
}

function normalizeIngredientName(value) {
  return cleanIngredientName(value).replace(/[^a-z0-9]+/g, " ").trim();
}

function segmentCoordinate(segment) {
  const coordinates = {
    Purist: { x: 24, y: 24 },
    Sunseeker: { x: 67, y: 32 },
    Hedonist: { x: 34, y: 54 },
    Bittersweet: { x: 20, y: 48 },
    Adventurer: { x: 64, y: 82 },
    Harmonist: { x: 18, y: 14 }
  };
  return coordinates[segment] || { x: 50, y: 50 };
}

function normalizeScore(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 0;
  return ((numberValue - 1) / 6) * 100;
}

function summarizePointCloud(points) {
  if (!points.length) return "no data";
  const averageX = average(points.map(point => point.x));
  const averageY = average(points.map(point => point.y));
  return `${denormalizeScore(averageX).toFixed(1)}, ${denormalizeScore(averageY).toFixed(1)}`;
}

function denormalizeScore(value) {
  return (Number(value) / 100) * 6 + 1;
}

function parseMatchPercent(value) {
  const parsed = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getTopEntry(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || null;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + Number(value), 0) / values.length;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function formatSignedMoney(value) {
  const formatted = formatMoney(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

function sanitizeName(value) {
  return String(value || "").trim().toLowerCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
