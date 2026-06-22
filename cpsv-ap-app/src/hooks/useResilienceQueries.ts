// cpsv-ap-app/src/hooks/useResilienceQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return res.json();
};

export function useResilienceRisks(params?: Record<string, string>) {
  const queryParams = new URLSearchParams(params);
  const url = `/api/resilience/risks?${queryParams.toString()}`;
  return useQuery({
    queryKey: ["resilience-risks", params],
    queryFn: () => fetcher(url),
    staleTime: 30 * 1000,
  });
}

export function useResilienceRiskDetail(id: number | null) {
  return useQuery({
    queryKey: ["resilience-risk-detail", id],
    queryFn: () => fetcher(`/api/resilience/risks/${id}`),
    enabled: id !== null && !isNaN(id),
    staleTime: 30 * 1000,
  });
}

export function useResilienceRegisters() {
  return useQuery({
    queryKey: ["resilience-registers"],
    queryFn: () => fetcher("/api/resilience/risk-registers"),
    staleTime: 30 * 1000,
  });
}

export function useResilienceScenarios() {
  return useQuery({
    queryKey: ["resilience-scenarios"],
    queryFn: () => fetcher("/api/resilience/scenarios"),
    staleTime: 30 * 1000,
  });
}

export function useResilienceProfiles(params?: Record<string, string>) {
  const queryParams = new URLSearchParams(params);
  return useQuery({
    queryKey: ["resilience-profiles", params],
    queryFn: () => fetcher(`/api/resilience/resilience-profiles?${queryParams.toString()}`),
    staleTime: 30 * 1000,
  });
}

export function useResilienceImpacts() {
  return useQuery({
    queryKey: ["resilience-impacts"],
    queryFn: () => fetcher("/api/resilience/resilience-impacts"),
    staleTime: 30 * 1000,
  });
}

export function useResilienceMeasures() {
  return useQuery({
    queryKey: ["resilience-measures"],
    queryFn: () => fetcher("/api/resilience/resilience-measures"),
    staleTime: 30 * 1000,
  });
}

export function useTerritorialAssets() {
  return useQuery({
    queryKey: ["territorial-assets"],
    queryFn: () => fetcher("/api/resilience/territorial-assets"),
    staleTime: 30 * 1000,
  });
}

export function useResilienceDependencies() {
  return useQuery({
    queryKey: ["resilience-dependencies"],
    queryFn: () => fetcher("/api/resilience/dependencies"),
    staleTime: 30 * 1000,
  });
}

export function useCriticalInfrastructures() {
  return useQuery({
    queryKey: ["critical-infrastructures"],
    queryFn: () => fetcher("/api/resilience/critical-infrastructures"),
    staleTime: 30 * 1000,
  });
}

export function useResilienceVulnerabilities() {
  return useQuery({
    queryKey: ["resilience-vulnerabilities"],
    queryFn: () => fetcher("/api/resilience/vulnerabilities"),
    staleTime: 30 * 1000,
  });
}
