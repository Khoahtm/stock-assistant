
import { useState, useEffect } from "react";
import StockCard from "../components/StockCard.jsx";

const API_URL = "http://localhost:3000";

function Home({ watchlist, setWatchlist }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const [filter, setFilter] = useState("all");

  // Theo dõi từ khóa tìm kiếm
  useEffect(() => {
    if (query.trim() !== "") {
      console.log(`Bạn đang tìm kiếm: ${query}`);
    } else {
      console.log("Đã xóa từ khóa tìm kiếm");
    }
  }, [query]);

  // Lọc danh sách cổ phiếu
  const filteredStocks = stocks.filter((s) => {
    const keyword = query.trim().toLowerCase();
    const symbol = s.symbol.toLowerCase();
    const name = (s.name || "").toLowerCase();

    const matchesSearch =
      symbol.includes(keyword) || name.includes(keyword);

    const matchesFilter =
      filter === "all" ||
      (filter === "up" && s.changePercent > 0) ||
      (filter === "down" && s.changePercent < 0);

    return matchesSearch && matchesFilter;
  });

  // Tải danh sách cổ phiếu từ API
  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/stocks`);

      if (!res.ok) {
        throw new Error(`Lỗi HTTP ${res.status}`);
      }

      const data = await res.json();

      console.log("Dữ liệu API:", data);
      setStocks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Tìm kiếm một mã cổ phiếu từ API
  async function searchStock() {
    const keyword = query.trim();

    setSearchError(null);
    setSearchResult(null);

    if (!keyword) {
      setSearchError("Vui lòng nhập mã cổ phiếu");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/stocks/${keyword}`
      );

      if (!res.ok) {
        throw new Error("Không tìm thấy mã cổ phiếu");
      }

      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      setSearchResult(null);
      setSearchError(err.message);
    }
  }

  // Trạng thái tải dữ liệu
  if (loading) {
    return <p>Đang tải...</p>;
  }

  // Trạng thái lỗi tải danh sách
  if (error) {
    return (
      <div>
        <p>Lỗi: {error}</p>
        <button onClick={load}>Thử lại</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Stock Assistant</h1>

      <input
        placeholder="Nhập mã cổ phiếu..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={() => {
          setQuery("");
          setSearchResult(null);
          setSearchError(null);
        }}
      >
        Xóa tìm kiếm
      </button>

      <button onClick={searchStock}>
        Tìm kiếm
      </button>

      {/* Hiển thị lỗi tìm kiếm */}
      {searchError && <p>{searchError}</p>}

      {/* Hiển thị kết quả tìm kiếm hoặc danh sách ban đầu */}
      {searchResult ? (
        <StockCard
          symbol={searchResult.symbol}
          price={searchResult.price}
          changePercent={searchResult.changePercent}
          watchlist={watchlist}
          setWatchlist={setWatchlist}
        />
      ) : (
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
      )}

      {/* Bộ lọc tăng giảm */}
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
