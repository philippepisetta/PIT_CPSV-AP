// src/components/craft/CraftEcosystem.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, Building2, Mail, Download, Upload, Trash2, Plus, Sparkles, Database, BarChart3, HelpCircle, ChevronRight, Globe, Layers, Check, X, FileJson } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EcosystemActor {
  id: string;
  name: string;
  type: "PME" | "Laboratoire de Recherche" | "Structure d'Accompagnement" | "Incubateur" | "Fédération";
  bceNumber: string;
  filiere: "Agroalimentaire" | "Sciences de la Vie" | "Industrie Manufacturière" | "Énergies Propres" | "Technologies du Futur" | "Construction durable";
  valueChainSegment: "Recherche & Développement" | "Approvisionnement & Conception" | "Production & Industrialisation" | "Logistique & Distribution" | "Marketing & Export" | "Économie Circulaire & Fin de vie";
  province: "Liège" | "Namur" | "Hainaut" | "Brabant Wallon" | "Luxembourg";
  city: string;
  skills: string[];
  employeesCount: number;
  contactEmail: string;
  description: string;
}

const initialActors: EcosystemActor[] = [
  {
    id: "act-1",
    name: "Sirris Liège",
    type: "Laboratoire de Recherche",
    bceNumber: "0406.606.390",
    filiere: "Technologies du Futur",
    valueChainSegment: "Recherche & Développement",
    province: "Liège",
    city: "Seraing",
    skills: ["Impression 3D", "Intelligence Artificielle", "Internet des Objets", "Matériaux Avancés"],
    employeesCount: 150,
    contactEmail: "info@sirris.be",
    description: "Sirris aide les entreprises belges à intégrer l'innovation technologique, en réalisant des démonstrations et des projets R&D concrets."
  },
  {
    id: "act-2",
    name: "Centexbel Mons",
    type: "Laboratoire de Recherche",
    bceNumber: "0407.458.120",
    filiere: "Industrie Manufacturière",
    valueChainSegment: "Recherche & Développement",
    province: "Hainaut",
    city: "Mons",
    skills: ["Textile Technique", "Recyclage Polymères", "Eco-conception", "Caractérisation"],
    employeesCount: 95,
    contactEmail: "mons@centexbel.be",
    description: "Centre technique et de recherche pour l'industrie textile et plastique, spécialisé dans la transition écologique et l'économie circulaire."
  },
  {
    id: "act-3",
    name: "MecaWall S.A.",
    type: "PME",
    bceNumber: "0845.125.790",
    filiere: "Industrie Manufacturière",
    valueChainSegment: "Production & Industrialisation",
    province: "Namur",
    city: "Gembloux",
    skills: ["Usinage de précision", "Robots collaboratifs", "IoT Industriel"],
    employeesCount: 120,
    contactEmail: "contact@mecawall.be",
    description: "PME industrielle pionnière dans l'intégration de capteurs intelligents sur les lignes de montage mécaniques."
  },
  {
    id: "act-4",
    name: "Tweed Cluster",
    type: "Fédération",
    bceNumber: "0898.341.220",
    filiere: "Énergies Propres",
    valueChainSegment: "Approvisionnement & Conception",
    province: "Liège",
    city: "Liège",
    skills: ["Réseaux de chaleur", "Production Hydrogène", "Microgrids", "Audit énergétique"],
    employeesCount: 15,
    contactEmail: "info@clustertweed.be",
    description: "Fédération d'acteurs de l'énergie en Wallonie, structurant les projets d'innovation autour du renouvelable et du bas carbone."
  },
  {
    id: "act-5",
    name: "BioTech Liège Corp",
    type: "PME",
    bceNumber: "0677.291.503",
    filiere: "Sciences de la Vie",
    valueChainSegment: "Recherche & Développement",
    province: "Liège",
    city: "Liège",
    skills: ["Génie Génétique", "Cultures Cellulaires", "Validation TRL"],
    employeesCount: 18,
    contactEmail: "research@biotechliege.com",
    description: "Startup spécialisée dans les dispositifs médicaux innovants et la recherche clinique collaborative."
  },
  {
    id: "act-6",
    name: "AWEX Namur",
    type: "Structure d'Accompagnement",
    bceNumber: "0268.109.112",
    filiere: "Technologies du Futur",
    valueChainSegment: "Marketing & Export",
    province: "Namur",
    city: "Namur",
    skills: ["Prospection Marché", "Aide Exportation", "Salons Internationaux"],
    employeesCount: 220,
    contactEmail: "international@awex.be",
    description: "Agence wallonne à l'exportation et aux investissements étrangers, soutenant le développement international des entreprises wallonnes."
  },
  {
    id: "act-7",
    name: "EcoWeave S.A.",
    type: "PME",
    bceNumber: "0502.993.441",
    filiere: "Industrie Manufacturière",
    valueChainSegment: "Économie Circulaire & Fin de vie",
    province: "Hainaut",
    city: "Mons",
    skills: ["Recyclage Fibres", "Upcycling", "Logistique inverse"],
    employeesCount: 45,
    contactEmail: "sustainable@ecoweave.be",
    description: "Entreprise engagée dans la fabrication de textiles recyclés haut de gamme à partir de surplus locaux."
  },
  {
    id: "act-8",
    name: "W.E. (Wallonie Entreprendre)",
    type: "Structure d'Accompagnement",
    bceNumber: "0840.404.990",
    filiere: "Technologies du Futur",
    valueChainSegment: "Production & Industrialisation",
    province: "Brabant Wallon",
    city: "Nivelles",
    skills: ["Capital Risque", "Garanties Publiques", "Prêts Innovation"],
    employeesCount: 180,
    contactEmail: "contact@wallonie-entreprendre.be",
    description: "Outil financier et d'accompagnement de la Wallonie, investissant dans la croissance des start-ups et PME d'avenir."
  },
  {
    id: "act-9",
    name: "Tensegrity SRL",
    type: "PME",
    bceNumber: "0788.190.220",
    filiere: "Construction durable",
    valueChainSegment: "Approvisionnement & Conception",
    province: "Brabant Wallon",
    city: "Louvain-la-Neuve",
    skills: ["Modélisation structurelle", "BIM 3D", "Éco-matériaux"],
    employeesCount: 8,
    contactEmail: "hello@tensegrity.be",
    description: "Bureau d'études en ingénierie de construction durable et matériaux à faible impact carbone."
  },
  {
    id: "act-10",
    name: "E-Lab Luxembourg",
    type: "Incubateur",
    bceNumber: "0901.884.230",
    filiere: "Technologies du Futur",
    valueChainSegment: "Recherche & Développement",
    province: "Luxembourg",
    city: "Arlon",
    skills: ["Mentorat Startups", "Espace Coworking", "Pitch Coaching"],
    employeesCount: 12,
    contactEmail: "incubator@elab.be",
    description: "Structure d'accueil territoriale favorisant le maillage transfrontalier et le lancement d'entreprises innovantes."
  }
];

