async function testEndpoint(endpoint) {
  const url = `https://pit-cpsv-ap.onrender.com${endpoint}`;
  const start = Date.now();
  try {
    const res = await fetch(url);
    const duration = Date.now() - start;
    const status = res.status;
    let text = await res.text();
    let data;
    let count = 0;
    try {
      data = JSON.parse(text);
      if (Array.isArray(data)) {
        count = data.length;
      } else if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        for (const k of keys) {
          if (Array.isArray(data[k])) {
            count = data[k].length;
            break;
          }
        }
      }
    } catch (e) {
      data = text.substring(0, 200);
    }
    
    return {
      endpoint,
      status,
      duration,
      count,
      payloadSample: typeof data === 'object' ? JSON.stringify(data).substring(0, 150) : String(data).substring(0, 150)
    };
  } catch (error) {
    const duration = Date.now() - start;
    return {
      endpoint,
      status: 'FETCH_ERROR',
      duration,
      count: 0,
      payloadSample: error.message
    };
  }
}

async function main() {
  const endpoints = [
    '/api/v2/programs',
    '/api/v2/capabilities',
    '/api/v2/s3-domains',
    '/api/v2/ecosystems',
    '/api/v2/beneficiaries',
    '/api/v2/journeys'
  ];
  
  const results = [];
  for (const ep of endpoints) {
    console.log(`Testing ${ep}...`);
    const res = await testEndpoint(ep);
    results.push(res);
  }
  
  console.log("API_TESTS_RESULT:", JSON.stringify(results, null, 2));
}

main();
