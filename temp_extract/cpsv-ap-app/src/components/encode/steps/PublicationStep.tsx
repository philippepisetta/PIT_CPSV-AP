// src/components/encode/steps/PublicationStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PublicationStep() {
  const { control } = useFormContext();

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Publication & Qualité
        </h3>
        <p className="text-sm text-gray-500">
          Workflow de publication finale et validation de conformité du service public.
        </p>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Statut du Workflow
          </label>
          <Controller
            name="publication.workflowStatus"
            control={control}
            defaultValue="Draft"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un statut de workflow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft (Brouillon)</SelectItem>
                  <SelectItem value="Review">Review (En cours de relecture)</SelectItem>
                  <SelectItem value="Approved">Approved (Approuvé)</SelectItem>
                  <SelectItem value="Published">Published (Publié en production)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
          💡 **Note sur l’interopérabilité** : Une fois publié, le service générera automatiquement son endpoint RDF sémantique officiel et sera synchronisé avec le catalogue sémantique national.
        </div>
      </div>
    </section>
  );
}
