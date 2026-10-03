const  stocks=[
    { symbol: "AAPL", price: 190},
    { symbol: "TSLA", price: 250},
    { symbol: "MSFT", price: 410}
];

// Duyet mang
for ( const s of stocks){
    console.log(`${s.symbol} dang co gia ${s.price}`);
}

// tao mang moi

const symobls = stocks.map((s) => s.symbol);
console.log(symobls);
// 3. filter: lọc phần tử
const expensive = stocks.filter((s) => s.price > 200);
console.log(expensive);

// 4. reduce: gộp thành một giá trị
const total = stocks.reduce((sum, s) => sum + s.price, 0);
console.log("Tổng giá:", total);