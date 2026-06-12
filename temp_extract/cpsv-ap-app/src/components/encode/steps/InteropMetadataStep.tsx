// src/components/encode/steps/InteropMetadataStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/TagInput";

export default function InteropMetadataStep() {
  const { control, register } = useFormContext();

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Interopérabilité & Métadonnées Sémantiques
        </h3>
        <p className="text-sm text-gray-500">
          Intégrez votre service aux catalogues d'interopérabilité européens (SEMIC, CPSV‑AP) et régionaux.
        </p>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Version officielle du modèle CPSV‑AP
          </label>
          <Input
            {...register("interop.cpsvVersion")}
            defaultValue="3.0.0"
            placeholder="3.0.0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Vocabulaire de référence (SEMIC Namespace)
          </label>
          <Input
            {...register("interop.semicVocab")}
            defaultValue="http://data.europa.eu/m8g/"
            placeholder="http://data.europa.eu/m8g/"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Identifiant territorial externe (External ID)
          </label>
          <Input
            {...register("interop.externalId")}
            placeholder="ex. BE-SPW-SVC-042"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Identifiants NGSI‑LD (Smart Region Integration)
          </label>
          <Controller
            name="interop.ngsiLdTags"
            control={control}
            render={({ field }) => (
              <Input
                value={(field.value as string[])?.join(", ") || ""}
                onChange={(e) => field.onChange(e.target.value.split(/[,;\s]+/).map(x => x.trim()).filter(Boolean))}
                placeholder="ex. urn:ngsi-ld:PublicService:042, urn:ngsi-ld:Organization:ADN"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Linked Open Datasets (Jeux de données associés)
          </label>
          <Controller
            name="interop.linkedDatasets"
            control={control}
            render={({ field }) => (
              <Input
                value={(field.value as string[])?.join(", ") || ""}
                onChange={(e) => field.onChange(e.target.value.split(/[,;\s]+/).map(x => x.trim()).filter(Boolean))}
                placeholder="ex. https://data.wallonie.be/dataset/pme, https://data.europa.eu/dataset/cpsv"
              />
            )}
          />
        </div>
      </div>
    </section>
  );
}
