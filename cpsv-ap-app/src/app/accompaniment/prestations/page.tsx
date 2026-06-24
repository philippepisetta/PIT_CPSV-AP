// src/app/accompaniment/prestations/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Users, 
  Sparkles, 
  ClipboardCheck, 
  TrendingUp, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Eye, 
  X, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  FileText,
  UserCheck,
  Building
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITStatCard from "@/design-system/PITStatCard";
import { 
  useV2ServiceDeliveriesQuery,
  useV2CreateServiceDeliveryMutation,
  useV2UpdateServiceDeliveryMutation,
  useV2DeleteServiceDeliveryMutation,
  useV2Beneficiaries,
  useV2Services,
  useV2Organizations
} from "@/hooks/useV2Queries";

const STATUS_OPTIONS = [
  { value: "requested", label: "Demandé", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { value: "accepted", label: "Accepté", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
  { value: "planned", label: "Planifié", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { value: "in_progress", label: "En cours", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
  { value: "delivered", label: "Délivré", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { value: "closed", label: "Clôturé", color: "text-teal-500 bg-teal-500/10 border-teal-500/20" },
  { value: "cancelled", label: "Annulé", color: "text-gray-500 bg-gray-500/10 border-gray-500/20" },
  { value: "rejected", label: "Rejeté", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" }
];

const CHANNEL_OPTIONS = ["téléphone", "mail", "plateforme", "rendez-vous", "événement", "API", "autre"];

export default function PrestationsPage() {
  // Query Filters State
  const [filterBeneficiary, setFilterBeneficiary] = useState<string>("");
  const [filterOperator, setFilterOperator] = useState<string>("");
  const [filterService, setFilterService] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterChannel, setFilterChannel] = useState<string>("");

  // UI Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPrestation, setSelectedPrestation] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formBeneficiaryId, setFormBeneficiaryId] = useState("");
  const [formServiceId, setFormServiceId] = useState("");
  const [formProviderOrgId, setFormProviderOrgId] = useState("");
  const [formStatus, setFormStatus] = useState("planned");
  const [formChannel, setFormChannel] = useState("mail");
  const [formDeliveryMode, setFormDeliveryMode] = useState("individuel");
  const [formLocation, setFormLocation] = useState("");
  const [formOutputs, setFormOutputs] = useState("");
  const [formSatisfaction, setFormSatisfaction] = useState("");
  
  // Maturity inputs
  const [maturityDigitalBefore, setMaturityDigitalBefore] = useState("1");
  const [maturityDigitalAfter, setMaturityDigitalAfter] = useState("1");
  const [maturityIaBefore, setMaturityIaBefore] = useState("1");
  const [maturityIaAfter, setMaturityIaAfter] = useState("1");
  const [maturityCyberBefore, setMaturityCyberBefore] = useState("1");
  const [maturityCyberAfter, setMaturityCyberAfter] = useState("1");
  const [maturityExportBefore, setMaturityExportBefore] = useState("1");
  const [maturityExportAfter, setMaturityExportAfter] = useState("1");
  const [maturityDurabilityBefore, setMaturityDurabilityBefore] = useState("1");
  const [maturityDurabilityAfter, setMaturityDurabilityAfter] = useState("1");

  const [formNextServiceId, setFormNextServiceId] = useState("");
  const [formNextStepComment, setFormNextStepComment] = useState("");

  // Queries
  const { data: deliveriesRaw, isLoading: loadingDeliveries } = useV2ServiceDeliveriesQuery({
    beneficiaryId: filterBeneficiary ? parseInt(filterBeneficiary) : undefined,
    providerOrganizationId: filterOperator ? parseInt(filterOperator) : undefined,
    serviceId: filterService ? parseInt(filterService) : undefined,
    status: filterStatus || undefined,
    channel: filterChannel || undefined
  });

  const { data: beneficiariesRaw, isLoading: loadingBeneficiaries } = useV2Beneficiaries();
  const { data: servicesRaw, isLoading: loadingServices } = useV2Services();
  const { data: organizationsRaw, isLoading: loadingOrganizations } = useV2Organizations();

  // Mutations
  const createMutation = useV2CreateServiceDeliveryMutation();
  const updateMutation = useV2UpdateServiceDeliveryMutation();
  const deleteMutation = useV2DeleteServiceDeliveryMutation();

  // Safe Arrays
  const deliveries = useMemo(() => Array.isArray(deliveriesRaw) ? (deliveriesRaw as any) : ((deliveriesRaw as any)?.data || []), [deliveriesRaw]);
  const beneficiaries = useMemo(() => Array.isArray(beneficiariesRaw) ? (beneficiariesRaw as any) : ((beneficiariesRaw as any)?.data || []), [beneficiariesRaw]);
  const services = useMemo(() => Array.isArray(servicesRaw) ? (servicesRaw as any) : ((servicesRaw as any)?.data || []), [servicesRaw]);
  const organizations = useMemo(() => Array.isArray(organizationsRaw) ? (organizationsRaw as any) : ((organizationsRaw as any)?.data || []), [organizationsRaw]);

  // Auto-select first item when lists load if empty (fixes select value race conditions)
  useEffect(() => {
    if (!formBeneficiaryId && beneficiaries.length > 0) {
      setFormBeneficiaryId(beneficiaries[0].id.toString());
    }
  }, [beneficiaries, formBeneficiaryId]);

  useEffect(() => {
    if (!formServiceId && services.length > 0) {
      setFormServiceId(services[0].id.toString());
    }
  }, [services, formServiceId]);

  useEffect(() => {
    if (!formProviderOrgId && organizations.length > 0) {
      setFormProviderOrgId(organizations[0].id.toString());
    }
  }, [organizations, formProviderOrgId]);

  // Statistics
  const stats = useMemo(() => {
    const total = deliveries.length;
    const closedCount = deliveries.filter((d: any) => d.status === "closed" || d.status === "delivered").length;
    const closureRate = total > 0 ? Math.round((closedCount / total) * 100) : 0;
    
    const satisfactionSums = deliveries
      .filter((d: any) => typeof d.satisfactionScore === "number")
      .map((d: any) => d.satisfactionScore);
    const avgSatisfaction = satisfactionSums.length > 0
      ? (satisfactionSums.reduce((a: number, b: number) => a + b, 0) / satisfactionSums.length).toFixed(1)
      : "N/A";

    const requestedOrPlanned = deliveries.filter((d: any) => d.status === "requested" || d.status === "planned").length;

    return { total, closureRate, avgSatisfaction, requestedOrPlanned };
  }, [deliveries]);

  // Actions
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedPrestation(null);
    setFormTitle("");
    setFormDesc("");
    setFormBeneficiaryId(beneficiaries[0]?.id?.toString() || "");
    setFormServiceId(services[0]?.id?.toString() || "");
    setFormProviderOrgId(organizations[0]?.id?.toString() || "");
    setFormStatus("planned");
    setFormChannel("mail");
    setFormDeliveryMode("individuel");
    setFormLocation("");
    setFormOutputs("");
    setFormSatisfaction("");
    
    setMaturityDigitalBefore("1");
    setMaturityDigitalAfter("1");
    setMaturityIaBefore("1");
    setMaturityIaAfter("1");
    setMaturityCyberBefore("1");
    setMaturityCyberAfter("1");
    setMaturityExportBefore("1");
    setMaturityExportAfter("1");
    setMaturityDurabilityBefore("1");
    setMaturityDurabilityAfter("1");

    setFormNextServiceId("");
    setFormNextStepComment("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prestation: any) => {
    setIsEditMode(true);
    setSelectedPrestation(prestation);
    setFormTitle(prestation.title || "");
    setFormDesc(prestation.description || "");
    setFormBeneficiaryId(prestation.beneficiaryId?.toString() || "");
    setFormServiceId(prestation.serviceId?.toString() || "");
    setFormProviderOrgId(prestation.providerOrganizationId?.toString() || prestation.operatorId?.toString() || "");
    setFormStatus(prestation.status || "planned");
    setFormChannel(prestation.channel || "mail");
    setFormDeliveryMode(prestation.deliveryMode || "individuel");
    setFormLocation(prestation.location || "");
    setFormOutputs(prestation.outputs || "");
    setFormSatisfaction(prestation.satisfactionScore?.toString() || "");
    
    // Maturity mapping
    const mb = prestation.maturityBefore || {};
    setMaturityDigitalBefore((mb.digital || "1").toString());
    setMaturityIaBefore((mb.ia || "1").toString());
    setMaturityCyberBefore((mb.cyber || "1").toString());
    setMaturityExportBefore((mb.export || "1").toString());
    setMaturityDurabilityBefore((mb.durability || "1").toString());

    const ma = prestation.maturityAfter || {};
    setMaturityDigitalAfter((ma.digital || "1").toString());
    setMaturityIaAfter((ma.ia || "1").toString());
    setMaturityCyberAfter((ma.cyber || "1").toString());
    setMaturityExportAfter((ma.export || "1").toString());
    setMaturityDurabilityAfter((ma.durability || "1").toString());

    setFormNextServiceId(prestation.nextRecommendedServiceId?.toString() || "");
    setFormNextStepComment(prestation.nextStepComment || "");
    setIsModalOpen(true);
  };

  const handleOpenDetailPanel = (prestation: any) => {
    setSelectedPrestation(prestation);
    setIsDetailOpen(true);
  };

  const handleDeletePrestation = async (id: number, beneficiaryId?: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet accompagnement ? Cette action est irréversible et supprimera également l'activité correspondante.")) {
      try {
        await deleteMutation.mutateAsync({ id, beneficiaryId });
        setIsDetailOpen(false);
      } catch (err: any) {
        alert(err.message || "Erreur de suppression");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBeneficiaryId || !formServiceId) {
      alert("Le bénéficiaire et le service CPSV sont obligatoires.");
      return;
    }

    const maturityBefore = {
      digital: parseInt(maturityDigitalBefore),
      ia: parseInt(maturityIaBefore),
      cyber: parseInt(maturityCyberBefore),
      export: parseInt(maturityExportBefore),
      durability: parseInt(maturityDurabilityBefore)
    };

    const maturityAfter = {
      digital: parseInt(maturityDigitalAfter),
      ia: parseInt(maturityIaAfter),
      cyber: parseInt(maturityCyberAfter),
      export: parseInt(maturityExportAfter),
      durability: parseInt(maturityDurabilityAfter)
    };

    const payload: any = {
      title: formTitle || undefined,
      description: formDesc || null,
      serviceId: parseInt(formServiceId),
      beneficiaryId: parseInt(formBeneficiaryId),
      providerOrganizationId: formProviderOrgId ? parseInt(formProviderOrgId) : null,
      // Sync duplicates as per constraints
      operatorId: formProviderOrgId ? parseInt(formProviderOrgId) : null,
      status: formStatus,
      channel: formChannel,
      deliveryMode: formDeliveryMode,
      location: formLocation || null,
      outputs: formOutputs || null,
      satisfactionScore: formSatisfaction ? parseFloat(formSatisfaction) : null,
      maturityBefore,
      maturityAfter,
      nextRecommendedServiceId: formNextServiceId ? parseInt(formNextServiceId) : null,
      nextStepComment: formNextStepComment || null,
      actualStartDate: new Date()
    };

    try {
      if (isEditMode && selectedPrestation) {
        await updateMutation.mutateAsync({ id: selectedPrestation.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Erreur d'enregistrement.");
    }
  };

  const loading = loadingDeliveries || loadingBeneficiaries || loadingServices || loadingOrganizations;

  return (
    <PITLayout
      category="ESPACE ACCOMPAGNEMENT"
      title="Prestations Réalisées"
      description="Registre et suivi opérationnel des prestations et accompagnements réels d'entreprises. Distinguez clairement l'offre théorique du catalogue (services CPSV) de leur délivrance sur le terrain."
      pageIcon={ClipboardCheck}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Accompagnement", href: "/accompaniment" }, { label: "Prestations" }]}
    >
      <div className="space-y-8">
        {/* Statistics Section */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <PITStatCard 
            label="Prestations Réalisées" 
            value={stats.total} 
            icon={ClipboardCheck} 
            themeColor="teal" 
            description="Total des accompagnements enregistrés" 
          />
          <PITStatCard 
            label="Taux de Clôture" 
            value={`${stats.closureRate}%`} 
            icon={CheckCircle2} 
            themeColor="indigo" 
            description="Prestations délivrées ou clôturées" 
          />
          <PITStatCard 
            label="Satisfaction Moyenne" 
            value={stats.avgSatisfaction} 
            icon={Sparkles} 
            themeColor="amber" 
            description="Moyenne sur 5 étoiles" 
          />
          <PITStatCard 
            label="En Attente" 
            value={stats.requestedOrPlanned} 
            icon={Clock} 
            themeColor="purple" 
            description="Statut 'demandé' ou 'planifié'" 
          />
        </section>

        {/* Filters and Search toolbar */}
        <div className="rounded-2xl bg-surface border border-muted/20 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-muted/10 pb-3">
            <h3 className="font-extrabold text-text flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
              <Filter className="h-4 w-4" />
              Filtres de Recherche
            </h3>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-650 hover:to-emerald-650 text-white rounded-xl shadow transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Enregistrer une prestation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Beneficiary Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase">Bénéficiaire</label>
              <select
                value={filterBeneficiary}
                onChange={(e) => setFilterBeneficiary(e.target.value)}
                className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
              >
                <option value="">Tous les bénéficiaires</option>
                {beneficiaries.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Operator Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase">Opérateur</label>
              <select
                value={filterOperator}
                onChange={(e) => setFilterOperator(e.target.value)}
                className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
              >
                <option value="">Tous les opérateurs</option>
                {organizations.map((org: any) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>

            {/* Service Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase">Service CPSV</label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
              >
                <option value="">Tous les services catalogue</option>
                {services.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase">Statut</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
              >
                <option value="">Tous les statuts</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Channel Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase">Canal</label>
              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
              >
                <option value="">Tous les canaux</option>
                {CHANNEL_OPTIONS.map((ch) => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* List table */}
        <div className="rounded-2xl bg-surface border border-muted/20 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
              <span className="text-muted text-xs font-bold animate-pulse">Chargement du registre...</span>
            </div>
          ) : deliveries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted">
              <AlertCircle className="h-12 w-12 text-muted/50 mb-3" />
              <p className="text-sm font-black">Aucune prestation trouvée.</p>
              <p className="text-xs text-muted max-w-sm mt-1">Essayez de modifier vos filtres ou enregistrez une nouvelle prestation réalisée.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-muted/10 text-muted font-black uppercase text-[10px]">
                    <th className="py-3">Prestation / Service CPSV</th>
                    <th className="py-3">Bénéficiaire</th>
                    <th className="py-3">Opérateur</th>
                    <th className="py-3">Canal</th>
                    <th className="py-3">Statut</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((d: any) => {
                    const statusConfig = STATUS_OPTIONS.find(opt => opt.value === d.status) || { label: d.status, color: "text-muted bg-muted/10 border-muted/20" };
                    return (
                      <tr key={d.id} className="border-b border-muted/5 hover:bg-glass/10 transition-colors">
                        <td className="py-4 pr-3">
                          <span className="font-bold text-text text-sm block">{d.title || "Accompagnement réalisé"}</span>
                          <span className="text-muted text-[10px] block mt-0.5">{d.service?.name}</span>
                        </td>
                        <td className="py-4">
                          <span className="font-bold text-text block">{d.beneficiary?.name}</span>
                          <span className="text-muted text-[10px] block mt-0.5">{d.beneficiary?.location}</span>
                        </td>
                        <td className="py-4">
                          <span className="font-bold text-text block">{d.providerOrganization?.name || d.operator?.name || "N/A"}</span>
                        </td>
                        <td className="py-4 font-bold capitalize text-muted">{d.channel || "téléphone"}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenDetailPanel(d)}
                            className="p-1.5 bg-glass hover:bg-glass/50 border border-muted/20 text-text rounded-lg inline-flex cursor-pointer transition-all"
                            title="Inspecter 360°"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(d)}
                            className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-500 rounded-lg inline-flex cursor-pointer transition-all"
                            title="Modifier"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePrestation(d.id, d.beneficiaryId)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 rounded-lg inline-flex cursor-pointer transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-surface border border-muted/20 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-muted/10 flex justify-between items-center bg-glass/10">
                <div>
                  <h3 className="text-base font-black uppercase tracking-wider text-text flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-teal-500" />
                    {isEditMode ? "Modifier la Prestation" : "Enregistrer une Prestation Réalisée"}
                  </h3>
                  <p className="text-[10px] text-muted font-bold mt-1">Saisie des informations de délivrance réelle de service.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-glass rounded-xl text-muted hover:text-text cursor-pointer transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted">Titre de l'accompagnement</label>
                    <input
                      type="text"
                      placeholder="Ex: Diagnostic IA Liège Métal"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                    />
                  </div>

                  {/* Beneficiary */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted">Bénéficiaire</label>
                    <select
                      value={formBeneficiaryId}
                      onChange={(e) => setFormBeneficiaryId(e.target.value)}
                      disabled={isEditMode}
                      className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                    >
                      {beneficiaries.map((b: any) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Service CPSV */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted">Service CPSV (Catalogue)</label>
                    <select
                      value={formServiceId}
                      onChange={(e) => setFormServiceId(e.target.value)}
                      disabled={isEditMode}
                      className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                    >
                      {services.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code || "Sans code"})</option>
                      ))}
                    </select>
                  </div>

                  {/* Provider Org */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted">Opérateur Prestataire</label>
                    <select
                      value={formProviderOrgId}
                      onChange={(e) => setFormProviderOrgId(e.target.value)}
                      className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                    >
                      <option value="">Sélectionner l'opérateur</option>
                      {organizations.map((org: any) => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted">Statut</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Channel */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted">Canal d'accès</label>
                    <select
                      value={formChannel}
                      onChange={(e) => setFormChannel(e.target.value)}
                      className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                    >
                      {CHANNEL_OPTIONS.map((ch) => (
                        <option key={ch} value={ch}>{ch}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-muted">Description / Récit de l'accompagnement</label>
                  <textarea
                    rows={3}
                    placeholder="Saisissez les détails de la prestation, contexte régional, besoins analysés..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                  />
                </div>

                {/* Outputs & Deliverables */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-muted">Livrables réels (Outputs)</label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Plan de transformation numérique v1.0, diagnostic cyber validé..."
                    value={formOutputs}
                    onChange={(e) => setFormOutputs(e.target.value)}
                    className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Delivery mode */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted">Mode de délivrance</label>
                    <select
                      value={formDeliveryMode}
                      onChange={(e) => setFormDeliveryMode(e.target.value)}
                      className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                    >
                      <option value="individuel">Individuel</option>
                      <option value="collectif">Collectif</option>
                      <option value="hybride">Hybride</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted">Lieu</label>
                    <input
                      type="text"
                      placeholder="Ex: Namur, sur site, en ligne..."
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                    />
                  </div>

                  {/* Satisfaction Score */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted">Note de satisfaction (0 à 5)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="5"
                      placeholder="Ex: 4.5"
                      value={formSatisfaction}
                      onChange={(e) => setFormSatisfaction(e.target.value)}
                      className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                    />
                  </div>
                </div>

                {/* Maturity Transition */}
                <div className="border border-muted/10 rounded-2xl p-4 bg-glass/5 space-y-3">
                  <h4 className="font-extrabold uppercase tracking-wider text-[10px] text-muted flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                    Transition de Maturité du Bénéficiaire
                  </h4>
                  
                  <div className="grid grid-cols-5 gap-3 text-center">
                    <div></div>
                    <div className="text-[9px] font-black uppercase text-muted">Numérique</div>
                    <div className="text-[9px] font-black uppercase text-muted">IA</div>
                    <div className="text-[9px] font-black uppercase text-muted">Cyber</div>
                    <div className="text-[9px] font-black uppercase text-muted">Export</div>

                    <div className="text-[10px] font-bold text-left py-1 text-muted">Avant</div>
                    {/* Digital Before */}
                    <input
                      type="number" min="1" max="5" value={maturityDigitalBefore}
                      onChange={(e) => setMaturityDigitalBefore(e.target.value)}
                      className="bg-glass border border-muted/20 text-center rounded focus:outline-none text-xs font-bold py-1"
                    />
                    {/* IA Before */}
                    <input
                      type="number" min="1" max="5" value={maturityIaBefore}
                      onChange={(e) => setMaturityIaBefore(e.target.value)}
                      className="bg-glass border border-muted/20 text-center rounded focus:outline-none text-xs font-bold py-1"
                    />
                    {/* Cyber Before */}
                    <input
                      type="number" min="1" max="5" value={maturityCyberBefore}
                      onChange={(e) => setMaturityCyberBefore(e.target.value)}
                      className="bg-glass border border-muted/20 text-center rounded focus:outline-none text-xs font-bold py-1"
                    />
                    {/* Export Before */}
                    <input
                      type="number" min="1" max="5" value={maturityExportBefore}
                      onChange={(e) => setMaturityExportBefore(e.target.value)}
                      className="bg-glass border border-muted/20 text-center rounded focus:outline-none text-xs font-bold py-1"
                    />

                    <div className="text-[10px] font-bold text-left py-1 text-muted">Après</div>
                    {/* Digital After */}
                    <input
                      type="number" min="1" max="5" value={maturityDigitalAfter}
                      onChange={(e) => setMaturityDigitalAfter(e.target.value)}
                      className="bg-glass border border-muted/20 text-center rounded focus:outline-none text-xs font-bold py-1"
                    />
                    {/* IA After */}
                    <input
                      type="number" min="1" max="5" value={maturityIaAfter}
                      onChange={(e) => setMaturityIaAfter(e.target.value)}
                      className="bg-glass border border-muted/20 text-center rounded focus:outline-none text-xs font-bold py-1"
                    />
                    {/* Cyber After */}
                    <input
                      type="number" min="1" max="5" value={maturityCyberAfter}
                      onChange={(e) => setMaturityCyberAfter(e.target.value)}
                      className="bg-glass border border-muted/20 text-center rounded focus:outline-none text-xs font-bold py-1"
                    />
                    {/* Export After */}
                    <input
                      type="number" min="1" max="5" value={maturityExportAfter}
                      onChange={(e) => setMaturityExportAfter(e.target.value)}
                      className="bg-glass border border-muted/20 text-center rounded focus:outline-none text-xs font-bold py-1"
                    />
                  </div>
                  <p className="text-[9px] text-muted italic mt-2">La maturité du bénéficiaire sera mise à jour dynamiquement à la clôture ou délivrance de la prestation.</p>
                </div>

                {/* Path recommendation */}
                <div className="border border-muted/10 rounded-2xl p-4 bg-glass/5 space-y-4">
                  <h4 className="font-extrabold uppercase tracking-wider text-[10px] text-muted flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    Recommandation & Suite de Parcours
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted uppercase">Prochain Service Recommandé</label>
                      <select
                        value={formNextServiceId}
                        onChange={(e) => setFormNextServiceId(e.target.value)}
                        className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                      >
                        <option value="">Aucune recommandation</option>
                        {services.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted uppercase">Commentaire de transition</label>
                      <input
                        type="text"
                        placeholder="Ex: Éligible au coaching individuel suite au diag..."
                        value={formNextStepComment}
                        onChange={(e) => setFormNextStepComment(e.target.value)}
                        className="w-full bg-glass border border-muted/20 px-3 py-2 text-xs font-bold rounded-lg text-text focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-muted/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-black bg-glass hover:bg-glass/80 border border-muted/20 text-text rounded-xl transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-650 hover:to-emerald-650 text-white rounded-xl shadow transition-all cursor-pointer"
                  >
                    {isEditMode ? "Enregistrer les modifications" : "Enregistrer l'accompagnement"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail 360° Sidebar panel */}
        {isDetailOpen && selectedPrestation && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50">
            <div className="bg-surface border-l border-muted/20 w-full max-w-md h-full shadow-2xl flex flex-col p-6 space-y-6 overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-muted/10 pb-4">
                <div>
                  <span className="text-[9px] font-black uppercase text-teal-605 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
                    Prestation 360°
                  </span>
                  <h3 className="text-base font-black text-text mt-2">{selectedPrestation.title || "Accompagnement"}</h3>
                  <span className="text-xs text-muted block mt-0.5">{selectedPrestation.service?.name}</span>
                </div>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-1.5 hover:bg-glass rounded-xl text-muted hover:text-text cursor-pointer transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status & Quick stats */}
              <div className="grid grid-cols-2 gap-4 border border-muted/10 rounded-2xl p-4 bg-glass/5">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-muted uppercase block">Statut Actuel</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-teal-500/15 text-teal-650 border border-teal-500/20">
                    {STATUS_OPTIONS.find(o => o.value === selectedPrestation.status)?.label || selectedPrestation.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-muted uppercase block">Canal</span>
                  <span className="font-extrabold text-xs text-text block capitalize">{selectedPrestation.channel || "N/A"}</span>
                </div>
              </div>

              {/* Beneficiary details */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-teal-655" />
                  Bénéficiaire
                </h4>
                <div className="bg-glass/10 border border-muted/10 rounded-2xl p-4 text-xs font-semibold space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted">Nom</span>
                    <span className="font-bold text-text">{selectedPrestation.beneficiary?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Taille</span>
                    <span className="font-bold text-text">{selectedPrestation.beneficiary?.size || "PME"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Arrondissement</span>
                    <span className="font-bold text-text">{selectedPrestation.beneficiary?.province || selectedPrestation.beneficiary?.location}</span>
                  </div>
                </div>
              </div>

              {/* Operator details */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-indigo-500" />
                  Opérateur / Conseiller
                </h4>
                <div className="bg-glass/10 border border-muted/10 rounded-2xl p-4 text-xs font-semibold space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted">Structure</span>
                    <span className="font-bold text-text">{selectedPrestation.providerOrganization?.name || selectedPrestation.operator?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Conseiller ID</span>
                    <span className="font-bold text-text">{selectedPrestation.providerPersonId || "Non assigné"}</span>
                  </div>
                </div>
              </div>

              {/* Deliverables / Description */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-purple-500" />
                  Livrables & Preuves
                </h4>
                <div className="bg-glass/10 border border-muted/10 rounded-2xl p-4 text-xs font-semibold space-y-3">
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-bold">Outputs</span>
                    <p className="text-text mt-1">{selectedPrestation.outputs || "Aucun livrable textuel encodé."}</p>
                  </div>
                  {selectedPrestation.evidences && selectedPrestation.evidences.length > 0 && (
                    <div>
                      <span className="text-muted block text-[10px] uppercase font-bold">Preuves associées</span>
                      <div className="mt-1.5 space-y-1.5">
                        {selectedPrestation.evidences.map((evi: any) => (
                          <div key={evi.id} className="flex justify-between items-center p-2 bg-glass rounded-lg border border-muted/15">
                            <span className="truncate max-w-[200px] font-bold text-text">{evi.name}</span>
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-600 px-1.5 rounded">{evi.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Transition commentary */}
              {selectedPrestation.nextRecommendedServiceId && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Prochaine Étape
                  </h4>
                  <div className="bg-glass/10 border border-muted/10 rounded-2xl p-4 text-xs font-semibold space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted">Recommandation suivante</span>
                      <span className="font-bold text-text">{selectedPrestation.nextRecommendedService?.name}</span>
                    </div>
                    {selectedPrestation.nextStepComment && (
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-bold mt-2">Notes</span>
                        <p className="text-text mt-1">{selectedPrestation.nextStepComment}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-6 border-t border-muted/10 mt-auto">
                <button
                  onClick={() => handleOpenEditModal(selectedPrestation)}
                  className="flex-1 py-2.5 text-xs font-black bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-500 rounded-xl transition-all cursor-pointer text-center"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeletePrestation(selectedPrestation.id, selectedPrestation.beneficiaryId)}
                  className="flex-1 py-2.5 text-xs font-black bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 rounded-xl transition-all cursor-pointer text-center"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PITLayout>
  );
}
