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
  const page = params.page || 1;
  const pageSize = params.pageSize || 1000;
  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());
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


// ==========================================
// --- 22. NEW INTEROPERABILITY & CONVERSION HOOKS (v3.5.0) ---
// ==========================================

// GET activities for a beneficiary (both individual and collective participations)
export function useV2BeneficiaryActivities(id: number | null) {
  return useQuery({
    queryKey: ["v2-beneficiary-activities", id],
    queryFn: () => fetcher(`/api/v2/beneficiaries/${id}/activities`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// GET funding instruments (financements) for a beneficiary
export function useV2BeneficiaryFinancements(id: number | null) {
  return useQuery({
    queryKey: ["v2-beneficiary-financements", id],
    queryFn: () => fetcher(`/api/v2/beneficiaries/${id}/financements`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// GET outcomes (impacts) for a beneficiary
export function useV2BeneficiaryOutcomes(id: number | null) {
  return useQuery({
    queryKey: ["v2-beneficiary-outcomes", id],
    queryFn: () => fetcher(`/api/v2/beneficiaries/${id}/outcomes`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// GET Source Systems config (Registry)
export function useV2SourceSystemsQuery() {
  return useQuery({
    queryKey: ["v2-source-systems"],
    queryFn: () => fetcher("/api/v2/interoperability/source-systems"),
    staleTime: 30 * 1000,
  });
}

// POST Source System mutation
export function useV2CreateSourceSystemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/interoperability/source-systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur d'enregistrement du Source System.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-source-systems"] });
    },
  });
}

// GET Data Products config (Registry)
export function useV2DataProductsQuery() {
  return useQuery({
    queryKey: ["v2-data-products"],
    queryFn: () => fetcher("/api/v2/interoperability/data-products"),
    staleTime: 30 * 1000,
  });
}

// POST Data Product mutation
export function useV2CreateDataProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/interoperability/data-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur d'enregistrement du Data Product.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-data-products"] });
    },
  });
}

// Conversion Mutation: Activity ➔ Journey
export function useV2ConvertActivityToJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { beneficiaryId: number; journeyId: number; startDate?: string }) => {
      const res = await fetch("/api/journey-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beneficiaryId: payload.beneficiaryId,
          journeyId: payload.journeyId,
          startDate: payload.startDate || new Date().toISOString(),
          status: "ENROLLED",
        }),
      });
      if (!res.ok) throw new Error("Échec de la conversion de l'activité en Parcours.");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-journeys", variables.beneficiaryId] });
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-detail", variables.beneficiaryId] });
    },
  });
}

// Conversion Mutation: Activity ➔ Service Delivery
export function useV2ConvertActivityToService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { beneficiaryId: number; serviceId: number; operatorId: number }) => {
      const res = await fetch("/api/service-deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beneficiaryId: payload.beneficiaryId,
          serviceId: payload.serviceId,
          operatorId: payload.operatorId,
          status: "COMPLETED",
          date: new Date().toISOString(),
          outputReal: "Service initié automatiquement depuis une activité d'animation.",
        }),
      });
      if (!res.ok) throw new Error("Échec de la conversion de l'activité en Service.");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-services", variables.beneficiaryId] });
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-detail", variables.beneficiaryId] });
    },
  });
}

