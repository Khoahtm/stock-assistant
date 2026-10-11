const express = require("express");
const Holding = require("../models/Holding");
const mongoose = require("mongoose");
const { getQuote } = require("../services/finhub");
const round2 = (n) => (n === null ? null : Math.round(n * 100) / 100);

const router = express.Router();

// Xem tất cả
router.get("/", async (req, res) => {
  try {
    const holdings = await Holding.find().sort({ createdAt: -1 });
    res.json(holdings);
  } catch (err) {
    console.log("Lỗi đọc danh mục:", err.message);
    res.status(500).json({ error: "Không đọc được danh mục" });
  }
});

// Thêm mới
router.post("/", async (req, res) => {
  try {
    const { symbol, quantity, buyPrice } = req.body || {};
    const holding = await Holding.create({ symbol, quantity, buyPrice });
    res.status(201).json(holding);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    console.log("Lỗi lưu holding:", err.message);
    res.status(500).json({ error: "Không lưu được" });
  }
});

// Danh mục kèm lãi/lỗ
router.get("/summary", async (req, res) => {
  try {
    const holdings = await Holding.find();
    const uniqueSymbols = [...new Set(holdings.map((h) => h.symbol))];

    const quotes = await Promise.all(uniqueSymbols.map((s) => getQuote(s)));
    const priceBySymbol = {};
    uniqueSymbols.forEach((s, i) => {
      priceBySymbol[s] = quotes[i].c;
    });

    let totalCost = 0;
    let totalValue = 0;

    const items = holdings.map((h) => {
      const currentPrice = priceBySymbol[h.symbol];
      const cost = h.quantity * h.buyPrice;
      const value = h.quantity * currentPrice;
      const profit = value - cost;
      totalCost += cost;
      totalValue += value;

            return {
        id: h._id,
        symbol: h.symbol,
        quantity: h.quantity,
        buyPrice: h.buyPrice,
        currentPrice,
        cost: round2(cost),
        value: round2(value),
        profit: round2(profit),
        profitPercent: cost > 0 ? round2((profit / cost) * 100) : null,
      };
    });

        res.json({
      items,
      totalCost: round2(totalCost),
      totalValue: round2(totalValue),
      totalProfit: round2(totalValue - totalCost),
      totalProfitPercent:
        totalCost > 0 ? round2(((totalValue - totalCost) / totalCost) * 100) : null,
    });
  } catch (err) {
    console.log("Lỗi tính danh mục:", err.message);
    res.status(502).json({ error: "Không tính được danh mục" });
  }
});

// Sửa
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "id không hợp lệ" });
  }

  const body = req.body || {};
  const updates = {};
  if (body.quantity !== undefined) updates.quantity = body.quantity;
  if (body.buyPrice !== undefined) updates.buyPrice = body.buyPrice;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Cần gửi quantity hoặc buyPrice" });
  }

  try {
    const holding = await Holding.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!holding) {
      return res.status(404).json({ error: "Không tìm thấy khoản này" });
    }
    res.json(holding);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: err.message });
    }
    console.log("Lỗi sửa holding:", err.message);
    res.status(500).json({ error: "Không sửa được" });
  }
});

// Xoá
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "id không hợp lệ" });
  }

  try {
    const holding = await Holding.findByIdAndDelete(id);
    if (!holding) {
      return res.status(404).json({ error: "Không tìm thấy khoản này" });
    }
    res.json({ message: "Đã xoá", deleted: holding });
  } catch (err) {
    console.log("Lỗi xoá holding:", err.message);
    res.status(500).json({ error: "Không xoá được" });
  }
});

module.exports = router;