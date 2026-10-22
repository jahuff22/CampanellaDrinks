const assert = require("node:assert/strict");
const path = require("node:path");
const { Readable } = require("node:stream");
const { test } = require("node:test");
const { createPilotApplicationHandler, buildPilotEmail } = require("../shared/pilot-applications");

const sample = {
  businessName: "The Golden Bar",
  location: "123 Main Street, West Village",
  name: "Alex Smith",
  position: "Owner",
  email: "alex@example.com",
  goals: "Help guests find drinks they love.\nUnderstand our menu's opportunities.",
  website: ""
};

function setup({ apiKey = "test-key", ok = true, networkError = false } = {}) {
  const calls = [];
  const handler = createPilotApplicationHandler({
    apiKey,
    from: "PROOF <hello@joinproof.bar>",
    recipients: ["hello@joinproof.bar", "splitticketpod@gmail.com"],
    logoPath: path.resolve(__dirname, "../shared/brand/web/proof-horizontal-email.png"),
    async fetchEmail(url, options) {
      calls.push({ url, options, payload: JSON.parse(options.body) });
      if (networkError) throw new Error("Mock network failure");
      return { ok, status: ok ? 200 : 500 };
    }
  });
  async function submit(body = sample, { method = "POST", contentType = "application/json", raw } = {}) {
    const request = Readable.from([raw === undefined ? JSON.stringify(body) : raw]);
    request.method = method;
    request.headers = { "content-type": contentType };
    const response = {
      headers: {},
      setHeader(name, value) { this.headers[name] = value; },
      writeHead(code, headers) { this.code = code; Object.assign(this.headers, headers); },
      end(value) { this.body = JSON.parse(value); }
    };
    await handler(request, response);
    return response;
  }
  return { submit, calls };
}

test("emails all six answers to both founders, with applicant reply-to and logo", async () => {
  const { submit, calls } = setup();
  const response = await submit();
  assert.equal(response.code, 201);
  assert.equal(response.body.sent, true);
  assert.equal(calls.length, 1);
  const { url, payload } = calls[0];
  assert.equal(url, "https://api.resend.com/emails");
  assert.deepEqual(payload.to, ["hello@joinproof.bar", "splitticketpod@gmail.com"]);
  assert.equal(payload.reply_to, sample.email);
  assert.equal(payload.from, "PROOF <hello@joinproof.bar>");
  for (const field of ["businessName", "location", "name", "position", "email", "goals"]) {
    assert.ok(payload.text.includes(sample[field]), field);
  }
  assert.match(payload.html, /cid:proof-logo/);
  assert.equal(payload.attachments[0].content_id, "proof-logo");
  assert.ok(payload.attachments[0].content.length > 100);
  assert.match(payload.html, /they love\.<br>Understand/);
});

test("escapes applicant HTML and keeps readable plain text", () => {
  const unsafe = '<script>alert("x")</script> & goals';
  const email = buildPilotEmail({ ...sample, goals: unsafe });
  assert.ok(!email.html.includes(unsafe));
  assert.ok(email.html.includes("&lt;script&gt;"));
  assert.ok(email.text.includes(unsafe));
});

test("requires all fields, rejects oversized fields and invalid email before sending", async () => {
  const { submit, calls } = setup();
  for (const key of ["businessName", "location", "name", "position", "email", "goals"]) {
    assert.equal((await submit({ ...sample, [key]: "  " })).code, 400, key);
    assert.equal((await submit({ ...sample, [key]: {} })).code, 400, key);
  }
  assert.equal((await submit({ ...sample, goals: "a".repeat(3001) })).code, 400);
  assert.equal((await submit({ ...sample, email: "not-an-email" })).code, 400);
  assert.equal((await submit({ ...sample, email: "alex@example.com\r\nBcc: victim@example.com" })).code, 400);
  assert.equal(calls.length, 0);
});

test("rejects invalid bodies, content types, honeypots and unsupported methods", async () => {
  const { submit, calls } = setup();
  for (const body of [null, [], "string"]) assert.equal((await submit(body)).code, 400);
  assert.equal((await submit(sample, { raw: "{" })).code, 400);
  assert.equal((await submit(sample, { raw: "x".repeat(20001) })).code, 413);
  assert.equal((await submit(sample, { contentType: "text/plain" })).code, 415);
  assert.equal((await submit(sample, { method: "GET" })).code, 405);
  assert.equal((await submit({ ...sample, website: "spam.example" })).code, 400);
  assert.equal(calls.length, 0);
});

test("only confirms successful provider delivery, never missing setup or provider failure", async () => {
  const unconfigured = setup({ apiKey: "" });
  assert.equal((await unconfigured.submit()).code, 503);
  assert.equal(unconfigured.calls.length, 0);
  for (const options of [{ ok: false }, { networkError: true }]) {
    const { submit } = setup(options);
    const response = await submit();
    assert.equal(response.code, 502);
    assert.notEqual(response.body.sent, true);
  }
});

test("limits repeated submissions for an email without blocking a different applicant", async () => {
  const { submit, calls } = setup();
  for (let i = 0; i < 3; i++) assert.equal((await submit()).code, 201);
  assert.equal((await submit({ ...sample, email: "ALEX@example.com" })).code, 429);
  assert.equal((await submit({ ...sample, email: "another@example.com" })).code, 201);
  assert.equal(calls.length, 4);
});
