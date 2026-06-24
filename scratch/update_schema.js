const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf-8');

// We will split the file by lines
let lines = schemaContent.split('\n');

// Helper to insert content before a specific line content
function insertBefore(targetLineContent, newLines, modelName) {
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === targetLineContent) {
      lines.splice(i, 0, ...newLines);
      console.log(`Successfully updated ${modelName} before line containing "${targetLineContent}"`);
      found = true;
      break;
    }
  }
  if (!found) {
    console.error(`Error: Could not find target line "${targetLineContent}" for model ${modelName}`);
  }
}

// 1. Organization (before @@map("organizations"))
insertBefore('@@map("organizations")', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterOrganizations")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketOrganizations")'
], 'Organization');

// 2. PublicService (before @@index([organizationId]))
insertBefore('@@index([organizationId])', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterServices")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketServices")'
], 'PublicService');

// 3. Beneficiary (before @@index([primaryNaceSectorId]))
insertBefore('@@index([primaryNaceSectorId])', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterBeneficiaries")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketBeneficiaries")'
], 'Beneficiary');

// 4. Journey (before @@map("journeys"))
insertBefore('@@map("journeys")', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterJourneys")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketJourneys")'
], 'Journey');

// 5. Dataset (before @@map("datasets"))
insertBefore('@@map("datasets")', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterDatasets")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketDatasets")',
  '  dataSpaces           DataSpace[]           @relation("DatasetToDataSpace")'
], 'Dataset');

// 6. Program (before @@map("programs"))
insertBefore('@@map("programs")', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterPrograms")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketPrograms")'
], 'Program');

// 7. FundingInstrument (before @@map("funding_instruments"))
insertBefore('@@map("funding_instruments")', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterFunding")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketFunding")'
], 'FundingInstrument');

// 8. Project (before @@map("projects"))
insertBefore('@@map("projects")', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterProjects")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketProjects")'
], 'Project');

// 9. Action (before @@map("actions"))
insertBefore('@@map("actions")', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterActions")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketActions")'
], 'Action');

// 10. Capability (before @@map("capabilities"))
insertBefore('@@map("capabilities")', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterCapabilities")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketCapabilities")'
], 'Capability');

// 11. ValueChain (before @@map("value_chains"))
insertBefore('@@map("value_chains")', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterValueChains")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketValueChains")'
], 'ValueChain');

// 12. Filiere (before @@map("filieres"))
insertBefore('@@map("filieres")', [
  '  s3Clusters           S3Cluster[]           @relation("ClusterFilieres")',
  '  s3MarketApps         S3MarketApplication[] @relation("MarketFilieres")'
], 'Filiere');

// Join back lines
schemaContent = lines.join('\n');

