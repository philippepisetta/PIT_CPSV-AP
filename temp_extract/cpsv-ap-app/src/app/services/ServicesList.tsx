"use client";

import { useState, useEffect } from "react";
import { useServices } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function ServicesList() {
  const { data, isLoading, error } = useServices();
  const [services, setServices] = useState(data?.services ?? []);
  const [name, setName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");
  const [language, setLanguage] = useState("");
  const [accessibility, setAccessibility] = useState(false);
  const [encoded, setEncoded] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newService = {
      id: Date.now().toString(),
      name,
      description,
      organisationId: orgId,
      sector,
      serviceType,
      serviceUrl,
      language,
      accessibility,
      contactPoint: {
        email,
        phone,
      },
    };
    const updated = [...services, newService];
    setServices(updated);
    // Encode the full services list in CPSV‑AP format
    setEncoded(JSON.stringify({ services: updated }, null, 2));
    // Reset form fields
    setName("");
    setOrgId("");
    setDescription("");
    setSector("");
    setServiceType("");
    setEmail("");
    setPhone("");
  };

  if (isLoading)
    return (
      <div className={cn("flex h-full items-center justify-center text-muted")}>
        Chargement des services…
      </div>
    );
  if (error)
    return <div className={cn("text-error")}>Erreur : {error.message}</div>;

  return (
    <section className="p-4">
      <h1 className="mb-4 text-2xl font-semibold text-text">Services</h1>
      {/* List existing services */}
      <ul className="space-y-2 mb-6">
        {services.map((svc) => (
          <li key={svc.id} className="rounded-md bg-surface p-3 shadow-card">
            <h2 className="font-medium text-text">{svc.name}</h2>
            <p className="text-muted">Organisation : {svc.organisationId}</p>
          </li>
        ))}
      </ul>
       {/* Form to add a new service */}
       <form onSubmit={handleAdd} className="flex flex-col gap-4 mb-4">
          <label className="flex flex-col">
            <span className="mb-1 text-muted">Nom du service</span>
            <input
              type="text"
              placeholder="Nom du service"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn("rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary")} 
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-muted">Description du service</span>
            <input
              type="text"
              placeholder="Description du service"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn("rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary")} 
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-muted">ID de l'organisation</span>
            <input
              type="text"
              placeholder="ID de l'organisation"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              className={cn("rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary")} 
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-muted">Secteur (ex. santé, éducation)</span>
            <input
              type="text"
              placeholder="Secteur (ex. santé, éducation)"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className={cn("rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary")} 
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-muted">Type de service (ex. administratif)</span>
            <input
              type="text"
              placeholder="Type de service (ex. administratif)"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className={cn("rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary")} 
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-muted">URL du service</span>
            <input
              type="url"
              placeholder="https://example.com/service"
              value={serviceUrl}
              onChange={(e) => setServiceUrl(e.target.value)}
              className={cn("rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary")} 
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-muted">Langue(s) du service (ex. fr, en)</span>
            <input
              type="text"
              placeholder="fr, en"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={cn("rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary")} 
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-muted">Accessibilité (oui/non)</span>
            <select
              value={accessibility ? "yes" : "no"}
              onChange={(e) => setAccessibility(e.target.value === "yes")}
              className={cn("rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary")} 
            >
              <option value="yes">Oui</option>
              <option value="no">Non</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-muted">Email de contact</span>
            <input
              type="email"
              placeholder="Email de contact"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn("rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary")} 
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-muted">Téléphone de contact</span>
            <input
              type="tel"
              placeholder="Téléphone de contact"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={cn("rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary")} 
            />
          </label>
         <button
           type="submit"
           className={cn("rounded-md bg-primary text-white px-4 py-2 hover:bg-primary/90 transition")}>
           Enregistrer
         </button>
       </form>
      {/* Show encoded representation of the last added service */}
      {encoded && (
        <pre className="bg-surface p-3 rounded-md overflow-x-auto">
          <code>{encoded}</code>
        </pre>
      )}
    </section>
  );
}
