// src/lib/hooks.ts

import { useQuery, UseQueryResult } from "@tanstack/react-query";

/** Fetch JSON from the public/mock folder */
const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
};

/** Hook to fetch organisations */
export const useOrganisations = (): UseQueryResult<{ organisations: Array<{ id: string; name: string; type: string }> }, Error> => {
  return useQuery({
    queryKey: ["organisations"],
    queryFn: () =>
      fetchJson<{ organisations: Array<{ id: string; name: string; type: string }> }>(
        "/mock/organisations.json",
      ),
  });
};

/** Hook to fetch services */
export const useServices = (): UseQueryResult<{ services: Array<{ id: string; name: string; organisationId: string }> }, Error> => {
  return useQuery({
    queryKey: ["services"],
    queryFn: () =>
      fetchJson<{ services: Array<{ id: string; name: string; organisationId: string }> }>(
        "/mock/services.json",
      ),
  });
};

/** Hook to fetch relations */
export const useRelations = (): UseQueryResult<{ relations: Array<{ source: string; target: string; type: string }> }, Error> => {
  return useQuery({
    queryKey: ["relations"],
    queryFn: () =>
      fetchJson<{ relations: Array<{ source: string; target: string; type: string }> }>(
        "/mock/relations.json",
      ),
  });
};
