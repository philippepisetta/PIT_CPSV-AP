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
