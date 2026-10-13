import { useState } from "react";
function StockCard({ symbol, price, changePercent }) {
  const isUp = changePercent >= 0;
  
function toggle() {
  watching = !watching;
  console.log("watching:", watching);
}
const [watching, setWatching] = useState(false);
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, margin: 8, width: 200 }}>
      <h3>{symbol}</h3>
      <p>Giá: {price}</p>
      <p style={{ color: isUp ? "green" : "red" }}>
        {isUp ? "▲" : "▼"} {changePercent}%
      </p>
      <button onClick={toggle}>{watching ? "Đang theo dõi" : "Theo dõi"}</button>
      <button onClick={() => setWatching(!watching)}>
        {watching ? "★ Đang theo dõi" : "☆ Theo dõi"}
      </button>
    </div>
  );
}


function App() {
  const stocks = [
    { symbol: "AAPL", price: 336.64, changePercent: 1.02 },
    { symbol: "MSFT", price: 535.07, changePercent: -0.45 },
    { symbol: "TSLA", price: 250.1, changePercent: 2.3 },
  ];
  const [query, setQuery] = useState("");

  

  return (
    <div>
      <h1>Stock Assistant</h1>
      <input
  placeholder="Lọc theo mã..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
      />
      {stocks
  .filter((s) => s.symbol.includes(query.toUpperCase()))
  .map((s) => (
    <StockCard key={s.symbol} symbol={s.symbol} price={s.price} changePercent={s.changePercent} />
  ))}
    </div>
  );
}

export default App;