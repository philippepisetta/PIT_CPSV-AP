-- Migration: Sprint 4.1 Core Prisma Implementation
-- Created at: 2026-06-12T16:08:07.670Z
-- Description: Adds S3Domain, ValueChain, Challenge, ChallengeCategory, Capability, Action, Activity tables without dropping deprecated models.

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('INDIVIDUAL', 'COLLECTIVE', 'SECOND_LINE');

-- AlterTable
ALTER TABLE "evidences" ADD COLUMN     "activityId" INTEGER;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "beneficiaryId" INTEGER;

-- AlterTable
ALTER TABLE "value_chain_stages" ADD COLUMN     "valueChainId" INTEGER;

-- CreateTable
CREATE TABLE "actions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "objective" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "projectId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "operatorId" INTEGER NOT NULL,
    "notes" TEXT,
    "beneficiaryId" INTEGER,
    "journeyId" INTEGER,
    "journeyStageId" INTEGER,
    "outputReal" TEXT,
    "outcomeReal" TEXT,
    "impact" TEXT,
    "maturityBefore" JSONB,
    "maturityAfter" JSONB,
    "maturityDelta" JSONB,
    "evidenceFiles" JSONB,
    "actionId" INTEGER,
    "journeyEnrollmentId" INTEGER,
    "title" TEXT,
    "participantsCount" INTEGER NOT NULL DEFAULT 0,
    "companiesCount" INTEGER NOT NULL DEFAULT 0,
    "satisfactionScore" DOUBLE PRECISION,
    "leadsCount" INTEGER NOT NULL DEFAULT 0,
    "nextSteps" TEXT,
    "eventResourceId" INTEGER,
    "collaborationsCount" INTEGER NOT NULL DEFAULT 0,
    "deliverables" TEXT,
    "territoryCovered" TEXT,
    "ecosystemId" INTEGER,
    "initiativeId" INTEGER,
    "engagementId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_categories" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" SERIAL NOT NULL,
    "uri" TEXT,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "challengeCategoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capabilities" (
    "id" SERIAL NOT NULL,
    "uri" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "capabilityType" TEXT NOT NULL DEFAULT 'TECHNOLOGICAL',
    "synonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentCapabilityId" INTEGER,

    CONSTRAINT "capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "s3_domains" (
    "id" SERIAL NOT NULL,
    "uri" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "s3_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_chains" (
    "id" SERIAL NOT NULL,
    "uri" TEXT,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "s3DomainId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "value_chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActivityCompaniesNew" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ActivityOperatorsNew" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ActivityEcosystemsNew" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ActivityValueChains" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ActivityKnowledgeAssetsNew" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ActivityTransformationsNew" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChallengeCapabilitiesNew" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ServiceCapabilitiesNew" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "activities_beneficiaryId_idx" ON "activities"("beneficiaryId");

-- CreateIndex
CREATE INDEX "activities_serviceId_idx" ON "activities"("serviceId");

-- CreateIndex
CREATE INDEX "activities_operatorId_idx" ON "activities"("operatorId");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_categories_code_key" ON "challenge_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "challenges_uri_key" ON "challenges"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "challenges_code_key" ON "challenges"("code");

-- CreateIndex
CREATE UNIQUE INDEX "capabilities_uri_key" ON "capabilities"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "capabilities_code_key" ON "capabilities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "s3_domains_uri_key" ON "s3_domains"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "s3_domains_code_key" ON "s3_domains"("code");

-- CreateIndex
CREATE UNIQUE INDEX "value_chains_uri_key" ON "value_chains"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "value_chains_code_key" ON "value_chains"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityCompaniesNew_AB_unique" ON "_ActivityCompaniesNew"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityCompaniesNew_B_index" ON "_ActivityCompaniesNew"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityOperatorsNew_AB_unique" ON "_ActivityOperatorsNew"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityOperatorsNew_B_index" ON "_ActivityOperatorsNew"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityEcosystemsNew_AB_unique" ON "_ActivityEcosystemsNew"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityEcosystemsNew_B_index" ON "_ActivityEcosystemsNew"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityValueChains_AB_unique" ON "_ActivityValueChains"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityValueChains_B_index" ON "_ActivityValueChains"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityKnowledgeAssetsNew_AB_unique" ON "_ActivityKnowledgeAssetsNew"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityKnowledgeAssetsNew_B_index" ON "_ActivityKnowledgeAssetsNew"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityTransformationsNew_AB_unique" ON "_ActivityTransformationsNew"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityTransformationsNew_B_index" ON "_ActivityTransformationsNew"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeCapabilitiesNew_AB_unique" ON "_ChallengeCapabilitiesNew"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeCapabilitiesNew_B_index" ON "_ChallengeCapabilitiesNew"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceCapabilitiesNew_AB_unique" ON "_ServiceCapabilitiesNew"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceCapabilitiesNew_B_index" ON "_ServiceCapabilitiesNew"("B");

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_chain_stages" ADD CONSTRAINT "value_chain_stages_valueChainId_fkey" FOREIGN KEY ("valueChainId") REFERENCES "value_chains"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_journeyStageId_fkey" FOREIGN KEY ("journeyStageId") REFERENCES "journey_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_journeyEnrollmentId_fkey" FOREIGN KEY ("journeyEnrollmentId") REFERENCES "journey_enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_eventResourceId_fkey" FOREIGN KEY ("eventResourceId") REFERENCES "event_resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_ecosystemId_fkey" FOREIGN KEY ("ecosystemId") REFERENCES "ecosystems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "initiatives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "beneficiary_engagements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_challengeCategoryId_fkey" FOREIGN KEY ("challengeCategoryId") REFERENCES "challenge_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capabilities" ADD CONSTRAINT "capabilities_parentCapabilityId_fkey" FOREIGN KEY ("parentCapabilityId") REFERENCES "capabilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_chains" ADD CONSTRAINT "value_chains_s3DomainId_fkey" FOREIGN KEY ("s3DomainId") REFERENCES "s3_domains"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityCompaniesNew" ADD CONSTRAINT "_ActivityCompaniesNew_A_fkey" FOREIGN KEY ("A") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityCompaniesNew" ADD CONSTRAINT "_ActivityCompaniesNew_B_fkey" FOREIGN KEY ("B") REFERENCES "beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityOperatorsNew" ADD CONSTRAINT "_ActivityOperatorsNew_A_fkey" FOREIGN KEY ("A") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityOperatorsNew" ADD CONSTRAINT "_ActivityOperatorsNew_B_fkey" FOREIGN KEY ("B") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityEcosystemsNew" ADD CONSTRAINT "_ActivityEcosystemsNew_A_fkey" FOREIGN KEY ("A") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityEcosystemsNew" ADD CONSTRAINT "_ActivityEcosystemsNew_B_fkey" FOREIGN KEY ("B") REFERENCES "ecosystems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityValueChains" ADD CONSTRAINT "_ActivityValueChains_A_fkey" FOREIGN KEY ("A") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityValueChains" ADD CONSTRAINT "_ActivityValueChains_B_fkey" FOREIGN KEY ("B") REFERENCES "value_chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityKnowledgeAssetsNew" ADD CONSTRAINT "_ActivityKnowledgeAssetsNew_A_fkey" FOREIGN KEY ("A") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityKnowledgeAssetsNew" ADD CONSTRAINT "_ActivityKnowledgeAssetsNew_B_fkey" FOREIGN KEY ("B") REFERENCES "knowledge_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityTransformationsNew" ADD CONSTRAINT "_ActivityTransformationsNew_A_fkey" FOREIGN KEY ("A") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityTransformationsNew" ADD CONSTRAINT "_ActivityTransformationsNew_B_fkey" FOREIGN KEY ("B") REFERENCES "transformation_dimensions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeCapabilitiesNew" ADD CONSTRAINT "_ChallengeCapabilitiesNew_A_fkey" FOREIGN KEY ("A") REFERENCES "capabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeCapabilitiesNew" ADD CONSTRAINT "_ChallengeCapabilitiesNew_B_fkey" FOREIGN KEY ("B") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceCapabilitiesNew" ADD CONSTRAINT "_ServiceCapabilitiesNew_A_fkey" FOREIGN KEY ("A") REFERENCES "capabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceCapabilitiesNew" ADD CONSTRAINT "_ServiceCapabilitiesNew_B_fkey" FOREIGN KEY ("B") REFERENCES "public_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

