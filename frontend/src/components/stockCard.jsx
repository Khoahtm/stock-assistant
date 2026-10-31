
function StockCard({
  symbol,
  price,
  changePercent,
  watchlist,
  setWatchlist
}) {
  const watching = watchlist.some(
  (stock) => stock.symbol === symbol
);
  const hasChange = typeof changePercent === "number";
  const isUp = hasChange && changePercent >= 0;

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, margin: 8, width: 200 }}>
      <h3>{symbol}</h3>
      <p>Giá: {price}</p>
      <p style={{ color: isUp ? "green" : "red" }}>
        {hasChange ? `${isUp ? "▲" : "▼"} ${changePercent.toFixed(2)}%` : "–"}
      </p>
      <button onClick={() => {
        if (watching) {
          setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol));
        } else {
          setWatchlist([...watchlist, { symbol, price, changePercent }]);
        }
      }}>
        {watching ? "★ Đang theo dõi" : "☆ Theo dõi"}
      </button>
    </div>
  );
}

export default StockCard;
