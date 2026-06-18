// src/app/beneficiaries/page.tsx
"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Search, 
  Layers, 
  FileText, 
  Compass, 
  Users, 
  Sparkles, 
  FolderGit, 
  MapPin, 
  TrendingUp,
  Activity,
  ArrowRight,
  HelpCircle,
  Briefcase,
  CheckCircle2,
  Network,
  Clock,
  Coins,
  ArrowDown,
  X,
  Plus,
  Edit,
  Trash2,
  UserPlus
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITStatCard from "@/design-system/PITStatCard";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITImpactPanel from "@/design-system/PITImpactPanel";
import SplitLayout from "@/components/ui/SplitLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  useV2Beneficiaries, 
  useV2BeneficiaryDetail,
  useV2BeneficiaryJourneys,
  useV2BeneficiaryServices,
  useV2BeneficiaryPrograms,
  useV2BeneficiaryProjects,
  useV2Contributions,
  useV2BeneficiaryActivities,
  useV2BeneficiaryFinancements,
  useV2BeneficiaryOutcomes,
  useV2CreateBeneficiaryMutation,
  useV2UpdateBeneficiaryMutation,
  useV2DeleteBeneficiaryMutation,
  useV2CreateContactMutation,
  useV2UpdateContactMutation,
  useV2DeleteContactMutation
} from "@/hooks/useV2Queries";

