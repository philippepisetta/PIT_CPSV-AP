// src/components/ui/TagInput.tsx
import React, { useEffect } from "react";
import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  name: string;
  control: Control<any>;
}

export const TagInput: React.FC<TagInputProps> = ({ name, control }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = e.target.value;
          const tags = raw.split(/[,;\s]+/).filter(Boolean);
          field.onChange(tags);
        };
        const value = (field.value as string[])?.join(", ") || "";
        return (
          <Input
            value={value}
            onChange={handleChange}
            placeholder="tag1, tag2, …"
          />
        );
      }}
    />
  );
};

export default TagInput;
