// src/components/encode/steps/GeneralInfoStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input"; // assuming shadcn/ui input component
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TagInput } from "@/components/ui/TagInput";

export default function GeneralInfoStep() {
  const { control, register, formState } = useFormContext();
  const errors = formState.errors as any;

  return (
    <section className="space-y-4">
      {/* Nom du service */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Nom du service *
        </label>
        <Input
          {...register("generalInfo.name")}
          placeholder="ex. Diagnostic de maturité numérique"
        />
        {errors?.generalInfo?.name && (
          <p className="text-sm text-red-600 mt-1">{errors.generalInfo.name.message as string}</p>
        )}
      </div>

      {/* URI */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          URI du service
        </label>
        <Input
          {...register("generalInfo.uri")}
          placeholder="https://pit.wallonie.be/services/…"
        />
        {errors?.generalInfo?.uri && (
          <p className="text-sm text-red-600 mt-1">{errors.generalInfo.uri.message as string}</p>
        )}
      </div>

      {/* Description courte */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Description courte * (max 300 caractères)
        </label>
        <Textarea
          {...register("generalInfo.shortDescription")}
          rows={3}
          placeholder="Résumé du service…"
        />
        {errors?.generalInfo?.shortDescription && (
          <p className="text-sm text-red-600 mt-1">{errors.generalInfo.shortDescription.message as string}</p>
        )}
      </div>

      {/* Description détaillée */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Description détaillée
        </label>
        <Textarea
          {...register("generalInfo.description")}
          rows={5}
          placeholder="Description complète du service…"
        />
      </div>

      {/* Statut */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Statut
        </label>
        <Controller
          name="generalInfo.status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Langue */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Langue
        </label>
        <Controller
          name="generalInfo.language"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">fr</SelectItem>
                <SelectItem value="nl">nl</SelectItem>
                <SelectItem value="de">de</SelectItem>
                <SelectItem value="en">en</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Version, dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Version</label>
          <Input {...register("generalInfo.version")} placeholder="1.0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Date de création</label>
          <Input type="date" {...register("generalInfo.createdAt")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Date de mise à jour</label>
          <Input type="date" {...register("generalInfo.updatedAt")} />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Tags</label>
        <TagInput name="generalInfo.tags" control={control} />
      </div>

      {/* Thématiques */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Thématiques</label>
        <Controller
          name="generalInfo.themes"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(value: string) => {
              const arr = field.value ? [...field.value] : [];
              if (arr.includes(value)) {
                field.onChange(arr.filter((v: string) => v !== value));
              } else {
                field.onChange([...arr, value]);
              }
            }} multiple>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez des thématiques" />
              </SelectTrigger>
              <SelectContent>
                {["IA","Industrie 4.0","Cybersécurité","Financement","Export","Énergie","Circularité","Innovation","Formation"].map((t) => (
                  <SelectItem key={t} value={t}> {t} </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {control._formValues?.generalInfo?.themes?.map((t: string) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
