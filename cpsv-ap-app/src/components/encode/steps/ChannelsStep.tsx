// src/components/encode/steps/ChannelsStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const channelTypes = [
  "Plateforme web",
  "Guichet physique",
  "Rendez-vous expert",
  "Workshop",
  "API",
  "Téléphone",
  "Email",
  "Événement collectif",
];

export default function ChannelsStep() {
  const { control, register, watch } = useFormContext();
  const allChannels = watch("channels.allChannels") || [];

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Canaux d’Accès (Access Channels)
        </h3>
        <p className="text-sm text-gray-500">
          Spécifiez les points d'entrée et modalités d'interaction mis à disposition de l'usager.
        </p>

        {/* Primary access channel */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Canal principal *
          </label>
          <Controller
            name="channels.primaryChannel"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez le canal principal" />
                </SelectTrigger>
                <SelectContent>
                  {channelTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* All secondary channels (multi-select) */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Canaux complémentaires disponibles
          </label>
          <Controller
            name="channels.allChannels"
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
                  <SelectValue placeholder="Ajouter des canaux secondaires" />
                </SelectTrigger>
                <SelectContent>
                  {channelTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {allChannels.map((c: string) => (
              <Badge key={c} variant="secondary" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {c}
              </Badge>
            ))}
          </div>
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            URL d’accès direct / Point de départ
          </label>
          <Input
            {...register("channels.url")}
            placeholder="ex. https://monespace.wallonie.be/services/..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SLA */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
              Délai moyen de réponse (SLA / Service Level Agreement)
            </label>
            <Input
              {...register("channels.sla")}
              placeholder="ex. 10 jours ouvrés"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
              Disponibilité / Horaires
            </label>
            <Input
              {...register("channels.availability")}
              placeholder="ex. 24h/24, 7j/7 ou Lu-Ve 9h-17h"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Localisation (si guichet physique)
          </label>
          <Input
            {...register("channels.location")}
            placeholder="ex. Avenue Prince de Liège 133, 5100 Namur"
          />
        </div>
      </div>
    </section>
  );
}
