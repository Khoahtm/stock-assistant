async function getTodo() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log("Có lỗi:", err.message);
  }
}

getTodo();