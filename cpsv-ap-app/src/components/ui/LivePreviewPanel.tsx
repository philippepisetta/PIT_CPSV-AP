// src/components/ui/LivePreviewPanel.tsx
"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Share2, Layers, Cpu, Compass } from "lucide-react";

export default function LivePreviewPanel() {
  const { watch } = useFormContext();
  const formData = watch();
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"json" | "graph">("graph");

  // Multi-step complete quality scoring
  const computeCompleteness = (data: any) => {
    if (!data) return 0;
    let score = 0;
    let total = 0;

    // 1. General info (name, desc, uri, themes)
    total += 4;
    if (data.generalInfo?.name) score += 1;
    if (data.generalInfo?.shortDescription) score += 1;
    if (data.generalInfo?.uri) score += 1;
    if (data.generalInfo?.themes?.length > 0) score += 1;

    // 2. Business description (objective, targetDigitalMaturity, TRL)
    total += 3;
    if (data.businessDescription?.objective) score += 1;
    if (data.businessDescription?.targetDigitalMaturity) score += 1;
    if (data.businessDescription?.targetTRL) score += 1;

    // 3. Providers
    total += 3;
    if (data.providers?.primaryProvider) score += 1;
    if (data.providers?.contactEmail) score += 1;
    if (data.providers?.website) score += 1;

    // 4. Beneficiaries
    total += 2;
    if (data.beneficiaries?.orgTypes?.length > 0) score += 1;
    if (data.beneficiaries?.sectors?.length > 0) score += 1;

    // 5. Events
    total += 1;
    if (data.events?.businessEvents?.length > 0 || data.events?.lifeEvents?.length > 0) score += 1;

    // 6. Conditions
    total += 2;
    if (data.conditions?.rules?.length > 0) score += 1;
    if (data.conditions?.operator) score += 1;

    // 7. Documents
    total += 1;
    if (data.documents?.requiredDocs?.length > 0) score += 1;

    // 8. Channels
    total += 2;
    if (data.channels?.primaryChannel) score += 1;
    if (data.channels?.url) score += 1;

    // 9. Outputs
    total += 1;
    if (data.outputs?.outputs?.length > 0) score += 1;

    // 10. Outcomes
    total += 1;
    if (data.outcomes?.outcomes?.length > 0) score += 1;

    // 11. Impacts
    total += 3;
    if (data.impacts?.jobsCreated !== undefined) score += 1;
    if (data.impacts?.carbonImpact !== undefined) score += 1;
    if (data.impacts?.sovereignty !== undefined) score += 1;

    // 12. Resources
    total += 1;
    if (data.resources?.resourcesList?.length > 0) score += 1;

    // 13. Related services
    total += 1;
    if (
      data.relatedServices?.prerequisites?.length > 0 ||
      data.relatedServices?.successors?.length > 0
    )
      score += 1;

    // 14. Journey
    total += 2;
    if (data.journey?.phases?.length > 0) score += 1;
    if (data.journey?.journeyTimeline) score += 1;

    // 15. KPIs
    total += 1;
    if (data.kpis?.kpisList?.length > 0) score += 1;

    // 16. Interop
    total += 2;
    if (data.interop?.cpsvVersion) score += 1;
    if (data.interop?.semicVocab) score += 1;

    // 17. Publication
    total += 2;
    if (data.publication?.workflowStatus) score += 1;
    if (data.publication?.businessValidator) score += 1;

    return Math.round((score / total) * 100);
  };

  const completeness = computeCompleteness(formData);

  // Advanced SEMIC CPSV-AP v3.0 JSON-LD Generation
  const jsonLd = {
    "@context": [
      "https://schema.org/",
      {
        "cpsv": "http://data.europa.eu/m8g/",
        "dct": "http://purl.org/dc/terms/",
        "eli": "http://data.europa.eu/eli/",
        "cv": "http://data.europa.eu/m8g/"
      }
    ],
    "@id": formData.generalInfo?.uri || "https://pit.wallonie.be/services/service-temp",
    "@type": "cpsv:PublicService",
    "dct:title": formData.generalInfo?.name || "Sans nom",
    "dct:description": formData.generalInfo?.shortDescription || "Aucune description",
    "dct:language": formData.generalInfo?.language || "fr",
    "cv:version": formData.generalInfo?.version || "1.0.0",
    "dct:status": {
      "@type": "skos:Concept",
      "skos:prefLabel": formData.publication?.workflowStatus || "Draft"
    },
    "cv:hasCompetentAuthority": formData.providers?.primaryProvider ? {
      "@type": "cv:Agent",
      "dct:title": formData.providers.primaryProvider,
      "cv:contactPoint": {
        "@type": "schema:ContactPoint",
        "schema:email": formData.providers.contactEmail || undefined,
        "schema:telephone": formData.providers.contactPhone || undefined,
        "schema:url": formData.providers.website || undefined
      }
    } : undefined,
    "cv:hasInput": formData.documents?.requiredDocs?.map((doc: any) => ({
      "@type": "cv:Evidence",
      "dct:title": doc.name,
      "dct:format": doc.format,
      "cv:isMandatory": doc.isMandatory
    })),
    "cv:hasOutput": formData.outputs?.outputs?.map((out: any) => ({
      "@type": "cv:Output",
      "dct:title": out.name,
      "dct:format": out.format,
      "cv:autoGenerated": out.autoGenerated
    })),
    "cv:accessChannel": formData.channels?.primaryChannel ? {
      "@type": "cv:Channel",
      "dct:type": formData.channels.primaryChannel,
      "schema:url": formData.channels.url || undefined,
      "cv:sla": formData.channels.sla || undefined
    } : undefined,
    "cv:hasImpact": {
      "@type": "cv:Impact",
      "cv:carbonImpactIndex": formData.impacts?.carbonImpact ?? 50,
      "cv:jobsCreatedEst": formData.impacts?.jobsCreated ?? 0,
      "cv:sovereigntyIndex": formData.impacts?.sovereignty ?? 50,
      "cv:resilienceIndex": formData.impacts?.resilience ?? 50,
      "cv:competitivenessIndex": formData.impacts?.competitiveness ?? 50
    },
    "cv:follows": formData.conditions?.rules?.length > 0 ? {
      "@type": "cv:Rule",
      "dct:description": formData.conditions.rules.join("; "),
      "cv:logicalOperator": formData.conditions.operator
    } : undefined
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLd, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Node placements for relational SVG Graph
  const centerNode = { x: 130, y: 130, label: formData.generalInfo?.name || "Service", color: "bg-primary-500", icon: Layers };
  const graphNodes = [
    { x: 130, y: 40, label: formData.providers?.primaryProvider || "Autorité", color: "bg-blue-500", desc: "Fournisseur" },
    { x: 210, y: 80, label: formData.channels?.primaryChannel || "Canal", color: "bg-green-500", desc: "Accès" },
    { x: 210, y: 180, label: (formData.outputs?.outputs?.[0]?.name) || "Outputs", color: "bg-purple-500", desc: "Livrables" },
    { x: 50, y: 80, label: (formData.beneficiaries?.primaryTarget) || "Bénéficiaires", color: "bg-orange-500", desc: "Audience" },
    { x: 50, y: 180, label: (formData.relatedServices?.prerequisites?.[0]) || "Liens", color: "bg-pink-500", desc: "Relations" },
  ];

  return (
    <div className="space-y-6 sticky top-20">
      {/* Completeness Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500">
            Évaluation Territoriale
          </span>
          <Badge className="bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900">
            CPSV-AP v3.0
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-gray-100 dark:stroke-gray-700 fill-none"
                strokeWidth="5.5"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-primary-500 fill-none transition-all duration-500"
                strokeWidth="5.5"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - completeness / 100)}
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-gray-900 dark:text-gray-100">
              {completeness}%
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
              Score de Qualité Sémantique
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Évalue le taux de complétion des 17 facettes réglementaires SEMIC.
            </p>
            <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full font-bold bg-green-500/10 text-green-600 dark:text-green-400">
              {completeness > 80 ? "Sémantiquement conforme" : "En cours de modélisation"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setActiveSubTab("graph")}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all duration-200 ${
              activeSubTab === "graph"
                ? "border-primary-500 text-primary-500"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Graphe Sémantique
          </button>
          <button
            onClick={() => setActiveSubTab("json")}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all duration-200 ${
              activeSubTab === "json"
                ? "border-primary-500 text-primary-500"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            JSON‑LD Live
          </button>
        </div>

        {/* Tab 1: Relation Graph */}
        {activeSubTab === "graph" && (
          <div className="p-4 space-y-4">
            <div className="h-64 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800/50 relative overflow-hidden flex items-center justify-center">
              <svg width="260" height="260" className="overflow-visible">
                {/* Node connects paths with subtle glow and flow animation */}
                {graphNodes.map((n, idx) => (
                  <path
                    key={idx}
                    d={`M ${centerNode.x} ${centerNode.y} Q ${(centerNode.x + n.x) / 2} ${(centerNode.y + n.y) / 2 - 10} ${n.x} ${n.y}`}
                    className="stroke-gray-300 dark:stroke-gray-700 fill-none"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                ))}

                {/* Outer Nodes */}
                {graphNodes.map((n, idx) => (
                  <g key={idx}>
                    {/* Glow ring */}
                    <circle cx={n.x} cy={n.y} r="20" className="fill-white dark:fill-gray-900 stroke-gray-200 dark:stroke-gray-800 shadow" strokeWidth="1" />
                    <circle cx={n.x} cy={n.y} r="10" className={`fill-none ${n.color.replace("bg-", "stroke-")} opacity-60`} strokeWidth="3" />
                    
                    {/* Small Node details */}
                    <text x={n.x} y={n.y - 24} textAnchor="middle" className="text-[9px] font-bold fill-gray-900 dark:fill-gray-100 max-w-[50px] truncate">
                      {n.label.length > 12 ? n.label.slice(0, 10) + "..." : n.label}
                    </text>
                    <text x={n.x} y={n.y + 24} textAnchor="middle" className="text-[8px] font-bold fill-gray-400">
                      {n.desc}
                    </text>
                  </g>
                ))}

                {/* Center Node */}
                <g>
                  <circle cx={centerNode.x} cy={centerNode.y} r="28" className="fill-primary-500/20 stroke-primary-500" strokeWidth="2.5" />
                  <circle cx={centerNode.x} cy={centerNode.y} r="18" className="fill-primary-500 text-white flex items-center justify-center" />
                  <centerNode.icon className="absolute w-4 h-4 text-white" style={{ left: `${centerNode.x - 8}px`, top: `${centerNode.y - 8}px` }} />
                  <text x={centerNode.x} y={centerNode.y + 40} textAnchor="middle" className="text-[10px] font-extrabold fill-primary-600 dark:text-primary-400">
                    {centerNode.label.length > 20 ? centerNode.label.slice(0, 18) + "..." : centerNode.label}
                  </text>
                </g>
              </svg>
            </div>
            <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
              <Compass className="w-3.5 h-3.5 text-primary-500 animate-spin" style={{ animationDuration: '4s' }} />
              Graphe de relations sémantiques réactif en temps réel.
            </div>
          </div>
        )}

        {/* Tab 2: JSON-LD viewer */}
        {activeSubTab === "json" && (
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-mono text-gray-500">application/ld+json</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
            </div>
            <pre className="text-[10px] font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-xl overflow-x-auto border border-gray-100 dark:border-gray-800/80 text-gray-700 dark:text-gray-300 max-h-[280px] scrollbar-thin">
              {JSON.stringify(jsonLd, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
