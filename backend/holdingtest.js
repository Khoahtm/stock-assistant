const mongoose = require("mongoose");
const Holding = require("./models/Holding");

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // C: tạo
    const created = await Holding.create({ symbol: "aapl", quantity: 10, buyPrice: 180.5 });
    console.log("1. Đã tạo:", created);

    // R: đọc
    const all = await Holding.find();
    console.log("2. Tổng số khoản:", all.length);

    const one = await Holding.findOne({ symbol: "AAPL" });
    console.log("3. Tìm AAPL, số lượng:", one.quantity);

    // U: sửa
    const updated = await Holding.findByIdAndUpdate(
      created._id,
      { quantity: 15 },
      { new: true }
    );
    console.log("4. Sau khi sửa:", updated.quantity);

    // Thử validate: thiếu field bắt buộc
    try {
      await Holding.create({ symbol: "TSLA" });
    } catch (err) {
      console.log("5. Lỗi validate:", err.message);
    }

    // D: xoá
    await Holding.deleteOne({ _id: created._id });
    console.log("6. Đã xoá");
  } catch (err) {
    console.log("Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Đã ngắt kết nối");
  }
}

main();