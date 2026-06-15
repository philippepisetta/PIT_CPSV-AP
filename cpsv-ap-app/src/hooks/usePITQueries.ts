// src/hooks/usePITQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetcher = async (url: string) => {
  const res = await fetch(url);
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
        headers: { "Content-Type": "application/json" },
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