export default function BeneficiariesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBeneId, setSelectedBeneId] = useState<number | null>(null);

  // Form states for Beneficiary Modal
  const [isBeneModalOpen, setIsBeneModalOpen] = useState(false);
  const [editingBene, setEditingBene] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [bce, setBce] = useState("");
  const [size, setSize] = useState("PME");
  const [employees, setEmployees] = useState("");
  const [revenue, setRevenue] = useState("");
  const [location, setLocation] = useState("");
  const [province, setProvince] = useState("");
  const [arrondissement, setArrondissement] = useState("");
  const [demand, setDemand] = useState("");
  const [sourceSystem, setSourceSystem] = useState("PIT Manual Input");
  const [sourceAuthority, setSourceAuthority] = useState("PIT Counselor");
  const [lastSyncDate, setLastSyncDate] = useState("");
  const [beneficiaryType, setBeneficiaryType] = useState("ENTREPRISE");

  // Fetch all beneficiaries
  const { data: beneficiariesData, isLoading: isListLoading, isError: isBeneError } = useV2Beneficiaries();
  const rawBeneficiaries = beneficiariesData?.data || [];

  // Filter beneficiaries (exclude ARCHIVED status since backend handles it, but verify locally)
  const filteredBeneficiaries = rawBeneficiaries.filter((bene: any) => 
    bene.status !== "ARCHIVED" && (
      bene.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (bene.location && bene.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bene.province && bene.province.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  // React Query Mutations
  const createBeneMutation = useV2CreateBeneficiaryMutation();
  const updateBeneMutation = useV2UpdateBeneficiaryMutation();
  const deleteBeneMutation = useV2DeleteBeneficiaryMutation();

  const handleSelectBene = (id: number) => {
    setSelectedBeneId(id);
  };

  const handleOpenCreateBene = () => {
    setEditingBene(null);
    setName("");
    setBce("");
    setSize("PME");
    setEmployees("");
    setRevenue("");
    setLocation("");
    setProvince("");
    setArrondissement("");
    setDemand("");
    setSourceSystem("PIT Manual Input");
    setSourceAuthority("PIT Counselor");
    setLastSyncDate(new Date().toISOString().split('T')[0]);
    setBeneficiaryType("ENTREPRISE");
    setIsBeneModalOpen(true);
  };

  const handleOpenEditBene = (bene: any) => {
    setEditingBene(bene);
    setName(bene.name || "");
    setBce(bene.bce || "");
    setSize(bene.size || "PME");
    setEmployees(bene.employees ? bene.employees.toString() : "");
    setRevenue(bene.revenue ? bene.revenue.toString() : "");
    setLocation(bene.location || "");
    setProvince(bene.province || "");
    setArrondissement(bene.arrondissement || "");
    setDemand(bene.demand || "");
    setSourceSystem(bene.sourceSystem || "PIT Manual Input");
    setSourceAuthority(bene.sourceAuthority || "PIT Counselor");
    setLastSyncDate(bene.lastSyncDate ? new Date(bene.lastSyncDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setBeneficiaryType(bene.beneficiaryType || "ENTREPRISE");
    setIsBeneModalOpen(true);
  };

  const handleBeneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      bce: bce || null,
      size,
      employees: employees ? parseInt(employees) : null,
      revenue: revenue ? parseFloat(revenue) : null,
      location,
      province: province || null,
      arrondissement: arrondissement || null,
      demand: demand || null,
      sourceSystem,
      sourceAuthority,
      lastSyncDate: lastSyncDate ? new Date(lastSyncDate) : null,
      beneficiaryType,
      status: editingBene ? editingBene.status : "ACTIVE"
    };

    if (editingBene) {
      updateBeneMutation.mutate(
        { id: editingBene.id, data: payload },
        {
          onSuccess: () => {
            setIsBeneModalOpen(false);
          }
        }
      );
    } else {
      createBeneMutation.mutate(payload, {
        onSuccess: () => {
          setIsBeneModalOpen(false);
        }
      });
    }
  };

  const handleSoftDeleteBene = (id: number) => {
    if (confirm("Voulez-vous vraiment archiver ce bénéficiaire ? Il sera masqué des listes opérationnelles.")) {
      deleteBeneMutation.mutate(id, {
        onSuccess: () => {
          setSelectedBeneId(null);
        }
      });
    }
  };

  const leftPane = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col max-h-[75vh]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/10">
        <h3 className="text-xs font-black uppercase text-muted tracking-wider">
          Bénéficiaires ({filteredBeneficiaries.length})
        </h3>
        <Button 
          onClick={handleOpenCreateBene}
          size="sm"
          className="h-7 text-[10px] font-extrabold uppercase bg-teal-600 hover:bg-teal-700 text-white cursor-pointer px-2.5 rounded-xl border-0"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Nouveau
        </Button>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-150 dark:border-gray-800 font-extrabold uppercase text-muted tracking-wider">
              <th className="px-5 py-3.5">Bénéficiaire</th>
              <th className="px-5 py-3.5">Taille</th>
              <th className="px-5 py-3.5">Localisation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isListLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                </tr>
              ))
            ) : filteredBeneficiaries.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-muted italic">
                  Aucun bénéficiaire ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              filteredBeneficiaries.map((bene: any) => (
                <tr
                  key={bene.id}
                  onClick={() => handleSelectBene(bene.id)}
                  className={`hover:bg-teal-500/5 cursor-pointer border-b border-gray-105 dark:border-gray-850 transition-colors ${
                    selectedBeneId === bene.id ? "bg-teal-500/10 border-l-4 border-l-teal-600" : ""
                  }`}
                >
                  <td className="px-5 py-3.5 font-bold text-text">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono bg-muted px-1.5 py-0.2 rounded font-bold uppercase select-none">
                        BCE
                      </span>
                      <span className="truncate max-w-[160px]">{bene.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted font-semibold">
                    {bene.size || "PME"}
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    {bene.location} ({bene.province || "Wallonie"})
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <PITLayout
      category="PORTFOLIO DE L'ACCOMPAGNATEUR"
      title="Beneficiary 360 Workspace"
      description="Analysez la fiche d'identité sémantique consolidée, les diagnostics BCE/DMAT, le lignage stratégique complet et l'historique d'accompagnement des bénéficiaires."
      pageIcon={Users}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Bénéficiaires" }]}
    >
      {isBeneError && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-800 dark:text-amber-300 rounded-xl flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
            ⚠️
          </span>
          <div>
            <p className="font-bold">API v2 Hors Ligne</p>
            <p className="text-[11px] text-muted-foreground font-normal mt-0.5">
              Le service d'API v2 n'est pas disponible.
            </p>
          </div>
        </div>
      )}

      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un bénéficiaire par nom, localisation, province..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={
          selectedBeneId ? (
            <BeneficiaryDetailPanel 
              id={selectedBeneId} 
              onClose={() => setSelectedBeneId(null)} 
              onEdit={handleOpenEditBene}
              onArchive={handleSoftDeleteBene}
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center bg-gray-50/20">
              <Users className="h-10 w-10 text-muted/50 mb-3" />
              <p className="text-muted text-xs font-bold">Sélectionnez un bénéficiaire dans la liste pour charger son profil 360°.</p>
            </div>
          )
        }
        leftColSpan={5}
      />

      {/* Beneficiary Modal Form */}
      {isBeneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setIsBeneModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4">
              {editingBene ? "Modifier le Bénéficiaire" : "Créer un nouveau Bénéficiaire"}
            </h3>

            <form onSubmit={handleBeneSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Nom du Bénéficiaire *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Type de Bénéficiaire *</label>
                  <select
                    value={beneficiaryType}
                    onChange={(e) => setBeneficiaryType(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none"
                  >
                    <option value="ENTREPRISE">Entreprise</option>
                    <option value="STARTUP">Start-up</option>
                    <option value="UNIVERSITE">Université</option>
                    <option value="CENTRE_RECHERCHE">Centre de recherche</option>
                    <option value="ECOLE">École</option>
                    <option value="EPN">EPN (Espace Public Numérique)</option>
                    <option value="ASBL">ASBL</option>
                    <option value="COMMUNE">Commune / Administration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Numéro BCE</label>
                  <input
                    type="text"
                    value={bce}
                    onChange={(e) => setBce(e.target.value)}
                    placeholder="ex: 0123.456.789"
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Taille *</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none"
                  >
                    <option value="TPE">TPE (1-9 ETP)</option>
                    <option value="PME">PME (10-249 ETP)</option>
                    <option value="Grande Entreprise">Grande Entreprise (250+ ETP)</option>
                    <option value="Commune">Commune / Administration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Nombre d'employés</label>
                  <input
                    type="number"
                    value={employees}
                    onChange={(e) => setEmployees(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Chiffre d'affaires (€)</label>
                  <input
                    type="number"
                    step="any"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Ville / Commune *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Province</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="ex: Liège, Namur..."
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Arrondissement</label>
                  <input
                    type="text"
                    value={arrondissement}
                    onChange={(e) => setArrondissement(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Demande / Problématique Initiale</label>
                  <textarea
                    value={demand}
                    onChange={(e) => setDemand(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Interop Fields */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Interopérabilité & Alignement</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-300 block">Système Source</label>
                    <input
                      type="text"
                      value={sourceSystem}
                      onChange={(e) => setSourceSystem(e.target.value)}
                      className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-300 block">Autorité Responsable</label>
                    <input
                      type="text"
                      value={sourceAuthority}
                      onChange={(e) => setSourceAuthority(e.target.value)}
                      className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-gray-600 dark:text-gray-300 block">Date de synchronisation</label>
                    <input
                      type="date"
                      value={lastSyncDate}
                      onChange={(e) => setLastSyncDate(e.target.value)}
                      className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBeneModalOpen(false)}
                  className="px-4 py-2 text-[11px] font-bold rounded-xl border border-gray-300"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 text-[11px] font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white border-0"
                >
                  {editingBene ? "Sauvegarder" : "Créer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PITLayout>
  );
}

interface DetailPanelProps {
  id: number;
  onClose: () => void;
  onEdit: (bene: any) => void;
  onArchive: (id: number) => void;
}

function BeneficiaryDetailPanel({ id, onClose, onEdit, onArchive }: DetailPanelProps) {
  const { data: detailData, isLoading: isDetailLoading } = useV2BeneficiaryDetail(id);
  const { data: journeysData } = useV2BeneficiaryJourneys(id);
  const { data: servicesData } = useV2BeneficiaryServices(id);
  const { data: programsData } = useV2BeneficiaryPrograms(id);
  const { data: projectsData } = useV2BeneficiaryProjects(id);
  const { data: contributionsData } = useV2Contributions("beneficiaries", id);

  // Sub-resource queries
  const { data: activitiesRes } = useV2BeneficiaryActivities(id);
  const { data: financementsRes } = useV2BeneficiaryFinancements(id);
  const { data: outcomesRes } = useV2BeneficiaryOutcomes(id);

  // Contact States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactType, setContactType] = useState("OPERATIONAL");
  const [contactIsPrimary, setContactIsPrimary] = useState(false);

  // Mutations for Contacts
  const createContactMutation = useV2CreateContactMutation();
  const updateContactMutation = useV2UpdateContactMutation();
  const deleteContactMutation = useV2DeleteContactMutation();

  if (isDetailLoading || !detailData) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-855 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="text-muted text-xs font-semibold mt-3">Chargement des données du bénéficiaire...</p>
      </div>
    );
  }

  const bene = detailData.data;

  const journeys = journeysData?.data || [];
  const services = servicesData?.data || [];
  const programs = programsData?.data || [];
  const projects = projectsData?.data || [];
  const activities = activitiesRes?.data || [];
  const financements = financementsRes?.data || [];
  const outcomes = outcomesRes?.data || [];

  const challenges = contributionsData?.challenges || [];
  const capabilities = contributionsData?.capabilities || [];

  // Contact Form Handlers
  const handleAddContact = () => {
    setEditingContact(null);
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setContactRole("");
    setContactType("OPERATIONAL");
    setContactIsPrimary(false);
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact: any) => {
    setEditingContact(contact);
    setContactName(contact.name || "");
    setContactEmail(contact.email || "");
    setContactPhone(contact.phone || "");
    setContactRole(contact.role || "");
    setContactType(contact.contactType || "OPERATIONAL");
    setContactIsPrimary(contact.isPrimaryContact || false);
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = (contactId: number) => {
    if (confirm("Voulez-vous supprimer ce contact ?")) {
      deleteContactMutation.mutate({ id: contactId, beneficiaryId: id });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: contactName,
      email: contactEmail || null,
      phone: contactPhone || null,
      role: contactRole || null,
      contactType: contactType,
      isPrimaryContact: contactIsPrimary,
      beneficiaryId: id
    };

    if (editingContact) {
      updateContactMutation.mutate(
        { id: editingContact.id, data: payload },
        {
          onSuccess: () => {
            setIsContactModalOpen(false);
          }
        }
      );
    } else {
      createContactMutation.mutate(payload, {
        onSuccess: () => {
          setIsContactModalOpen(false);
        }
      });
    }
  };

  const ProvenanceTag = ({ source }: { source: string }) => (
    <span className="text-[8px] font-black tracking-widest text-teal-605 bg-teal-500/10 border border-teal-500/20 rounded-md px-1.5 py-0.2 uppercase select-none">
      Source: {source}
    </span>
  );

  const overviewContent = (
    <div className="space-y-6">
      {/* 2 Cards of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PITStatCard
          label="Services Reçus"
          value={services.length.toString()}
          icon={FileText}
          themeColor="teal"
          description="Accompagnements et diagnostics"
        />
        <PITStatCard
          label="Parcours suivis"
          value={journeys.length.toString()}
          icon={Compass}
          themeColor="indigo"
          description="Trajectoires d'innovation initiées"
        />
      </div>

      {/* Info grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-text">
        <div className="bg-glass/5 border border-muted/10 p-3.5 rounded-xl space-y-1.5 relative">
          <div className="absolute top-2.5 right-2.5">
            <ProvenanceTag source={bene.sourceSystem || "BCE"} />
          </div>
          <span className="text-[9px] font-bold text-muted uppercase block">Données Administratives</span>
          <p>Localisation : <span className="font-bold">{bene.location} ({bene.province || "N/A"})</span></p>
          <p>N BCE : <span className="font-mono">{bene.bce || "Non spécifié"}</span></p>
          <p className="text-[10px] text-gray-400">Sync: {bene.lastSyncDate ? new Date(bene.lastSyncDate).toLocaleDateString() : "Temps réel"}</p>
        </div>
        <div className="bg-glass/5 border border-muted/10 p-3.5 rounded-xl space-y-1.5 relative">
          <div className="absolute top-2.5 right-2.5">
            <ProvenanceTag source={bene.sourceAuthority || "BCE"} />
          </div>
          <span className="text-[9px] font-bold text-muted uppercase block">Métrique d'Affaires</span>
          <p>Type : <span className="font-bold text-teal-605">{bene.beneficiaryType || "ENTREPRISE"}</span></p>
          <p>Taille : <span className="font-bold">{bene.size || "PME"}</span></p>
          <p>Effectif : <span className="font-bold">{bene.employees || "—"} ETP</span></p>
          {bene.revenue && <p>CA annuel : <span className="font-bold">{bene.revenue.toLocaleString()} €</span></p>}
        </div>
      </div>

      {bene.demand && (
        <div className="space-y-1 bg-glass/5 border border-muted/10 p-3.5 rounded-xl text-xs relative">
          <div className="absolute top-2 right-2">
            <ProvenanceTag source="EDIH" />
          </div>
          <span className="text-[9px] font-bold text-muted uppercase block">Problématique / Demande initiale</span>
          <p className="italic leading-relaxed">"{bene.demand}"</p>
        </div>
      )}

      {/* Contacts List within Overview */}
      <div className="pt-6 border-t border-muted/10 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">
            Contacts Associés ({bene.contacts?.length || 0})
          </h4>
          <Button
            onClick={handleAddContact}
            size="sm"
            className="h-7 text-[10px] font-extrabold uppercase bg-teal-600 hover:bg-teal-700 text-white cursor-pointer px-2.5 rounded-xl border-0"
          >
            <Plus className="h-3 w-3 mr-1" /> Ajouter
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {(bene.contacts || []).map((contact: any) => (
            <div key={contact.id} className="p-3.5 bg-glass/5 border border-muted/10 rounded-xl space-y-2 relative bg-white/20 dark:bg-gray-900/10">
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                {contact.isPrimaryContact && (
                  <span className="text-[8px] font-black tracking-wider text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">
                    Principal
                  </span>
                )}
                <span className="text-[8px] font-black tracking-wider text-teal-605 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 uppercase">
                  {contact.contactType}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-text block pr-24">{contact.name}</span>
                <span className="text-[10px] text-muted font-semibold block">{contact.role || "Pas de rôle spécifié"}</span>
              </div>

              <div className="text-[10px] font-semibold text-muted space-y-0.5 pt-1.5 border-t border-muted/5">
                {contact.email && <p>Email : <a href={`mailto:${contact.email}`} className="text-teal-605 hover:underline font-bold">{contact.email}</a></p>}
                {contact.phone && <p>Tél : <span className="text-text font-bold">{contact.phone}</span></p>}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => handleEditContact(contact)}
                  className="text-muted hover:text-indigo-650 p-1 rounded hover:bg-muted/10 transition-colors cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="text-muted hover:text-rose-600 p-1 rounded hover:bg-muted/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {(bene.contacts || []).length === 0 && (
            <p className="text-xs text-muted italic text-center col-span-2 py-4 bg-gray-50/20 dark:bg-gray-900/5 rounded-xl border-2 border-dashed border-muted/10">
              Aucun contact enregistré pour ce bénéficiaire.
            </p>
          )}
        </div>
      </div>

      {/* Maturities sliders/progress */}
      <div className="space-y-3.5 pt-6 border-t border-muted/10">
        <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Diagnostics de maturité (Modèles Fédérés)</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {[
            { label: "Maturité Numérique", value: bene.maturityDigital || 2, color: "bg-teal-500", source: "DMAT" },
            { label: "Maturité IA", value: bene.maturityIa || 1, color: "bg-purple-500", source: "DMAT" },
            { label: "Maturité Cybersécurité", value: bene.maturityCyber || 2, color: "bg-rose-500", source: "DMAT" },
            { label: "Maturité Export", value: bene.maturityExport || 1, color: "bg-amber-500", source: "AWEX" },
            { label: "Maturité Durable / S3", value: bene.maturityDurability || 2, color: "bg-emerald-500", source: "DMAT" }
          ].map((item, idx) => (
            <div key={idx} className="bg-glass/5 border border-muted/10 p-3 rounded-xl space-y-1.5 text-xs relative">
              <div className="absolute top-2 right-2">
                <ProvenanceTag source={item.source} />
              </div>
              <div className="flex justify-between items-center font-bold pr-16">
                <span>{item.label}</span>
                <span className="text-teal-655">{item.value}/5</span>
              </div>
              <div className="h-1.5 w-full bg-gray-150 dark:bg-gray-850 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.value / 5) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const relationsContent = (
    <PITRelationsPanel
      sections={[
        {
          title: "Secteurs NACE d'Activité",
          items: bene.primaryNaceSector ? [
            {
              id: bene.primaryNaceSector.id,
              title: bene.primaryNaceSector.name,
              relationType: `Code principal: ${bene.primaryNaceSector.code}`,
              Icon: Briefcase
            }
          ] : []
        },
        {
          title: "Défis Stratégiques identifiés",
          items: challenges.map((c: any) => ({
            id: c.id,
            title: c.name,
            relationType: "Défi d'affaires",
            Icon: Sparkles
          }))
        }
      ]}
    />
  );

  // Timeline 360° Tab (Chronological)
  const timelineContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-muted/10 pb-2">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">
          Timeline 360° des Interactions Historiques
        </h4>
        <span className="text-[8px] font-black bg-teal-500/10 text-teal-650 px-2 py-0.5 rounded border border-teal-500/20">
          Chronologique
        </span>
      </div>

      <div className="relative border-l border-muted/30 ml-4 pl-6 space-y-6">
        {activities.length === 0 && services.length === 0 && financements.length === 0 && projects.length === 0 ? (
          <p className="text-xs text-muted italic text-center py-4">Aucune interaction chronologique enregistrée.</p>
        ) : (
          [
            ...(activities || []).map((a: any) => ({ type: "activity", date: a.date ? new Date(a.date) : new Date(), label: a.title || a.notes, extra: a.activityType, source: a.operator?.name?.includes("AWEX") ? "AWEX" : "EDIH" })),
            ...(services || []).map((s: any) => ({ type: "service", date: s.createdAt ? new Date(s.createdAt) : new Date(), label: s.name, extra: s.code, source: "EDIH" })),
            ...(financements || []).map((f: any) => ({ type: "funding", date: f.createdAt ? new Date(f.createdAt) : new Date(), label: f.name, extra: f.type, source: "WE" })),
            ...(projects || []).map((p: any) => ({ type: "project", date: p.startDate ? new Date(p.startDate) : new Date(), label: p.name, extra: p.status, source: "PIT" }))
          ]
          .sort((a: any, b: any) => b.date.getTime() - a.date.getTime())
          .map((item, idx) => (
            <div key={idx} className="relative space-y-1">
              {/* Dot */}
              <div className="absolute -left-9 top-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-white dark:border-gray-800" />
              
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-muted">{item.date.toLocaleDateString()}</span>
                <Badge className={`uppercase text-[8px] font-bold ${
                  item.type === "activity" ? "bg-indigo-500/15 text-indigo-600" :
                  item.type === "service" ? "bg-teal-500/15 text-teal-650" :
                  item.type === "funding" ? "bg-emerald-500/15 text-emerald-600" :
                  "bg-amber-500/15 text-amber-600"
                }`}>
                  {item.type}
                </Badge>
                <ProvenanceTag source={item.source} />
              </div>

              <p className="text-xs font-bold text-text leading-tight">{item.label}</p>
              <p className="text-[10px] text-muted font-semibold leading-none">{item.extra}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Lignage 360° Tab (Vertical cascade)
  const lineage360Content = (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-muted/10 pb-2">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">
          Cascade de Lignage Sémantique 360° (PIT Architecture)
        </h4>
        <span className="text-[8px] font-black bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded border border-indigo-500/20">
          Lineage Trace
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 text-center max-w-xl mx-auto">
        {/* 1. Bénéficiaire */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">1. Bénéficiaire</span>
            <ProvenanceTag source="BCE" />
          </div>
          <span className="text-xs font-bold text-text">{bene.name}</span>
        </div>

        <ArrowDown className="h-4 w-4 text-muted animate-pulse" />

        {/* 2. Défis */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">2. Défis d&apos;affaires</span>
            <ProvenanceTag source="PIT" />
          </div>
          {challenges.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {challenges.map((c: any) => (
                <span key={c.id} className="text-[10px] font-bold text-indigo-650 bg-indigo-500/10 px-2 py-0.5 rounded">{c.name}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun défi</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 3. Parcours */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">3. Parcours (Journeys)</span>
            <ProvenanceTag source="PIT" />
          </div>
          {journeys.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {journeys.map((j: any) => (
                <span key={j.id} className="text-[10px] font-bold text-teal-650 bg-teal-500/10 px-2 py-0.5 rounded">{j.name}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun parcours</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 4. Services */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">4. Services sémantiques reçus</span>
            <ProvenanceTag source="EDIH" />
          </div>
          {services.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {services.map((s: any) => (
                <span key={s.id} className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">{s.name}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun service</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 5. Activités */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">5. Activités d&apos;Animation</span>
            <ProvenanceTag source="EDIH/AWEX" />
          </div>
          {activities.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {activities.map((a: any) => (
                <span key={a.id} className="text-[10px] font-bold text-purple-650 bg-purple-500/10 px-2 py-0.5 rounded truncate max-w-[200px]">{a.title || a.notes}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucune activité</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 6. Financements */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">6. Financements octroyés</span>
            <ProvenanceTag source="WE" />
          </div>
          {financements.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {financements.map((f: any) => (
                <span key={f.id} className="text-[10px] font-bold text-emerald-650 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <Coins className="h-3 w-3" /> {f.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun financement</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 7. Projets */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">7. Projets R&D / Innovation</span>
            <ProvenanceTag source="PIT" />
          </div>
          {projects.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {projects.map((p: any) => (
                <span key={p.id} className="text-[10px] font-bold text-blue-650 bg-blue-500/10 px-2 py-0.5 rounded">{p.name}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun projet</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 8. Outcomes */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">8. Résultats réels (Outcomes & Impacts)</span>
            <ProvenanceTag source="PIT" />
          </div>
          {outcomes.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {outcomes.map((o: any) => (
                <span key={o.id} className="text-[10px] font-bold text-rose-650 bg-rose-500/10 px-2 py-0.5 rounded">{o.name || o.textValue}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun outcome mesuré</span>
          )}
        </div>
      </div>
    </div>
  );

  const combinedContributionsContent = (
    <div className="space-y-6">
      {/* Projects cascade */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
          Hiérarchie d&apos;Exécution : Programme ➔ Projet ➔ Action ➔ Activité
        </h4>
        <div className="space-y-4">
          {programs.length === 0 ? (
            <p className="text-xs text-muted italic text-center py-4">Aucun projet ou programme d&apos;innovation rattaché.</p>
          ) : (
            programs.map((prog: any, idx: number) => {
              const proj = projects[idx] || { id: 1, name: "Digitalisation Agroalimentaire" };
              return (
                <div key={prog.id} className="border border-muted/15 rounded-2xl overflow-hidden bg-glass/5 p-4 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-teal-650" />
                      <span className="text-xs font-bold text-text">{prog.name}</span>
                    </div>
                    <Badge className="bg-teal-500/10 text-teal-600 border-teal-500/25 uppercase text-[9px] font-bold">
                      Programme Porteur
                    </Badge>
                  </div>

                  <div className="pl-6 border-l-2 border-l-teal-600 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <FolderGit className="h-4 w-4 text-indigo-500" />
                        <span>{proj.name}</span>
                      </div>
                      <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/25 uppercase text-[8px] font-bold">
                        Projet Relie
                      </Badge>
                    </div>

                    <div className="pl-6 border-l-2 border-l-indigo-500 space-y-2">
                      <div className="flex justify-between items-center text-[11px] bg-white dark:bg-gray-800 p-2 rounded-xl border border-muted/10">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Action : Déploiement des capteurs IoT</span>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 uppercase text-[8px] font-bold">Terminé</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-muted/10">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
          Impact & Diagnostics du Bénéficiaire
        </h4>
        <PITImpactPanel data={contributionsData} />
      </div>
    </div>
  );

  return (
    <>
      <PITDetailLayout
        title={bene.name}
        subtitle={`${bene.size} — Arrondissement de ${bene.arrondissement || "Namur"}`}
        badge={
          <span className="text-[9px] font-bold uppercase tracking-wider text-teal-655 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
            {bene.bce || "BENEFICIARY"}
          </span>
        }
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(bene)} 
              className="h-8 text-[11px] font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              Modifier
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onArchive(bene.id)} 
              className="h-8 text-[11px] font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Archiver
            </Button>
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-[11px] font-bold">
              Fermer
            </Button>
          </div>
        }
        overviewTab={overviewContent}
        relationsTab={relationsContent}
        impactTab={lineage360Content}
        contributionsTab={combinedContributionsContent}
        metadataTab={timelineContent}
        overviewLabel="Vue d'ensemble"
        relationsLabel="Taxonomies & NACE"
        impactLabel="Lignage 360°"
        contributionsLabel="Programmes, Projets & Impact"
        metadataLabel="Timeline 360°"
      />

      {/* Contact Modal Form */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl max-w-md w-full shadow-2xl p-6 relative text-xs">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4">
              {editingContact ? "Modifier le Contact" : "Ajouter un nouveau Contact"}
            </h3>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-600 dark:text-gray-300 block">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Téléphone</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Rôle / Fonction</label>
                  <input
                    type="text"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    placeholder="ex: CEO, CTO, Responsable R&D..."
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-300 block">Type de Contact</label>
                  <select
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-650 rounded-xl px-3 py-2 text-gray-900 dark:text-white font-bold focus:outline-none"
                  >
                    <option value="OPERATIONAL">Opérationnel</option>
                    <option value="STRATEGIC">Stratégique</option>
                    <option value="TECHNICAL">Technique</option>
                    <option value="ADMINISTRATIVE">Administratif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={contactIsPrimary}
                  onChange={(e) => setContactIsPrimary(e.target.checked)}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <label htmlFor="isPrimary" className="font-bold text-gray-600 dark:text-gray-300 select-none cursor-pointer">
                  Définir comme contact principal
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-4 py-2 text-[11px] font-bold rounded-xl border border-gray-300"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 text-[11px] font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white border-0"
                >
                  {editingContact ? "Sauvegarder" : "Ajouter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