// Conversion Mutation: Activity ➔ Funding Opportunity
export function useV2ConvertActivityToFunding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { beneficiaryId: number; fundingInstrumentId: number }) => {
      const res = await fetch(`/api/v2/beneficiaries/${payload.beneficiaryId}/financements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fundingInstrumentId: payload.fundingInstrumentId,
        }),
      });
      if (!res.ok) throw new Error("Échec de la conversion de l'activité en Financement.");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-financements", variables.beneficiaryId] });
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-detail", variables.beneficiaryId] });
    },
  });
}

// CREATE Beneficiary mutation
export function useV2CreateBeneficiaryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/beneficiaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur de création du bénéficiaire.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiaries-list"] });
    },
  });
}

// UPDATE Beneficiary mutation
export function useV2UpdateBeneficiaryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/beneficiaries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur de mise à jour du bénéficiaire.");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiaries-list"] });
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-detail", variables.id] });
    },
  });
}

// DELETE (soft delete) Beneficiary mutation
export function useV2DeleteBeneficiaryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/beneficiaries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur de suppression du bénéficiaire.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiaries-list"] });
    },
  });
}

// GET contacts for a beneficiary
export function useV2BeneficiaryContacts(beneficiaryId: number | null) {
  return useQuery({
    queryKey: ["v2-beneficiary-contacts", beneficiaryId],
    queryFn: () => fetcher(`/api/v2/beneficiaries/${beneficiaryId}/contacts`),
    enabled: beneficiaryId !== null && !isNaN(beneficiaryId),
  });
}

// CREATE Contact mutation
export function useV2CreateContactMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur de création du contact.");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-contacts", variables.beneficiaryId] });
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-detail", variables.beneficiaryId] });
    },
  });
}

// UPDATE Contact mutation
export function useV2UpdateContactMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur de mise à jour du contact.");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-contacts", variables.data.beneficiaryId] });
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-detail", variables.data.beneficiaryId] });
    },
  });
}

// DELETE Contact mutation
export function useV2DeleteContactMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, beneficiaryId }: { id: number; beneficiaryId: number }) => {
      const res = await fetch(`/api/v2/contacts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur de suppression du contact.");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-contacts", variables.beneficiaryId] });
      queryClient.invalidateQueries({ queryKey: ["v2-beneficiary-detail", variables.beneficiaryId] });
    },
  });
}

// CREATE membership mutation
export function useV2CreateMembershipMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/community-memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur d'adhésion.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-communities-list"] });
      queryClient.invalidateQueries({ queryKey: ["v2-communities"] });
    },
  });
}

// UPDATE membership mutation
export function useV2UpdateMembershipMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/community-memberships/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur de mise à jour d'adhésion.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-communities-list"] });
      queryClient.invalidateQueries({ queryKey: ["v2-communities"] });
    },
  });
}

// DELETE membership mutation
export function useV2DeleteMembershipMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/community-memberships/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur de suppression d'adhésion.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-communities-list"] });
      queryClient.invalidateQueries({ queryKey: ["v2-communities"] });
    },
  });
}

// --------------------------------------------------
// PIT vNext — Vulnerability Queries (Phase 4.2)
// --------------------------------------------------
export function useV2Vulnerabilities() {
  return useQuery({
    queryKey: ["v2-vulnerabilities"],
    queryFn: () => fetcher("/api/v2/vulnerabilities"),
    staleTime: 30 * 1000,
  });
}

