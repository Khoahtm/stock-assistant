const BASE_URL="https://finnhub.io/api/v1";

async function getQuote(symbol) {
  const key = process.env.FINHUB_API_KEY;
  const url = `${BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`;
  const res = await fetch(url);
    if (!res.ok) {
    throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return await res.json();
}

module.exports = { getQuote };