// Append new models and enums at the end of the schema content
const newSchemaPart = `
// =========================================================================
// PHASE 6: STABLE REFERENCE FRAMEWORKS, S3/DIS & DATA SPACES NEW MODELS
// =========================================================================

enum ReferenceSourceType {
  EU_OFFICIAL
  JRC
  SEMIC
  ETSI
  IDSA
  DSSC
  WALLONIA
  INTERNAL
  OTHER
}

enum ReferenceStabilityLevel {
  STABLE
  EVOLVING
  DRAFT
  INTERNAL_WORKING_SOURCE
}

enum ReferenceLegalOrMethodologicalStatus {
  REGULATION
  RECOMMENDATION
  GUIDE
  STANDARD
  TAXONOMY
  METHODOLOGY
  INTERNAL_NOTE
}

enum ReferenceApplicability {
  S3
  DIS
  DATA_SPACE
  DATASET
  SERVICE
  VALUE_CHAIN
  BENEFICIARY
  GOVERNANCE
  AI
  CYBER
  DATA
}

enum ClusterRole {
  MARKET_CLUSTER
  TRANSVERSAL_CLUSTER
  NOISY_CLUSTER
  RESIDUAL_CLUSTER
  TO_BE_ARBITRATED
}

enum ClusterValidationStatus {
  DRAFT
  PROXIED
  VALIDATED
}

model ReferenceFramework {
  id                          Int                                  @id @default(autoincrement())
  code                        String                               @unique
  labelFr                     String
  labelEn                     String
  description                 String?                              @db.Text
  sourceName                  String?
  sourceType                  ReferenceSourceType                  @default(EU_OFFICIAL)
  sourceUrl                   String?
  version                     String?
  publicationDate             DateTime?
  lastCheckedAt               DateTime?
  stabilityLevel              ReferenceStabilityLevel              @default(STABLE)
  legalOrMethodologicalStatus ReferenceLegalOrMethodologicalStatus @default(STANDARD)
  applicableTo                ReferenceApplicability               @default(S3)
  confidenceLevel             String?                              // HIGH, MEDIUM, LOW
  notes                       String?                              @db.Text
  limitations                 String?                              @db.Text
  isOfficial                  Boolean                              @default(true)
  isDeprecated                Boolean                              @default(false)
  
  replacementSourceId         Int?
  replacementSource           ReferenceFramework?                  @relation("ReplacementFramework", fields: [replacementSourceId], references: [id])
  replacedFrameworks          ReferenceFramework[]                 @relation("ReplacementFramework")
  
  sources                     ReferenceSource[]
  taxonomies                  ReferenceTaxonomy[]
  sourceDocuments             SourceDocument[]
  interopStandards            InteroperabilityStandard[]
  
  potentialDis                PotentialDIS[]
  s3Clusters                  S3Cluster[]
  marketApps                  S3MarketApplication[]
  
  createdAt                   DateTime                             @default(now())
  updatedAt                   DateTime                             @updatedAt

  @@map("ref_frameworks")
}

model ReferenceSource {
  id           Int                @id @default(autoincrement())
  code         String?            @unique
  name         String
  description  String?            @db.Text
  url          String?
  frameworkId  Int
  framework    ReferenceFramework @relation(fields: [frameworkId], references: [id], onDelete: Cascade)
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt

  @@map("ref_sources")
}

model ReferenceTaxonomy {
  id          Int                      @id @default(autoincrement())
  code        String                   @unique
  name        String
  description String?                  @db.Text
  frameworkId Int
  framework   ReferenceFramework       @relation(fields: [frameworkId], references: [id], onDelete: Cascade)
  versions    ReferenceTaxonomyVersion[]
  concepts    ReferenceConcept[]
  createdAt   DateTime                 @default(now())
  updatedAt   DateTime                 @updatedAt

  @@map("ref_taxonomies")
}

model ReferenceTaxonomyVersion {
  id          Int               @id @default(autoincrement())
  version     String
  releaseDate DateTime?
  taxonomyId  Int
  taxonomy    ReferenceTaxonomy @relation(fields: [taxonomyId], references: [id], onDelete: Cascade)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@map("ref_taxonomy_versions")
}

model ReferenceConcept {
  id              Int                       @id @default(autoincrement())
  code            String                    @unique
  labelFr         String
  labelEn         String
  description     String?                   @db.Text
  taxonomyId      Int?
  taxonomy        ReferenceTaxonomy?        @relation(fields: [taxonomyId], references: [id], onDelete: SetNull)
  parentConceptId Int?
  parentConcept   ReferenceConcept?         @relation("ConceptHierarchy", fields: [parentConceptId], references: [id])
  childConcepts   ReferenceConcept[]        @relation("ConceptHierarchy")
  mappingsFrom    ReferenceConceptMapping[] @relation("SourceConcept")
  mappingsTo      ReferenceConceptMapping[] @relation("TargetConcept")
  
  potentialDis    PotentialDIS[]            @relation("DisConcepts")
  s3Clusters      S3Cluster[]               @relation("ClusterConcepts")
  marketApps      S3MarketApplication[]     @relation("MarketConcepts")
  dataSpaces      DataSpace[]               @relation("DataSpaceConcepts")
  
  createdAt       DateTime                  @default(now())
  updatedAt       DateTime                  @updatedAt

  @@map("ref_concepts")
}

model ReferenceConceptMapping {
  id              Int              @id @default(autoincrement())
  sourceConceptId Int
  sourceConcept   ReferenceConcept @relation("SourceConcept", fields: [sourceConceptId], references: [id], onDelete: Cascade)
  targetConceptId Int
  targetConcept   ReferenceConcept @relation("TargetConcept", fields: [targetConceptId], references: [id], onDelete: Cascade)
  mappingType     String           // EXACT_MATCH, BROADER_THAN, NARROWER_THAN, RELATED
  description     String?          @db.Text
  confidenceLevel String           @default("HIGH") // HIGH, MEDIUM, LOW
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  @@map("ref_concept_mappings")
}

model SourceDocument {
  id                Int                               @id @default(autoincrement())
  title             String
  author            String?
  url               String?
  status            String                            @default("OFFICIAL_PUBLIC_REFERENCE") // INTERNAL_WORKING_NOTE, INTERNAL_PRESENTATION, OFFICIAL_PUBLIC_REFERENCE, EUROPEAN_STANDARD, LEGAL_REFERENCE, METHODOLOGICAL_REFERENCE
  topic             String?
  description       String?                           @db.Text
  frameworkId       Int?
  framework         ReferenceFramework?               @relation(fields: [frameworkId], references: [id], onDelete: SetNull)
  extracts          SourceDocumentExtract[]
  referenceMappings SourceDocumentReferenceMapping[]
  
  potentialDis      PotentialDIS[]
  s3Clusters        S3Cluster[]
  marketApps        S3MarketApplication[]
  dataSpaces        DataSpace[]
  
  createdAt         DateTime                          @default(now())
  updatedAt         DateTime                          @updatedAt

  @@map("ref_source_documents")
}

model SourceDocumentExtract {
  id          Int            @id @default(autoincrement())
  keyQuote    String         @db.Text
  pageNumber  Int?
  contextNote String?        @db.Text
  documentId  Int
  document    SourceDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@map("ref_source_document_extracts")
}

model SourceDocumentReferenceMapping {
  id               Int            @id @default(autoincrement())
  sourceDocumentId Int
  sourceDocument   SourceDocument @relation(fields: [sourceDocumentId], references: [id], onDelete: Cascade)
  targetTable      String
  targetId         Int
  mappingType      String         // SOURCE_OF_TRUTH, Triangulated, Arbitrated, DraftHypothesis
  notes            String?        @db.Text
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  @@map("ref_source_document_ref_mappings")
}

model ReferenceGovernanceNote {
  id          Int      @id @default(autoincrement())
  title       String
  content     String   @db.Text
  author      String?
  targetTable String?
  targetId    Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("ref_governance_notes")
}

model InteroperabilityStandard {
  id               Int                @id @default(autoincrement())
  code             String             @unique
  name             String
  description      String?            @db.Text
  url              String?
  frameworkId      Int?
  framework        ReferenceFramework? @relation(fields: [frameworkId], references: [id], onDelete: SetNull)
  semanticProfiles SemanticProfile[]
  vocabularies     Vocabulary[]
  dataSpaces       DataSpace[]
  s3Clusters       S3Cluster[]
  marketApps       S3MarketApplication[]
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  @@map("interop_standards")
}

model SemanticProfile {
  id          Int                      @id @default(autoincrement())
  name        String
  description String?                  @db.Text
  jsonSchema  String?                  @db.Text
  standardId  Int
  standard    InteroperabilityStandard @relation(fields: [standardId], references: [id], onDelete: Cascade)
  createdAt   DateTime                 @default(now())
  updatedAt   DateTime                 @updatedAt

  @@map("interop_semantic_profiles")
}

model Vocabulary {
  id           Int                      @id @default(autoincrement())
  prefix       String
  namespaceUri String                   @unique
  standardId   Int?
  standard     InteroperabilityStandard? @relation(fields: [standardId], references: [id], onDelete: SetNull)
  conceptSchemes ConceptScheme[]
  createdAt    DateTime                 @default(now())
  updatedAt    DateTime                 @updatedAt

  @@map("interop_vocabularies")
}

model ConceptScheme {
  id           Int        @id @default(autoincrement())
  uri          String     @unique
  title        String
  vocabularyId Int
  vocabulary   Vocabulary @relation(fields: [vocabularyId], references: [id], onDelete: Cascade)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@map("interop_concept_schemes")
}

model CommonEuropeanDataSpaceDomain {
  id          Int          @id @default(autoincrement())
  code        String       @unique
  name        String
  description String?      @db.Text
  dataSpaces  DataSpace[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@map("common_eu_data_space_domains")
}

model NaceCode {
  id          Int                   @id @default(autoincrement())
  code        String                @unique
  labelFr     String
  labelEn     String?
  description String?               @db.Text
  clusters    S3Cluster[]           @relation("ClusterNaceCodes")
  marketApps  S3MarketApplication[] @relation("MarketNaceCodes")
  potentialDis PotentialDIS[]        @relation("DisNaceCodes")
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt

  @@map("ref_nace_codes")
}

model NabsCode {
  id          Int                   @id @default(autoincrement())
  code        String                @unique
  labelFr     String
  labelEn     String?
  description String?               @db.Text
  clusters    S3Cluster[]           @relation("ClusterNabsCodes")
  marketApps  S3MarketApplication[] @relation("MarketNabsCodes")
  potentialDis PotentialDIS[]        @relation("DisNabsCodes")
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt

  @@map("ref_nabs_codes")
}

model PotentialDIS {
  id               Int                      @id @default(autoincrement())
  code             String?                  @unique
  name             String
  description      String?                  @db.Text
  validationStatus ClusterValidationStatus  @default(PROXIED)
  arbitrationStatus String                  @default("TO_BE_ARBITRATED")
  version          String                   @default("S3 2026")
  isProxy          Boolean                  @default(true)
  limitationNote   String?                  @db.Text
  triangulationNeeded Boolean               @default(true)
  
  frameworkId      Int?
  framework        ReferenceFramework?      @relation(fields: [frameworkId], references: [id], onDelete: SetNull)
  sourceDocumentId Int?
  sourceDocument   SourceDocument?          @relation(fields: [sourceDocumentId], references: [id], onDelete: SetNull)
  
  clusters         S3Cluster[]
  marketApps       S3MarketApplication[]
  groupings        DISGrouping[]
  referenceConcepts ReferenceConcept[]      @relation("DisConcepts")
  naceCodes        NaceCode[]               @relation("DisNaceCodes")
  nabsCodes        NabsCode[]               @relation("DisNabsCodes")
  
  dataSpaces       DataSpace[]
  
  createdAt        DateTime                 @default(now())
  updatedAt        DateTime                 @updatedAt

  @@map("s3_potential_dis")
}

model S3Cluster {
  id                     Int                      @id @default(autoincrement())
  code                   Int                      @unique
  name                   String
  description            String?                  @db.Text
  role                   ClusterRole              @default(MARKET_CLUSTER)
  validationStatus       ClusterValidationStatus  @default(PROXIED)
  arbitrationStatus      String                   @default("TO_BE_ARBITRATED")
  version                String                   @default("GTS3 2026")
  isProxy                Boolean                  @default(true)
  limitationNote         String?                  @db.Text
  triangulationNeeded    Boolean                  @default(true)
  
  potentialDisId         Int?
  potentialDis           PotentialDIS?            @relation(fields: [potentialDisId], references: [id], onDelete: SetNull)
  frameworkId            Int?
  framework              ReferenceFramework?      @relation(fields: [frameworkId], references: [id], onDelete: SetNull)
  sourceDocumentId       Int?
  sourceDocument         SourceDocument?          @relation(fields: [sourceDocumentId], references: [id], onDelete: SetNull)
  standardId             Int?
  standard               InteroperabilityStandard? @relation(fields: [standardId], references: [id], onDelete: SetNull)
  
  marketApps             S3MarketApplication[]
  groupings              DISGrouping[]
  scoringCriteria        S3ScoringCriterion[]     @relation("ClusterCriteria")
  indicatorBlocks        S3IndicatorBlock[]
  methodologyNotes       ClusterMethodologyNote[]
  dataSources            ClusterDataSource[]
  referenceConcepts      ReferenceConcept[]       @relation("ClusterConcepts")
  naceCodes              NaceCode[]               @relation("ClusterNaceCodes")
  nabsCodes              NabsCode[]               @relation("ClusterNabsCodes")
  
  beneficiaries          Beneficiary[]            @relation("ClusterBeneficiaries")
  organizations          Organization[]           @relation("ClusterOrganizations")
  projects               Project[]                @relation("ClusterProjects")
  programs               Program[]                @relation("ClusterPrograms")
  actions                Action[]                 @relation("ClusterActions")
  publicServices         PublicService[]          @relation("ClusterServices")
  journeys               Journey[]                @relation("ClusterJourneys")
  valueChains            ValueChain[]             @relation("ClusterValueChains")
  filieres               Filiere[]                @relation("ClusterFilieres")
  fundingInstruments     FundingInstrument[]      @relation("ClusterFunding")
  datasets               Dataset[]                @relation("ClusterDatasets")
  dataSpaces             DataSpace[]              @relation("ClusterDataSpaces")
  capabilities           Capability[]             @relation("ClusterCapabilities")
  
  createdAt              DateTime                 @default(now())
  updatedAt              DateTime                 @updatedAt

  @@map("s3_clusters")
}

model S3MarketApplication {
  id                     Int                      @id @default(autoincrement())
  code                   String?                  @unique
  name                   String
  description            String?                  @db.Text
  validationStatus       ClusterValidationStatus  @default(PROXIED)
  arbitrationStatus      String                   @default("TO_BE_ARBITRATED")
  version                String                   @default("GTS3 2026")
  isProxy                Boolean                  @default(true)
  limitationNote         String?                  @db.Text
  triangulationNeeded    Boolean                  @default(true)
  
  clusterId              Int?
  cluster                S3Cluster?               @relation(fields: [clusterId], references: [id], onDelete: SetNull)
  potentialDisId         Int?
  potentialDis           PotentialDIS?            @relation(fields: [potentialDisId], references: [id], onDelete: SetNull)
  frameworkId            Int?
  framework              ReferenceFramework?      @relation(fields: [frameworkId], references: [id], onDelete: SetNull)
  sourceDocumentId       Int?
  sourceDocument         SourceDocument?          @relation(fields: [sourceDocumentId], references: [id], onDelete: SetNull)
  standardId             Int?
  standard               InteroperabilityStandard? @relation(fields: [standardId], references: [id], onDelete: SetNull)
  
  groupings              DISGrouping[]
  scoringCriteria        S3ScoringCriterion[]     @relation("MarketCriteria")
  indicatorBlocks        S3IndicatorBlock[]
  methodologyNotes       ClusterMethodologyNote[]
  dataSources            ClusterDataSource[]
  referenceConcepts      ReferenceConcept[]       @relation("MarketConcepts")
  naceCodes              NaceCode[]               @relation("MarketNaceCodes")
  nabsCodes              NabsCode[]               @relation("MarketNabsCodes")
  
  beneficiaries          Beneficiary[]            @relation("MarketBeneficiaries")
  organizations          Organization[]           @relation("MarketOrganizations")
  projects               Project[]                @relation("MarketProjects")
  programs               Program[]                @relation("MarketPrograms")
  actions                Action[]                 @relation("MarketActions")
  publicServices         PublicService[]          @relation("MarketServices")
  journeys               Journey[]                @relation("MarketJourneys")
  valueChains            ValueChain[]             @relation("MarketValueChains")
  filieres               Filiere[]                @relation("MarketFilieres")
  fundingInstruments     FundingInstrument[]      @relation("MarketFunding")
  datasets               Dataset[]                @relation("MarketDatasets")
  dataSpaces             DataSpace[]              @relation("MarketDataSpaces")
  capabilities           Capability[]             @relation("MarketCapabilities")
  
  createdAt              DateTime                 @default(now())
  updatedAt              DateTime                 @updatedAt

  @@map("s3_market_applications")
}

model DISGrouping {
  id               Int                  @id @default(autoincrement())
  name             String
  description      String?              @db.Text
  
  potentialDisId   Int
  potentialDis     PotentialDIS         @relation(fields: [potentialDisId], references: [id], onDelete: Cascade)
  clusterId        Int?
  cluster          S3Cluster?           @relation(fields: [clusterId], references: [id], onDelete: SetNull)
  marketAppId      Int?
  marketApp        S3MarketApplication? @relation(fields: [marketAppId], references: [id], onDelete: SetNull)
  
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt

  @@map("s3_dis_groupings")
}

model S3ScoringCriterion {
  id          Int                   @id @default(autoincrement())
  name        String
  description String?               @db.Text
  category    String?               
  weight      Float                 @default(1.0)
  
  clusters    S3Cluster[]           @relation("ClusterCriteria")
  marketApps  S3MarketApplication[] @relation("MarketCriteria")
  
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt

  @@map("s3_scoring_criteria")
}

model S3IndicatorBlock {
  id          Int                  @id @default(autoincrement())
  category    String               
  name        String
  value       Float?
  unit        String?
  
  s3ClusterId Int?
  s3Cluster   S3Cluster?           @relation(fields: [s3ClusterId], references: [id], onDelete: Cascade)
  marketAppId Int?
  marketApp   S3MarketApplication? @relation(fields: [marketAppId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt

  @@map("s3_indicator_blocks")
}

model ClusterMethodologyNote {
  id              Int                  @id @default(autoincrement())
  title           String
  content         String               @db.Text
  limitations     String?              @db.Text
  confidenceLevel String               @default("MEDIUM")
  
  s3ClusterId     Int?
  s3Cluster       S3Cluster?           @relation(fields: [s3ClusterId], references: [id], onDelete: Cascade)
  marketAppId     Int?
  marketApp       S3MarketApplication? @relation(fields: [marketAppId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt

  @@map("s3_cluster_methodology_notes")
}

model ClusterDataSource {
  id          Int                  @id @default(autoincrement())
  name        String
  recordCount Int?
  description String?              @db.Text
  
  s3ClusterId Int?
  s3Cluster   S3Cluster?           @relation(fields: [s3ClusterId], references: [id], onDelete: Cascade)
  marketAppId Int?
  marketApp   S3MarketApplication? @relation(fields: [marketAppId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt

  @@map("s3_cluster_data_sources")
}

model DataSpace {
  id               Int                            @id @default(autoincrement())
  name             String
  description      String?                        @db.Text
  uri              String?                        @unique
  validationStatus ClusterValidationStatus        @default(PROXIED)
  arbitrationStatus String                        @default("TO_BE_ARBITRATED")
  version          String                         @default("PwC 2026")
  isProxy          Boolean                        @default(true)
  limitationNote   String?                        @db.Text
  triangulationNeeded Boolean                     @default(true)
  
  domainId         Int?
  domain           CommonEuropeanDataSpaceDomain? @relation(fields: [domainId], references: [id], onDelete: SetNull)
  standardId       Int?
  standard         InteroperabilityStandard?      @relation(fields: [standardId], references: [id], onDelete: SetNull)
  sourceDocumentId Int?
  sourceDocument   SourceDocument?                @relation(fields: [sourceDocumentId], references: [id], onDelete: SetNull)
  frameworkId      Int?
  framework        ReferenceFramework?            @relation(fields: [frameworkId], references: [id], onDelete: SetNull)
  
  potentialDisId   Int?
  potentialDis     PotentialDIS?                  @relation(fields: [potentialDisId], references: [id], onDelete: SetNull)
  
  datasets         Dataset[]                      @relation("DatasetToDataSpace")
  s3Clusters       S3Cluster[]                    @relation("ClusterDataSpaces")
  marketApps       S3MarketApplication[]          @relation("MarketDataSpaces")
  referenceConcepts ReferenceConcept[]            @relation("DataSpaceConcepts")
  
  createdAt        DateTime                       @default(now())
  updatedAt        DateTime                       @updatedAt

  @@map("data_spaces")
}
`;

fs.writeFileSync(schemaPath, schemaContent + newSchemaPart, 'utf-8');
console.log('Successfully appended new models!');
