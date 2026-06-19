// src/app/members/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Users, Search, Building, MapPin, Plus, Trash2, Edit2, X, Phone, Mail, Globe } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import {
  useV2MembersQuery,
  useV2CreateMemberMutation,
  useV2UpdateMemberMutation,
  useV2DeleteMemberMutation
} from "@/hooks/usePITQueries";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("Entreprise");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("PME");
  const [nace, setNace] = useState("");
  const [digitalMaturity, setDigitalMaturity] = useState(1);
  const [iaMaturity, setIaMaturity] = useState(1);
  const [cyberMaturity, setCyberMaturity] = useState(1);

  const { data: membersRes, isLoading } = useV2MembersQuery();
  const members = membersRes?.data || [];

  const createMutation = useV2CreateMemberMutation();
  const updateMutation = useV2UpdateMemberMutation();
  const deleteMutation = useV2DeleteMemberMutation();

  // Filter members
  const filtered = useMemo(() => {
    return members.filter((m: any) => {
      const matchesSearch = (m.name || "").toLowerCase().includes(search.toLowerCase()) || 
                            (m.location || "").toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" || m.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [members, search, filterType]);

  const stats = useMemo(() => {
    return {
      total: members.length,
      companies: members.filter((m: any) => m.type === "Entreprise").length,
      uni: members.filter((m: any) => m.type === "Université" || m.type === "Centre de recherche").length,
      others: members.filter((m: any) => m.type !== "Entreprise" && m.type !== "Université" && m.type !== "Centre de recherche").length,
    };
  }, [members]);

  const openCreateModal = () => {
    setEditingMember(null);
    setName("");
    setType("Entreprise");
    setDescription("");
    setEmail("");
    setPhone("");
    setWebsite("");
    setLocation("");
    setSize("PME");
    setNace("");
    setDigitalMaturity(1);
    setIaMaturity(1);
    setCyberMaturity(1);
    setIsOpen(true);
  };

  const openEditModal = (m: any) => {
    setEditingMember(m);
    setName(m.name || "");
    setType(m.type || "Entreprise");
    setDescription(m.description || "");
    setEmail(m.email || "");
    setPhone(m.phone || "");
    setWebsite(m.website || "");
    setLocation(m.location || "");
    setSize(m.size || "PME");
    setNace(m.nace || "");
    setDigitalMaturity(m.digitalMaturity || 1);
    setIaMaturity(m.iaMaturity || 1);
    setCyberMaturity(m.cyberMaturity || 1);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      type,
      description,
      email,
      phone,
      website,
      location,
      size,
      nace,
      digitalMaturity,
      iaMaturity,
      cyberMaturity
    };

    if (editingMember) {
      await updateMutation.mutateAsync({ id: editingMember.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment retirer ce membre de l'écosystème ?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <PITLayout
      category="GESTION DE L'ÉCOSYSTÈME"
      title="Affiliations & Membres"
      description="Pilotez les affiliations et memberships de l'écosystème territorial wallon."
      pageIcon={Users}
      breadcrumb={[{ label: "Membres" }]}
    >
      {/* Help Banner */}
      <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-start gap-3 mb-6">
        <Users className="h-5 w-5 text-teal-605 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 dark:text-teal-350">
          <p className="font-bold uppercase tracking-wider text-[10px]">Aide Métier : Affiliations</p>
          <p className="mt-1 leading-relaxed">
            Un membre correspond à une organisation rattachée à une communauté, un programme, un consortium ou un cluster avec un rôle défini. Le membre n’est pas une entité isolée : il représente une relation d’affiliation entre un acteur territorial et un collectif.
          </p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 w-full mb-6">
        <div className="bg-glass p-4 rounded-xl border border-muted/10">
          <span className="text-[10px] font-black uppercase text-muted">Total Acteurs</span>
          <span className="text-xl font-black text-text block">{stats.total}</span>
        </div>
        <div className="bg-glass p-4 rounded-xl border border-muted/10">
          <span className="text-[10px] font-black uppercase text-teal-500">Entreprises / PME</span>
          <span className="text-xl font-black text-teal-500 block">{stats.companies}</span>
        </div>
        <div className="bg-glass p-4 rounded-xl border border-muted/10">
          <span className="text-[10px] font-black uppercase text-indigo-500">R&D / Universités</span>
          <span className="text-xl font-black text-indigo-500 block">{stats.uni}</span>
        </div>
        <div className="bg-glass p-4 rounded-xl border border-muted/10">
          <span className="text-[10px] font-black uppercase text-amber-500">Autres Acteurs</span>
          <span className="text-xl font-black text-amber-500 block">{stats.others}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
        {/* Filters and Add button */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Rechercher par nom ou localisation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-glass border border-muted/30 rounded-xl text-xs font-bold text-text focus:outline-none focus:border-teal-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-glass border border-muted/30 rounded-xl px-3 py-2 text-xs font-bold text-text cursor-pointer focus:outline-none"
            >
              <option value="all">Tous les types</option>
              <option value="Entreprise">Entreprises</option>
              <option value="Université">Universités</option>
              <option value="Centre de recherche">Centres de recherche</option>
              <option value="Expert">Experts</option>
              <option value="Institution publique">Institutions publiques</option>
            </select>

            <button
              onClick={openCreateModal}
              className="bg-teal-550 hover:bg-teal-600 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Plus className="h-4 w-4" />
              Nouveau
            </button>
          </div>
        </div>

        {/* Members Grid */}
        {isLoading ? (
          <div className="text-center py-8 text-muted">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m: any) => (
              <div key={m.id} className="p-4 rounded-xl border border-muted/10 bg-glass/30 hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-xs text-text">{m.name}</h3>
                      <span className="text-[9px] font-bold text-muted uppercase">{m.type}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(m)}
                        className="text-muted hover:text-text p-1 transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-muted hover:text-rose-500 p-1 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mt-2 text-[10px] text-muted">
                    {m.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{m.location}</span>
                      </div>
                    )}
                    {m.nace && <div>NACE: <span className="font-mono">{m.nace}</span></div>}
                    {m.size && <div>Taille: <span className="font-semibold text-text">{m.size}</span></div>}
                  </div>
                </div>

                {/* Maturities */}
                <div className="grid grid-cols-3 gap-1 pt-3 mt-3 border-t border-muted/10 text-center text-[9px] font-bold">
                  <div className="bg-teal-500/10 text-teal-400 py-1 rounded">
                    Num: {m.digitalMaturity}/4
                  </div>
                  <div className="bg-indigo-500/10 text-indigo-400 py-1 rounded">
                    IA: {m.iaMaturity}/4
                  </div>
                  <div className="bg-rose-500/10 text-rose-400 py-1 rounded">
                    Cyber: {m.cyberMaturity}/4
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-muted/30 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-text transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-extrabold text-text mb-4">
              {editingMember ? "Modifier le membre" : "Ajouter un nouveau membre"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-muted block">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted block">Type d'acteur</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                  >
                    <option value="Entreprise">Entreprise</option>
                    <option value="Université">Université</option>
                    <option value="Centre de recherche">Centre de recherche</option>
                    <option value="Expert">Expert</option>
                    <option value="Institution publique">Institution publique</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted block">Localisation</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ville, Province"
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted block">Description / Activités</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted block">Code NACE</label>
                  <input
                    type="text"
                    value={nace}
                    onChange={(e) => setNace(e.target.value)}
                    placeholder="ex: 62.01"
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted block">Taille</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text focus:outline-none"
                  >
                    <option value="TPE">TPE</option>
                    <option value="PME">PME</option>
                    <option value="ETI">ETI</option>
                    <option value="Grande Entreprise">Grande Entreprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted block">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted block">Site Web</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Maturities sliders */}
              <div className="p-4 bg-muted/5 border border-muted/10 rounded-xl space-y-3">
                <h4 className="font-black text-[10px] text-muted uppercase">Maturités Digitales / IA / Cyber (Scale 1-4)</h4>
                
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[10px]">
                    <span>Maturité Numérique / Digital</span>
                    <span className="text-teal-400">{digitalMaturity}/4</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={digitalMaturity}
                    onChange={(e) => setDigitalMaturity(parseInt(e.target.value))}
                    className="w-full h-1 bg-muted/20 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[10px]">
                    <span>Maturité Intelligence Artificielle</span>
                    <span className="text-indigo-400">{iaMaturity}/4</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={iaMaturity}
                    onChange={(e) => setIaMaturity(parseInt(e.target.value))}
                    className="w-full h-1 bg-muted/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[10px]">
                    <span>Maturité Cybersécurité</span>
                    <span className="text-rose-400">{cyberMaturity}/4</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={cyberMaturity}
                    onChange={(e) => setCyberMaturity(parseInt(e.target.value))}
                    className="w-full h-1 bg-muted/20 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
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
                  {editingMember ? "Mettre à jour" : "Créer le membre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PITLayout>
  );
}
