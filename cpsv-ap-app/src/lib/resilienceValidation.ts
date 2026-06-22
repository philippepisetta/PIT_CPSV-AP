// cpsv-ap-app/src/lib/resilienceValidation.ts
import { z } from "zod";

// Helper for parsing dates or strings representing dates
const dateCoercible = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  return arg;
}, z.date()).optional().nullable();

// 1. RiskRegister
export const riskRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  version: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  campaignCode: z.string().optional().nullable(),
  validFrom: dateCoercible,
  validTo: dateCoercible,
  uri: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// 2. Risk
export const riskSchema = z.object({
  code: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional().nullable(),
  severity: z.coerce.number().int().min(1).max(5).optional(),
  likelihood: z.coerce.number().int().min(1).max(5).optional(),
  riskScore: z.coerce.number().int().optional(),
  uri: z.string().optional().nullable(),
  riskRegisterId: z.coerce.number().int().optional().nullable(),
  isActive: z.boolean().optional(),
  // Relations
  organizationIds: z.array(z.coerce.number().int()).optional(),
  territoryIds: z.array(z.coerce.number().int()).optional(),
  filiereIds: z.array(z.coerce.number().int()).optional(),
  valueChainIds: z.array(z.coerce.number().int()).optional(),
  ecosystemIds: z.array(z.coerce.number().int()).optional(),
  assetIds: z.array(z.coerce.number().int()).optional(),
  challengeIds: z.array(z.coerce.number().int()).optional(),
});

// 3. Threat
export const threatSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  threatType: z.string().min(1, "ThreatType is required"),
  uri: z.string().optional().nullable(),
  riskId: z.coerce.number().int(),
});

// 4. Hazard
export const hazardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  hazardType: z.string().min(1, "HazardType is required"),
  source: z.string().optional().nullable(),
  uri: z.string().optional().nullable(),
  riskId: z.coerce.number().int(),
});

// 5. Scenario
export const scenarioSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  horizon: z.string().optional().nullable(),
  probability: z.coerce.number().min(0).max(1).optional().nullable(),
  severity: z.string().optional().nullable(),
  uri: z.string().optional().nullable(),
  riskId: z.coerce.number().int(),
  isActive: z.boolean().optional(),
});

// 6. RiskAssessment
export const riskAssessmentSchema = z.object({
  assessmentType: z.string().optional(),
  methodology: z.string().optional().nullable(),
  exposureScore: z.coerce.number().int().min(0).max(10).optional().nullable(),
  vulnerabilityScore: z.coerce.number().int().min(0).max(10).optional().nullable(),
  consequenceScore: z.coerce.number().int().min(0).max(10).optional().nullable(),
  overallScore: z.coerce.number().int().min(0).max(10).optional().nullable(),
  notes: z.string().optional().nullable(),
  assessedAt: dateCoercible,
  scenarioId: z.coerce.number().int(),
  organizationId: z.coerce.number().int().optional().nullable(),
  territoryId: z.coerce.number().int().optional().nullable(),
  riskId: z.coerce.number().int().optional().nullable(),
  isActive: z.boolean().optional(),
  policyEvidenceIds: z.array(z.coerce.number().int()).optional(),
});

// 7. ResilienceImpact
export const resilienceImpactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  magnitude: z.coerce.number().optional().nullable(),
  unit: z.string().optional().nullable(),
  timeHorizon: z.string().optional().nullable(),
  scenarioId: z.coerce.number().int().optional().nullable(),
  organizationId: z.coerce.number().int().optional().nullable(),
  territoryId: z.coerce.number().int().optional().nullable(),
  ecosystemId: z.coerce.number().int().optional().nullable(),
  resilienceMeasureIds: z.array(z.coerce.number().int()).optional(),
});

