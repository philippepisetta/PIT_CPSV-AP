// src/components/encode/steps/BeneficiariesStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const orgTypes = ["Indépendant", "TPE", "PME", "Grande entreprise", "Administration", "Startup", "Centre recherche"];
const sizes = ["1-5", "5-20", "20-50", "50-250", "250+"];
const sectors = ["Manufacturing", "BioTech", "Energie", "Construction", "AgriTech", "Retail", "Smart City"];
const territories = ["Wallonie", "Bruxelles", "Flandre", "International"];

export default function BeneficiariesStep() {
  const { control, watch } = useFormContext();

  const selectedSectors = watch("beneficiaries.sectors") || [];
  const selectedSizes = watch("beneficiaries.companySizes") || [];
  const selectedTypes = watch("beneficiaries.orgTypes") || [];

  return (
    <div className="space-y-6">
      {/* Type d'organisation */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Type d’organisation concernée
        </label>
        <Controller
          name="beneficiaries.orgTypes"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(val: string) => {
              const current = field.value || [];
              if (current.includes(val)) field.onChange(current.filter((x: string) => x !== val));
              else field.onChange([...current, val]);
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez des types d'organisations" />
              </SelectTrigger>
              <SelectContent>
                {orgTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedTypes.map((t: string) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
        </div>
      </div>

      {/* Taille d'entreprise */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Taille de l'entreprise (nombre de salariés)
        </label>
        <Controller
          name="beneficiaries.companySizes"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(val: string) => {
              const current = field.value || [];
              if (current.includes(val)) field.onChange(current.filter((x: string) => x !== val));
              else field.onChange([...current, val]);
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez des tailles" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s} value={s}>{s} salariés</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedSizes.map((s: string) => (
            <Badge key={s} variant="secondary">{s} salariés</Badge>
          ))}
        </div>
      </div>

      {/* Secteurs d'activité */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Secteurs d’activité cibles
        </label>
        <Controller
          name="beneficiaries.sectors"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(val: string) => {
              const current = field.value || [];
              if (current.includes(val)) field.onChange(current.filter((x: string) => x !== val));
              else field.onChange([...current, val]);
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez des secteurs" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedSectors.map((s: string) => (
            <Badge key={s} variant="secondary">{s}</Badge>
          ))}
        </div>
      </div>

      {/* Territoire éligible */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Territoires éligibles
        </label>
        <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
          {territories.map((t) => (
            <Controller
              key={t}
              name="beneficiaries.territories"
              control={control}
              render={({ field }) => {
                const checked = field.value?.includes(t) || false;
                return (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(isChecked: any) => {
                        const current = field.value || [];
                        if (isChecked) field.onChange([...current, t]);
                        else field.onChange(current.filter((x: string) => x !== t));
                      }}
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-200">{t}</span>
                  </label>
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
