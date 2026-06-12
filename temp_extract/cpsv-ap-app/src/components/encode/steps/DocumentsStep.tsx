// src/components/encode/steps/DocumentsStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formats = ["PDF", "XML", "JSON-LD", "Scanné (PNG/JPG)", "Formulaire en ligne", "Papier original"];

export default function DocumentsStep() {
  const { control } = useFormContext();

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Documents et Preuves requis (Evidence)
        </h3>
        <p className="text-sm text-gray-500">
          Définissez les pièces justificatives ou documents d'analyse à fournir par l'usager lors de sa demande.
        </p>

        <Controller
          name="documents.requiredDocs"
          control={control}
          defaultValue={[{ name: "Comptes annuels des 2 derniers exercices", format: "PDF", isMandatory: true, expirationMonths: 12 }]}
          render={({ field }) => {
            const list = field.value || [];
            const addDoc = () => field.onChange([...list, { name: "", format: "PDF", isMandatory: false, expirationMonths: 0 }]);
            const updateDoc = (idx: number, key: string, val: any) => {
              const updated = [...list];
              updated[idx] = { ...updated[idx], [key]: val };
              field.onChange(updated);
            };
            const removeDoc = (idx: number) => {
              field.onChange(list.filter((_: any, i: number) => i !== idx));
            };

            return (
              <div className="space-y-4">
                {list.map((doc: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200/50 dark:border-gray-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">DOCUMENT / PREUVE {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeDoc(idx)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Nom du document</label>
                        <Input
                          value={doc.name}
                          onChange={(e) => updateDoc(idx, "name", e.target.value)}
                          placeholder="ex. Numéro BCE, Diagnostic initial..."
                        />
                      </div>

                      {/* Format */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Format accepté</label>
                        <Select
                          onValueChange={(val: string) => updateDoc(idx, "format", val)}
                          defaultValue={doc.format}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionnez un format" />
                          </SelectTrigger>
                          <SelectContent>
                            {formats.map((f) => (
                              <SelectItem key={f} value={f}>{f}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Expiration months */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Durée d'expiration (en mois - 0 si illimité)</label>
                        <Input
                          type="number"
                          value={doc.expirationMonths || ""}
                          onChange={(e) => updateDoc(idx, "expirationMonths", parseInt(e.target.value) || 0)}
                          placeholder="ex. 12"
                        />
                      </div>

                      {/* Mandatory check */}
                      <div className="flex items-center space-x-2 pt-5">
                        <Checkbox
                          checked={doc.isMandatory}
                          onCheckedChange={(checked: any) => updateDoc(idx, "isMandatory", !!checked)}
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-200 font-semibold">Obligatoire</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDoc}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-200 font-semibold transition hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  + Ajouter une preuve requise
                </button>
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}
