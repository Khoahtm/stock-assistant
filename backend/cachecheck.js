const { getQuote } = require("./services/finhub");

async function main() {
  console.time("lần 1");
  await getQuote("AAPL");
  console.timeEnd("lần 1");

  console.time("lần 2");
  await getQuote("AAPL");
  console.timeEnd("lần 2");
}

main();