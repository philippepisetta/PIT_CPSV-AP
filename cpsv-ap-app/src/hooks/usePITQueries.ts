// src/hooks/usePITQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getHeaders = (customHeaders?: Record<string, string>) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders
  };
  if (typeof window !== "undefined") {
    const activeWorkspace = localStorage.getItem("pit-active-workspace");
    if (activeWorkspace) {
      headers["x-user-role"] = activeWorkspace.toUpperCase();
    }
  }
  return headers;
};

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: getHeaders()
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return res.json();
};

export function useMetaQuery() {
  return useQuery({
    queryKey: ["meta"],
    queryFn: () => fetcher("/api/meta"),
  });
}

export function useGraphQuery() {
  return useQuery({
    queryKey: ["graph"],
    queryFn: () => fetcher("/api/graph"),
  });
}

export function useBeneficiariesQuery() {
  return useQuery({
    queryKey: ["beneficiaries"],
    queryFn: () => fetcher("/api/beneficiaries"),
  });
}

export function useServiceDeliveriesQuery(beneficiaryId?: number) {
  const url = beneficiaryId 
    ? `/api/service-deliveries?beneficiaryId=${beneficiaryId}` 
    : "/api/service-deliveries";
  return useQuery({
    queryKey: ["service-deliveries", beneficiaryId],
    queryFn: () => fetcher(url),
  });
}

export function useDatasetsQuery() {
  return useQuery({
    queryKey: ["datasets"],
    queryFn: () => fetcher("/api/datasets"),
  });
}

export function useEcosystemsQuery() {
  return useQuery({
    queryKey: ["ecosystems"],
    queryFn: () => fetcher("/api/ecosystems"),
  });
}

export function useJourneysQuery() {
  return useQuery({
    queryKey: ["journeys"],
    queryFn: () => fetcher("/api/journeys"),
  });
}

export function useKnowledgeAssetsQuery() {
  return useQuery({
    queryKey: ["knowledge-assets"],
    queryFn: () => fetcher("/api/knowledge-assets"),
  });
}

export function usePilotageQuery(filiereS3Id?: number, territoryId?: number) {
  const params = new URLSearchParams();
  if (filiereS3Id) params.append("filiereS3Id", filiereS3Id.toString());
  if (territoryId) params.append("territoryId", territoryId.toString());
  const url = `/api/pilotage?${params.toString()}`;
  return useQuery({
    queryKey: ["pilotage", filiereS3Id, territoryId],
    queryFn: () => fetcher(url),
  });
}

export function useStrategiesQuery() {
  return useQuery({
    queryKey: ["strategies"],
    queryFn: () => fetcher("/api/strategies"),
  });
}

export function useRecommenderQuery(beneficiaryId?: string) {
  return useQuery({
    queryKey: ["recommender", beneficiaryId],
    queryFn: () => fetcher(`/api/recommender/${beneficiaryId}`),
    enabled: !!beneficiaryId,
  });
}

export function useJourneyEnrollmentsQuery() {
  return useQuery({
    queryKey: ["journey-enrollments"],
    queryFn: () => fetcher("/api/journey-enrollments"),
  });
}

export function useCreateJourneyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (journeyData: any) => {
      const res = await fetch("/api/journeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journeyData),
      });
      if (!res.ok) throw new Error("Failed to save journey");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
    },
  });
}

export function useUpdateJourneyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: any }) => {
      const res = await fetch(`/api/journeys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update journey");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
    },
  });
}

export function useDeleteJourneyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await fetch(`/api/journeys/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete journey");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
    },
  });
}

// --- V2 WORKSPACE & STRATEGIC HOOKS ---

export function useV2MembersQuery(q?: string, type?: string) {
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (type) params.append("type", type);
  return useQuery({
    queryKey: ["v2-members", q, type],
    queryFn: () => fetcher(`/api/v2/members?${params.toString()}`),
  });
}

export function useV2CommunitiesQuery() {
  return useQuery({
    queryKey: ["v2-communities"],
    queryFn: () => fetcher("/api/v2/communities"),
  });
}

export function useV2OpportunitiesQuery(type?: string) {
  return useQuery({
    queryKey: ["v2-opportunities", type],
    queryFn: () => fetcher(type ? `/api/v2/opportunities?type=${type}` : "/api/v2/opportunities"),
  });
}

export function useV2ConsortiaQuery() {
  return useQuery({
    queryKey: ["v2-consortia"],
    queryFn: () => fetcher("/api/v2/consortia"),
  });
}

export function useV2CreateConsortiumMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (consortiumData: any) => {
      const res = await fetch("/api/v2/consortia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consortiumData),
      });
      if (!res.ok) throw new Error("Failed to create consortium");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-consortia"] });
    },
  });
}

