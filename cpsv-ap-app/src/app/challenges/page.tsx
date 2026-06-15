// src/app/challenges/page.tsx
"use client";

import { useState } from "react";
import { Target, AlertCircle, Plus, Edit2, Trash2, X } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import {
  useV2ChallengesQuery,
  useV2ChallengeCategoriesQuery,
  useV2CreateChallengeMutation,
  useV2UpdateChallengeMutation,
  useV2DeleteChallengeMutation
} from "@/hooks/usePITQueries";

export default function ChallengesPage() {
  const { data: challengesRes, isLoading } = useV2ChallengesQuery();
  const { data: categoriesRes } = useV2ChallengeCategoriesQuery();
  
  const challenges = challengesRes?.data || [];
  const categories = categoriesRes?.data || [];

  const createMutation = useV2CreateChallengeMutation();
  const updateMutation = useV2UpdateChallengeMutation();
  const deleteMutation = useV2DeleteChallengeMutation();

  // Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<any>(null);

  // Form States
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const openCreateModal = () => {
    setEditingChallenge(null);
    setName("");
    setCode("");
    setDescription("");
    setCategoryId(categories[0]?.id?.toString() || "");
    setIsOpen(true);
  };

  const openEditModal = (c: any) => {
    setEditingChallenge(c);
    setName(c.name || "");
    setCode(c.code || "");
    setDescription(c.description || "");
    setCategoryId(c.challengeCategoryId?.toString() || "");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      code: code || null,
      description: description || null,
      challengeCategoryId: categoryId ? parseInt(categoryId) : null
    };

    if (editingChallenge) {
      await updateMutation.mutateAsync({ id: editingChallenge.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment retirer ce défi de l'écosystème ?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <PITLayout
      category="ECOSYSTEM CRM"
      title="Défis d'Écosystèmes (Ecosystem Challenges)"
      description="Consultez les verrous technologiques et organisationnels identifiés par les animateurs et adressés par les consortiums."
      pageIcon={Target}
      breadcrumb={[{ label: "Défis" }]}
    >
      <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
        {/* Header Action */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-black uppercase text-muted">Défis Enregistrés</h2>
          <button
            onClick={openCreateModal}
            className="bg-teal-550 hover:bg-teal-600 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1 transition-all"
          >
            <Plus className="h-4 w-4" />
            Nouveau Défi
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted">Chargement...</div>
        ) : (
          <div className="space-y-4">
            {challenges.length === 0 ? (
              <div className="text-center py-8 text-muted text-xs">Aucun défi trouvé. Cliquez sur "Nouveau Défi" pour en ajouter un.</div>
            ) : (
              challenges.map((c: any) => (
                <div key={c.id} className="p-5 rounded-2xl border border-muted/10 bg-glass/30 flex flex-col md:flex-row gap-4 items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        <h3 className="font-extrabold text-xs text-text">{c.name}</h3>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(c)}
                          className="text-muted hover:text-text p-1 transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-muted hover:text-rose-500 p-1 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">{c.description || "Aucune description de défi n'est fournie."}</p>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 text-right w-full md:w-auto shrink-0 border-t md:border-t-0 border-muted/10 pt-2.5 md:pt-0">
                    <span className="text-[9px] font-black uppercase text-teal-500">
                      Catégorie: {c.challengeCategory?.name || "Général"}
                    </span>
                    {c.code && (
                      <span className="text-[8px] font-mono text-muted uppercase">
                        Code: {c.code}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-muted/30 rounded-2xl max-w-md w-full shadow-2xl p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-text transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-extrabold text-text mb-4">
              {editingChallenge ? "Modifier le défi" : "Créer un nouveau défi d'écosystème"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted block">Intitulé du défi</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Certification réglementaire NIS2"
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted block">Code Défi</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="ex: CH-NIS2"
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted block">Catégorie S3</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                  >
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted block">Description du verrou / besoin</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Décrivez précisément l'impact et la nature du blocage technologique..."
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-muted/10 hover:bg-muted/20 text-text rounded-xl px-4 py-2 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-teal-550 hover:bg-teal-600 text-white rounded-xl px-4 py-2 font-bold transition-all"
                >
                  {editingChallenge ? "Mettre à jour" : "Créer le défi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PITLayout>
  );
}
