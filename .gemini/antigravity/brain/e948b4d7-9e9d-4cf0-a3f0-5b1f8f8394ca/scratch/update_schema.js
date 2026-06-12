const fs = require('fs');
const path = require('path');

const schemaPath = 'c:/Users/Philippe Pisetta/Downloads/testing CPSV-AP/prisma/schema.prisma';
console.log('Reading schema from:', schemaPath);
let content = fs.readFileSync(schemaPath, 'utf8');

// 1. Deprecations (add /// @deprecated)
const deprecateModels = [
  'StrategicPriority',
  'Measure',
  'StrategicDomainDimension',
  'StrategicValueChain',
  'BusinessChallenge',
  'CapabilityDimension',
  'ServiceDelivery',
  'CollectiveDelivery',
  'SecondLineMission',
  'ActionInstance'
];

deprecateModels.forEach(modelName => {
  const regex = new RegExp(`model ${modelName} \\{`, 'g');
  content = content.replace(regex, `/// @deprecated\nmodel ${modelName} {`);
});

// 2. Organization extensions
content = content.replace(
  '  datasets            Dataset[]',
  '  datasets            Dataset[]\n  activitiesNew       Activity[]           @relation("ActivityOperator")\n  activitiesMobilizedNew Activity[]        @relation("ActivityOperatorsNew")'
);

// 3. PublicService extensions
content = content.replace(
  '  outputs           Output[]             // Livrables attendus (théoriques)',
  '  outputs           Output[]             // Livrables attendus (théoriques)\n  activitiesNew     Activity[]           @relation("ServiceActivitiesNew")\n  capabilitiesNew   Capability[]         @relation("ServiceCapabilitiesNew")'
);

// 4. Evidence extensions
content = content.replace(
  '  secondLineMission   SecondLineMission? @relation(fields: [secondLineMissionId], references: [id], onDelete: Cascade)',
  '  secondLineMission   SecondLineMission? @relation(fields: [secondLineMissionId], references: [id], onDelete: Cascade)\n  activityId          Int?\n  activity            Activity?            @relation(fields: [activityId], references: [id], onDelete: Cascade)'
);

// 5. Beneficiary extensions
content = content.replace(
  '  fundingInstruments  FundingInstrument[]   @relation("BeneficiaryFunding")',
  '  fundingInstruments  FundingInstrument[]   @relation("BeneficiaryFunding")\n  projects            Project[]             @relation("BeneficiaryProjects")\n  activitiesNew       Activity[]           @relation("BeneficiaryActivitiesNew")\n  activitiesCollectiveNew Activity[]       @relation("ActivityCompaniesNew")'
);

// 6. Project extensions
content = content.replace(
  '  initiativeId    Int?\n  initiative      Initiative?           @relation(fields: [initiativeId], references: [id], onDelete: SetNull)',
  '  initiativeId    Int?\n  initiative      Initiative?           @relation(fields: [initiativeId], references: [id], onDelete: SetNull)\n  beneficiaryId   Int?\n  beneficiary     Beneficiary?          @relation("BeneficiaryProjects", fields: [beneficiaryId], references: [id], onDelete: SetNull)\n  actionsNew      Action[]'
);

// 7. ValueChainStage extensions
content = content.replace(
  '  needs          BusinessNeed[]  @relation("NeedStages")',
  '  needs          BusinessNeed[]  @relation("NeedStages")\n  valueChainId   Int?\n  valueChain     ValueChain?          @relation(fields: [valueChainId], references: [id], onDelete: SetNull)'
);

// 8. Ecosystem extensions
content = content.replace(
  '  memberships    EcosystemMembership[]',
  '  memberships    EcosystemMembership[]\n  activitiesNew  Activity[]           @relation("ActivityEcosystemsNew")\n  activitiesDirectNew Activity[]       @relation("ActivityEcosystemDirectNew")'
);

// 9. Journey extensions
content = content.replace(
  '  actionInstances   ActionInstance[]',
  '  actionInstances   ActionInstance[]\n  activitiesNew     Activity[]           @relation("JourneyActivitiesNew")'
);

