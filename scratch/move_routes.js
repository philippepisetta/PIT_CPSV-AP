const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/server.ts');
console.log("Reading file:", filePath);
let content = fs.readFileSync(filePath, 'utf8');

// Normalize all newlines to LF for easy processing
let normalized = content.replace(/\r\n/g, '\n');

// 1. Locate the block to delete
const startMarker = "// --- REALISATIONS DE SERVICES (SERVICE DELIVERIES) ---";
const endMarker = "// --- LIVRAISONS COLLECTIVES (COLLECTIVE DELIVERIES) ---";

const startIndex = normalized.indexOf(startMarker);
const endIndex = normalized.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found");
  process.exit(1);
}

// Slice the block
const oldBlock = normalized.substring(startIndex, endIndex);

// Verify it contains app.get('/api/service-deliveries')
if (!oldBlock.includes("app.get('/api/service-deliveries'")) {
  console.error("Old block doesn't contain expected content");
  process.exit(1);
}

// Remove oldBlock from content
normalized = normalized.replace(oldBlock, "");

// 2. Locate the place to insert under v2Router
const insertMarker = "// --- 1. BENEFICIARY APIs ---";
const insertIndex = normalized.indexOf(insertMarker);
if (insertIndex === -1) {
  console.error("Insert marker not found");
  process.exit(1);
}

// Define new block (converting app to v2Router and removing /api prefix)
let newBlock = oldBlock.replace(/\/\/ --- REALISATIONS DE SERVICES \(SERVICE DELIVERIES\) ---/, "// --- 0. SERVICE DELIVERY APIs ---");
newBlock = newBlock.replace(/app\.get\('\/api\/service-deliveries'/g, "v2Router.get('/service-deliveries'");
newBlock = newBlock.replace(/app\.get\('\/api\/service-deliveries\/:id'/g, "v2Router.get('/service-deliveries/:id'");
newBlock = newBlock.replace(/app\.post\('\/api\/service-deliveries'/g, "v2Router.post('/service-deliveries'");
newBlock = newBlock.replace(/app\.patch\('\/api\/service-deliveries\/:id'/g, "v2Router.patch('/service-deliveries/:id'");
newBlock = newBlock.replace(/app\.delete\('\/api\/service-deliveries\/:id'/g, "v2Router.delete('/service-deliveries/:id'");

// Insert before the insertMarker
normalized = normalized.replace(insertMarker, newBlock + "\n\n" + insertMarker);

// 3. Update the permission middleware
const looseTarget = "path.startsWith('/attendances')\n  ) {\n    if (role === 'CONSEILLER') {";
const looseReplacement = "path.startsWith('/attendances') ||\n    path.startsWith('/service-deliveries')\n  ) {\n    if (role === 'CONSEILLER') {";

if (normalized.includes(looseTarget)) {
  normalized = normalized.replace(looseTarget, looseReplacement);
} else {
  console.error("Could not find permission target");
  process.exit(1);
}

// Write back with original CRLF format if needed (Windows standard is CRLF, but Node can write LF, let's keep it clean as LF or restore CRLF)
// Let's restore CRLF for file consistency if the original had CRLF
const hasCRLF = content.includes('\r\n');
const finalContent = hasCRLF ? normalized.replace(/\n/g, '\r\n') : normalized;

fs.writeFileSync(filePath, finalContent, 'utf8');
console.log("Success! server.ts modified successfully.");
