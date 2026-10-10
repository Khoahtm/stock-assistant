const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Đã kết nối MongoDB, database:", mongoose.connection.name);
  } catch (err) {
    console.log("Lỗi kết nối:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Đã ngắt kết nối");
  }
}

main();