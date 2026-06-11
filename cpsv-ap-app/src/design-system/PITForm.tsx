// src/design-system/PITForm.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormSection {
  id: string;
  title: string;
  subtitle?: string;
  fields: React.ReactNode;
}

interface PITFormProps {
  title: string;
  sections: FormSection[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  infoPanel?: React.ReactNode;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export default function PITForm({
  title,
  sections,
  onSubmit,
  onCancel,
  infoPanel,
  isSubmitting = false,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  className,
}: PITFormProps) {
  // Store collapsible state for sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start", className)}>
      {/* Form Area */}
      <form
        onSubmit={onSubmit}
        className={cn(
          "bg-glass border border-muted/20 rounded-2xl p-6 shadow-sm space-y-6",
          infoPanel ? "lg:col-span-2" : "lg:col-span-3"
        )}
      >
        <div className="border-b border-muted/10 pb-4">
          <h2 className="text-lg font-black text-text tracking-tight uppercase">
            {title}
          </h2>
        </div>

        <div className="space-y-4">
          {sections.map((section) => {
            const isCollapsed = !!collapsedSections[section.id];
            return (
              <div
                key={section.id}
                className="border border-muted/15 rounded-xl overflow-hidden bg-glass/10 transition-all duration-200"
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 bg-muted/5 hover:bg-muted/10 border-0 text-left cursor-pointer transition-colors"
                >
                  <div>
                    <h3 className="text-xs font-extrabold uppercase text-text tracking-wider">
                      {section.title}
                    </h3>
                    {section.subtitle && (
                      <p className="text-[10px] text-muted mt-0.5 leading-snug">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                  {isCollapsed ? (
                    <ChevronDown className="h-4 w-4 text-muted" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-muted" />
                  )}
                </button>

                {/* Section Content */}
                {!isCollapsed && (
                  <div className="p-5 border-t border-muted/10 space-y-4 animate-in slide-in-from-top-1 duration-200">
                    {section.fields}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="border-t border-muted/15 pt-5 flex justify-end gap-3.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-muted hover:bg-glass rounded-xl font-bold text-muted hover:text-text transition-all cursor-pointer bg-transparent disabled:opacity-50 text-xs"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-black shadow-md transition-all cursor-pointer border-0 disabled:opacity-50 text-xs"
          >
            {isSubmitting ? "Enregistrement..." : submitLabel}
          </button>
        </div>
      </form>

      {/* Help / Information Side Panel */}
      {infoPanel && (
        <div className="bg-glass/15 border border-muted/10 rounded-2xl p-5 shadow-xs space-y-4 lg:col-span-1 leading-relaxed text-xs">
          <div className="flex items-center gap-2 border-b border-muted/10 pb-3">
            <HelpCircle className="h-5 w-5 text-teal-650 dark:text-teal-400" />
            <span className="font-extrabold text-[10px] uppercase text-text tracking-wider">
              Aide Contextuelle & Recommandations
            </span>
          </div>
          <div className="text-muted text-[11px] space-y-3">
            {infoPanel}
          </div>
        </div>
      )}
    </div>
  );
}
