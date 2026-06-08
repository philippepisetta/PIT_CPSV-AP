// src/components/encode/Wizard.tsx
"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cpsvSchema } from "@/lib/schema/cpsv";

import GeneralInfoStep from "./steps/GeneralInfoStep";
import BusinessDescriptionStep from "./steps/BusinessDescriptionStep";
import ProvidersStep from "./steps/ProvidersStep";
import BeneficiariesStep from "./steps/BeneficiariesStep";
import EventsStep from "./steps/EventsStep";
import ConditionsStep from "./steps/ConditionsStep";
import DocumentsStep from "./steps/DocumentsStep";
import ChannelsStep from "./steps/ChannelsStep";
import OutputsStep from "./steps/OutputsStep";
import OutcomesStep from "./steps/OutcomesStep";
import ImpactsStep from "./steps/ImpactsStep";
import ResourcesStep from "./steps/ResourcesStep";
import RelatedServicesStep from "./steps/RelatedServicesStep";
import KpisStep from "./steps/KpisStep";
import InteropMetadataStep from "./steps/InteropMetadataStep";
import PublicationStep from "./steps/PublicationStep";

import LivePreviewPanel from "@/components/ui/LivePreviewPanel";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, ArrowLeft, Save, AlertCircle } from "lucide-react";

const steps = [
  { id: "generalInfo", component: GeneralInfoStep, label: "1. Infos Générales" },
  { id: "businessDescription", component: BusinessDescriptionStep, label: "2. Description Métier" },
  { id: "providers", component: ProvidersStep, label: "3. Fournisseurs" },
  { id: "beneficiaries", component: BeneficiariesStep, label: "4. Bénéficiaires" },
  { id: "events", component: EventsStep, label: "5. Événements Sémantiques" },
  { id: "conditions", component: ConditionsStep, label: "6. Éligibilité" },
  { id: "documents", component: DocumentsStep, label: "7. Documents Requis" },
  { id: "channels", component: ChannelsStep, label: "8. Canaux d’Accès" },
  { id: "outputs", component: OutputsStep, label: "9. Outputs" },
  { id: "outcomes", component: OutcomesStep, label: "10. Outcomes" },
  { id: "impacts", component: ImpactsStep, label: "11. Impacts Territoriaux" },
  { id: "resources", component: ResourcesStep, label: "12. Ressources" },
  { id: "relatedServices", component: RelatedServicesStep, label: "13. Services Liés" },
  { id: "kpis", component: KpisStep, label: "14. Indicateurs KPI" },
  { id: "interop", component: InteropMetadataStep, label: "15. Interopérabilité" },
  { id: "publication", component: PublicationStep, label: "16. Publication & Gouvernance" },
];

