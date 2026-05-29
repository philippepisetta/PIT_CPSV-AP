// src/app/providers.tsx

"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

// Light theme by default, respect system preference
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}
