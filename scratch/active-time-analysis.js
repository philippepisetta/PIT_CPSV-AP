const fs = require('fs');
const path = require('path');

const brainDir = "C:/Users/Philippe/ /..".replace("Philippe/ /..", "Philippe Pisetta/.gemini/antigravity/brain");
// Safe path building
const brainPath = path.resolve("C:/Users/Philippe Pisetta/.gemini/antigravity/brain");

if (!fs.existsSync(brainPath)) {
  console.error(`Brain directory not found at: ${brainPath}`);
  process.exit(1);
}

const items = fs.readdirSync(brainPath);
const transcripts = [];

items.forEach(item => {
  const itemPath = path.join(brainPath, item);
  if (fs.statSync(itemPath).isDirectory() && item !== 'tempmediaStorage') {
    const transcriptPath = path.join(itemPath, '.system_generated', 'logs', 'transcript.jsonl');
    if (fs.existsSync(transcriptPath)) {
      transcripts.push(transcriptPath);
    }
  }
});

let overallActiveTimeMs = 0;
let overallTurns = 0;
let overallSteps = 0;

console.log(`Scanning active developer logs from ${transcripts.length} conversations...\n`);

transcripts.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');
  const steps = lines.map((line, idx) => {
    try {
      return JSON.parse(line);
    } catch(e) {
      return null;
    }
  }).filter(Boolean);
  
  steps.sort((a, b) => a.step_index - b.step_index);
  
  let totalActiveTimeMs = 0;
  let currentTurnStart = null;
  let currentTurnEnd = null;
  let turnsCount = 0;
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const time = new Date(step.created_at).getTime();
    
    // We count active time as the duration from the user prompt (USER_INPUT from USER_EXPLICIT)
    // until the last action (model response or tool execution) in that turn.
    if (step.source === 'USER_EXPLICIT' && step.type === 'USER_INPUT') {
      if (currentTurnStart && currentTurnEnd) {
        const duration = currentTurnEnd - currentTurnStart;
        totalActiveTimeMs += duration;
        turnsCount++;
      }
      currentTurnStart = time;
      currentTurnEnd = time;
    } else {
      if (currentTurnStart) {
        currentTurnEnd = time;
      }
    }
  }
  
  if (currentTurnStart && currentTurnEnd) {
    const duration = currentTurnEnd - currentTurnStart;
    totalActiveTimeMs += duration;
    turnsCount++;
  }
  
  overallActiveTimeMs += totalActiveTimeMs;
  overallTurns += turnsCount;
  overallSteps += steps.length;
  
  const convId = path.basename(path.dirname(path.dirname(path.dirname(filePath))));
  console.log(`Conversation ${convId}:`);
  console.log(`  Steps: ${steps.length}`);
  console.log(`  Turns: ${turnsCount}`);
  console.log(`  Active time: ${(totalActiveTimeMs / 1000 / 60).toFixed(2)} minutes (${(totalActiveTimeMs / 1000 / 3600).toFixed(2)} hours)`);
});

console.log(`\n=========================================`);
console.log(`TOTAL ACTIVE PROJECT DEVELOPMENT TIME:`);
console.log(`  Total Conversations: ${transcripts.length}`);
console.log(`  Total Steps: ${overallSteps}`);
console.log(`  Total Turns (Prompts): ${overallTurns}`);
console.log(`  Total Time: ${(overallActiveTimeMs / 1000 / 60).toFixed(2)} minutes (${(overallActiveTimeMs / 1000 / 3600).toFixed(2)} hours)`);
console.log(`=========================================`);
