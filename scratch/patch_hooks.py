with open("cpsv-ap-app/src/hooks/useV2Queries.ts", "r", encoding="utf-8") as f:
    content = f.read()

new_hooks = """

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
"""

with open("cpsv-ap-app/src/hooks/useV2Queries.ts", "w", encoding="utf-8") as f:
    f.write(content + new_hooks)

print("useV2Queries.ts successfully updated with new hooks and mutations!")
