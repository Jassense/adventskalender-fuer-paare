const { getStore } = require("@netlify/blobs");
exports.handler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  if (body.password !== process.env.ADMIN_PASSWORD) return { statusCode: 401, body: JSON.stringify({ error: "wrong password" }) };
  const store = getStore("advent-codes");
  let codes = (await store.get("codes", { type: "json" })) || [];
  const idx = codes.findIndex(c => c.code === (body.code || "").trim().toUpperCase());
  if (idx === -1) return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: false }) };
  codes[idx].used = false;
  delete codes[idx].usedAt;
  await store.setJSON("codes", codes);
  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
};
