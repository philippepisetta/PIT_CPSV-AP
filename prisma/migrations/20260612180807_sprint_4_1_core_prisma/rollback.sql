-- Rollback: Sprint 4.1 Core Prisma Implementation
-- Created at: 2026-06-12T16:08:07.670Z
-- Description: Drops S3Domain, ValueChain, Challenge, ChallengeCategory, Capability, Action, Activity tables.

-- DropForeignKey
ALTER TABLE "evidences" DROP CONSTRAINT "evidences_activityId_fkey";

-- DropForeignKey
ALTER TABLE "value_chain_stages" DROP CONSTRAINT "value_chain_stages_valueChainId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_beneficiaryId_fkey";

-- DropForeignKey
ALTER TABLE "actions" DROP CONSTRAINT "actions_projectId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_operatorId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_beneficiaryId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_journeyId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_journeyStageId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_actionId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_journeyEnrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_eventResourceId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_ecosystemId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_initiativeId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_engagementId_fkey";

-- DropForeignKey
ALTER TABLE "challenges" DROP CONSTRAINT "challenges_challengeCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "capabilities" DROP CONSTRAINT "capabilities_parentCapabilityId_fkey";

-- DropForeignKey
ALTER TABLE "value_chains" DROP CONSTRAINT "value_chains_s3DomainId_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityCompaniesNew" DROP CONSTRAINT "_ActivityCompaniesNew_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityCompaniesNew" DROP CONSTRAINT "_ActivityCompaniesNew_B_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityOperatorsNew" DROP CONSTRAINT "_ActivityOperatorsNew_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityOperatorsNew" DROP CONSTRAINT "_ActivityOperatorsNew_B_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityEcosystemsNew" DROP CONSTRAINT "_ActivityEcosystemsNew_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityEcosystemsNew" DROP CONSTRAINT "_ActivityEcosystemsNew_B_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityValueChains" DROP CONSTRAINT "_ActivityValueChains_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityValueChains" DROP CONSTRAINT "_ActivityValueChains_B_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityKnowledgeAssetsNew" DROP CONSTRAINT "_ActivityKnowledgeAssetsNew_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityKnowledgeAssetsNew" DROP CONSTRAINT "_ActivityKnowledgeAssetsNew_B_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityTransformationsNew" DROP CONSTRAINT "_ActivityTransformationsNew_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityTransformationsNew" DROP CONSTRAINT "_ActivityTransformationsNew_B_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeCapabilitiesNew" DROP CONSTRAINT "_ChallengeCapabilitiesNew_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeCapabilitiesNew" DROP CONSTRAINT "_ChallengeCapabilitiesNew_B_fkey";

-- DropForeignKey
ALTER TABLE "_ServiceCapabilitiesNew" DROP CONSTRAINT "_ServiceCapabilitiesNew_A_fkey";

-- DropForeignKey
ALTER TABLE "_ServiceCapabilitiesNew" DROP CONSTRAINT "_ServiceCapabilitiesNew_B_fkey";

-- AlterTable
ALTER TABLE "evidences" DROP COLUMN "activityId";

-- AlterTable
ALTER TABLE "value_chain_stages" DROP COLUMN "valueChainId";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "beneficiaryId";

-- DropTable
DROP TABLE "actions";

-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "challenge_categories";

-- DropTable
DROP TABLE "challenges";

-- DropTable
DROP TABLE "capabilities";

-- DropTable
DROP TABLE "s3_domains";

-- DropTable
DROP TABLE "value_chains";

-- DropTable
DROP TABLE "_ActivityCompaniesNew";

-- DropTable
DROP TABLE "_ActivityOperatorsNew";

-- DropTable
DROP TABLE "_ActivityEcosystemsNew";

-- DropTable
DROP TABLE "_ActivityValueChains";

-- DropTable
DROP TABLE "_ActivityKnowledgeAssetsNew";

-- DropTable
DROP TABLE "_ActivityTransformationsNew";

-- DropTable
DROP TABLE "_ChallengeCapabilitiesNew";

-- DropTable
DROP TABLE "_ServiceCapabilitiesNew";

-- DropEnum
DROP TYPE "ActivityType";

