// src/components/encode/steps/ConditionsStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ConditionsStep() {
  const { control } = useFormContext();

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
            Conditions et critères d’éligibilité (Rule Builder)
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Configurez les contraintes réglementaires et conditions d'accès logiques.
          </p>
        </div>

        {/* Global operators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500 uppercase">Opérateur logique</label>
            <Controller
              name="conditions.operator"
              control={control}
              defaultValue="AND"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Opérateur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">ET (AND) - Toutes requises</SelectItem>
                    <SelectItem value="OR">OU (OR) - Une seule requise</SelectItem>
                    <SelectItem value="NOT">NON (NOT) - Exclusion logique</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-center justify-between px-2 pt-4 md:pt-0">
            <div>
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Numéro BCE requis</h4>
              <p className="text-[10px] text-gray-400">Vérifie l'existence légale</p>
            </div>
            <Controller
              name="conditions.hasValidBce"
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between px-2 pt-4 md:pt-0">
            <div>
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Localisation Wallonne</h4>
              <p className="text-[10px] text-gray-400">Siège social / exploitation</p>
            </div>
            <Controller
              name="conditions.isWalloon"
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Dynamic Rules list */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
            Règles d'éligibilité personnalisées
          </label>
          <Controller
            name="conditions.rules"
            control={control}
            defaultValue={["Être une PME wallonne active dans l'innovation", "Avoir un niveau de maturité digitale intermediate"]}
            render={({ field }) => {
              const list = field.value || [];
              const addRule = () => field.onChange([...list, ""]);
              const updateRule = (idx: number, val: string) => {
                const updated = [...list];
                updated[idx] = val;
                field.onChange(updated);
              };
              const removeRule = (idx: number) => {
                field.onChange(list.filter((_: any, i: number) => i !== idx));
              };

              return (
                <div className="space-y-3">
                  {list.map((rule: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 whitespace-nowrap">RÈGLE {idx + 1}</span>
                      <Input
                        value={rule}
                        onChange={(e) => updateRule(idx, e.target.value)}
                        placeholder="ex. Consommation minimale de 100 MWh/an"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeRule(idx)}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline px-2 py-1"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRule}
                    className="mt-2 text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-200 font-semibold transition hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    + Ajouter une règle d'éligibilité
                  </button>
                </div>
              );
            }}
          />
        </div>
      </div>
    </section>
  );
}