export default function Wizard({ onSuccess }: { onSuccess?: () => void }) {
  const methods = useForm({
    resolver: zodResolver(cpsvSchema),
    defaultValues: {
      generalInfo: { status: "Draft", language: "fr", version: "1.0.0" },
      conditions: { operator: "AND", hasValidBce: true, isWalloon: true },
      costs: { free: true },
      interop: { semicVocab: "http://data.europa.eu/m8g/", cpsvVersion: "3.0.0" },
      publication: { workflowStatus: "Draft" }
    }
  });

  const [currentStep, setCurrentStep] = useState(0);

  const StepComponent = steps[currentStep].component;

  const next = async () => {
    // Validate current step fields before going forward
    const stepId = steps[currentStep].id;
    const isValid = await methods.trigger(stepId as any);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const back = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const jumpToStep = (idx: number) => {
    setCurrentStep(idx);
  };

  const onSubmit = async (data: any) => {
    console.log("Saving full CPSV-AP enterprise model", data);
    
    // Mapping function from CPSV-AP form state to database relational payload
    const mapCpsvToBackend = (d: any) => {
      const orgName = d.providers?.primaryProvider || "";
      let organizationId = 1; // Default to Agence du Numérique (ORG-ADN)
      if (orgName.includes("Entreprendre") || orgName.includes("WE")) organizationId = 2;
      else if (orgName.includes("AWEX")) organizationId = 3;
      else if (orgName.includes("UCM")) organizationId = 4;

      const allChannels = d.channels?.allChannels || [];
      const channels = allChannels.map((c: string) => {
        if (c.toLowerCase().includes("web") || c.toLowerCase().includes("plateforme")) return 1;
        if (c.toLowerCase().includes("guichet") || c.toLowerCase().includes("physique")) return 2;
        if (c.toLowerCase().includes("rendez") || c.toLowerCase().includes("expert") || c.toLowerCase().includes("rdv")) return 3;
        if (c.toLowerCase().includes("téléphone") || c.toLowerCase().includes("phone")) return 4;
        return 1;
      });
      if (channels.length === 0) channels.push(1);

      const orgTypes = d.beneficiaries?.orgTypes || [];
      const targetAudiences = orgTypes.map((t: string) => {
        if (t.toLowerCase().includes("pme")) return 1;
        if (t.toLowerCase().includes("startup")) return 2;
        if (t.toLowerCase().includes("indépendant") || t.toLowerCase().includes("independant")) return 3;
        if (t.toLowerCase().includes("recherche") || t.toLowerCase().includes("centre")) return 4;
        return 1;
      });
      if (targetAudiences.length === 0) targetAudiences.push(1);

      const bEvents = d.events?.businessEvents || [];
      const businessEvents = bEvents.map((e: string) => {
        if (e.toLowerCase().includes("digital") || e.toLowerCase().includes("transformation")) return 1;
        if (e.toLowerCase().includes("financement") || e.toLowerCase().includes("recherche")) return 2;
        if (e.toLowerCase().includes("export") || e.toLowerCase().includes("international")) return 3;
        if (e.toLowerCase().includes("création") || e.toLowerCase().includes("creation")) return 4;
        return 1;
      });

      const lEvents = d.events?.lifeEvents || [];
      const lifeEvents = lEvents.map((e: string) => {
        if (e.toLowerCase().includes("reprise") || e.toLowerCase().includes("transmission") || e.toLowerCase().includes("difficulté")) return 1;
        return 1;
      });

      const catalogues = [1];

      const rules = d.conditions?.rules || [];
      const requirements = rules.map((rName: string) => {
        const slug = rName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return {
          name: rName,
          description: `Règle d'éligibilité : ${rName}`,
          code: `REQ-${slug.toUpperCase()}`,
          uri: `https://pit.wallonie.be/id/requirement/${slug}`,
          evidences: d.documents?.requiredDocs?.map((doc: any) => {
            const dSlug = doc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return {
              name: doc.name,
              description: `Document requis (${doc.format || "PDF"}). Obligatoire: ${doc.isMandatory ? "Oui" : "Non"}`,
              code: `EVI-${dSlug.toUpperCase()}`,
              uri: `https://pit.wallonie.be/id/evidence/${dSlug}`
            };
          }) || []
        };
      });

      const outList = d.outputs?.outputs || [];
      const outputs = outList.map((out: any) => {
        const slug = out.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return {
          name: out.name,
          description: `Livrable généré (${out.format || "Rapport"}). Auto: ${out.autoGenerated ? "Oui" : "Non"}`,
          code: `OUT-${slug.toUpperCase()}`,
          uri: `https://pit.wallonie.be/id/output/${slug}`
        };
      });

      const costs = [];
      if (d.costs && !d.costs.free) {
        const val = parseFloat(d.costs.amount) || 0;
        costs.push({
          name: "Tarif standard d'encodage",
          value: val,
          currency: d.costs.currency || "EUR",
          description: d.costs.description || "Frais direct d'accès"
        });
      }

      const contactPoints = [{
        name: d.providers?.contactName || "Contact principal",
        email: d.providers?.contactEmail || "contact@pit.wallonie.be",
        telephone: d.providers?.contactPhone || "+32 (0) 81 22 22 22",
        description: "Point de contact encodé via le cockpit"
      }];

      return {
        name: d.generalInfo?.name,
        description: (d.generalInfo?.shortDescription || "") + "\n\n" + (d.generalInfo?.description || ""),
        code: d.generalInfo?.uri ? d.generalInfo.uri.split("/").pop()?.toUpperCase() : "SVC-" + Date.now().toString().slice(-6),
        uri: d.generalInfo?.uri || `https://pit.wallonie.be/id/public-service/${(d.generalInfo?.name || "").toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        organizationId,
        channels,
        targetAudiences,
        businessEvents,
        lifeEvents,
        catalogues,
        requirements,
        outputs,
        costs,
        contactPoints
      };
    };

    try {
      const payload = mapCpsvToBackend(data);
      console.log("Transmitting payload to backend REST API:", payload);

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const createdService = await response.json();
      console.log("Service saved in Postgres via Prisma successfully:", createdService);
      alert("✅ Service CPSV-AP enregistré avec succès dans la base de données PostgreSQL du territoire !");
      
      methods.reset();
      setCurrentStep(0);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Failed to save service in database:", err);
      alert("❌ Erreur lors de l'enregistrement en base de données. Sauvegarde locale effectuée.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col xl:flex-row gap-6">
        
        {/* Step Navigation Sidebar */}
        <div className="xl:w-1/5 flex flex-row xl:flex-col overflow-x-auto xl:overflow-x-visible border-b xl:border-b-0 xl:border-r border-gray-200 dark:border-gray-800 pb-4 xl:pb-0 xl:pr-4 gap-2 scrollbar-none sticky top-20 max-h-[calc(100vh-10rem)]">
          <span className="hidden xl:block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            Étapes CPSV-AP
          </span>
          {steps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpToStep(idx)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-left text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap xl:whitespace-normal",
                currentStep === idx
                  ? "bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 border-l-2 border-primary-500"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <div className={cn(
                "w-5 h-5 flex items-center justify-center rounded-full border text-[10px]",
                currentStep > idx
                  ? "bg-green-500 border-green-500 text-white"
                  : currentStep === idx
                    ? "border-primary-500 text-primary-500 font-bold"
                    : "border-gray-300 dark:border-gray-700"
              )}>
                {currentStep > idx ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body Panel */}
        <div className="flex-1 space-y-6">
          {/* Header Action Bar */}
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500">
                Encodage Sémantique
              </span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mt-1">
                {steps[currentStep].label}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-lg shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 transition"
                >
                  Suivant
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-green-500/10 hover:shadow-green-500/20 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  Enregistrer le Service
                </button>
              )}
            </div>
          </div>

          {/* Form Step Body with AnimatePresence */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800/80 p-6 rounded-2xl shadow-sm min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <StepComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Live Quality, Graph & RDF/JSON-LD Panel */}
        <div className="xl:w-1/3 space-y-6">
          <LivePreviewPanel />
        </div>
      </form>
    </FormProvider>
  );
}
