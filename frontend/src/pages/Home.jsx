import { useState, useEffect } from "react";
import StockCard from "../components/stockCard.jsx";

const API_URL = "http://localhost:3000";


function Home({ watchlist, setWatchlist }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  
  const filteredStocks = stocks.filter((s) => {
    const keyword = query.trim().toLowerCase();
    const symbol = s.symbol.toLowerCase();
    const name = (s.name || "").toLowerCase();

    // Điều kiện tìm kiếm
    const matchesSearch =
      symbol.includes(keyword) || name.includes(keyword);

    // Điều kiện lọc tăng giảm
    const matchesFilter =
      filter === "all" ||
      (filter === "up" && s.changePercent > 0) ||
      (filter === "down" && s.changePercent < 0);

    return matchesSearch && matchesFilter;
});

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
      <button onClick={() => setQuery("")}>
       Xóa tìm kiếm
      </button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredStocks.length > 0 ? (
          filteredStocks.map((s) => (
            <StockCard
              key={s.symbol}
              symbol={s.symbol}
              price={s.price}
              changePercent={s.changePercent}
              watchlist={watchlist}
              setWatchlist={setWatchlist}
            />
          ))
      ) : (
        <p>Không tìm thấy cổ phiếu phù hợp.</p>
      )}
      </div>
      <div>
        <button onClick={() => setFilter("all")}>
          Tất cả
        </button>

        <button onClick={() => setFilter("up")}>
          Tăng giá
        </button>

        <button onClick={() => setFilter("down")}>
          Giảm giá
        </button>
      </div>
    </div>
  );
}

export default Home;