// 10. JourneyStage extensions
content = content.replace(
  '  journeyEnrollments JourneyEnrollment[]',
  '  journeyEnrollments JourneyEnrollment[]\n  activitiesNew     Activity[]           @relation("JourneyStageActivitiesNew")'
);

// 11. JourneyEnrollment extensions
content = content.replace(
  '  deliveries     ServiceDelivery[]',
  '  deliveries     ServiceDelivery[]\n  activitiesNew  Activity[]           @relation("JourneyEnrollmentActivitiesNew")'
);

// 12. KnowledgeAsset extensions
content = content.replace(
  '  dataQuality        DataQualityDimension?',
  '  dataQuality        DataQualityDimension?\n  activitiesNew      Activity[]           @relation("ActivityKnowledgeAssetsNew")'
);

// 13. EventResource extensions
content = content.replace(
  '  knowledgeAssets     KnowledgeAsset[]     @relation("EventKnowledgeAssets")',
  '  knowledgeAssets     KnowledgeAsset[]     @relation("EventKnowledgeAssets")\n  activitiesNew       Activity[]           @relation("EventActivitiesNew")'
);

// 14. TransformationDimension extensions
content = content.replace(
  '  ecosystems      Ecosystem[]           @relation("EcosystemTransformations")',
  '  ecosystems      Ecosystem[]           @relation("EcosystemTransformations")\n  activitiesNew   Activity[]           @relation("ActivityTransformationsNew")'
);

