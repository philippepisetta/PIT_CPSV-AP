// src/app/governance/referentiels/page.tsx
"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Database, 
  Network, 
  Share2, 
  FileText, 
  Shield, 
  ExternalLink,
  Info,
  ChevronRight,
  GitBranch,
  Building,
  Tag
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  useV2ReferenceFrameworks,
  useV2ReferenceTaxonomies,
  useV2ReferenceConcepts,
  useV2ReferenceMappings,
  useV2NaceCodes,
  useV2NabsCodes,
  useV2CommonEuropeanDataSpaceDomains,
  useV2InteroperabilityStandards,
  useV2SourceDocuments,
  useV2DIS
} from "@/hooks/useV2Queries";

function ReferentielsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "s3-dis";

  // React Query Hooks
  const { data: frameworksData, isLoading: isFwLoading } = useV2ReferenceFrameworks();
  const { data: taxonomiesData, isLoading: isTaxLoading } = useV2ReferenceTaxonomies();
  const { data: conceptsData, isLoading: isConceptsLoading } = useV2ReferenceConcepts();
  const { data: mappingsData, isLoading: isMappingsLoading } = useV2ReferenceMappings();
  const { data: naceData, isLoading: isNaceLoading } = useV2NaceCodes();
  const { data: nabsData, isLoading: isNabsLoading } = useV2NabsCodes();
  const { data: domainsData, isLoading: isDomainsLoading } = useV2CommonEuropeanDataSpaceDomains();
  const { data: standardsData, isLoading: isStandardsLoading } = useV2InteroperabilityStandards();
  const { data: sourcesData, isLoading: isSourcesLoading } = useV2SourceDocuments();
  const { data: disData, isLoading: isDisLoading } = useV2DIS();

  const frameworks = frameworksData?.data || [];
  const taxonomies = taxonomiesData?.data || [];
  const concepts = conceptsData?.data || [];
  const mappings = mappingsData?.data || [];
  const naceCodes = naceData?.data || [];
  const nabsCodes = nabsData?.data || [];
  const domains = domainsData?.data || [];
  const standards = standardsData?.data || [];
  const sourceDocs = sourcesData?.data || [];
  const disList = disData?.data || [];

  const handleTabChange = (tabName: string) => {
    router.push(`/governance/referentiels?tab=${tabName}`);
  };

  const getSourceTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'EU_OFFICIAL':
      case 'JRC':
      case 'SEMIC':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'DSSC':
      case 'IDSA':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'WALLONIA':
      case 'INTERNAL':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <PITLayout
      category="REFERENTIELS"
      title="Registre des Référentiels Stables"
      description="Consultez et gérez les référentiels, ontologies, standards d'interopérabilité et sources documentaires de la PIT."
      pageIcon={BookOpen}
      breadcrumb={[{ label: "Gouvernance", href: "/guide" }, { label: "Référentiels stables" }]}
    >
      <div className="space-y-6 text-left">
        
        {/* Render Tab Contents */}
        <div className="bg-surface border border-muted/20 p-6 rounded-2xl">
          
          {/* TAB 1: S3 / DIS */}
          {currentTab === "s3-dis" && (
            <div className="space-y-6">
              <div className="border-b border-muted/10 pb-3">
                <h3 className="text-xs font-black uppercase text-text tracking-wider">Référentiels S3 / RIS3</h3>
                <p className="text-xs text-muted mt-1 font-semibold">
                  Cadre méthodologique européen pour la stratégie de spécialisation intelligente (S3) et les DIS wallons.
                </p>
              </div>

              {isFwLoading ? (
                <div className="text-xs text-muted">Chargement des frameworks...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {frameworks
                    .filter((fw: any) => fw.applicableTo === 'S3')
                    .map((fw: any) => (
                      <div key={fw.id} className="p-4 bg-muted/20 border border-muted/10 rounded-xl space-y-3 relative overflow-hidden">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-teal-600 uppercase tracking-wider">{fw.code}</span>
                          <Badge className={`${getSourceTypeBadgeColor(fw.sourceType)} border text-[8px] font-extrabold px-1.5`}>
                            {fw.sourceType}
                          </Badge>
                        </div>
                        <h4 className="text-xs font-black text-text">{fw.labelFr}</h4>
                        <p className="text-[11px] text-muted leading-relaxed font-normal">{fw.description || "Pas de description"}</p>
                        <div className="text-[9px] text-muted-foreground font-extrabold uppercase border-t border-muted/10 pt-2 flex items-center justify-between">
                          <span>Niveau: {fw.stabilityLevel}</span>
                          <span>Statut: {fw.legalOrMethodologicalStatus}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TAXONOMIES S3 */}
          {currentTab === "taxonomies-s3" && (
            <div className="space-y-6">
              <div className="border-b border-muted/10 pb-3">
                <h3 className="text-xs font-black uppercase text-text tracking-wider">Taxonomies S3 & Méthodologies</h3>
                <p className="text-xs text-muted mt-1 font-semibold">
                  Concepts organisés issus des guides méthodologiques RIS3 et cartographies Eye@RIS3.
                </p>
              </div>

              {isTaxLoading ? (
                <div className="text-xs text-muted">Chargement des taxonomies...</div>
              ) : (
                <div className="space-y-4">
                  {taxonomies
                    .filter((tax: any) => tax.framework?.applicableTo === 'S3')
                    .map((tax: any) => (
                      <div key={tax.id} className="p-4 bg-muted/20 border border-muted/10 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-teal-600 uppercase">{tax.name}</span>
                          <span className="text-[10px] text-muted font-bold">Code: {tax.code}</span>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-muted uppercase block">Concepts définis :</span>
                          <div className="flex flex-wrap gap-1.5">
                            {tax.concepts && tax.concepts.map((c: any) => (
                              <Badge key={c.id} className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-0 text-[10px]">
                                {c.labelFr}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DATA SPACES */}
          {currentTab === "dataspaces" && (
            <div className="space-y-6">
              <div className="border-b border-muted/10 pb-3">
                <h3 className="text-xs font-black uppercase text-text tracking-wider">Référentiels Data Spaces</h3>
                <p className="text-xs text-muted mt-1 font-semibold">
                  Cadre sémantique et architectural du DSSC Blueprint, IDSA RAM et du Data Governance Act.
                </p>
              </div>

              {isDomainsLoading ? (
                <div className="text-xs text-muted">Chargement des espaces européens...</div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/20 border border-muted/10 rounded-xl">
                    <span className="text-xs font-extrabold text-teal-600 uppercase block mb-3">14 Domaines Européens Communs</span>
                    <div className="grid grid-cols-2 md:grid-cols-3 sm:grid-cols-4 gap-2">
                      {domains.map((dom: any) => (
                        <div key={dom.id} className="p-2.5 bg-surface border border-muted/10 rounded-lg text-center text-xs font-extrabold text-text uppercase">
                          {dom.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INTEROP */}
          {currentTab === "interop" && (
            <div className="space-y-6">
              <div className="border-b border-muted/10 pb-3">
                <h3 className="text-xs font-black uppercase text-text tracking-wider">Standards d'Interopérabilité</h3>
                <p className="text-xs text-muted mt-1 font-semibold">
                  Modèles de données sémantiques pour catalogues (DCAT-AP), services (CPSV-AP), contextes (NGSI-LD).
                </p>
              </div>

              {isStandardsLoading ? (
                <div className="text-xs text-muted">Chargement...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {standards.map((std: any) => (
                    <div key={std.id} className="p-4 bg-muted/20 border border-muted/10 rounded-xl space-y-2">
                      <span className="text-xs font-extrabold text-teal-650 bg-teal-500/10 px-2 py-0.5 rounded">{std.code}</span>
                      <h4 className="text-xs font-black text-text mt-2">{std.name}</h4>
                      <p className="text-[11px] text-muted font-normal mt-1 leading-normal">{std.description || "Pas de description"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SECTORS */}
          {currentTab === "sectors" && (
            <div className="space-y-6">
              <div className="border-b border-muted/10 pb-3">
                <h3 className="text-xs font-black uppercase text-text tracking-wider">Référentiels Sectoriels NACE</h3>
                <p className="text-xs text-muted mt-1 font-semibold">
                  Nomenclature stable des activités économiques (NACE Rev. 2) pour classifier entreprises et DIS.
                </p>
              </div>

              {isNaceLoading ? (
                <div className="text-xs text-muted">Chargement...</div>
              ) : (
                <div className="bg-surface border border-muted/10 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-muted/10 text-xs">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="px-4 py-2 text-left font-black uppercase tracking-wider text-muted">Code</th>
                          <th className="px-4 py-2 text-left font-black uppercase tracking-wider text-muted">Libellé</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/10 font-medium">
                        {naceCodes.map((n: any) => (
                          <tr key={n.id}>
                            <td className="px-4 py-2 font-mono font-bold text-teal-600">{n.code}</td>
                            <td className="px-4 py-2">{n.labelFr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: LEGAL */}
          {currentTab === "legal" && (
            <div className="space-y-6">
              <div className="border-b border-muted/10 pb-3">
                <h3 className="text-xs font-black uppercase text-text tracking-wider">Référentiels RDI / Objectifs (NABS)</h3>
                <p className="text-xs text-muted mt-1 font-semibold">
                  Nomenclature NABS 2007 pour qualifier les priorités scientifiques et programmes R&D liés aux DIS.
                </p>
              </div>

              {isNabsLoading ? (
                <div className="text-xs text-muted">Chargement...</div>
              ) : (
                <div className="bg-surface border border-muted/10 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-muted/10 text-xs">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="px-4 py-2 text-left font-black uppercase tracking-wider text-muted">Code</th>
                          <th className="px-4 py-2 text-left font-black uppercase tracking-wider text-muted">Objectif RDI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/10 font-medium">
                        {nabsCodes.map((n: any) => (
                          <tr key={n.id}>
                            <td className="px-4 py-2 font-mono font-bold text-teal-600">{n.code}</td>
                            <td className="px-4 py-2">{n.labelFr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: INTERNAL */}
          {currentTab === "internal" && (
            <div className="space-y-6">
              <div className="border-b border-muted/10 pb-3">
                <h3 className="text-xs font-black uppercase text-text tracking-wider">Sources Internes & Notes Régionales</h3>
                <p className="text-xs text-muted mt-1 font-semibold">
                  Lignage technique distinguant les décisions ministérielles, présentations de consultants et notes internes AdN.
                </p>
              </div>

              {isSourcesLoading ? (
                <div className="text-xs text-muted">Chargement...</div>
              ) : (
                <div className="space-y-4">
                  {sourceDocs.map((doc: any) => (
                    <div key={doc.id} className="p-4 bg-muted/20 border border-muted/10 rounded-xl space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[7px] px-2.5 py-0.5 rounded-bl border-l border-b border-amber-500/20">
                        Interne / Consultance
                      </div>
                      <span className="text-[9px] font-black uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        {doc.status}
                      </span>
                      <h4 className="text-xs font-black text-text mt-2">{doc.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1">Auteur: {doc.author || "Non spécifié"}</p>
                      <p className="text-[11px] text-muted font-normal mt-1 leading-normal">{doc.description || "Pas de description"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: MAPPINGS */}
          {currentTab === "mappings" && (
            <div className="space-y-6">
              <div className="border-b border-muted/10 pb-3">
                <h3 className="text-xs font-black uppercase text-text tracking-wider">Alignements de Mappings</h3>
                <p className="text-xs text-muted mt-1 font-semibold">
                  Lignage conceptuel modélisé par des relations SKOS (EXACT_MATCH, RELATED, BROADER, NARROWER).
                </p>
              </div>

              {isMappingsLoading ? (
                <div className="text-xs text-muted">Chargement...</div>
              ) : (
                <div className="space-y-3">
                  {mappings.map((m: any) => (
                    <div key={m.id} className="p-3 bg-muted/20 border border-muted/10 rounded-xl flex items-center justify-between text-xs font-bold text-text">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-teal-650 bg-teal-500/10 px-2 py-0.5 rounded">{m.sourceConcept?.labelFr}</span>
                        <span>&rarr;</span>
                        <Badge className="bg-muted text-muted-foreground border-0 uppercase text-[9px] font-black">{m.mappingType}</Badge>
                        <span>&rarr;</span>
                        <span className="text-blue-650 bg-blue-500/10 px-2 py-0.5 rounded">{m.targetConcept?.labelFr}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-normal italic">{m.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </PITLayout>
  );
}

export default function ReferentielsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-xs text-muted">
        Chargement de l'espace Référentiels...
      </div>
    }>
      <ReferentielsContent />
    </Suspense>
  );
}
