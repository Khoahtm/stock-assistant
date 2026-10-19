import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";

function StockCard({ symbol, price, changePercent }) {
  const [watching, setWatching] = useState(false);
  const hasChange = typeof changePercent === "number";
  const isUp = hasChange && changePercent >= 0;

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, margin: 8, width: 200 }}>
      <h3>{symbol}</h3>
      <p>Giá: {price}</p>
      <p style={{ color: isUp ? "green" : "red" }}>
        {hasChange ? `${isUp ? "▲" : "▼"} ${changePercent.toFixed(2)}%` : "–"}
      </p>
      <button onClick={() => setWatching(!watching)}>
        {watching ? "★ Đang theo dõi" : "☆ Theo dõi"}
      </button>
    </div>
  );
}

function App() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/stocks`);
        if (!res.ok) {
          throw new Error(`Lỗi HTTP ${res.status}`);
        }
        const data = await res.json();
        setStocks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p style={{ color: "red" }}>Lỗi: {error}</p>;

  return (
    <div>
      <h1>Stock Assistant</h1>
      <input
        placeholder="Lọc theo mã..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {stocks
          .filter((s) => s.symbol.includes(query.toUpperCase()))
          .map((s) => (
            <StockCard
              key={s.symbol}
              symbol={s.symbol}
              price={s.price}
              changePercent={s.changePercent}
            />
          ))}
      </div>
    </div>
  );
}

export default App;