// 8. ResilienceMeasure
export const resilienceMeasureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  measureType: z.string().min(1, "Measure type is required"),
  targetDimension: z.string().min(1, "Target dimension is required"),
  status: z.string().optional().nullable(),
  uri: z.string().optional().nullable(),
  publicServiceId: z.coerce.number().int().optional().nullable(),
  resilienceImpactIds: z.array(z.coerce.number().int()).optional(),
});

// 9. ResilienceProfile
export const resilienceProfileSchema = z.object({
  exposure: z.coerce.number().min(0).max(10).optional(),
  sensitivity: z.coerce.number().min(0).max(10).optional(),
  vulnerability: z.coerce.number().min(0).max(10).optional(),
  absorptionCapacity: z.coerce.number().min(0).max(10).optional(),
  adaptiveCapacity: z.coerce.number().min(0).max(10).optional(),
  recoveryCapacity: z.coerce.number().min(0).max(10).optional(),
  overallResilience: z.coerce.number().min(0).max(10).optional(),
  methodology: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  assessedAt: dateCoercible,
  organizationId: z.coerce.number().int().optional().nullable(),
  territoryId: z.coerce.number().int().optional().nullable(),
  ecosystemId: z.coerce.number().int().optional().nullable(),
  calculationMethod: z.string().optional().nullable(),
  calculationVersion: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// 10. Dependency
export const dependencySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  criticalLevel: z.string().optional().nullable(),
  substitutability: z.string().optional().nullable(),
  uri: z.string().optional().nullable(),
  criticalInfrastructureId: z.coerce.number().int().optional().nullable(),
  organizationIds: z.array(z.coerce.number().int()).optional(),
  filiereIds: z.array(z.coerce.number().int()).optional(),
  valueChainIds: z.array(z.coerce.number().int()).optional(),
  assetIds: z.array(z.coerce.number().int()).optional(),
});

// 11. CriticalInfrastructure
export const criticalInfrastructureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  type: z.string().min(1, "Type is required"),
  operator: z.string().optional().nullable(),
  territory: z.string().optional().nullable(),
  isCrossBorder: z.boolean().optional(),
  uri: z.string().optional().nullable(),
  dependencyIds: z.array(z.coerce.number().int()).optional(),
  territoryIds: z.array(z.coerce.number().int()).optional(),
});

// 12. Vulnerability
export const vulnerabilitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  severity: z.string().optional().nullable(),
  indicator: z.string().optional().nullable(),
  organizationIds: z.array(z.coerce.number().int()).optional(),
  filiereIds: z.array(z.coerce.number().int()).optional(),
  assetIds: z.array(z.coerce.number().int()).optional(),
});

// 13. TerritorialAsset
export const territorialAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  assetType: z.string().min(1, "AssetType is required"),
  subType: z.string().optional().nullable(),
  owner: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  estimatedValue: z.coerce.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  metadata: z.any().optional().nullable(),
  uri: z.string().optional().nullable(),
  organizationId: z.coerce.number().int().optional().nullable(),
  territoryId: z.coerce.number().int().optional().nullable(),
  ecosystemId: z.coerce.number().int().optional().nullable(),
  riskIds: z.array(z.coerce.number().int()).optional(),
  dependencyIds: z.array(z.coerce.number().int()).optional(),
  vulnerabilityIds: z.array(z.coerce.number().int()).optional(),
});

export const RESILIENCE_VALIDATIONS: Record<string, z.ZodObject<any, any>> = {
  "risk-registers": riskRegisterSchema,
  "risks": riskSchema,
  "threats": threatSchema,
  "hazards": hazardSchema,
  "scenarios": scenarioSchema,
  "risk-assessments": riskAssessmentSchema,
  "resilience-impacts": resilienceImpactSchema,
  "resilience-measures": resilienceMeasureSchema,
  "resilience-profiles": resilienceProfileSchema,
  "dependencies": dependencySchema,
  "critical-infrastructures": criticalInfrastructureSchema,
  "vulnerabilities": vulnerabilitySchema,
  "territorial-assets": territorialAssetSchema,
};