export function useV2MissionsQuery() {
  return useQuery({
    queryKey: ["v2-missions"],
    queryFn: () => fetcher("/api/v2/strategic/missions"),
  });
}

export function useV2RoadmapsQuery() {
  return useQuery({
    queryKey: ["v2-roadmaps"],
    queryFn: () => fetcher("/api/v2/strategic/roadmaps"),
  });
}

export function useV2PortfoliosQuery() {
  return useQuery({
    queryKey: ["v2-portfolios"],
    queryFn: () => fetcher("/api/v2/strategic/portfolios"),
  });
}

export function useV2FrameworksQuery() {
  return useQuery({
    queryKey: ["v2-frameworks"],
    queryFn: () => fetcher("/api/v2/strategic/frameworks"),
  });
}

export function useV2EcosystemKpisQuery() {
  return useQuery({
    queryKey: ["v2-ecosystem-kpis"],
    queryFn: () => fetcher("/api/v2/ecosystem/kpis"),
  });
}

export function useV2EcosystemActivityQuery() {
  return useQuery({
    queryKey: ["v2-ecosystem-activity"],
    queryFn: () => fetcher("/api/v2/ecosystem/activity"),
  });
}

export function useV2GapAnalysisQuery() {
  return useQuery({
    queryKey: ["v2-gap-analysis"],
    queryFn: () => fetcher("/api/v2/ecosystem/gap-analysis"),
  });
}

export function useV2EvidencesQuery() {
  return useQuery({
    queryKey: ["v2-evidences"],
    queryFn: () => fetcher("/api/v2/strategic/evidences"),
  });
}

