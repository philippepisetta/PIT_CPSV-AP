const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
const lines = schemaContent.split('\n');

const targetModels = [
  'Beneficiary', 'Organization', 'Project', 'Program', 'Action', 
  'PublicService', 'Journey', 'ValueChain', 'Filiere', 'FundingInstrument', 
  'Dataset', 'Capability'
];

targetModels.forEach(model => {
  const modelDeclaration = `model ${model} {`;
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith(modelDeclaration)) {
      console.log(`Found ${model}: line ${i + 1}`);
      found = true;
      // print first few lines of the model to verify
      for (let j = 0; j < 10; j++) {
        if (lines[i + j]) {
          console.log(`  ${i + j + 1}: ${lines[i + j]}`);
        }
      }
      break;
    }
  }
  if (!found) {
    console.log(`Not found: ${model}`);
  }
});
