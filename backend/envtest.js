const key=process.env.FINHUB_API_KEY;
console.log("Co key ko?", Boolean(key));
console.log("Key length:", key ? key.length : 0);