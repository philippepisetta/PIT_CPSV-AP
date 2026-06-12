// src/hooks/useV2Queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return res.json();
};

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  q?: string;
  drbest?: string;
  s3Domain?: string | number;
  valueChain?: string | number;
  valueChainStage?: string | number;
}

// 1. Hook for Programs list with filters
export function useV2Programs(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
  if (params.q) queryParams.append("q", params.q);
  if (params.drbest) queryParams.append("drbest", params.drbest);
  if (params.s3Domain) queryParams.append("s3Domain", params.s3Domain.toString());

  const url = `/api/v2/programs?${queryParams.toString()}`;
  return useQuery({
    queryKey: ["v2-programs", params],
    queryFn: () => fetcher(url),
    staleTime: 30 * 1000,
  });
}

// 2. Hook for Program Detail
export function useV2ProgramDetail(id: number | null) {
  return useQuery({
    queryKey: ["v2-program-detail", id],
    queryFn: () => fetcher(`/api/v2/programs/${id}`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// 3. Hook for nested Program Projects
export function useV2ProgramProjects(programId: number | null, page = 1, pageSize = 5) {
  const url = `/api/v2/programs/${programId}/projects?page=${page}&pageSize=${pageSize}`;
  return useQuery({
    queryKey: ["v2-program-projects", programId, page, pageSize],
    queryFn: () => fetcher(url),
    enabled: programId !== null && !isNaN(programId),
    staleTime: 30 * 1000,
  });
}

// 4. Hook for Projects Actions
export function useV2ProjectActions(projectId: number | null, page = 1, pageSize = 5) {
  const url = `/api/v2/projects/${projectId}/actions?page=${page}&pageSize=${pageSize}`;
  return useQuery({
    queryKey: ["v2-project-actions", projectId, page, pageSize],
    queryFn: () => fetcher(url),
    enabled: projectId !== null && !isNaN(projectId),
    staleTime: 30 * 1000,
  });
}

// 5. Hook for Actions Activities
export function useV2ActionActivities(actionId: number | null, page = 1, pageSize = 5) {
  const url = `/api/v2/actions/${actionId}/activities?page=${page}&pageSize=${pageSize}`;
  return useQuery({
    queryKey: ["v2-action-activities", actionId, page, pageSize],
    queryFn: () => fetcher(url),
    enabled: actionId !== null && !isNaN(actionId),
    staleTime: 30 * 1000,
  });
}

// 6. Hook for Capabilities
export function useV2Capabilities() {
  return useQuery({
    queryKey: ["v2-capabilities"],
    queryFn: () => fetcher("/api/v2/capabilities"),
    staleTime: 30 * 1000,
  });
}

// 7. Hooks for S3 Strategy
export function useV2S3Domains() {
  return useQuery({
    queryKey: ["v2-s3-domains"],
    queryFn: () => fetcher("/api/v2/s3-domains"),
    staleTime: 30 * 1000,
  });
}

export function useV2ValueChains() {
  return useQuery({
    queryKey: ["v2-value-chains"],
    queryFn: () => fetcher("/api/v2/value-chains"),
    staleTime: 30 * 1000,
  });
}

export function useV2ValueChainStages(valueChainId?: number) {
  const url = valueChainId 
    ? `/api/v2/value-chain-stages?valueChainId=${valueChainId}` 
    : "/api/v2/value-chain-stages";
  return useQuery({
    queryKey: ["v2-value-chain-stages", valueChainId],
    queryFn: () => fetcher(url),
    staleTime: 30 * 1000,
  });
}

// 8. Hooks for Taxonomies
export function useV2Taxonomy(name: "drbest" | "capabilities" | "challenges" | "s3" | "territories") {
  return useQuery({
    queryKey: ["v2-taxonomy", name],
    queryFn: () => fetcher(`/api/v2/taxonomies/${name}`),
    staleTime: 30 * 1000,
  });
}

// 9. Hook for Services and their relations (cross references)
export function useV2Services(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
  if (params.q) queryParams.append("q", params.q);
  if (params.drbest) queryParams.append("drbest", params.drbest);
  if (params.s3Domain) queryParams.append("s3Domain", params.s3Domain.toString());
  if (params.valueChain) queryParams.append("valueChain", params.valueChain.toString());
  if (params.valueChainStage) queryParams.append("valueChainStage", params.valueChainStage.toString());

  const url = `/api/v2/services?${queryParams.toString()}`;
  return useQuery({
    queryKey: ["v2-services-list", params],
    queryFn: () => fetcher(url),
    staleTime: 30 * 1000,
  });
}

// 10. Hook for Journeys list
export function useV2Journeys(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
  if (params.q) queryParams.append("q", params.q);
  if (params.drbest) queryParams.append("drbest", params.drbest);
  if (params.s3Domain) queryParams.append("s3Domain", params.s3Domain.toString());
  if (params.valueChain) queryParams.append("valueChain", params.valueChain.toString());
  if (params.valueChainStage) queryParams.append("valueChainStage", params.valueChainStage.toString());

  const url = `/api/v2/journeys?${queryParams.toString()}`;
  return useQuery({
    queryKey: ["v2-journeys-list", params],
    queryFn: () => fetcher(url),
    staleTime: 30 * 1000,
  });
}

// 11. Hook for Graph Data
export function useV2GraphQuery(entityType: string, id: number | null) {
  return useQuery({
    queryKey: ["v2-graph", entityType, id],
    queryFn: () => fetcher(`/api/v2/graph/${entityType}/${id}`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// 12. Service Relation Hooks
export function useV2ServiceChallenges(serviceId: number | null) {
  return useQuery({
    queryKey: ["v2-service-challenges", serviceId],
    queryFn: () => fetcher(`/api/v2/services/${serviceId}/challenges`),
    enabled: serviceId !== null && !isNaN(serviceId),
    staleTime: 30 * 1000,
  });
}

export function useV2ServiceCapabilities(serviceId: number | null) {
  return useQuery({
    queryKey: ["v2-service-capabilities", serviceId],
    queryFn: () => fetcher(`/api/v2/services/${serviceId}/capabilities`),
    enabled: serviceId !== null && !isNaN(serviceId),
    staleTime: 30 * 1000,
  });
}

export function useV2ServiceJourneys(serviceId: number | null) {
  return useQuery({
    queryKey: ["v2-service-journeys", serviceId],
    queryFn: () => fetcher(`/api/v2/services/${serviceId}/journeys`),
    enabled: serviceId !== null && !isNaN(serviceId),
    staleTime: 30 * 1000,
  });
}

export function useV2ServicePrograms(serviceId: number | null) {
  return useQuery({
    queryKey: ["v2-service-programs", serviceId],
    queryFn: () => fetcher(`/api/v2/services/${serviceId}/programs`),
    enabled: serviceId !== null && !isNaN(serviceId),
    staleTime: 30 * 1000,
  });
}

export function useV2ServiceProjects(serviceId: number | null) {
  return useQuery({
    queryKey: ["v2-service-projects", serviceId],
    queryFn: () => fetcher(`/api/v2/services/${serviceId}/projects`),
    enabled: serviceId !== null && !isNaN(serviceId),
    staleTime: 30 * 1000,
  });
}

// 13. Journey Relation Hooks
export function useV2JourneyServices(journeyId: number | null) {
  return useQuery({
    queryKey: ["v2-journey-services", journeyId],
    queryFn: () => fetcher(`/api/v2/journeys/${journeyId}/services`),
    enabled: journeyId !== null && !isNaN(journeyId),
    staleTime: 30 * 1000,
  });
}

export function useV2JourneyChallenges(journeyId: number | null) {
  return useQuery({
    queryKey: ["v2-journey-challenges", journeyId],
    queryFn: () => fetcher(`/api/v2/journeys/${journeyId}/challenges`),
    enabled: journeyId !== null && !isNaN(journeyId),
    staleTime: 30 * 1000,
  });
}

export function useV2JourneyCapabilities(journeyId: number | null) {
  return useQuery({
    queryKey: ["v2-journey-capabilities", journeyId],
    queryFn: () => fetcher(`/api/v2/journeys/${journeyId}/capabilities`),
    enabled: journeyId !== null && !isNaN(journeyId),
    staleTime: 30 * 1000,
  });
}

export function useV2JourneyBusinessEvents(journeyId: number | null) {
  return useQuery({
    queryKey: ["v2-journey-business-events", journeyId],
    queryFn: () => fetcher(`/api/v2/journeys/${journeyId}/business-events`),
    enabled: journeyId !== null && !isNaN(journeyId),
    staleTime: 30 * 1000,
  });
}

export function useV2JourneyLifeEvents(journeyId: number | null) {
  return useQuery({
    queryKey: ["v2-journey-life-events", journeyId],
    queryFn: () => fetcher(`/api/v2/journeys/${journeyId}/life-events`),
    enabled: journeyId !== null && !isNaN(journeyId),
    staleTime: 30 * 1000,
  });
}

export function useV2JourneyBeneficiaries(journeyId: number | null) {
  return useQuery({
    queryKey: ["v2-journey-beneficiaries", journeyId],
    queryFn: () => fetcher(`/api/v2/journeys/${journeyId}/beneficiaries`),
    enabled: journeyId !== null && !isNaN(journeyId),
    staleTime: 30 * 1000,
  });
}

// 14. Hook for Contributions / Impact (v3.4.1)
export function useV2Contributions(
  entityType: "programs" | "capabilities" | "services" | "journeys" | "organizations" | "ecosystems" | "territories" | "beneficiaries",
  id: number | null
) {
  return useQuery({
    queryKey: ["v2-contributions", entityType, id],
    queryFn: () => fetcher(`/api/v2/${entityType}/${id}/contributions`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// 15. Beneficiaries (v2)
export function useV2Beneficiaries(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
  if (params.q) queryParams.append("q", params.q);
  if (params.drbest) queryParams.append("drbest", params.drbest);
  if (params.s3Domain) queryParams.append("s3Domain", params.s3Domain.toString());

  const url = `/api/v2/beneficiaries?${queryParams.toString()}`;
  return useQuery({
    queryKey: ["v2-beneficiaries-list", params],
    queryFn: () => fetcher(url),
    staleTime: 30 * 1000,
  });
}

export function useV2BeneficiaryDetail(id: number | null) {
  return useQuery({
    queryKey: ["v2-beneficiary-detail", id],
    queryFn: () => fetcher(`/api/v2/beneficiaries/${id}`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useV2BeneficiaryJourneys(id: number | null) {
  return useQuery({
    queryKey: ["v2-beneficiary-journeys", id],
    queryFn: () => fetcher(`/api/v2/beneficiaries/${id}/journeys`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useV2BeneficiaryServices(id: number | null) {
  return useQuery({
    queryKey: ["v2-beneficiary-services", id],
    queryFn: () => fetcher(`/api/v2/beneficiaries/${id}/services`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useV2BeneficiaryPrograms(id: number | null) {
  return useQuery({
    queryKey: ["v2-beneficiary-programs", id],
    queryFn: () => fetcher(`/api/v2/beneficiaries/${id}/programs`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useV2BeneficiaryProjects(id: number | null) {
  return useQuery({
    queryKey: ["v2-beneficiary-projects", id],
    queryFn: () => fetcher(`/api/v2/beneficiaries/${id}/projects`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// 16. Organizations (v2)
export function useV2Organizations() {
  return useQuery({
    queryKey: ["v2-organizations-list"],
    queryFn: () => fetcher("/api/v2/organizations"),
    staleTime: 30 * 1000,
  });
}

export function useV2OrganizationDetail(id: number | null) {
  return useQuery({
    queryKey: ["v2-organization-detail", id],
    queryFn: () => fetcher(`/api/v2/organizations/${id}`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useV2OrganizationServices(id: number | null) {
  return useQuery({
    queryKey: ["v2-organization-services", id],
    queryFn: () => fetcher(`/api/v2/organizations/${id}/services`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useV2OrganizationPrograms(id: number | null) {
  return useQuery({
    queryKey: ["v2-organization-programs", id],
    queryFn: () => fetcher(`/api/v2/organizations/${id}/programs`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useV2OrganizationProjects(id: number | null) {
  return useQuery({
    queryKey: ["v2-organization-projects", id],
    queryFn: () => fetcher(`/api/v2/organizations/${id}/projects`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useV2OrganizationEcosystems(id: number | null) {
  return useQuery({
    queryKey: ["v2-organization-ecosystems", id],
    queryFn: () => fetcher(`/api/v2/organizations/${id}/ecosystems`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useV2OrganizationTerritories(id: number | null) {
  return useQuery({
    queryKey: ["v2-organization-territories", id],
    queryFn: () => fetcher(`/api/v2/organizations/${id}/territories`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// 17. Ecosystems (v2)
export function useV2Ecosystems() {
  return useQuery({
    queryKey: ["v2-ecosystems-list"],
    queryFn: () => fetcher("/api/v2/ecosystems"),
    staleTime: 30 * 1000,
  });
}

// 18. Territories (v2)
export function useV2Territories() {
  return useQuery({
    queryKey: ["v2-territories-list"],
    queryFn: () => fetcher("/api/v2/territories"),
    staleTime: 30 * 1000,
  });
}

// 19. Ecosystem Detail (v2)
export function useV2EcosystemDetail(id: number | null) {
  return useQuery({
    queryKey: ["v2-ecosystem-detail", id],
    queryFn: () => fetcher(`/api/v2/ecosystems/${id}`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// 20. Territory Detail (v2)
export function useV2TerritoryDetail(id: number | null) {
  return useQuery({
    queryKey: ["v2-territory-detail", id],
    queryFn: () => fetcher(`/api/v2/territories/${id}`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// 21. DR-BEST global impact (v2)
export function useV2DrbestImpact() {
  return useQuery({
    queryKey: ["v2-drbest-impact"],
    queryFn: () => fetcher("/api/v2/drbest/impact"),
    staleTime: 30 * 1000,
  });
}
