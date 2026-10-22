const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const { test } = require("node:test");
const { buildCustomerProfileEmail } = require("../shared/email/customer-profile");

const root = path.resolve(__dirname, "..");
const sample = {
  email: "preview@example.com",
  firstName: "Alex",
  persona: "Sunseeker",
  aboutYou: "Bright citrus and a refreshing finish.",
  recommendations: [{ name: "Daiquiri", matchPercentage: "95%" }],
  bartenderScript: "Something bright with fresh lime, please.",
  spiritsAndModifiers: ["Light rum", "Fresh lime"],
  recipe: {
    name: "Golden Hour",
    description: "A crisp citrus cocktail.",
    ingredients: ["2 oz light rum", "0.75 oz fresh lime"],
    method: "Shake with ice, then strain."
  }
};

test("keeps the existing subject and plain-text email", () => {
  const email = buildCustomerProfileEmail(sample);
  assert.equal(email.subject, "Your PROOF cocktail results");
  assert.equal(email.text, [
    "Hi Alex,",
    "Cocktail Persona: You're a Sunseeker.",
    "About you: Bright citrus and a refreshing finish.",
    "Your Perfect Classics:",
    "1. Daiquiri",
    "Any decent bar in America can make these. Just ask!",
    "Your Bartender Script:",
    "Something bright with fresh lime, please.",
    "Try these spirits and modifiers:",
    "- Light rum",
    "- Fresh lime",
    "A recipe for your palate:",
    "Golden Hour",
    "A crisp citrus cocktail.",
    "- 2 oz light rum",
    "- 0.75 oz fresh lime",
    "Shake with ice, then strain.",
    "Thanks for letting us read your palate. Save this email for the next time you're deciding what to order.",
    "Cheers!",
    "Michael and Jake"
  ].join("\n"));
});

test("escapes every customer-controlled HTML field", () => {
  const unsafe = '<img src=x onerror="alert(1)"> & cocktail';
  const safe = "&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; cocktail";
  const { html } = buildCustomerProfileEmail({
    firstName: unsafe,
    persona: unsafe,
    aboutYou: unsafe,
    bartenderScript: unsafe,
    recommendations: [{ name: unsafe, matchPercentage: unsafe }],
    spiritsAndModifiers: [unsafe],
    recipe: { name: unsafe, description: unsafe, ingredients: [unsafe], method: unsafe }
  });
  assert.ok(!html.includes(unsafe));
  assert.equal(html.split(safe).length - 1, 11);
  assert.ok(!html.includes("<script"));
});

test("handles omitted optional profile fields", () => {
  const { text, html } = buildCustomerProfileEmail({});
  assert.ok(text.startsWith("Hi,\nCocktail Persona: You're a PROOF guest."));
  assert.ok(html.includes("You're a PROOF guest"));
  assert.ok(!html.includes("undefined"));
  assert.ok(!html.includes("null"));
});

// Exercise the real sender without opening a server or contacting Resend.
function loadSender({ apiKey = "test-key", responseOk = true } = {}) {
  const requests = [];
  const serverRequire = createRequire(path.join(root, "server.js"));
  const context = vm.createContext({
    __dirname: root,
    process: { env: { RESEND_API_KEY: apiKey } },
    console: { log() {}, error() {} },
    require(name) {
      if (name === "http") return { createServer: () => ({ listen() {} }) };
      if (name === "fs") return { ...fs, existsSync: file => path.basename(file) !== ".env" && fs.existsSync(file) };
      return serverRequire(name);
    },
    async fetch(url, options) {
      requests.push({ url, payload: JSON.parse(options.body) });
      return { ok: responseOk, status: responseOk ? 200 : 500, json: async () => ({ id: "test-message" }) };
    }
  });
  vm.runInContext(fs.readFileSync(path.join(root, "server.js"), "utf8"), context);
  return { send: context.sendCustomerProfileEmail, requests };
}

test("sends the original content with a matching inline PNG attachment", async () => {
  const { send, requests } = loadSender();
  const result = await send(sample);
  assert.equal(result.sent, true);
  assert.equal(requests.length, 1);
  const { url, payload } = requests[0];
  assert.equal(url, "https://api.resend.com/emails");
  assert.equal(payload.to, sample.email);
  assert.equal(payload.from, "PROOF <hello@joinproof.bar>");
  assert.equal(payload.reply_to, "hello@joinproof.bar");
  assert.equal(payload.subject, buildCustomerProfileEmail(sample).subject);
  assert.equal(payload.text, buildCustomerProfileEmail(sample).text);
  assert.equal(payload.attachments.length, 1);
  const logo = payload.attachments[0];
  assert.equal(logo.content_type, "image/png");
  assert.ok(payload.html.includes(`src="cid:${logo.content_id}"`));
  const png = Buffer.from(logo.content, "base64");
  assert.deepEqual(png.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  assert.deepEqual(png, fs.readFileSync(path.join(root, "shared/brand/web/proof-horizontal-email.png")));
});

test("keeps the existing skip and delivery-failure behavior", async () => {
  const unconfigured = loadSender({ apiKey: "" });
  assert.equal((await unconfigured.send(sample)).skipped, true);
  assert.equal(unconfigured.requests.length, 0);

  const missingEmail = loadSender();
  assert.equal((await missingEmail.send({ ...sample, email: "" })).skipped, true);
  assert.equal(missingEmail.requests.length, 0);

  const failure = loadSender({ responseOk: false });
  assert.equal((await failure.send(sample)).sent, false);
});
