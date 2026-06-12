const http = require("https");

const endpoints = [
  "/api/v2/programs",
  "/api/v2/capabilities",
  "/api/v2/s3-domains",
  "/api/v2/ecosystems",
  "/api/v2/beneficiaries",
  "/api/v2/journeys"
];

const baseUrl = "https://pit-cpsv-ap.onrender.com";

function testEndpoint(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    const url = baseUrl + path;
    
    const req = http.get(url, (res) => {
      let data = "";
      
      res.on("data", (chunk) => {
        data += chunk;
      });
      
      res.on("end", () => {
        const duration = Date.now() - start;
        let count = 0;
        let preview = "";
        
        try {
          const json = JSON.parse(data);
          if (json.data && Array.isArray(json.data)) {
            count = json.data.length;
          } else if (Array.isArray(json)) {
            count = json.length;
          } else if (json.meta && json.meta.total !== undefined) {
            count = json.meta.total;
          }
          preview = JSON.stringify(json).substring(0, 100);
        } catch (e) {
          preview = data.substring(0, 100);
        }
        
        resolve({
          path,
          status: res.statusCode,
          duration,
          count,
          preview
        });
      });
    });
    
    req.on("error", (err) => {
      const duration = Date.now() - start;
      resolve({
        path,
        status: "ERROR",
        duration,
        count: 0,
        preview: err.message
      });
    });
  });
}

async function run() {
  console.log("=== TESTING PRODUCTION API (RENDER) ===");
  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    console.log(`Endpoint: ${res.path}`);
    console.log(`  HTTP Status: ${res.status}`);
    console.log(`  Duration: ${res.duration}ms`);
    console.log(`  Count: ${res.count}`);
    console.log(`  Preview: ${res.preview}`);
    console.log("---------------------------------------");
  }
}

run();