export function useV2UpdateEvidenceStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "APPROVED" | "REJECTED" | "PENDING" }) => {
      const res = await fetch(`/api/v2/strategic/evidences/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update evidence status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-evidences"] });
      queryClient.invalidateQueries({ queryKey: ["v2-missions"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["pilotage"] });
    },
  });
}

// --- ADDITIONAL CRUDS AND MUTATIONS (v2.6.0) ---

export function useV2ChallengesQuery() {
  return useQuery({
    queryKey: ["v2-challenges"],
    queryFn: () => fetcher("/api/v2/challenges"),
  });
}

export function useV2ChallengeCategoriesQuery() {
  return useQuery({
    queryKey: ["v2-challenge-categories"],
    queryFn: () => fetcher("/api/v2/challenge-categories"),
  });
}

// Member Mutations
export function useV2CreateMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/members", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-members"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2UpdateMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/members/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-members"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2DeleteMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/members/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-members"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

// Challenge Mutations
export function useV2CreateChallengeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/challenges", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create challenge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2UpdateChallengeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/challenges/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update challenge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2DeleteChallengeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/challenges/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete challenge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

// Services CRUD Mutations
export function useV2CreateServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/services", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2UpdateServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/services/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2DeleteServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/services/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

// Communities Mutations
export function useV2CommunitiesListQuery() {
  return useQuery({
    queryKey: ["v2-communities-list"],
    queryFn: () => fetcher("/api/v2/communities"),
  });
}

export function useV2CreateCommunityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/communities", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create community");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-communities-list"] });
      queryClient.invalidateQueries({ queryKey: ["v2-communities"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2UpdateCommunityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/communities/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update community");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-communities-list"] });
      queryClient.invalidateQueries({ queryKey: ["v2-communities"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2DeleteCommunityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/communities/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete community");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-communities-list"] });
      queryClient.invalidateQueries({ queryKey: ["v2-communities"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

// Activity & Attendance Mutations
export function useV2ActivitiesListQuery() {
  return useQuery({
    queryKey: ["v2-activities-list"],
    queryFn: () => fetcher("/api/v2/activities"),
  });
}

export function useV2CreateActivityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/activities", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create activity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-activities-list"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2UpdateActivityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/activities/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update activity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-activities-list"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2SaveAttendanceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ activityId, attendance }: { activityId: number; attendance: any[] }) => {
      const res = await fetch(`/api/v2/activities/${activityId}/attendance`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ attendance }),
      });
      if (!res.ok) throw new Error("Failed to save attendance");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-activities-list"] });
    },
  });
}

// Taxonomy Registry Hooks
export function useV2TaxonomyRegistryQuery() {
  return useQuery({
    queryKey: ["taxonomy-registry"],
    queryFn: () => fetcher("/api/v2/taxonomy-registry"),
  });
}

export function useV2TaxonomyTermsQuery(taxonomyName: string) {
  return useQuery({
    queryKey: ["taxonomy-terms", taxonomyName],
    queryFn: () => fetcher(`/api/v2/taxonomy-registry/terms/${taxonomyName}`),
    enabled: !!taxonomyName,
  });
}

export function useV2TaxonomyAlignMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { entityType: string; entityId: number; taxonomyName: string; termId: number }) => {
      const res = await fetch("/api/v2/taxonomy-registry/align", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to align taxonomy term");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-members"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

// Lineage Tracing Query
export function useV2LineageQuery(entityType: string, id: number) {
  return useQuery({
    queryKey: ["lineage", entityType, id],
    queryFn: () => fetcher(`/api/v2/lineage/${entityType}/${id}`),
    enabled: !!entityType && !!id,
  });
}

// Project/Outcome/Evidence CRUD
export function useV2CreateOutcomeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/outcomes", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create outcome");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2CreateEvidenceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/evidences", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create evidence");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-evidences"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2DeleteProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/projects/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2UpdateConsortiumMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/consortia/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update consortium");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-consortia"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2DeleteConsortiumMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/consortia/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete consortium");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-consortia"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2CreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/projects", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2UpdateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/projects/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2UpdateOutcomeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/outcomes/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update outcome");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2DeleteOutcomeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/outcomes/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete outcome");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2UpdateEvidenceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/evidences/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update evidence");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-evidences"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2DeleteEvidenceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/evidences/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete evidence");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-evidences"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
}

export function useV2ProjectsQuery() {
  return useQuery({
    queryKey: ["v2-projects"],
    queryFn: () => fetcher("/api/v2/projects"),
  });
}

export function useV2OutcomesQuery() {
  return useQuery({
    queryKey: ["v2-outcomes"],
    queryFn: () => fetcher("/api/v2/outcomes"),
  });
}

export function useV2FilieresQuery() {
  return useQuery({
    queryKey: ["v2-filieres"],
    queryFn: () => fetcher("/api/v2/filieres"),
  });
}

export function useV2ValueChainsQuery() {
  return useQuery({
    queryKey: ["v2-value-chains"],
    queryFn: () => fetcher("/api/v2/value-chains"),
  });
}

// --- ECOSYSTEM CHALLENGES (v2.7.0) ---
export function useV2EcosystemChallengesQuery() {
  return useQuery({
    queryKey: ["v2-ecosystem-challenges"],
    queryFn: () => fetcher("/api/v2/ecosystem-challenges"),
  });
}

export function useV2CreateEcosystemChallengeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/ecosystem-challenges", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create ecosystem challenge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-ecosystem-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2UpdateEcosystemChallengeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/ecosystem-challenges/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update ecosystem challenge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-ecosystem-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2DeleteEcosystemChallengeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/ecosystem-challenges/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete ecosystem challenge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-ecosystem-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

// --- FUNDING PROGRAMS (v2.7.0) ---
export function useV2FundingProgramsQuery() {
  return useQuery({
    queryKey: ["v2-funding-programs"],
    queryFn: () => fetcher("/api/v2/funding-programs"),
  });
}

export function useV2CreateFundingProgramMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/funding-programs", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create funding program");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-programs"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2UpdateFundingProgramMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/funding-programs/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update funding program");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-programs"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2DeleteFundingProgramMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/funding-programs/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete funding program");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-programs"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

// --- FUNDING CALLS (v2.7.0) ---
export function useV2FundingCallsQuery() {
  return useQuery({
    queryKey: ["v2-funding-calls"],
    queryFn: () => fetcher("/api/v2/funding-calls"),
  });
}

export function useV2CreateFundingCallMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/funding-calls", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create funding call");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-calls"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2UpdateFundingCallMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/funding-calls/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update funding call");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-calls"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2DeleteFundingCallMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/funding-calls/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete funding call");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-calls"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

// --- FUNDING INSTRUMENTS (v2.7.0) ---
export function useV2FundingInstrumentsQuery() {
  return useQuery({
    queryKey: ["v2-funding-instruments"],
    queryFn: () => fetcher("/api/v2/funding-instruments"),
  });
}

export function useV2CreateFundingInstrumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/funding-instruments", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create funding instrument");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-instruments"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2UpdateFundingInstrumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/funding-instruments/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update funding instrument");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-instruments"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2DeleteFundingInstrumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/funding-instruments/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete funding instrument");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-instruments"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

// --- FUNDING AWARDS (v2.7.0) ---
export function useV2FundingAwardsQuery() {
  return useQuery({
    queryKey: ["v2-funding-awards"],
    queryFn: () => fetcher("/api/v2/funding-awards"),
  });
}

export function useV2CreateFundingAwardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/v2/funding-awards", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create funding award");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-awards"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2UpdateFundingAwardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/v2/funding-awards/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update funding award");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-awards"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}

export function useV2DeleteFundingAwardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/v2/funding-awards/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete funding award");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v2-funding-awards"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      queryClient.invalidateQueries({ queryKey: ["meta"] });
    },
  });
}



