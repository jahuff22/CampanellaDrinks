const fs = require("fs");

const fields = [
  ["businessName", "Restaurant / bar", 160],
  ["location", "Address / neighborhood", 300],
  ["name", "Name", 120],
  ["position", "Position", 120],
  ["email", "Email", 254],
  ["goals", "Business goals", 3000]
];

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function buildPilotEmail(application) {
  const rows = fields.map(([key, label]) => ({ label, value: application[key] }));
  return {
    subject: `PROOF pilot application: ${application.businessName}`,
    text: rows.map(({ label, value }) => `${label}:\n${value}`).join("\n\n"),
    html: `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body style="margin:0;background:#19102C;color:#F3ECDF;font-family:Arial,sans-serif">
      <table role="presentation" width="100%" style="background:#19102C"><tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" style="max-width:600px"><tr><td style="padding:0 0 24px">
      <img src="cid:proof-logo" alt="PROOF." width="176" style="display:block;max-width:100%;height:auto">
      <h1 style="color:#D3B05E;font-family:Georgia,serif;font-weight:normal;font-size:32px">New pilot application</h1></td></tr>
      ${rows.map(({ label, value }) => `<tr><td style="padding:16px 20px;background:#342556;border-bottom:1px solid #4A3670">
        <p style="margin:0 0 6px;color:#D3B05E;font-size:13px">${label}</p>
        <p style="margin:0;color:#F3ECDF;line-height:1.6;overflow-wrap:anywhere;word-break:break-word">${escapeHtml(value).replace(/\n/g, "<br>")}</p></td></tr>`).join("")}
      </table></td></tr></table></body></html>`
  };
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let bytes = 0;
    request.setEncoding("utf8");
    request.on("data", chunk => {
      bytes += Buffer.byteLength(chunk);
      if (bytes <= 20000) body += chunk;
    });
    request.on("end", () => {
      if (bytes > 20000) return reject(Object.assign(new Error("Application is too large."), { status: 413 }));
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error("Invalid application data."), { status: 400 }));
      }
    });
    request.on("error", reject);
    request.on("aborted", () => reject(new Error("Request aborted")));
  });
}

function createPilotApplicationHandler({ apiKey, from, recipients, logoPath, fetchEmail = (...args) => fetch(...args) }) {
  // Best-effort per-email throttling; instances do not share this cache.
  const attempts = new Map();
  return async function handlePilotApplication(request, response) {
    const reply = (code, payload) => {
      response.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      response.end(JSON.stringify(payload));
    };
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      return reply(405, { error: "Method not allowed." });
    }
    if (!/^application\/json(?:\s*;|$)/i.test(request.headers["content-type"] || "")) {
      return reply(415, { error: "Please submit the application using the form." });
    }

    let body;
    try {
      body = await readBody(request);
    } catch (error) {
      return reply(error.status || 400, { error: error.status ? error.message : "Invalid application data." });
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return reply(400, { error: "Invalid application data." });
    }
    if (body.website) return reply(400, { error: "Unable to submit this application." });

    const application = {};
    for (const [key, label, maxLength] of fields) {
      if (typeof body[key] !== "string" || !body[key].trim() || body[key].length > maxLength) {
        return reply(400, { error: `Please provide ${label.toLowerCase()} (${maxLength} characters or fewer).` });
      }
      application[key] = body[key].replace(/\r\n?/g, "\n").trim();
      if (key !== "goals") application[key] = application[key].replace(/\s+/g, " ");
    }
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(application.email) || /[\r\n]/.test(body.email)) {
      return reply(400, { error: "Please provide a valid email address." });
    }
    if (!apiKey) {
      return reply(503, { error: "Applications are temporarily unavailable. Please email hello@joinproof.bar." });
    }

    const now = Date.now();
    for (const [email, entry] of attempts) {
      if (entry.expires <= now) attempts.delete(email);
    }
    const emailKey = application.email.toLowerCase();
    const entry = attempts.get(emailKey) || { count: 0, expires: now + 3600000 };
    if (entry.count >= 3 || attempts.size >= 1000 && !attempts.has(emailKey)) {
      return reply(429, { error: "Too many applications. Please try later or email hello@joinproof.bar." });
    }
    entry.count += 1;
    attempts.set(emailKey, entry);

    try {
      const logo = await fs.promises.readFile(logoPath);
      const result = await fetchEmail("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          from,
          to: recipients,
          reply_to: application.email,
          ...buildPilotEmail(application),
          attachments: [{ filename: "proof-logo.png", content: logo.toString("base64"), content_type: "image/png", content_id: "proof-logo" }]
        })
      });
      if (!result.ok) throw new Error(`Email provider returned ${result.status}`);
      return reply(201, { sent: true });
    } catch (error) {
      console.error("Pilot application email failed:", error.message);
      return reply(502, { error: "We couldn't send your application. Please try again or email hello@joinproof.bar." });
    }
  };
}

module.exports = { createPilotApplicationHandler, buildPilotEmail };
