const fs = require('fs');

const schemaPath = 'c:/Users/Philippe Pisetta/Downloads/testing CPSV-AP/prisma/schema.prisma';
let content = fs.readFileSync(schemaPath, 'utf8');

// 1. Remove the incorrect relation in model Journey
content = content.replace(
  '  journeyEnrollments JourneyEnrollment[]\n  activitiesNew     Activity[]           @relation("JourneyStageActivitiesNew")\n  actionInstances   ActionInstance[]',
  '  journeyEnrollments JourneyEnrollment[]\n  actionInstances   ActionInstance[]'
);

// 2. Add the correct relation in model JourneyStage using a specific multi-line pattern
content = content.replace(
  '  journeyEnrollments JourneyEnrollment[]\n  createdAt       DateTime          @default(now())',
  '  journeyEnrollments JourneyEnrollment[]\n  activitiesNew     Activity[]           @relation("JourneyStageActivitiesNew")\n  createdAt       DateTime          @default(now())'
);

fs.writeFileSync(schemaPath, content, 'utf8');
console.log('schema.prisma fixed and updated.');
