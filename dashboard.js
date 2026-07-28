const traitLabels = {
  strength: "Strength",
  sweetness: "Sweet",
  sourness: "Sour",
  bitterness: "Bitter",
  thickness: "Body",
  rarity: "Rarity"
};

const segmentNames = ["Purist", "Sunseeker", "Hedonist", "Bittersweet", "Adventurer", "Harmonist"];
const menuDrinks = Array.isArray(window.drinks) ? window.drinks : [];

const state = {
  restaurantSlug: getRestaurantSlugFromPath(),
  events: [],
  activeTab: "personas"
};

document.getElementById("refresh-button").addEventListener("click", loadDashboard);

for (const button of document.querySelectorAll(".tab-button")) {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
}

initializeDashboard();

async function initializeDashboard() {
  const restaurantName = formatSlug(state.restaurantSlug);
  document.getElementById("restaurant-title").textContent = restaurantName || "Restaurant";
  document.getElementById("quiz-link").href = `/r/${state.restaurantSlug}`;
  await loadDashboard();
}

async function loadDashboard() {
  showStatus("Loading dashboard data...");

  try {
    const response = await fetch(`/api/dashboard-data?restaurant=${encodeURIComponent(state.restaurantSlug)}`);
    const data = await response.json();

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
  const gaps = findMenuGaps(events);
  const guestPoints = Object.entries(countSegments(events)).map(([segment, count]) => ({
    label: segment,
    count,
    ...segmentCoordinate(segment)
  }));

  const drinkPoints = menuDrinks.map(drink => ({
    label: drink.name,
    x: normalizeScore(drink.scores?.sourness),
    y: normalizeScore(drink.scores?.rarity),
    type: "drink"
  }));

  const gapPoints = gaps.slice(0, 4).map(gap => ({
    label: gap.shortTitle,
    x: normalizeScore(gap.average.sourness),
    y: normalizeScore(gap.average.rarity),
    type: "gap"
  }));

  plot.innerHTML = `
    <span class="axis-label axis-left">LESS SOUR</span>
    <span class="axis-label axis-right">MORE SOUR</span>
    <span class="axis-label axis-top">MORE ADVENTUROUS</span>
    ${drinkPoints.map(point => renderPoint(point)).join("")}
    ${guestPoints.map(point => renderPoint({ ...point, type: "guest" })).join("")}
    ${gapPoints.map(point => renderPoint(point)).join("")}
  `;

  renderMapGaps(gaps);
}

function renderPoint(point) {
  const left = clamp(point.x, 4, 96);
  const top = clamp(100 - point.y, 4, 96);
  const label = point.type === "drink" ? "" : `<span>${escapeHtml(point.label)}</span>`;
  return `<i class="map-point ${point.type}" style="left:${left}%;top:${top}%">${label}</i>`;
}

function renderMapGaps(gaps) {
  const container = document.getElementById("map-gaps");

  if (!gaps.length) {
    container.innerHTML = `<p class="empty-note">No obvious map gaps yet.</p>`;
    return;
  }

  container.innerHTML = gaps.slice(0, 4).map(gap => `
    <article class="callout">
      <strong>${escapeHtml(gap.shortTitle)}</strong>
      <span>${escapeHtml(gap.note)}</span>
    </article>
  `).join("");
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
  tbody.innerHTML = menuDrinks.map(drink => `
    <tr>
      <td><span class="drink-name">${escapeHtml(drink.name)}</span></td>
      ${Object.keys(traitLabels).map(trait => renderScoreCell(drink.scores?.[trait])).join("")}
    </tr>
  `).join("");
}

function renderScoreCell(value) {
  const numberValue = Number(value) || 0;
  return `
    <td class="score-cell">
      ${numberValue}
      <span class="score-bar"><i style="width:${normalizeScore(numberValue)}%"></i></span>
    </td>
  `;
}

function renderMenuLab(events) {
  const container = document.getElementById("menu-lab-list");
  const gaps = findMenuGaps(events);

  if (!gaps.length) {
    container.innerHTML = `<p class="empty-note">No Menu Lab gaps yet. More sessions will make this sharper.</p>`;
    return;
  }

  container.innerHTML = gaps.slice(0, 6).map(gap => `
    <article class="lab-card">
      <div class="lab-title">${escapeHtml(gap.shortTitle)}</div>
      <p>${escapeHtml(gap.brief)}</p>
      <p class="lab-ingredients">${escapeHtml(gap.ingredients)}</p>
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
      brief: buildLabBrief(group),
      ingredients: buildLabIngredients(group)
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

function buildLabIngredients(group) {
  if (group.highTraits.includes("bitterness") && group.highTraits.includes("sourness")) {
    return "Starting point: amaro or bitter aperitivo, fresh citrus, restrained sweetener.";
  }
  if (group.highTraits.includes("thickness")) {
    return "Starting point: egg white, cream, coconut, or clarified texture with a balancing acid.";
  }
  if (group.highTraits.includes("rarity")) {
    return "Starting point: familiar base spirit with one unexpected modifier or technique.";
  }
  if (group.lowTraits.includes("sweetness")) {
    return "Starting point: dry build, citrus or vermouth structure, minimal syrup.";
  }
  return "Starting point: use the gap profile as a beverage-team brief, then score the proposed recipe.";
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
