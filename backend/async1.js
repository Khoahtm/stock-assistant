function fetchPrice(symbol) {
    return new Promise((resolve) => {
        setTimeout(()=>{
            resolve({ symbol: symbol,    price: 190});
        },1000);
    }   );        
        }
async function main() {
  console.log("Bắt đầu...");
  const data = await fetchPrice("AAPL");
  console.log("Nhận được:", data);
  console.log("Xong.");
}

main();