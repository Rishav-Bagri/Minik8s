const total = 600;
const batchSize = 100;

for (let i = 0; i < total; i += batchSize) {
  const batch = [];
  for (let j = i; j < i + batchSize && j < total; j++) {
    batch.push(fetch('http://localhost:3000/queue/enqueue', { method: 'POST' }));
  }
  console.log(`sent batch ${i / batchSize + 1}`);
  await Promise.all(batch);
}
console.log("all batches complete");