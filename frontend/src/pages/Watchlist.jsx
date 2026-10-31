function Watchlist({ watchlist }) {
  return (
    <div>
      <h1>Danh sách theo dõi</h1>

      {watchlist.map((stock) => (
        <p key={stock.symbol}>
          {stock.symbol} - {stock.price}
        </p>
      ))}
    </div>
  );
}

export default Watchlist;