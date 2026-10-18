const express = require("express");
const cors = require("cors");
const { getQuote } = require("./services/finhub");
const mongoose = require("mongoose");
const portfolioRouter = require("./routes/portfolio");

const app = express();
const PORT = 3000;
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());
app.use("/api/portfolio", portfolioRouter);

const symbols = ["AAPL", "TSLA", "MSFT"];

app.get("/", (req, res) => {
  res.send("Xin chào từ server!");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello Khoa", time: new Date() });
});

app.get("/api/stocks", async (req, res) => {
  try {
    const quotes = await Promise.all(symbols.map((s) => getQuote(s)));

    const result = quotes.map((q, i) => ({
      symbol: symbols[i],
      price: q.c,
      change: q.d,
      changePercent: q.dp,
    }));

    res.json(result);
  } catch (err) {
    console.log("Lỗi khi lấy danh sách:", err.message);
    res.status(502).json({ error: "Không lấy được dữ liệu giá" });
  }
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

// 404: không route nào khớp
app.use((req, res) => {
  res.status(404).json({ error: "Không tìm thấy đường dẫn" });
});

// Bộ xử lý lỗi: phải có đủ 4 tham số
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Body không phải JSON hợp lệ" });
  }
  console.log("Lỗi không lường trước:", err.message);
  res.status(500).json({ error: "Lỗi server" });
});

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Đã kết nối MongoDB:", mongoose.connection.name);

  app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.log("Không khởi động được server:", err.message);
  process.exit(1);
});