(() => {
  const form = document.getElementById("pilot-form");
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById("pilot-status");
  let submitting = false;
  button.disabled = false;

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;

    submitting = true;
    button.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.dataset.state = "sending";
    status.textContent = "Sending your application...";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.sent !== true) {
        throw new Error(result.error || "We couldn't send your application. Please try again or email hello@joinproof.bar.");
      }

      form.reset();
      status.dataset.state = "success";
      status.textContent = "Thank you! Your application has been sent. Michael and Jake will be in touch.";
    } catch (error) {
      status.dataset.state = "error";
      status.textContent = error.name === "AbortError"
        ? "Delivery couldn't be confirmed. Please email hello@joinproof.bar before trying again."
        : (error instanceof TypeError || error instanceof SyntaxError)
          ? "We couldn't send your application. Please try again or email hello@joinproof.bar."
          : error.message;
    } finally {
      clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
})();
