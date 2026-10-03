const BASE_URL="https://finnhub.io/api/v1";
const cache = new Map();
const CACHE_TTL_MS = 30 * 1000;

async function getQuote(symbol) {
    const cached = cache.get(symbol);
if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
  console.log("CACHE HIT:", symbol);
  return cached.data;
}
console.log("GỌI FINNHUB:", symbol);
  const key = process.env.FINHUB_API_KEY;
  const url = `${BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`;
  const res = await fetch(url);
    if (!res.ok) {
    throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    const data = await res.json();
    cache.set(symbol, { data, time: Date.now() });
    return data;
}

module.exports = { getQuote };