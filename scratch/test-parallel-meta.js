async function testParallel() {
  const url = 'https://pit-cpsv-ap.vercel.app/api/meta';
  const start = Date.now();
  console.log("Sending 3 parallel requests to /api/meta on Vercel...");
  
  const promises = [
    fetch(url).then(res => ({ id: 1, status: res.status })),
    fetch(url).then(res => ({ id: 2, status: res.status })),
    fetch(url).then(res => ({ id: 3, status: res.status }))
  ];
  
  const results = await Promise.all(promises);
  const duration = Date.now() - start;
  
  console.log("Parallel results:", JSON.stringify(results));
  console.log("Total duration:", duration, "ms");
}

testParallel();
