// src/components/ui/ReferenceSelector.tsx
"use client";

import React from "react";

interface Option {
  id: number | string;
  name: string;
}

interface ReferenceSelectorProps {
  label: string;
  options: Option[];
  value: string | number;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
}

export default function ReferenceSelector({
  label,
  options,
  value,
  onChange,
  required = false,
  placeholder = "Sélectionnez...",
}: ReferenceSelectorProps) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
