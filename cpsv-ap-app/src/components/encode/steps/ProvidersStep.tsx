// src/components/encode/steps/ProvidersStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const partnersList = [
  "Agence du Numérique",
  "Wallonie Entreprendre",
  "AWEX",
  "UCM",
  "AKT",
  "WBI",
  "Pôle Mecatech",
  "Cluster Tweed",
  "SPW EER"
];

export default function ProvidersStep() {
  const { control, register, watch } = useFormContext();
  const selectedPartners = watch("providers.partners") || [];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200/50 dark:border-gray-800 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-primary-500">
          Fournisseur Principal
        </h3>
        
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Organisation principale *
          </label>
          <Controller
            name="providers.primaryProvider"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez l'organisation" />
                </SelectTrigger>
                <SelectContent>
                  {partnersList.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200/50 dark:border-gray-800 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-green-500">
          Organisations partenaires
        </h3>
        
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Partenaires institutionnels
          </label>
          <Controller
            name="providers.partners"
            control={control}
            render={({ field }) => (
              <Select onValueChange={(val: string) => {
                const current = field.value || [];
                if (current.includes(val)) {
                  field.onChange(current.filter((x: string) => x !== val));
                } else {
                  field.onChange([...current, val]);
                }
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez des partenaires" />
                </SelectTrigger>
                <SelectContent>
                  {partnersList.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedPartners.map((p: string) => (
              <Badge key={p} variant="secondary" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200/50 dark:border-gray-800 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-blue-500">
          Point de Contact
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Responsable / Contact</label>
            <Input {...register("providers.contactName")} placeholder="ex. Jean Dupont" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Email professionnel</label>
            <Input type="email" {...register("providers.contactEmail")} placeholder="ex. contact@pit.wallonie.be" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Téléphone</label>
            <Input {...register("providers.contactPhone")} placeholder="ex. +32 (0) 81 22 22 22" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Site Web officiel</label>
            <Input {...register("providers.website")} placeholder="ex. https://adn.be" />
          </div>
        </div>
      </div>
    </div>
  );
}