// 15. New Models Definitions
const newModels = `
// ==========================================
// PIT v11.0 Core Domain Models (Sprint 4.1)
// ==========================================

enum ActivityType {
  INDIVIDUAL
  COLLECTIVE
  SECOND_LINE
}

model Action {
  id             Int          @id @default(autoincrement())
  title          String
  objective      String?      @db.Text
  startDate      DateTime     @default(now())
  endDate        DateTime?
  status         String       @default("PLANNED") // PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
  
  projectId      Int?
  project        Project?     @relation(fields: [projectId], references: [id], onDelete: SetNull)
  activities     Activity[]
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@map("actions")
}

model Activity {
  id                  Int                   @id @default(autoincrement())
  activityType        ActivityType
  
  // Relations communes
  serviceId           Int
  service             PublicService         @relation("ServiceActivitiesNew", fields: [serviceId], references: [id], onDelete: Cascade)
  
  status              String                @default("PLANNED")
  date                DateTime              @default(now())
  endDate             DateTime?
  
  operatorId          Int
  operator            Organization          @relation("ActivityOperator", fields: [operatorId], references: [id], onDelete: Cascade)
  
  notes               String?               @db.Text
  evidences           Evidence[]
  
  // Relations spécifiques INDIVIDUAL
  beneficiaryId       Int?
  beneficiary         Beneficiary?          @relation("BeneficiaryActivitiesNew", fields: [beneficiaryId], references: [id], onDelete: Cascade)
  
  journeyId           Int?
  journey             Journey?              @relation("JourneyActivitiesNew", fields: [journeyId], references: [id], onDelete: SetNull)
  journeyStageId      Int?
  journeyStage        JourneyStage?         @relation("JourneyStageActivitiesNew", fields: [journeyStageId], references: [id], onDelete: SetNull)
  
  outputReal          String?               @db.Text
  outcomeReal         String?               @db.Text
  impact              String?               @db.Text
  maturityBefore      Json?
  maturityAfter       Json?
  maturityDelta       Json?
  evidenceFiles       Json?
  
  actionId            Int?
  action              Action?               @relation(fields: [actionId], references: [id], onDelete: SetNull)
  
  journeyEnrollmentId Int?
  journeyEnrollment   JourneyEnrollment?    @relation("JourneyEnrollmentActivitiesNew", fields: [journeyEnrollmentId], references: [id], onDelete: SetNull)
  
  // Relations spécifiques COLLECTIVE
  title               String?
  participantsCount   Int                   @default(0)
  companiesCount      Int                   @default(0)
  satisfactionScore   Float?
  leadsCount          Int                   @default(0)
  nextSteps           String?               @db.Text
  companies           Beneficiary[]         @relation("ActivityCompaniesNew")
  eventResourceId     Int?
  eventResource       EventResource?        @relation("EventActivitiesNew", fields: [eventResourceId], references: [id], onDelete: SetNull)
  
  // Relations spécifiques SECOND_LINE
  operatorsMobilized  Organization[]        @relation("ActivityOperatorsNew")
  collaborationsCount Int                   @default(0)
  deliverables        String?               @db.Text
  territoryCovered    String?
  ecosystems          Ecosystem[]           @relation("ActivityEcosystemsNew")
  valueChains         ValueChain[]          @relation("ActivityValueChains")
  knowledgeAssets     KnowledgeAsset[]      @relation("ActivityKnowledgeAssetsNew")
  
  ecosystemId         Int?
  ecosystemDirect     Ecosystem?            @relation("ActivityEcosystemDirectNew", fields: [ecosystemId], references: [id], onDelete: SetNull)
  
  // Nouvelles relations Strategic Governance
  initiativeId        Int?
  initiative          Initiative?           @relation(fields: [initiativeId], references: [id], onDelete: SetNull)
  engagementId        Int?
  engagement          BeneficiaryEngagement? @relation(fields: [engagementId], references: [id], onDelete: SetNull)

  transformationDimensions TransformationDimension[] @relation("ActivityTransformationsNew")

  createdAt           DateTime              @default(now())
  updatedAt           DateTime              @updatedAt

  @@index([beneficiaryId])
  @@index([serviceId])
  @@index([operatorId])
  @@map("activities")
}

model ChallengeCategory {
  id          Int         @id @default(autoincrement())
  code        String      @unique
  name        String
  description String?     @db.Text
  challenges  Challenge[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@map("challenge_categories")
}

model Challenge {
  id                  Int                @id @default(autoincrement())
  uri                 String?            @unique
  code                String?            @unique
  name                String
  description         String?            @db.Text
  
  challengeCategoryId Int?
  challengeCategory   ChallengeCategory? @relation(fields: [challengeCategoryId], references: [id], onDelete: SetNull)
  capabilities        Capability[]       @relation("ChallengeCapabilitiesNew")
  
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt
  
  @@map("challenges")
}

model Capability {
  id                 Int                  @id @default(autoincrement())
  uri                String               @unique
  code               String               @unique
  name               String
  description        String?              @db.Text
  capabilityType     String               @default("TECHNOLOGICAL")
  synonyms           String[]             @default([])
  status             String               @default("ACTIVE")
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt

  // Hiérarchie Circulaire
  parentCapabilityId Int?
  parentCapability   Capability?          @relation("CapabilityHierarchy", fields: [parentCapabilityId], references: [id], onDelete: SetNull)
  childCapabilities  Capability[]         @relation("CapabilityHierarchy")

  // Relations
  challenges         Challenge[]          @relation("ChallengeCapabilitiesNew")
  services           PublicService[]      @relation("ServiceCapabilitiesNew")

  @@map("capabilities")
}

model S3Domain {
  id           Int          @id @default(autoincrement())
  uri          String?      @unique
  code         String       @unique
  name         String
  description  String?      @db.Text
  valueChains  ValueChain[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  @@map("s3_domains")
}

model ValueChain {
  id             Int             @id @default(autoincrement())
  uri            String?         @unique
  code           String?         @unique
  name           String
  description    String?         @db.Text
  
  s3DomainId     Int?
  s3Domain       S3Domain?       @relation(fields: [s3DomainId], references: [id], onDelete: SetNull)
  stages         ValueChainStage[]
  activities     Activity[]      @relation("ActivityValueChains")

  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  
  @@map("value_chains")
}
`;

content += newModels;

fs.writeFileSync(schemaPath, content, 'utf8');
console.log('schema.prisma updated successfully.');
