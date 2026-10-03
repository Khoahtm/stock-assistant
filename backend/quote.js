const key = process.env.FINHUB_API_KEY;

async function getQuote(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Lỗi HTTP: ${res.status}`);
  }

  return await res.json();
}

async function main() {
  try {
    const data = await getQuote("AAPL");
    console.log(data);
  } catch (err) {
    console.log("Có lỗi:", err.message);
  }
}

main();