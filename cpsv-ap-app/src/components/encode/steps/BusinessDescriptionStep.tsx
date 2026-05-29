// src/components/encode/steps/BusinessDescriptionStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BusinessDescriptionStep() {
  const { control, register } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Objectif du service
        </label>
        <Textarea
          {...register("businessDescription.objective")}
          placeholder="ex. Structurer la démarche d'intégration des technologies IA dans le tissu industriel."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Problématique adressée
        </label>
        <Textarea
          {...register("businessDescription.problemSolved")}
          placeholder="ex. Manque de compétences internes en intelligence artificielle et risques d'investissements infructueux."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Valeur apportée aux PME / Territoire
        </label>
        <Textarea
          {...register("businessDescription.valueAdded")}
          placeholder="ex. Réduction du risque financier grâce au PoC pré-financé et montée en compétences immédiate des ingénieurs."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Niveau de maturité digitale ciblé
          </label>
          <Controller
            name="businessDescription.targetDigitalMaturity"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez le niveau cible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner (Débutant)</SelectItem>
                  <SelectItem value="Intermediate">Intermediate (Intermédiaire)</SelectItem>
                  <SelectItem value="Advanced">Advanced (Avancé)</SelectItem>
                  <SelectItem value="Expert">Expert (Expert sémantique)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Niveau TRL cible (Technology Readiness Level)
          </label>
          <Controller
            name="businessDescription.targetTRL"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez le TRL" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRL 1 - Principes de base">TRL 1 - Principes de base</SelectItem>
                  <SelectItem value="TRL 2 - Concept technologique">TRL 2 - Concept technologique</SelectItem>
                  <SelectItem value="TRL 3 - Preuve de concept">TRL 3 - Preuve de concept</SelectItem>
                  <SelectItem value="TRL 4 - Validation en labo">TRL 4 - Validation en labo</SelectItem>
                  <SelectItem value="TRL 5 - Validation en environnement représentatif">TRL 5 - Validation en environnement représentatif</SelectItem>
                  <SelectItem value="TRL 6 - Démonstration">TRL 6 - Démonstration</SelectItem>
                  <SelectItem value="TRL 7 - Prototype en environnement opérationnel">TRL 7 - Prototype en environnement opérationnel</SelectItem>
                  <SelectItem value="TRL 8 - Système qualifié">TRL 8 - Système qualifié</SelectItem>
                  <SelectItem value="TRL 9 - Déploiement commercial">TRL 9 - Déploiement commercial</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Transformation structurelle attendue
        </label>
        <Textarea
          {...register("businessDescription.expectedTransformation")}
          placeholder="ex. Automatisation de 40% des tâches manuelles de tri et amélioration de la souveraineté technologique locale."
          rows={3}
        />
      </div>
    </div>
  );
}
