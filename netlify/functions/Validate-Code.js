const { getStore } = require("@netlify/blobs");
exports.handler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const store = getStore("advent-codes");
  let codes = (await store.get("codes", { type: "json" })) || [];
  const found = codes.find(c => c.code === (body.code || "").trim().toUpperCase());
  if (!found) return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ valid: false, reason: "not_found" }) };
  if (found.used) return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ valid: false, reason: "used" }) };
  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ valid: true }) };
};
