// src/components/encode/steps/OrganisationStep.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

export default function OrganisationStep() {
  const { register, formState } = useFormContext();
  const errors = formState.errors as any;

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Organisation Principale (Compétente)
        </h3>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Nom de l’organisation *
          </label>
          <Input
            {...register("organisation.primary.name")}
            placeholder="ex. Agence du Numérique"
          />
          {errors?.organisation?.primary?.name && (
            <p className="text-sm text-red-600 mt-1">{errors.organisation.primary.name.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Point de contact
          </label>
          <Input
            {...register("organisation.primary.contactPoint")}
            placeholder="ex. Service relation client"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Adresse email
          </label>
          <Input
            type="email"
            {...register("organisation.primary.email")}
            placeholder="ex. contact@adn.be"
          />
          {errors?.organisation?.primary?.email && (
            <p className="text-sm text-red-600 mt-1">{errors.organisation.primary.email.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Téléphone
          </label>
          <Input
            {...register("organisation.primary.phone")}
            placeholder="ex. +32 81 00 00 00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Site web de l’organisation
          </label>
          <Input
            {...register("organisation.primary.website")}
            placeholder="ex. https://www.adn.be"
          />
          {errors?.organisation?.primary?.website && (
            <p className="text-sm text-red-600 mt-1">{errors.organisation.primary.website.message as string}</p>
          )}
        </div>
      </div>
    </section>
  );
}
