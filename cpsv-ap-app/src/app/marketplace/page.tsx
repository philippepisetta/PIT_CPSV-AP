// src/app/marketplace/page.tsx
"use client";

import { useState } from "react";
import { 
  Database, 
  Search, 
  Layers, 
  ArrowRight, 
  Share2, 
  FileCheck, 
  Sparkles, 
  Info, 
  Activity, 
  Plus, 
  CheckCircle2, 
  Network, 
  ShieldCheck, 
  FileCode 
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITStatCard from "@/design-system/PITStatCard";
import SplitLayout from "@/components/ui/SplitLayout";
import PITForm, { FormSection } from "@/design-system/PITForm";
import { 
  useV2DataProductsQuery, 
  useV2SourceSystemsQuery, 
  useV2CreateDataProductMutation 
} from "@/hooks/useV2Queries";

interface SchemaField {
  field: string;
  type: string;
  mapping: string;
  taxonomy: string;
}

interface DataProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  sourceSystemId: string;
  sourceSystemName: string;
  owner: string;
  syncFrequency: string;
  qualityScore: number;
  apiEndpoint: string;
  license: string;
  subscriberCount: number;
  useCases: string[];
  schema: SchemaField[];
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "registry">("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Queries
  const { data: productsRes, isLoading: productsLoading } = useV2DataProductsQuery();
  const { data: systemsRes } = useV2SourceSystemsQuery();
  const createProductMutation = useV2CreateDataProductMutation();

  const products: DataProduct[] = productsRes?.data || [];
  const sourceSystems = systemsRes?.data || [];

  // Form states
  const [prodId, setProdId] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodCat, setProdCat] = useState("Administrative");
  const [prodDesc, setProdDesc] = useState("");
  const [prodSourceId, setProdSourceId] = useState("");
  const [prodOwner, setProdOwner] = useState("");
  const [prodFreq, setProdFreq] = useState("Quotidienne");
  const [prodQuality, setProdQuality] = useState("95");
  const [prodEndpoint, setProdEndpoint] = useState("");
  const [prodLicense, setProdLicense] = useState("Open Data Wallonie");
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([
    { field: "", type: "String", mapping: "", taxonomy: "N/A" }
  ]);

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
  };

  const handleSubscribe = (prodName: string) => {
    alert(`✅ Demande d'accès envoyée pour le Data Product "${prodName}". L'autorisation de synchronisation est en cours de traitement par le Data Steward.`);
  };

  // Add field to form schema
  const addSchemaField = () => {
    setSchemaFields([...schemaFields, { field: "", type: "String", mapping: "", taxonomy: "N/A" }]);
  };

  // Update field in form schema
  const updateSchemaField = (idx: number, key: keyof SchemaField, value: string) => {
    const updated = [...schemaFields];
    updated[idx][key] = value;
    setSchemaFields(updated);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodId || !prodName || !prodSourceId) {
      alert("L'identifiant, le nom et le système source sont requis.");
      return;
    }

    const selectedSystem = sourceSystems.find((s: any) => s.id === prodSourceId);

    const payload = {
      id: prodId,
      name: prodName,
      category: prodCat,
      description: prodDesc,
      sourceSystemId: prodSourceId,
      sourceSystemName: selectedSystem ? selectedSystem.name : prodSourceId,
      owner: prodOwner || selectedSystem?.owner || "Région Wallonne",
      syncFrequency: prodFreq,
      qualityScore: parseInt(prodQuality) || 95,
      apiEndpoint: prodEndpoint,
      license: prodLicense,
      subscriberCount: 0,
      useCases: [],
      schema: schemaFields.filter(f => f.field !== "")
    };

    createProductMutation.mutate(payload, {
      onSuccess: () => {
        alert("✅ Data Product enregistré avec succès dans le registre !");
        setActiveTab("marketplace");
        setSelectedProductId(prodId);
        // Clear
        setProdId("");
        setProdName("");
        setProdDesc("");
        setProdOwner("");
        setProdEndpoint("");
        setSchemaFields([{ field: "", type: "String", mapping: "", taxonomy: "N/A" }]);
      }
    });
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === "All" || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const selectedProduct = products.find(p => p.id === selectedProductId) || (filteredProducts.length > 0 ? filteredProducts[0] : null);

  const categories = ["All", "Administrative", "Diagnostic", "Strategic", "Ecosystem", "Catalog", "CRM"];

  // Left side: list of products
  const leftPane = (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="flex flex-wrap gap-1.5 bg-glass/10 p-1.5 rounded-xl border border-muted/10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border-0 bg-transparent cursor-pointer transition-all ${
              selectedCat === cat 
                ? "bg-teal-500 text-white font-extrabold" 
                : "text-muted hover:text-text hover:bg-glass"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of cards */}
      <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
        {filteredProducts.map((p) => {
          const isSelected = selectedProduct?.id === p.id;
          return (
            <div
              key={p.id}
              onClick={() => handleSelectProduct(p.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected 
                  ? "bg-teal-500/10 border-teal-500/40 shadow-md"
                  : "bg-glass/30 border-muted/15 hover:border-muted/30"
              }`}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase tracking-wider text-teal-605 bg-teal-500/10 px-2 py-0.5 rounded-full">
                    {p.category}
                  </span>
                  <span className="text-[10px] font-bold text-muted">
                    Qualité : <span className="text-teal-600 font-extrabold">{p.qualityScore}%</span>
                  </span>
                </div>
                <h3 className="font-extrabold text-xs text-text">{p.name}</h3>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">{p.description}</p>
              </div>

              <div className="flex justify-between items-center border-t border-muted/10 pt-2.5 text-[9px] font-bold text-muted">
                <span>Source : {p.sourceSystemName}</span>
                <span>Féq : {p.syncFrequency}</span>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-xs text-muted italic">
            Aucun produit de données trouvé dans cette catégorie.
          </div>
        )}
      </div>
    </div>
  );

  // Right side: Data Product Explorer & Lineage
  const rightPane = selectedProduct ? (
    <div className="bg-glass/30 border border-muted/20 rounded-2xl p-5 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-muted/10 pb-4">
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase text-teal-605 bg-teal-500/10 px-2.5 py-0.5 rounded-full">
            {selectedProduct.category}
          </span>
          <h2 className="font-extrabold text-sm text-text">{selectedProduct.name}</h2>
          <p className="text-xs text-muted font-bold">Propriétaire : {selectedProduct.owner}</p>
        </div>
        <button
          onClick={() => handleSubscribe(selectedProduct.name)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer border-0 shadow-sm transition-all"
        >
          Demander l'accès
        </button>
      </div>

      {/* Description */}
      <div className="bg-glass/10 p-3.5 border border-muted/10 rounded-xl space-y-1">
        <span className="text-[9px] font-bold text-muted uppercase block">Description Générale</span>
        <p className="text-xs text-text leading-relaxed">{selectedProduct.description}</p>
      </div>

      {/* Lineage Diagram (Source System -> Data Product -> Knowledge Graph -> Use Cases) */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-black uppercase text-muted tracking-wider block">
          Lignage Sémantique de Distribution
        </span>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 text-[11px] font-bold text-text bg-glass/20 p-4 border border-muted/10 rounded-2xl">
          {/* Source System */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl flex-1 w-full text-center">
            <span className="text-[8px] text-muted block uppercase mb-1">Système Source (SoR)</span>
            <span className="text-indigo-650">{selectedProduct.sourceSystemName}</span>
          </div>

          <ArrowRight className="h-4 w-4 text-muted shrink-0 rotate-90 md:rotate-0" />

          {/* Data Product */}
          <div className="bg-teal-500/10 border border-teal-500/20 p-2.5 rounded-xl flex-1 w-full text-center">
            <span className="text-[8px] text-muted block uppercase mb-1">Produit de Données</span>
            <span className="text-teal-650 truncate block">{selectedProduct.name}</span>
          </div>

          <ArrowRight className="h-4 w-4 text-muted shrink-0 rotate-90 md:rotate-0" />

          {/* Knowledge Graph */}
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-2.5 rounded-xl flex-1 w-full text-center">
            <span className="text-[8px] text-muted block uppercase mb-1">Graphe Sémantique</span>
            <span className="text-fuchsia-650">Knowledge Graph PIT</span>
          </div>

          {selectedProduct.useCases.length > 0 && (
            <>
              <ArrowRight className="h-4 w-4 text-muted shrink-0 rotate-90 md:rotate-0" />
              {/* Use Cases */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex-1 w-full text-center">
                <span className="text-[8px] text-muted block uppercase mb-1">Cas d'Usage Activés</span>
                <span className="text-amber-600 truncate block">
                  {selectedProduct.useCases.join(", ")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Schema Mapping Table */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-black uppercase text-muted tracking-wider block">
          Spécification du Schéma & Alignement Sémantique
        </span>
        <div className="overflow-x-auto rounded-xl border border-muted/10">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-glass/10 border-b border-muted/10 font-bold uppercase text-[9px] text-muted tracking-wider">
                <th className="p-3">Champ Source</th>
                <th className="p-3">Type</th>
                <th className="p-3">Mapping Graphe</th>
                <th className="p-3">Taxonomie Alignée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10 font-semibold text-text">
              {selectedProduct.schema.map((f, i) => (
                <tr key={i} className="hover:bg-glass/5">
                  <td className="p-3 font-mono text-xs">{f.field}</td>
                  <td className="p-3">{f.type}</td>
                  <td className="p-3 text-teal-650">{f.mapping}</td>
                  <td className="p-3 text-amber-600">
                    <span className={f.taxonomy !== "N/A" ? "bg-amber-500/10 text-amber-650 px-2 py-0.5 rounded text-[10px]" : "text-muted"}>
                      {f.taxonomy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metadata details */}
      <div className="grid grid-cols-2 gap-4 text-xs text-text font-semibold pt-2">
        <div className="bg-glass/5 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] text-muted uppercase block mb-1">API de Distribution</span>
          <span className="font-mono text-[10px] text-teal-650 break-all select-all">{selectedProduct.apiEndpoint}</span>
        </div>
        <div className="bg-glass/5 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] text-muted uppercase block mb-1">Type de Licence</span>
          <span>{selectedProduct.license}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center py-20 text-muted italic bg-glass/10 border-2 border-dashed border-muted/15 rounded-2xl">
      <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
      Sélectionnez un produit de données pour afficher son explorer.
    </div>
  );

  // Form Section definition for registration
  const registrySections: FormSection[] = [
    {
      id: "general",
      title: "Identité du Produit",
      subtitle: "Nom, catégorie et source du package",
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Identifiant unique *</label>
              <input required value={prodId} onChange={e => setProdId(e.target.value)} type="text" placeholder="ex: dp-biowin-members" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Nom du Produit *</label>
              <input required value={prodName} onChange={e => setProdName(e.target.value)} type="text" placeholder="ex: Membres BioWin" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Catégorie *</label>
              <select value={prodCat} onChange={e => setProdCat(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
                <option value="Administrative">Administrative</option>
                <option value="Diagnostic">Diagnostic</option>
                <option value="Strategic">Strategic</option>
                <option value="Ecosystem">Ecosystem</option>
                <option value="Catalog">Catalog</option>
                <option value="CRM">CRM</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Système Source (SoR) *</label>
              <select required value={prodSourceId} onChange={e => setProdSourceId(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
                <option value="">Sélectionner</option>
                {sourceSystems.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Description *</label>
            <textarea required value={prodDesc} onChange={e => setProdDesc(e.target.value)} placeholder="Décrivez les données du package et leur utilité..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none h-16 resize-none" />
          </div>
        </div>
      )
    },
    {
      id: "distribution",
      title: "Gouvernance & Métadonnées",
      subtitle: "Licence, qualité et points d'accès",
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Propriétaire des Données</label>
              <input value={prodOwner} onChange={e => setProdOwner(e.target.value)} type="text" placeholder="ex: Pôle BioWin" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Fréquence de Synchro</label>
              <select value={prodFreq} onChange={e => setProdFreq(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
                <option value="Temps Réel">Temps Réel</option>
                <option value="Quotidienne">Quotidienne</option>
                <option value="Hebdomadaire">Hebdomadaire</option>
                <option value="Mensuelle">Mensuelle</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Score de Qualité (%)</label>
              <input value={prodQuality} onChange={e => setProdQuality(e.target.value)} type="number" min="0" max="100" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Licence</label>
              <input value={prodLicense} onChange={e => setProdLicense(e.target.value)} type="text" placeholder="ex: Fédérée Restreinte" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">API Endpoint de Distribution</label>
            <input value={prodEndpoint} onChange={e => setProdEndpoint(e.target.value)} type="text" placeholder="https://..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
          </div>
        </div>
      )
    },
    {
      id: "schema",
      title: "Schéma & Alignements",
      subtitle: "Définissez les champs du produit et leur mapping dans le graphe",
      fields: (
        <div className="space-y-4">
          <div className="max-h-[220px] overflow-y-auto space-y-3 pr-1">
            {schemaFields.map((field, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 bg-glass/5 p-2 rounded-xl border border-muted/10 relative">
                <div>
                  <label className="text-[8px] font-bold uppercase text-muted mb-0.5 block">Champ</label>
                  <input required value={field.field} onChange={e => updateSchemaField(idx, "field", e.target.value)} type="text" placeholder="Name" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-1 text-[10px] text-text outline-none" />
                </div>
                <div>
                  <label className="text-[8px] font-bold uppercase text-muted mb-0.5 block">Type</label>
                  <select value={field.type} onChange={e => updateSchemaField(idx, "type", e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-1 text-[10px] text-text outline-none">
                    <option value="String">String</option>
                    <option value="Int">Int</option>
                    <option value="Float">Float</option>
                    <option value="Boolean">Boolean</option>
                  </select>
                </div>
                <div>
                  <label className="text-[8px] font-bold uppercase text-muted mb-0.5 block">Mapping PIT</label>
                  <input value={field.mapping} onChange={e => updateSchemaField(idx, "mapping", e.target.value)} type="text" placeholder="PIT.Member.name" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-1 text-[10px] text-text outline-none" />
                </div>
                <div>
                  <label className="text-[8px] font-bold uppercase text-muted mb-0.5 block">Taxonomie</label>
                  <input value={field.taxonomy} onChange={e => updateSchemaField(idx, "taxonomy", e.target.value)} type="text" placeholder="N/A" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-1 text-[10px] text-text outline-none" />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSchemaField}
            className="w-full py-2 border border-dashed border-muted/20 hover:border-muted/40 text-[10px] font-extrabold uppercase rounded-lg bg-glass text-muted hover:text-text cursor-pointer transition-all"
          >
            + Ajouter un champ
          </button>
        </div>
      )
    }
  ];

  return (
    <PITLayout
      category="ÉCHANGE DE DONNÉES TERRITORIALES"
      title="Territorial Data Marketplace & Data Products"
      description="Découvrez, souscrivez et explorez le registre des produits de données sémantiques qui alimentent le Knowledge Graph de la Wallonie."
      pageIcon={Database}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Data Marketplace" }
      ]}
      actions={
        <div className="flex bg-glass/25 p-1 rounded-xl border border-muted/15 gap-1 shrink-0">
          {[
            { id: "marketplace", label: "Explorer les Produits", icon: Database },
            { id: "registry", label: "Data Product Registry", icon: Plus }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer border-0 bg-transparent ${
                  activeTab === t.id 
                    ? "bg-teal-500 text-white font-extrabold" 
                    : "text-muted hover:text-text"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      }
    >
      <div className="space-y-4">
        {activeTab === "marketplace" ? (
          <>
            <PITFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Rechercher un produit de données par nom, description, propriétaire..."
            />
            <SplitLayout
              leftPane={leftPane}
              rightPane={rightPane}
              leftColSpan={5}
            />
          </>
        ) : (
          <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 relative max-w-4xl mx-auto">
            <PITForm
              title="Enregistrer un Data Product"
              sections={registrySections}
              onSubmit={handleCreateProduct}
              onCancel={() => setActiveTab("marketplace")}
              submitLabel="Créer le produit de données"
              infoPanel={
                <div className="space-y-4">
                  <p>
                    <strong>Data Product :</strong> Un produit de données est un ensemble de données sémantiquement cohérent, prêt à l'emploi et publié par un Source System (Salesforce, BCE, etc.).
                  </p>
                  <p>
                    En renseignant la spécification du schéma et son alignement sur le Knowledge Graph de la PIT, vous permettez aux décideurs et conseillers de faire des diagnostics précis basés sur des informations intègres et documentées.
                  </p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </PITLayout>
  );
}
