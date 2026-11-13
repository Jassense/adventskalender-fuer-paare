const { getStore } = require("@netlify/blobs");
exports.handler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  if (body.password !== process.env.ADMIN_PASSWORD) return { statusCode: 401, body: JSON.stringify({ error: "wrong password" }) };
  const store = getStore("advent-codes");
  let codes = (await store.get("codes", { type: "json" })) || [];
  const code = Math.random().toString(36).slice(2,6).toUpperCase() + "-" + Math.random().toString(36).slice(2,6).toUpperCase();
  codes.push({ code, used: false, createdAt: new Date().toISOString() });
  await store.setJSON("codes", codes);
  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) };
};
