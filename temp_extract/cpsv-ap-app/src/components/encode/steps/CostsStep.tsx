// src/components/encode/steps/CostsStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CostsStep() {
  const { control, register, watch } = useFormContext();
  const isFree = watch("costs.free");

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Coûts et conditions de financement
        </h3>

        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Service gratuit</h4>
            <p className="text-xs text-gray-500">Activez si ce service public ne nécessite aucun frais direct.</p>
          </div>
          <Controller
            name="costs.free"
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

        {!isFree && (
          <div className="space-y-4 pt-4 border-t border-dashed border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Coût HTVA (€)
                </label>
                <Input
                  type="number"
                  {...register("costs.amount", { valueAsNumber: true })}
                  placeholder="ex. 150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Devise
                </label>
                <Controller
                  name="costs.currency"
                  control={control}
                  defaultValue="EUR"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Coût subsidié</h4>
                <p className="text-xs text-gray-500">Le coût est-il pris en charge partiellement ou totalement par des subventions ?</p>
              </div>
              <Controller
                name="costs.subsidized"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
