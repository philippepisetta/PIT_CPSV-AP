const fs = require('fs');

const logFile = 'C:\\Users\\Philippe Pisetta\\.gemini\\antigravity\\brain\\1852d3de-cc1f-4e7e-8d9f-0331e0dfd276\\.system_generated\\tasks\\task-6780.log';
if (fs.existsSync(logFile)) {
  const content = fs.readFileSync(logFile, 'utf8');
  const index = content.indexOf('1) [chromium]');
  if (index !== -1) {
    const failuresText = content.substring(index);
    const split = failuresText.split(/\r?\n\r?\n\s*\d+\) \[chromium\]/);
    console.log("=== FAILURE 1 ===");
    console.log(split[0]);
    console.log("=== FAILURE 2 ===");
    console.log(split[1]);
  } else {
    console.log("No failures section found.");
  }
} else {
  console.log("Log file not found!");
}
