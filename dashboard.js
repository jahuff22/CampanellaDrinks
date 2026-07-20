const traitLabels = {
  strength: "Strong",
  sweetness: "Sweet",
  sourness: "Sour",
  bitterness: "Bitter",
  thickness: "Rich Body",
  rarity: "Adventurous"
};

const segmentNames = ["Purist", "Sunseeker", "Hedonist", "Bittersweet", "Adventurer", "Easy going"];

const state = {
  restaurantSlug: getRestaurantSlugFromPath(),
  events: []
};

document.getElementById("refresh-button").addEventListener("click", loadDashboard);

initializeDashboard();

async function initializeDashboard() {
  const restaurantName = formatSlug(state.restaurantSlug);
  document.getElementById("restaurant-title").textContent = `${restaurantName} Dashboard`;
  document.getElementById("quiz-link").href = `/r/${state.restaurantSlug}`;
  await loadDashboard();
}

async function loadDashboard() {
  showStatus("Loading dashboard data...");

  try {
    const response = await fetch(`/api/dashboard-data?restaurant=${encodeURIComponent(state.restaurantSlug)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Dashboard data failed");
    }

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
  const preferenceAverages = calculatePreferenceAverages(events);
  const topSegment = getTopEntry(segmentCounts);
  const topPreference = getTopPreference(preferenceAverages);

  document.getElementById("total-events").textContent = events.length;
  document.getElementById("total-tables").textContent = tables.size;
  document.getElementById("top-segment").textContent = topSegment ? topSegment[0] : "None";
  document.getElementById("top-preference").textContent = topPreference ? topPreference.label : "None";

  renderReceiptSection(events, Boolean(data.receiptDataAvailable));
  renderBars("preference-bars", preferenceAverages.map(item => ({
    label: item.label,
    value: item.average,
    display: item.average ? item.average.toFixed(1) : "0.0",
    max: 7
  })));
  renderBars("segment-bars", segmentNames.map(segment => ({
    label: segment,
    value: segmentCounts[segment] || 0,
    display: String(segmentCounts[segment] || 0),
    max: Math.max(...Object.values(segmentCounts), 1)
  })));
  renderGaps(events);
  renderRecentEvents(events);
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

  return Object.keys(counts).find(category => counts[category] >= 2) || categories[0] || "Easy going";
}

function calculatePreferenceAverages(events) {
  return Object.keys(traitLabels).map(trait => {
    const values = events
      .map(event => Number(event.guestInput?.sliderPreferences?.[trait]))
      .filter(value => Number.isFinite(value));

    const average = values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0;

    return {
      trait,
      label: traitLabels[trait],
      average
    };
  });
}

function getTopEntry(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || null;
}

function getTopPreference(preferences) {
  return preferences
    .filter(item => item.average > 0)
    .sort((a, b) => b.average - a.average)[0] || null;
}

function renderReceiptSection(events, receiptDataAvailable) {
  const container = document.getElementById("receipt-content");

  if (!receiptDataAvailable) {
    container.innerHTML = `<div class="no-data">NO RECEIPT DATA</div>`;
    return;
  }

  const proofChecks = events
    .map(event => event.pos?.drinkSubtotal)
    .filter(value => Number.isFinite(Number(value)));

  if (!proofChecks.length) {
    container.innerHTML = `<div class="no-data">NO RECEIPT DATA</div>`;
    return;
  }

  const proofAverage = average(proofChecks);

  container.innerHTML = `
    <div class="metric-grid">
      <article class="metric-card">
        <span>PROOF drink check avg</span>
        <strong>${formatMoney(proofAverage)}</strong>
      </article>
      <article class="metric-card">
        <span>Non-PROOF drink check avg</span>
        <strong>NO RECEIPT DATA</strong>
      </article>
      <article class="metric-card">
        <span>Linked checks</span>
        <strong>${proofChecks.length}</strong>
      </article>
      <article class="metric-card">
        <span>Lift</span>
        <strong>NO RECEIPT DATA</strong>
      </article>
    </div>
  `;
}

function renderBars(elementId, rows) {
  const container = document.getElementById(elementId);

  if (!rows.length || rows.every(row => !row.value)) {
    container.innerHTML = `<p class="empty-note">No data yet.</p>`;
    return;
  }

  container.innerHTML = rows.map(row => {
    const width = row.max ? Math.max((row.value / row.max) * 100, row.value ? 3 : 0) : 0;

    return `
      <div class="bar-row">
        <span class="bar-label">${escapeHtml(row.label)}</span>
        <span class="bar-track"><span class="bar-fill" style="width: ${width}%"></span></span>
        <span class="bar-value">${escapeHtml(row.display)}</span>
      </div>
    `;
  }).join("");
}

function renderGaps(events) {
  const container = document.getElementById("gap-list");
  const gaps = findMenuGaps(events);

  if (!gaps.length) {
    container.innerHTML = `<p class="empty-note">No obvious menu gaps yet. More sessions will make this sharper.</p>`;
    return;
  }

  container.innerHTML = gaps.map(gap => `
    <article class="gap-item">
      <div class="gap-title">
        <span>${escapeHtml(gap.title)}</span>
        <span>${gap.count} sessions</span>
      </div>
      <p class="gap-note">${escapeHtml(gap.note)}</p>
    </article>
  `).join("");
}

function findMenuGaps(events) {
  const demand = {};

  for (const event of events) {
    const preferences = event.guestInput?.sliderPreferences || {};
    const profile = getDemandProfile(preferences);
    if (!profile) continue;

    const key = profile.key;
    if (!demand[key]) {
      demand[key] = {
        ...profile,
        count: 0
      };
    }

    demand[key].count += 1;
  }

  return Object.values(demand)
    .filter(profile => profile.count >= 2 || events.length < 6)
    .map(profile => ({
      ...profile,
      menuMatches: countMenuMatches(profile)
    }))
    .filter(profile => profile.menuMatches <= 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(profile => ({
      title: profile.title,
      count: profile.count,
      note: `${profile.menuMatches} close menu matches found from the current drink list.`
    }));
}

function getDemandProfile(preferences) {
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

  const titleParts = [
    ...highTraits.map(trait => `high ${traitLabels[trait].toLowerCase()}`),
    ...lowTraits.map(trait => `low ${traitLabels[trait].toLowerCase()}`)
  ];

  return {
    key: interestingTraits.sort().join("|"),
    highTraits,
    lowTraits,
    title: titleParts.join(", ")
  };
}

function countMenuMatches(profile) {
  return (window.drinks || drinks || []).filter(drink => {
    return profile.highTraits.every(trait => Number(drink.scores?.[trait]) >= 6) &&
      profile.lowTraits.every(trait => Number(drink.scores?.[trait]) <= 2);
  }).length;
}

function renderRecentEvents(events) {
  const tbody = document.getElementById("recent-events");
  const recentEvents = [...events]
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 12);

  if (!recentEvents.length) {
    tbody.innerHTML = `<tr><td colspan="4">No sessions yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = recentEvents.map(event => {
    const preferences = summarizePreferences(event);
    const recommendations = (event.recommendations || [])
      .slice(0, 3)
      .map(recommendation => recommendation.name)
      .filter(Boolean)
      .join(", ");

    return `
      <tr>
        <td>${escapeHtml(formatDate(event.createdAt))}</td>
        <td>${escapeHtml(event.table?.label || event.table?.slug || "Unknown")}</td>
        <td>${escapeHtml(preferences || "No strong signals")}</td>
        <td>${escapeHtml(recommendations || "None")}</td>
      </tr>
    `;
  }).join("");
}

function summarizePreferences(event) {
  const preferences = event.guestInput?.sliderPreferences || {};
  const parsed = event.guestInput?.parsedPreferences || {};
  const sliderSignals = Object.entries(preferences)
    .filter(([, value]) => Number(value) >= 6 || Number(value) <= 2)
    .map(([trait, value]) => `${Number(value) >= 6 ? "high" : "low"} ${traitLabels[trait]?.toLowerCase() || trait}`);
  const textSignals = [
    ...(parsed.like || []).map(term => `likes ${term}`),
    ...(parsed.require || []).map(term => `needs ${term}`),
    ...(parsed.remove || []).map(term => `avoids ${term}`)
  ];

  return [...sliderSignals, ...textSignals].slice(0, 5).join(", ");
}

function average(values) {
  return values.reduce((sum, value) => sum + Number(value), 0) / values.length;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
