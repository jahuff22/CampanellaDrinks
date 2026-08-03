const loginState = {
  restaurantSlug: getRestaurantSlugFromPath()
};

document.getElementById("login-restaurant-title").textContent = `${formatSlug(loginState.restaurantSlug)} Console`;
document.getElementById("dashboard-login-form").addEventListener("submit", handleDashboardLogin);

async function handleDashboardLogin(event) {
  event.preventDefault();

  const status = document.getElementById("dashboard-login-status");
  const button = event.currentTarget.querySelector("button[type='submit']");
  const password = document.getElementById("dashboard-password").value;

  status.hidden = true;
  button.disabled = true;
  button.textContent = "Checking...";

  try {
    const response = await fetch("/api/dashboard-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        restaurantSlug: loginState.restaurantSlug,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    window.location.reload();
  } catch (error) {
    status.textContent = error.message || "Login failed";
    status.hidden = false;
    button.disabled = false;
    button.textContent = "Log in";
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
