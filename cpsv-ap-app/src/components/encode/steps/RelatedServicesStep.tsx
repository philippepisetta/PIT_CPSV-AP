// src/components/encode/steps/RelatedServicesStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const mockServicesList = [
  { id: "svc-1", name: "Diagnostic de maturité numérique PME" },
  { id: "svc-2", name: "Accompagnement transformation digitale industrie 4.0" },
  { id: "svc-3", name: "Programme expérimentation IA industrielle" },
  { id: "svc-4", name: "Recherche de financement innovation" },
  { id: "svc-5", name: "Accompagnement export international digital" },
  { id: "svc-6", name: "Parcours cybersécurité PME" },
  { id: "svc-7", name: "Programme transition énergétique industrielle" },
  { id: "svc-8", name: "Détection de consortiums innovation S3" },
  { id: "svc-9", name: "Mise en relation partenaires IA & industrie" },
  { id: "svc-10", name: "Accompagnement stratégie données territoriales" },
];

export default function RelatedServicesStep() {
  const { control, watch } = useFormContext();

  const selectedPre = watch("relatedServices.prerequisites") || [];
  const selectedComp = watch("relatedServices.complementary") || [];
  const selectedNext = watch("relatedServices.recommendedNext") || [];
  const selectedSucc = watch("relatedServices.successors") || [];

  const getServiceName = (id: string) => {
    return mockServicesList.find((s) => s.id === id)?.name || id;
  };

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
            Services Liés (Relations Sémantiques du Graphe)
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Définissez les dépendances et relations sémantiques entre ce service public et d’autres dispositifs territoriaux.
          </p>
        </div>

        {/* 1. Prerequisites */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Services Prérequis (prerequisites)
          </label>
          <Controller
            name="relatedServices.prerequisites"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val: string) => {
                  const current = field.value || [];
                  if (current.includes(val)) {
                    field.onChange(current.filter((x: string) => x !== val));
                  } else {
                    field.onChange([...current, val]);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un prérequis" />
                </SelectTrigger>
                <SelectContent>
                  {mockServicesList.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedPre.map((id: string) => (
              <Badge key={id} variant="secondary" className="bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900">
                {getServiceName(id)}
              </Badge>
            ))}
          </div>
        </div>

        {/* 2. Complementary */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Services Complémentaires (complementary)
          </label>
          <Controller
            name="relatedServices.complementary"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val: string) => {
                  const current = field.value || [];
                  if (current.includes(val)) {
                    field.onChange(current.filter((x: string) => x !== val));
                  } else {
                    field.onChange([...current, val]);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un service complémentaire" />
                </SelectTrigger>
                <SelectContent>
                  {mockServicesList.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedComp.map((id: string) => (
              <Badge key={id} variant="secondary" className="bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900">
                {getServiceName(id)}
              </Badge>
            ))}
          </div>
        </div>

        {/* 3. Recommended Next */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Étape Suivante Recommandée (recommendedNext)
          </label>
          <Controller
            name="relatedServices.recommendedNext"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val: string) => {
                  const current = field.value || [];
                  if (current.includes(val)) {
                    field.onChange(current.filter((x: string) => x !== val));
                  } else {
                    field.onChange([...current, val]);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez le prochain service" />
                </SelectTrigger>
                <SelectContent>
                  {mockServicesList.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedNext.map((id: string) => (
              <Badge key={id} variant="secondary" className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                {getServiceName(id)}
              </Badge>
            ))}
          </div>
        </div>

        {/* 4. Successors */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Services Successeurs Directs (successors)
          </label>
          <Controller
            name="relatedServices.successors"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val: string) => {
                  const current = field.value || [];
                  if (current.includes(val)) {
                    field.onChange(current.filter((x: string) => x !== val));
                  } else {
                    field.onChange([...current, val]);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un successeur" />
                </SelectTrigger>
                <SelectContent>
                  {mockServicesList.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedSucc.map((id: string) => (
              <Badge key={id} variant="secondary" className="bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                {getServiceName(id)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
