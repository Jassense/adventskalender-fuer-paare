const { getStore } = require("@netlify/blobs");
exports.handler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const store = getStore("advent-codes");
  let codes = (await store.get("codes", { type: "json" })) || [];
  const idx = codes.findIndex(c => c.code === (body.code || "").trim().toUpperCase());
  if (idx === -1) return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: false }) };
  codes[idx].used = true;
  codes[idx].usedAt = new Date().toISOString();
  await store.setJSON("codes", codes);
  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
};