export function useV2VulnerabilityDetail(id: number | null) {
  return useQuery({
    queryKey: ["v2-vulnerability-detail", id],
    queryFn: () => fetcher(`/api/v2/vulnerabilities/${id}`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

// --------------------------------------------------
// PHASE 6: STABLE REFERENCE FRAMEWORKS, S3/DIS & DATA SPACES HOOKS
// --------------------------------------------------

export function useV2S3Clusters() {
  return useQuery({
    queryKey: ["v2-s3-clusters"],
    queryFn: () => fetcher("/api/v2/s3-clusters"),
    staleTime: 30 * 1000,
  });
}

export function useV2S3MarketApplications() {
  return useQuery({
    queryKey: ["v2-s3-market-applications"],
    queryFn: () => fetcher("/api/v2/s3-market-applications"),
    staleTime: 30 * 1000,
  });
}


export function useV2ReferenceFrameworks() {
  return useQuery({
    queryKey: ["v2-reference-frameworks"],
    queryFn: () => fetcher("/api/v2/reference-frameworks"),
    staleTime: 30 * 1000,
  });
}

export function useV2ReferenceFrameworkDetail(id: number | null) {
  return useQuery({
    queryKey: ["v2-reference-framework-detail", id],
    queryFn: () => fetcher(`/api/v2/reference-frameworks/${id}`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useV2ReferenceSources() {
  return useQuery({
    queryKey: ["v2-reference-sources"],
    queryFn: () => fetcher("/api/v2/reference-sources"),
    staleTime: 30 * 1000,
  });
}

export function useV2ReferenceTaxonomies() {
  return useQuery({
    queryKey: ["v2-reference-taxonomies"],
    queryFn: () => fetcher("/api/v2/reference-taxonomies"),
    staleTime: 30 * 1000,
  });
}

export function useV2ReferenceConcepts() {
  return useQuery({
    queryKey: ["v2-reference-concepts"],
    queryFn: () => fetcher("/api/v2/reference-concepts"),
    staleTime: 30 * 1000,
  });
}

export function useV2ReferenceMappings() {
  return useQuery({
    queryKey: ["v2-reference-mappings"],
    queryFn: () => fetcher("/api/v2/reference-mappings"),
    staleTime: 30 * 1000,
  });
}

export function useV2S3ReferenceTaxonomies() {
  return useQuery({
    queryKey: ["v2-s3-reference-taxonomies"],
    queryFn: () => fetcher("/api/v2/s3-reference-taxonomies"),
    staleTime: 30 * 1000,
  });
}

export function useV2S3Priorities() {
  return useQuery({
    queryKey: ["v2-s3-priorities"],
    queryFn: () => fetcher("/api/v2/s3-priorities"),
    staleTime: 30 * 1000,
  });
}

export function useV2DIS() {
  return useQuery({
    queryKey: ["v2-dis"],
    queryFn: () => fetcher("/api/v2/dis"),
    staleTime: 30 * 1000,
  });
}

export function useV2S3Methodology() {
  return useQuery({
    queryKey: ["v2-s3-methodology"],
    queryFn: () => fetcher("/api/v2/s3-methodology"),
    staleTime: 30 * 1000,
  });
}

export function useV2S3Indicators() {
  return useQuery({
    queryKey: ["v2-s3-indicators"],
    queryFn: () => fetcher("/api/v2/s3-indicators"),
    staleTime: 30 * 1000,
  });
}

export function useV2NaceCodes() {
  return useQuery({
    queryKey: ["v2-nace-codes"],
    queryFn: () => fetcher("/api/v2/nace-codes"),
    staleTime: 30 * 1000,
  });
}

export function useV2NabsCodes() {
  return useQuery({
    queryKey: ["v2-nabs-codes"],
    queryFn: () => fetcher("/api/v2/nabs-codes"),
    staleTime: 30 * 1000,
  });
}

export function useV2DataSpaceReferenceFrameworks() {
  return useQuery({
    queryKey: ["v2-data-space-reference-frameworks"],
    queryFn: () => fetcher("/api/v2/data-space-reference-frameworks"),
    staleTime: 30 * 1000,
  });
}

export function useV2CommonEuropeanDataSpaceDomains() {
  return useQuery({
    queryKey: ["v2-common-european-data-space-domains"],
    queryFn: () => fetcher("/api/v2/common-european-data-space-domains"),
    staleTime: 30 * 1000,
  });
}

export function useV2DataSpaceBuildingBlocks() {
  return useQuery({
    queryKey: ["v2-data-space-building-blocks"],
    queryFn: () => fetcher("/api/v2/data-space-building-blocks"),
    staleTime: 30 * 1000,
  });
}

export function useV2InteroperabilityStandards() {
  return useQuery({
    queryKey: ["v2-interoperability-standards"],
    queryFn: () => fetcher("/api/v2/interoperability-standards"),
    staleTime: 30 * 1000,
  });
}

export function useV2SemanticProfiles() {
  return useQuery({
    queryKey: ["v2-semantic-profiles"],
    queryFn: () => fetcher("/api/v2/semantic-profiles"),
    staleTime: 30 * 1000,
  });
}

export function useV2SourceDocuments() {
  return useQuery({
    queryKey: ["v2-source-documents"],
    queryFn: () => fetcher("/api/v2/source-documents"),
    staleTime: 30 * 1000,
  });
}

export function useV2SourceDocumentMappings() {
  return useQuery({
    queryKey: ["v2-source-document-mappings"],
    queryFn: () => fetcher("/api/v2/source-document-mappings"),
    staleTime: 30 * 1000,
  });
}