export default function CraftEcosystem() {
  const [actors, setActors] = useState<EcosystemActor[]>(initialActors);
  const [subTab, setSubTab] = useState<"directory" | "map" | "observatory" | "impexp">("directory");
  const [selectedActor, setSelectedActor] = useState<EcosystemActor | null>(null);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [filiereFilter, setFiliereFilter] = useState("All");
  const [valueChainFilter, setValueChainFilter] = useState("All");
  const [provinceFilter, setProvinceFilter] = useState("All");

  // Form States for adding manually
  const [isCreatingActor, setIsCreatingActor] = useState(false);
  const [newActName, setNewActName] = useState("");
  const [newActType, setNewActType] = useState<EcosystemActor["type"]>("PME");
  const [newActBce, setNewActBce] = useState("");
  const [newActFiliere, setNewActFiliere] = useState<EcosystemActor["filiere"]>("Industrie Manufacturière");
  const [newActValueChain, setNewActValueChain] = useState<EcosystemActor["valueChainSegment"]>("Production & Industrialisation");
  const [newActProvince, setNewActProvince] = useState<EcosystemActor["province"]>("Namur");
  const [newActCity, setNewActCity] = useState("");
  const [newActSkills, setNewActSkills] = useState("");
  const [newActEmail, setNewActEmail] = useState("");
  const [newActDesc, setNewActDesc] = useState("");

  // CSV Import States
  const [csvText, setCsvText] = useState("");
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // Filtered actors computed
  const filteredActors = useMemo(() => {
    return actors.filter(a => {
      const matchSearch = 
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.city.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase()) ||
        a.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
      
      const matchType = typeFilter === "All" || a.type === typeFilter;
      const matchFiliere = filiereFilter === "All" || a.filiere === filiereFilter;
      const matchVC = valueChainFilter === "All" || a.valueChainSegment === valueChainFilter;
      const matchProv = provinceFilter === "All" || a.province === provinceFilter;

      return matchSearch && matchType && matchFiliere && matchVC && matchProv;
    });
  }, [actors, search, typeFilter, filiereFilter, valueChainFilter, provinceFilter]);

  // Aggregate statistics for observatory
  const stats = useMemo(() => {
    const totalCount = actors.length;
    const totalEmployees = actors.reduce((sum, a) => sum + a.employeesCount, 0);
    const avgMaturity = 6.4; // TRL benchmark

    // Count filieres
    const filieresBreakdown = actors.reduce((acc, a) => {
      acc[a.filiere] = (acc[a.filiere] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count types
    const typesBreakdown = actors.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count provinces
    const provincesBreakdown = actors.reduce((acc, a) => {
      acc[a.province] = (acc[a.province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCount,
      totalEmployees,
      avgMaturity,
      filieresBreakdown,
      typesBreakdown,
      provincesBreakdown
    };
  }, [actors]);

  const handleSaveNewActor = () => {
    if (!newActName || !newActBce || !newActCity || !newActEmail) {
      alert("⚠️ Veuillez remplir tous les champs obligatoires (Nom, BCE, Ville, Email).");
      return;
    }

    const skillsArray = newActSkills
      ? newActSkills.split(",").map(s => s.trim()).filter(Boolean)
      : ["S3 Innovation"];

    const newActor: EcosystemActor = {
      id: `act-${Date.now()}`,
      name: newActName,
      type: newActType,
      bceNumber: newActBce,
      filiere: newActFiliere,
      valueChainSegment: newActValueChain,
      province: newActProvince,
      city: newActCity,
      skills: skillsArray,
      employeesCount: 10 + Math.round(Math.random() * 50),
      contactEmail: newActEmail,
      description: newActDesc || "Acteur industriel de l'écosystème wallon."
    };

    setActors(prev => [...prev, newActor]);
    setIsCreatingActor(false);
    
    // reset form
    setNewActName("");
    setNewActBce("");
    setNewActCity("");
    setNewActSkills("");
    setNewActEmail("");
    setNewActDesc("");
  };

  const handleDeleteActor = (id: string) => {
    if (confirm("❌ Supprimer cet acteur de l'écosystème ?")) {
      setActors(prev => prev.filter(a => a.id !== id));
      if (selectedActor?.id === id) {
        setSelectedActor(null);
      }
    }
  };

  const handleImportCSV = () => {
    if (!csvText) {
      setImportMessage("⚠️ Le texte CSV est vide.");
      return;
    }

    try {
      const lines = csvText.split("\n").map(l => l.trim()).filter(Boolean);
      let successCount = 0;
      const parsedActors: EcosystemActor[] = [];

      lines.forEach((line, index) => {
        // Skip header if matches format
        if (index === 0 && (line.toLowerCase().includes("nom") || line.toLowerCase().includes("name"))) {
          return;
        }

        const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
        if (cols.length >= 8) {
          const [name, type, bce, filiere, valueChain, province, city, email, desc] = cols;
          
          parsedActors.push({
            id: `act-${Date.now()}-${index}`,
            name,
            type: (type || "PME") as any,
            bceNumber: bce || "BCE-MOCK",
            filiere: (filiere || "Industrie Manufacturière") as any,
            valueChainSegment: (valueChain || "Production & Industrialisation") as any,
            province: (province || "Namur") as any,
            city: city || "Namur",
            skills: ["Imported"],
            employeesCount: 25,
            contactEmail: email || "contact@imported.be",
            description: desc || "Acteur économique importé."
          });
          successCount++;
        }
      });

      if (parsedActors.length > 0) {
        setActors(prev => [...prev, ...parsedActors]);
        setImportMessage(`✅ Importation réussie : ${successCount} acteurs ajoutés.`);
        setCsvText("");
      } else {
        setImportMessage("⚠️ Aucune ligne valide trouvée. Vérifiez le format (Nom, Type, BCE, Filiere, Chaîne, Province, Ville, Email, Description).");
      }
    } catch (err) {
      setImportMessage("❌ Erreur lors de l'analyse du CSV.");
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nom,Type,BCE,Filière,Chaîne de Valeurs,Province,Ville,Email,Description\n";
    
    actors.forEach(a => {
      const row = [
        `"${a.name}"`,
        `"${a.type}"`,
        `"${a.bceNumber}"`,
        `"${a.filiere}"`,
        `"${a.valueChainSegment}"`,
        `"${a.province}"`,
        `"${a.city}"`,
        `"${a.contactEmail}"`,
        `"${a.description.replace(/"/g, '""')}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "annuaire_craft_wallonie.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSONLD = () => {
    const jsonLdGraph = actors.map(a => ({
      "@context": "https://schema.org",
      "@type": "GovernmentOrganization",
      "@id": `https://pit.wallonie.be/actors/${a.id}`,
      "name": a.name,
      "taxID": a.bceNumber,
      "email": a.contactEmail,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": a.city,
        "addressRegion": a.province,
        "addressCountry": "BE"
      },
      "description": a.description,
      "knowsAbout": a.skills,
      "additionalType": "http://data.europa.eu/m8g/EcosystemActor",
      "filiere": a.filiere,
      "valueChainSegment": a.valueChainSegment
    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jsonLdGraph, null, 2))}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute("download", "craft_ecosystem_semantic.jsonld");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs switcher inside tab */}
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-200/50 dark:border-gray-800">
        <div className="flex gap-1.5">
          <button
            onClick={() => setSubTab("directory")}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer",
              subTab === "directory"
                ? "bg-white dark:bg-gray-850 text-purple-650 dark:text-purple-400 shadow-sm border border-gray-200/30 dark:border-gray-800"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-850"
            )}
          >
            <Building2 className="w-3.5 h-3.5 inline mr-1" />
            Annuaire des Acteurs ({filteredActors.length})
          </button>
          <button
            onClick={() => setSubTab("map")}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer",
              subTab === "map"
                ? "bg-white dark:bg-gray-850 text-purple-650 dark:text-purple-400 shadow-sm border border-gray-200/30 dark:border-gray-800"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-850"
            )}
          >
            <Globe className="w-3.5 h-3.5 inline mr-1" />
            Cartographie (SVG)
          </button>
          <button
            onClick={() => setSubTab("observatory")}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer",
              subTab === "observatory"
                ? "bg-white dark:bg-gray-850 text-purple-650 dark:text-purple-400 shadow-sm border border-gray-200/30 dark:border-gray-800"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-850"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5 inline mr-1" />
            Observatoire & Statistiques
          </button>
          <button
            onClick={() => setSubTab("impexp")}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer",
              subTab === "impexp"
                ? "bg-white dark:bg-gray-850 text-purple-650 dark:text-purple-400 shadow-sm border border-gray-200/30 dark:border-gray-800"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-850"
            )}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1" />
            Centre Import/Export
          </button>
        </div>

        {subTab === "directory" && !isCreatingActor && (
          <button
            onClick={() => setIsCreatingActor(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer mr-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter un Acteur
          </button>
        )}
      </div>

      {/* DIRECTORY VIEW */}
      {subTab === "directory" && (
        <div className="space-y-6">
          {/* Manually Creating Actor Form */}
          {isCreatingActor && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-purple-100 dark:border-purple-900 shadow-lg space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                <h4 className="text-sm font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Ajouter manuellement un Acteur d'Innovation
                </h4>
                <button onClick={() => setIsCreatingActor(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Nom de l'Acteur *</label>
                  <input
                    type="text"
                    placeholder="ex: Sirris / CRM Group"
                    value={newActName}
                    onChange={(e) => setNewActName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Type d'Acteur *</label>
                  <select
                    value={newActType}
                    onChange={(e) => setNewActType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  {/* Select options */}
                  <select
                    value={newActType}
                    onChange={(e) => setNewActType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="PME">PME (Petite & Moyenne Entreprise)</option>
                    <option value="Laboratoire de Recherche">Laboratoire de Recherche</option>
                    <option value="Structure d'Accompagnement">Structure d'Accompagnement</option>
                    <option value="Incubateur">Incubateur d'Innovation</option>
                    <option value="Fédération">Fédération / Cluster Professionnel</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Numéro BCE Belge *</label>
                  <input
                    type="text"
                    placeholder="ex: 0406.606.390"
                    value={newActBce}
                    onChange={(e) => setNewActBce(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Filière Stratégique S3 *</label>
                  <select
                    value={newActFiliere}
                    onChange={(e) => setNewActFiliere(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Agroalimentaire">Agroalimentaire</option>
                    <option value="Sciences de la Vie">Sciences de la Vie</option>
                    <option value="Industrie Manufacturière">Industrie Manufacturière</option>
                    <option value="Énergies Propres">Énergies Propres</option>
                    <option value="Technologies du Futur">Technologies du Futur</option>
                    <option value="Construction durable">Construction durable</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Segment Chaîne de Valeurs *</label>
                  <select
                    value={newActValueChain}
                    onChange={(e) => setNewActValueChain(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Recherche & Développement">Recherche & Développement</option>
                    <option value="Approvisionnement & Conception">Approvisionnement & Conception</option>
                    <option value="Production & Industrialisation">Production & Industrialisation</option>
                    <option value="Logistique & Distribution">Logistique & Distribution</option>
                    <option value="Marketing & Export">Marketing & Export</option>
                    <option value="Économie Circulaire & Fin de vie">Économie Circulaire & Fin de vie</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Province Wallonne *</label>
                  <select
                    value={newActProvince}
                    onChange={(e) => setNewActProvince(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Liège">Liège</option>
                    <option value="Namur">Namur</option>
                    <option value="Hainaut">Hainaut</option>
                    <option value="Brabant Wallon">Brabant Wallon</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Ville *</label>
                  <input
                    type="text"
                    placeholder="ex: Seraing / Nivelles"
                    value={newActCity}
                    onChange={(e) => setNewActCity(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Contact Email *</label>
                  <input
                    type="email"
                    placeholder="ex: innovation@sirris.be"
                    value={newActEmail}
                    onChange={(e) => setNewActEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Mots-clés (séparés par virgules)</label>
                  <input
                    type="text"
                    placeholder="ex: Impression 3D, IA, Robotique"
                    value={newActSkills}
                    onChange={(e) => setNewActSkills(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Description Synthétique</label>
                  <textarea
                    placeholder="Présentez brièvement les missions ou compétences de cet acteur..."
                    value={newActDesc}
                    onChange={(e) => setNewActDesc(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700 pt-3 text-xs">
                <button
                  onClick={() => setIsCreatingActor(false)}
                  className="px-3 py-1.5 bg-gray-150 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-bold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveNewActor}
                  className="px-3 py-1.5 bg-purple-650 hover:bg-purple-755 bg-purple-650 hover:bg-purple-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {/* Multicriteria filters */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Rechercher par nom, ville, compétence, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[9px] font-bold text-gray-450 uppercase block mb-1">Type d'Entité</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="All">Tous les types</option>
                  <option value="PME">PME</option>
                  <option value="Laboratoire de Recherche">Laboratoire de Recherche</option>
                  <option value="Structure d'Accompagnement">Structure d'Accompagnement</option>
                  <option value="Incubateur">Incubateur</option>
                  <option value="Fédération">Fédération</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-455 uppercase block mb-1">Filière S3</label>
                <select
                  value={filiereFilter}
                  onChange={(e) => setFiliereFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="All">Toutes les filières</option>
                  <option value="Agroalimentaire">Agroalimentaire</option>
                  <option value="Sciences de la Vie">Sciences de la Vie</option>
                  <option value="Industrie Manufacturière">Industrie Manufacturière</option>
                  <option value="Énergies Propres">Énergies Propres</option>
                  <option value="Technologies du Futur">Technologies du Futur</option>
                  <option value="Construction durable">Construction durable</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-455 uppercase block mb-1">Chaîne de Valeurs</label>
                <select
                  value={valueChainFilter}
                  onChange={(e) => setValueChainFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="All">Tous les segments</option>
                  <option value="Recherche & Développement">Recherche & Développement</option>
                  <option value="Approvisionnement & Conception">Approvisionnement & Conception</option>
                  <option value="Production & Industrialisation">Production & Industrialisation</option>
                  <option value="Logistique & Distribution">Logistique & Distribution</option>
                  <option value="Marketing & Export">Marketing & Export</option>
                  <option value="Économie Circulaire & Fin de vie">Économie Circulaire & Fin de vie</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-455 uppercase block mb-1">Province Wallonne</label>
                <select
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="All">Toutes les provinces</option>
                  <option value="Liège">Liège</option>
                  <option value="Namur">Namur</option>
                  <option value="Hainaut">Hainaut</option>
                  <option value="Brabant Wallon">Brabant Wallon</option>
                  <option value="Luxembourg">Luxembourg</option>
                </select>
              </div>
            </div>
          </div>

          {/* Directory Actors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActors.map(a => (
              <div
                key={a.id}
                onClick={() => setSelectedActor(a)}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md hover:shadow-lg transition duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 border border-purple-500/20">
                        {a.type}
                      </span>
                      <h4 className="text-xs font-black text-gray-900 dark:text-gray-100 mt-2 leading-tight">
                        {a.name}
                      </h4>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteActor(a.id);
                      }}
                      className="text-gray-400 hover:text-rose-500 p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                    {a.description}
                  </p>
                </div>

                <div className="space-y-2 border-t border-gray-50 dark:border-gray-700/60 pt-3">
                  <div className="flex flex-wrap gap-1">
                    {a.skills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-semibold text-[8px] border border-gray-200/50 dark:border-gray-800">
                        {s}
                      </span>
                    ))}
                    {a.skills.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/20 text-purple-600 text-[8px] font-bold">
                        +{a.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-gray-400">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-purple-500" />
                      {a.city} ({a.province})
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {a.filiere}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INTERACTIVE SVG MAP VIEW */}
      {subTab === "map" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Map */}
          <div className="col-span-12 lg:col-span-7 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-md flex flex-col items-center">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-purple-500 mb-2">
              Cartographie Sectorielle de Wallonie
            </h4>
            <p className="text-xs text-gray-400 text-center mb-6 max-w-md">
              Survolez les provinces pour voir la répartition des acteurs. Cliquez sur une province pour filtrer automatiquement l'annuaire de compétences.
            </p>

            <svg viewBox="0 0 300 240" className="w-full max-w-md overflow-visible select-none">
              {/* Hainaut */}
              <path
                d="M 20 80 L 80 60 L 110 90 L 90 130 L 30 120 Z"
                onClick={() => setProvinceFilter(provinceFilter === "Hainaut" ? "All" : "Hainaut")}
                className={cn(
                  "stroke-white dark:stroke-gray-800 stroke-[1.5] transition-all duration-300 cursor-pointer outline-none",
                  provinceFilter === "Hainaut"
                    ? "fill-purple-600 shadow-md"
                    : "fill-purple-300 hover:fill-purple-400 dark:fill-purple-900/40 dark:hover:fill-purple-800/60"
                )}
              />
              
              {/* Brabant Wallon */}
              <path
                d="M 80 60 L 130 45 L 150 75 L 110 90 Z"
                onClick={() => setProvinceFilter(provinceFilter === "Brabant Wallon" ? "All" : "Brabant Wallon")}
                className={cn(
                  "stroke-white dark:stroke-gray-800 stroke-[1.5] transition-all duration-300 cursor-pointer outline-none",
                  provinceFilter === "Brabant Wallon"
                    ? "fill-purple-600"
                    : "fill-purple-200 hover:fill-purple-450 dark:fill-purple-950/40 dark:hover:fill-purple-800/50"
                )}
              />

              {/* Namur */}
              <path
                d="M 110 90 L 150 75 L 180 115 L 145 175 L 90 130 Z"
                onClick={() => setProvinceFilter(provinceFilter === "Namur" ? "All" : "Namur")}
                className={cn(
                  "stroke-white dark:stroke-gray-800 stroke-[1.5] transition-all duration-300 cursor-pointer outline-none",
                  provinceFilter === "Namur"
                    ? "fill-purple-600"
                    : "fill-purple-400 hover:fill-purple-500 dark:fill-purple-800/40 dark:hover:fill-purple-750/60"
                )}
              />

              {/* Liège */}
              <path
                d="M 130 45 L 230 20 L 270 75 L 220 125 L 180 115 L 150 75 Z"
                onClick={() => setProvinceFilter(provinceFilter === "Liège" ? "All" : "Liège")}
                className={cn(
                  "stroke-white dark:stroke-gray-800 stroke-[1.5] transition-all duration-300 cursor-pointer outline-none",
                  provinceFilter === "Liège"
                    ? "fill-purple-600"
                    : "fill-purple-350 hover:fill-purple-450 dark:fill-purple-900/30 dark:hover:fill-purple-800/40"
                )}
              />

              {/* Luxembourg */}
              <path
                d="M 180 115 L 220 125 L 245 195 L 175 215 L 145 175 Z"
                onClick={() => setProvinceFilter(provinceFilter === "Luxembourg" ? "All" : "Luxembourg")}
                className={cn(
                  "stroke-white dark:stroke-gray-800 stroke-[1.5] transition-all duration-300 cursor-pointer outline-none",
                  provinceFilter === "Luxembourg"
                    ? "fill-purple-600"
                    : "fill-purple-500 hover:fill-purple-600 dark:fill-purple-850/40 dark:hover:fill-purple-800/70"
                )}
              />

              {/* Labels & Counts */}
              {/* Hainaut */}
              <g className="pointer-events-none select-none">
                <text x="60" y="100" textAnchor="middle" className="text-[8px] font-extrabold fill-purple-950 dark:fill-purple-100">Hainaut</text>
                <text x="60" y="110" textAnchor="middle" className="text-[7px] font-bold fill-purple-700 dark:fill-purple-300">({stats.provincesBreakdown["Hainaut"] || 0})</text>
              </g>

              {/* Brabant Wallon */}
              <g className="pointer-events-none select-none">
                <text x="115" y="65" textAnchor="middle" className="text-[7px] font-extrabold fill-purple-950 dark:fill-purple-100">B. Wallon</text>
                <text x="115" y="73" textAnchor="middle" className="text-[6px] font-bold fill-purple-700 dark:fill-purple-300">({stats.provincesBreakdown["Brabant Wallon"] || 0})</text>
              </g>

              {/* Namur */}
              <g className="pointer-events-none select-none">
                <text x="135" y="120" textAnchor="middle" className="text-[8px] font-extrabold fill-purple-950 dark:fill-purple-100">Namur</text>
                <text x="135" y="130" textAnchor="middle" className="text-[7px] font-bold fill-purple-750 dark:fill-purple-300">({stats.provincesBreakdown["Namur"] || 0})</text>
              </g>

              {/* Liège */}
              <g className="pointer-events-none select-none">
                <text x="200" y="75" textAnchor="middle" className="text-[8px] font-extrabold fill-purple-950 dark:fill-purple-100">Liège</text>
                <text x="200" y="85" textAnchor="middle" className="text-[7px] font-bold fill-purple-800 dark:fill-purple-300">({stats.provincesBreakdown["Liège"] || 0})</text>
              </g>

              {/* Luxembourg */}
              <g className="pointer-events-none select-none">
                <text x="190" y="165" textAnchor="middle" className="text-[8px] font-extrabold fill-purple-950 dark:fill-purple-100">Luxembourg</text>
                <text x="190" y="175" textAnchor="middle" className="text-[7px] font-bold fill-purple-700 dark:fill-purple-300">({stats.provincesBreakdown["Luxembourg"] || 0})</text>
              </g>
            </svg>
          </div>

          {/* Right Column: Province Actors list preview */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-md">
              <div className="flex justify-between items-center border-b border-gray-55 dark:border-gray-700 pb-3">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                  Acteurs Filtrés par Carte
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  {provinceFilter === "All" ? "Toute la Wallonie" : provinceFilter}
                </span>
              </div>

              <div className="space-y-2 mt-4 max-h-[360px] overflow-y-auto pr-1">
                {actors
                  .filter(a => provinceFilter === "All" || a.province === provinceFilter)
                  .map(a => (
                    <div
                      key={a.id}
                      onClick={() => setSelectedActor(a)}
                      className="p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-purple-50/20 dark:hover:bg-purple-950/10 rounded-xl border border-gray-200/50 dark:border-gray-800/80 cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">{a.type}</span>
                        <h4 className="text-xs font-bold text-gray-850 dark:text-gray-150 truncate block mt-0.5">{a.name}</h4>
                        <span className="text-[9px] text-purple-600 dark:text-purple-400 mt-1 block">{a.city} • {a.filiere}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OBSERVATORY & CHARTS VIEW */}
      {subTab === "observatory" && (
        <div className="space-y-6">
          {/* Top Scorecard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Acteurs Référencés</span>
                <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{stats.totalCount}</h4>
              </div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Database className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Emplois R&D / Tech</span>
                <h4 className="text-xl font-black text-green-650 dark:text-green-400 mt-1">{stats.totalEmployees} FTE</h4>
              </div>
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                <Building2 className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Maturité Moyenne</span>
                <h4 className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">TRL {stats.avgMaturity}</h4>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Layers className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Filiere Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-purple-500">
                  Répartition Économique des Acteurs par Filière
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Pourcentage et volume absolu d'innovation.</p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  "Agroalimentaire",
                  "Sciences de la Vie",
                  "Industrie Manufacturière",
                  "Énergies Propres",
                  "Technologies du Futur",
                  "Construction durable"
                ].map(f => {
                  const count = stats.filieresBreakdown[f] || 0;
                  const pct = Math.round((count / stats.totalCount) * 100) || 0;

                  return (
                    <div key={f} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-600 dark:text-gray-300">{f}</span>
                        <span className="text-purple-600 dark:text-purple-400">{count} acteur(s) ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Type Distribution & Territorial Density */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-purple-500">
                  Maillage Territorial & Statut des Structures
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Répartition par typologie opérationnelle.</p>
              </div>

              {/* Typology breakdown */}
              <div className="space-y-4 pt-2">
                {[
                  { label: "PME", color: "bg-teal-500" },
                  { label: "Laboratoire de Recherche", color: "bg-blue-500" },
                  { label: "Structure d'Accompagnement", color: "bg-emerald-500" },
                  { label: "Incubateur", color: "bg-purple-500" },
                  { label: "Fédération", color: "bg-amber-500" }
                ].map(item => {
                  const count = stats.typesBreakdown[item.label] || 0;
                  const pct = Math.round((count / stats.totalCount) * 100) || 0;

                  return (
                    <div key={item.label} className="flex items-center gap-4 text-[10px]">
                      <span className="w-36 font-bold text-gray-500 dark:text-gray-400 truncate">{item.label}</span>
                      <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-1 border border-gray-100 dark:border-gray-800/80">
                        <div
                          className={cn("h-4 rounded-md transition-all duration-300 flex items-center justify-end pr-2 text-[9px] font-bold text-white shadow-xs", item.color)}
                          style={{ width: `${Math.max(10, pct)}%` }}
                        >
                          {count}
                        </div>
                      </div>
                      <span className="w-8 text-right font-black text-gray-400">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT / EXPORT VIEW */}
      {subTab === "impexp" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CSV Import */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-md space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-purple-500 flex items-center gap-1">
                <Upload className="w-4 h-4" />
                <span>Importation massive (CSV)</span>
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Collez les données de vos acteurs séparées par des virgules pour enrichir le catalogue.
              </p>
            </div>

            <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight italic bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-150 dark:border-gray-800/80">
              <strong>Format requis (avec ou sans en-tête) :</strong><br />
              <code>Nom, Type, BCE, Filiere, ChaîneDeValeur, Province, Ville, Email, Description</code>
            </div>

            <textarea
              placeholder="ex: Sirris Group,Laboratoire de Recherche,0406606390,Technologies du Futur,Recherche & Développement,Liège,Seraing,info@sirris.be,Spécialiste de la R&D"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={5}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none text-gray-700 dark:text-gray-150 font-mono resize-none focus:ring-1 focus:ring-purple-500"
            />

            {importMessage && (
              <div className={cn(
                "p-3 rounded-lg text-[10px] font-bold border",
                importMessage.includes("✅")
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              )}>
                {importMessage}
              </div>
            )}

            <button
              onClick={handleImportCSV}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Lancer l'Importation
            </button>
          </div>

          {/* API & Semantic Export */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-md space-y-6">
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-purple-500 flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>Export & Interopérabilité Européenne</span>
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Téléchargez l'annuaire territorial sous forme de bases interopérables.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-200/50 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-gray-800 dark:text-gray-150 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-purple-500" />
                    Format Plat CSV (CRAFT)
                  </h5>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Fichier tabulaire compatible avec Excel, Google Sheets et la plateforme CRAFT standard.
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  Exporter CSV
                </button>
              </div>

              <div className="p-4 rounded-xl border border-gray-200/50 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-gray-800 dark:text-gray-150 flex items-center gap-1.5">
                    <FileJson className="w-4 h-4 text-blue-500" />
                    Format JSON-LD (Org Ontology)
                  </h5>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Données sémantiques basées sur les ontologies du W3C pour l'intégration de graphes d'interopérabilité régionaux.
                  </p>
                </div>
                <button
                  onClick={handleExportJSONLD}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  Exporter JSON-LD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER FOR ACTOR */}
      {selectedActor && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop */}
            <div onClick={() => setSelectedActor(null)} className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer" aria-hidden="true" />
            
            {/* Panel */}
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md md:max-w-lg xl:max-w-xl bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between h-full">
                <div className="space-y-6 overflow-y-auto">
                  <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-650 px-2 py-0.5 rounded border border-purple-500/20">
                        {selectedActor.type}
                      </span>
                      <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mt-2">
                        {selectedActor.name}
                      </h3>
                      <div className="text-[9px] text-purple-600 dark:text-purple-400 font-bold block mt-1">
                        Numéro BCE Belge : {selectedActor.bceNumber}
                      </div>
                    </div>
                    <button onClick={() => setSelectedActor(null)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Description d'Acteur</h5>
                      <p className="text-xs text-gray-650 dark:text-gray-300 mt-2 leading-relaxed bg-gray-50/50 dark:bg-gray-950/20 p-3 rounded-lg border border-gray-100 dark:border-gray-850">
                        {selectedActor.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Filière S3 Cible</h5>
                        <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded">
                          {selectedActor.filiere}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Chaîne de Valeurs</h5>
                        <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 rounded">
                          {selectedActor.valueChainSegment}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Compétences & Mots-clés</h5>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedActor.skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 font-bold text-[9px] border border-purple-100 dark:border-purple-900">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-55 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2 text-xs">
                      <h5 className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-500" />
                        Coordonnées & Territoire
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                        <div>
                          <span className="text-[8px] text-gray-400 uppercase block">Localité</span>
                          <span className="font-bold text-gray-800 dark:text-zinc-200">{selectedActor.city}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-400 uppercase block">Province</span>
                          <span className="font-bold text-gray-800 dark:text-zinc-200">{selectedActor.province}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-center text-xs">
                  <a
                    href={`mailto:${selectedActor.contactEmail}`}
                    className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-bold"
                  >
                    <Mail className="w-4 h-4" />
                    {selectedActor.contactEmail}
                  </a>
                  <button
                    onClick={() => setSelectedActor(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-zinc-300 font-semibold rounded-lg transition"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
