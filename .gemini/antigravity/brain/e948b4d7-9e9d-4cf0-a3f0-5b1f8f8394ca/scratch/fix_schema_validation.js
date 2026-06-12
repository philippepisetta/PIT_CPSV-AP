const fs = require('fs');

const schemaPath = 'c:/Users/Philippe Pisetta/Downloads/testing CPSV-AP/prisma/schema.prisma';
let content = fs.readFileSync(schemaPath, 'utf8');

// 1. Remove incorrect relation from ActionInstance
content = content.replace(
  '  deliveries     ServiceDelivery[]\n  activitiesNew  Activity[]           @relation("JourneyEnrollmentActivitiesNew")',
  '  deliveries     ServiceDelivery[]'
);

// 2. Add correct relation to JourneyEnrollment (using the unique comment)
content = content.replace(
  '  // Relation inverse pour ServiceDelivery\n  deliveries     ServiceDelivery[]',
  '  // Relation inverse pour ServiceDelivery\n  deliveries     ServiceDelivery[]\n  activitiesNew  Activity[]           @relation("JourneyEnrollmentActivitiesNew")'
);

// 3. Add activities relation to Initiative
content = content.replace(
  '  projects           Project[]\n\n  createdAt          DateTime              @default(now())\n  updatedAt          DateTime              @updatedAt\n\n  @@map("initiatives")',
  '  projects           Project[]\n  activities         Activity[]\n\n  createdAt          DateTime              @default(now())\n  updatedAt          DateTime              @updatedAt\n\n  @@map("initiatives")'
);

// 4. Add activities relation to BeneficiaryEngagement
content = content.replace(
  '  deliveries    ServiceDelivery[]\n  collectiveDeliveries CollectiveDelivery[]\n\n  createdAt     DateTime              @default(now())\n  updatedAt     DateTime              @updatedAt\n\n  @@map("beneficiary_engagements")',
  '  deliveries    ServiceDelivery[]\n  collectiveDeliveries CollectiveDelivery[]\n  activities    Activity[]\n\n  createdAt     DateTime              @default(now())\n  updatedAt     DateTime              @updatedAt\n\n  @@map("beneficiary_engagements")'
);

fs.writeFileSync(schemaPath, content, 'utf8');
console.log('Schema validation fixes applied.');
