// src/app/consortia/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Network, Plus, Check, X, ShieldAlert, ArrowRight, UserPlus } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { 
  useV2ConsortiaQuery, 
  useV2CreateConsortiumMutation, 
  useV2MembersQuery, 
  useV2OpportunitiesQuery,
  useV2UpdateConsortiumMutation,
  useV2DeleteConsortiumMutation
} from "@/hooks/usePITQueries";

export default function ConsortiaPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingConsortium, setEditingConsortium] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [opportunityId, setOpportunityId] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<{ memberId: number; role: string }[]>([]);
  
  // Member selection helper states
  const [currentMemberId, setCurrentMemberId] = useState("");
  const [currentRole, setCurrentRole] = useState("Partner");

  // React Query
  const { data: consortiaRes, isLoading: consortiaLoading } = useV2ConsortiaQuery();
  const { data: membersRes } = useV2MembersQuery();
  const { data: oppsRes } = useV2OpportunitiesQuery();
  const createConsortiumMutation = useV2CreateConsortiumMutation();
  const updateConsortiumMutation = useV2UpdateConsortiumMutation();
  const deleteConsortiumMutation = useV2DeleteConsortiumMutation();

  const consortia = consortiaRes?.data || [];
  const members = membersRes?.data || [];
  const opportunities = oppsRes?.data || [];

  // Handle adding a member to the temp list
  const handleAddMember = () => {
    if (!currentMemberId) return;
    const mId = parseInt(currentMemberId);
    if (selectedMembers.some(m => m.memberId === mId)) return; // already added
    setSelectedMembers([...selectedMembers, { memberId: mId, role: currentRole }]);
    setCurrentMemberId("");
    setCurrentRole("Partner");
  };

  // Handle removing a member from the temp list
  const handleRemoveMember = (mId: number) => {
    setSelectedMembers(selectedMembers.filter(m => m.memberId !== mId));
  };

  // Submit consortium form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedMembers.length === 0) return;

    if (editingConsortium) {
      updateConsortiumMutation.mutate({
        id: editingConsortium.id,
        data: {
          name,
          description,
          opportunityId: opportunityId ? parseInt(opportunityId) : null,
          members: selectedMembers
        }
      }, {
        onSuccess: () => {
          setName("");
          setDescription("");
          setOpportunityId("");
          setSelectedMembers([]);
          setEditingConsortium(null);
          setShowForm(false);
        }
      });
    } else {
      createConsortiumMutation.mutate({
        name,
        description,
        opportunityId: opportunityId ? parseInt(opportunityId) : null,
        members: selectedMembers
      }, {
        onSuccess: () => {
          setName("");
          setDescription("");
          setOpportunityId("");
          setSelectedMembers([]);
          setShowForm(false);
        }
      });
    }
  };

  const handleStartEdit = (c: any) => {
    setEditingConsortium(c);
    setName(c.name);
    setDescription(c.description || "");
    setOpportunityId(c.opportunityId ? String(c.opportunityId) : "");
    setSelectedMembers(c.members?.map((m: any) => ({ memberId: m.memberId, role: m.role || "Partner" })) || []);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce consortium d'innovation ? Cette action est irréversible.")) return;
    deleteConsortiumMutation.mutate(id);
  };

  return (
    <PITLayout
      category="ECOSYSTEM CRM"
      title="Gestion des Consortiums"
      description="Créez et gérez des groupes de partenaires d'innovation répondant aux appels à projets régionaux."
      pageIcon={Network}
      breadcrumb={[{ label: "Consortiums" }]}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black uppercase text-muted tracking-wider">
            Consortiums enregistrés
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-indigo-500 hover:shadow-md text-white rounded-xl text-xs font-black cursor-pointer transition-all"
          >
            <Plus className="h-4 w-4" />
            Nouveau Consortium
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-teal-500/35 bg-teal-500/5 space-y-6">
            <h3 className="font-extrabold text-xs uppercase text-teal-700 dark:text-teal-400">
              {editingConsortium ? "Modifier le Consortium" : "Nouveau Consortium d'Innovation"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted">Nom du Consortium</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Consortium e-Health Diagnostics"
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted">Appel à projets (Optionnel)</label>
                <select
                  value={opportunityId}
                  onChange={(e) => setOpportunityId(e.target.value)}
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                >
                  <option value="">Aucun appel</option>
                  {opportunities.map((o: any) => (
                    <option key={o.id} value={o.id}>{o.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-muted">Description du projet</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Objectifs collaboratifs et thématiques adressées..."
                className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-xs font-bold text-text focus:outline-none focus:border-teal-500 min-h-[80px]"
              />
            </div>

            {/* Member Addition */}
            <div className="border-t border-muted/10 pt-4 space-y-4">
              <h4 className="text-[10px] font-black uppercase text-indigo-500">Ajouter des Partenaires</h4>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={currentMemberId}
                  onChange={(e) => setCurrentMemberId(e.target.value)}
                  className="flex-1 bg-glass border border-muted/30 rounded-xl px-3 py-2 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                >
                  <option value="">Sélectionner un membre</option>
                  {members.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
                  ))}
                </select>

                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="bg-glass border border-muted/30 rounded-xl px-3 py-2 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                >
                  <option value="Lead Partner">Chef de file</option>
                  <option value="Partner">Partenaire R&D</option>
                  <option value="Technology Provider">Fournisseur de technologie</option>
                  <option value="End User">Utilisateur final</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddMember}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer hover:bg-indigo-600 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  Ajouter
                </button>
              </div>

              {/* Added Members List */}
              {selectedMembers.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-muted uppercase">Partenaires inclus ({selectedMembers.length})</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((sm) => {
                      const memberName = members.find((m: any) => m.id === sm.memberId)?.name || `Membre #${sm.memberId}`;
                      return (
                        <div key={sm.memberId} className="flex items-center gap-1.5 bg-glass border border-muted/20 pl-3 pr-1 py-1 rounded-xl text-[10px] font-bold">
                          <span>{memberName} • <span className="text-teal-605 uppercase">{sm.role}</span></span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(sm.memberId)}
                            className="p-0.5 rounded-full hover:bg-muted/20 text-muted hover:text-text cursor-pointer border-0 bg-transparent"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end border-t border-muted/10 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingConsortium(null);
                  setName("");
                  setDescription("");
                  setOpportunityId("");
                  setSelectedMembers([]);
                }}
                className="px-4 py-2 bg-glass border border-muted/30 text-text rounded-xl text-xs font-extrabold cursor-pointer hover:bg-glass/60 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={name === "" || selectedMembers.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-black hover:shadow-lg disabled:opacity-50 disabled:shadow-none cursor-pointer transition-all"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        )}

        {/* Consortia Grid */}
        {consortiaLoading ? (
          <div className="text-center py-8 text-muted">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consortia.map((c: any) => (
              <div key={c.id} className="p-5 rounded-2xl border border-muted/10 bg-glass/20 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm text-text">{c.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-glass/40 border border-muted/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold text-text uppercase">
                        {c.status || "APPROVED"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(c)}
                        className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/25 border-0 text-[9px] font-black cursor-pointer transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500/25 border-0 text-[9px] font-black cursor-pointer transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  {c.opportunity && (
                    <span className="text-[10px] text-teal-605 font-bold uppercase block">
                      Appel: {c.opportunity.title}
                    </span>
                  )}
                  <p className="text-xs text-muted leading-relaxed">{c.description || "Aucune description."}</p>
                </div>

                {/* Partners in Consortium */}
                <div className="border-t border-muted/10 pt-3 space-y-2">
                  <span className="text-[9px] font-black text-muted uppercase block">Partenaires mobilisés</span>
                  <div className="space-y-1">
                    {c.members?.map((m: any) => (
                      <div key={m.id} className="flex justify-between items-center text-[10px] font-bold bg-glass/20 p-2 rounded-lg">
                        <span className="text-text">{m.member?.name || "Acteur"}</span>
                        <span className="text-muted font-black uppercase text-[9px]">{m.role || "Partner"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PITLayout>
  );
}
