import StockCard from "../components/StockCard.jsx";
function Watchlist({ watchlist, setWatchlist }) {
  return (
    <div>
      <h1>Danh sách theo dõi</h1>

      {watchlist.length === 0 ? (
        <p>Chưa có cổ phiếu nào được theo dõi.</p>
      ) : (
        watchlist.map((stock) => (
            <StockCard
              key={stock.symbol}
              symbol={stock.symbol}
              price={stock.price}
              changePercent={stock.changePercent}
              watchlist={watchlist}
              setWatchlist={setWatchlist}
            />
          ))
      )}
    </div>
  );
}

export default Watchlist;