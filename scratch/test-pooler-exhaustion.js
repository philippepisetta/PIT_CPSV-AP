async function testExhaustion() {
  const urls = [
    'https://pit-cpsv-ap.vercel.app/api/meta',
    'https://pit-cpsv-ap.vercel.app/api/beneficiaries',
    'https://pit-cpsv-ap.vercel.app/api/journeys',
    'https://pit-cpsv-ap.vercel.app/api/journey-enrollments'
  ];
  
  const start = Date.now();
  console.log("Sending 16 parallel requests to Vercel API endpoints to test pooler saturation...");
  
  const promises = [];
  for (let i = 0; i < 4; i++) {
    for (const url of urls) {
      promises.push(
        fetch(url)
          .then(res => ({ url: url.substring(url.lastIndexOf('/')), status: res.status }))
          .catch(err => ({ url: url.substring(url.lastIndexOf('/')), status: 'ERROR', error: err.message }))
      );
    }
  }
  
  const results = await Promise.all(promises);
  const duration = Date.now() - start;
  
  console.log("Results:");
  console.log(JSON.stringify(results, null, 2));
  console.log("Total duration:", duration, "ms");
}

testExhaustion();
