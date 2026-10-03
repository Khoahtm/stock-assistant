const express = require("express");
const { getQuote } = require("./services/finhub");

const app = express();
const PORT = 3000;

const stocks = [
  { symbol: "AAPL", price: 190 },
  { symbol: "TSLA", price: 250 },
  { symbol: "MSFT", price: 410 },
];

app.get("/", (req, res) => {
  res.send("Xin chào từ server!");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello Khoa", time: new Date() });
});

app.get("/api/stocks", (req, res) => {
  res.json(stocks);
});

app.get("/api/stocks/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const data = await getQuote(symbol);
    

    if (!data.c) {
      return res.status(404).json({ error: "Không tìm thấy mã" });
    }

    res.json({
      symbol,
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
    });
  } catch (err) {
    console.log("Lỗi khi lấy giá:", err.message);
    res.status(502).json({ error: "Không lấy được dữ liệu giá" });
  }
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});