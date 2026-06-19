// src/app/contacts/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Users, Search, Mail, Phone, Building, Info, UserCheck } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { useV2Beneficiaries } from "@/hooks/useV2Queries";

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: beneficiariesData, isLoading } = useV2Beneficiaries();
  const beneficiaries = beneficiariesData?.data || [];

  // Extract all contacts from beneficiaries
  const contacts = useMemo(() => {
    const list: any[] = [];
    beneficiaries.forEach((bene: any) => {
      if (bene.contacts && Array.isArray(bene.contacts)) {
        bene.contacts.forEach((contact: any) => {
          list.push({
            ...contact,
            organizationName: bene.name,
            organizationId: bene.id
          });
        });
      }
    });
    return list;
  }, [beneficiaries]);

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c: any) => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.role && c.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.organizationName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  return (
    <PITLayout
      category="GESTION DE L'ÉCOSYSTÈME"
      title="Registre des Contacts"
      description="Gérez les personnes physiques rattachées aux organisations et bénéficiaires de l'écosystème wallon."
      pageIcon={Users}
      breadcrumb={[{ label: "Écosystème" }, { label: "Contacts" }]}
    >
      <div className="space-y-6">
        
        {/* Help Banner */}
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-start gap-3">
          <Info className="h-5 w-5 text-teal-605 shrink-0 mt-0.5" />
          <div className="text-xs text-teal-900 dark:text-teal-350">
            <p className="font-bold uppercase tracking-wider text-[10px]">Aide Métier : Définitions</p>
            <p className="mt-1 leading-relaxed">
              Un <strong>Contact</strong> est une personne physique rattachée à une organisation (Acteur territorial ou Bénéficiaire). Le <strong>Bénéficiaire</strong> est la structure accompagnée, tandis que l'<strong>Acteur</strong> représente un partenaire opérationnel du pôle.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex bg-glass/25 p-3 rounded-2xl border border-muted/15 items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted/60" />
            <input
              type="text"
              placeholder="Rechercher un contact par nom, email, rôle, organisation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-glass border border-muted/30 hover:border-muted/50 rounded-xl py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:border-teal-500 font-bold transition-all text-text"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-muted tracking-wider">
              Contacts Référencés ({filteredContacts.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-150 dark:border-gray-800 font-extrabold uppercase text-muted tracking-wider">
                  <th className="px-5 py-3">Nom</th>
                  <th className="px-5 py-3">Rôle / Type</th>
                  <th className="px-5 py-3">Organisation rattachée</th>
                  <th className="px-5 py-3">Coordonnées</th>
                  <th className="px-5 py-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div></td>
                      <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                      <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
                      <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                      <td className="px-5 py-4 text-right"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-muted italic font-semibold">
                      Aucun contact trouvé dans l'écosystème.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((c: any) => (
                    <tr key={c.id} className="hover:bg-teal-500/5 border-b border-gray-105 dark:border-gray-850 transition-colors">
                      <td className="px-5 py-4 font-bold text-text">
                        {c.name}
                      </td>
                      <td className="px-5 py-4 font-bold text-muted">
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md uppercase font-mono">
                          {c.role || "Non spécifié"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-text/90">
                          <Building className="h-3.5 w-3.5 text-muted shrink-0" />
                          <span>{c.organizationName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 space-y-1 font-semibold text-muted">
                        {c.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-teal-605 shrink-0" />
                            <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                          </div>
                        )}
                        {c.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-muted shrink-0" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {c.isPrimaryContact ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Principal
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-gray-500/10 text-gray-600 border border-gray-500/20">
                            Opérationnel
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PITLayout>
  );
}
