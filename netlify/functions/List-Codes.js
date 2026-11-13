const { getStore } = require("@netlify/blobs");
exports.handler = async (event) => {
  const store = getStore("advent-codes");
  let codes = (await store.get("codes", { type: "json" })) || [];
  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codes }) };
};
