// src/app/providers.tsx

"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { PITPerspectiveProvider } from "../design-system/PITPerspectiveProvider";

// Light theme by default, respect system preference
export function Providers({ children }: { children: ReactNode }) {
  return (
    <PITPerspectiveProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </PITPerspectiveProvider>
  );
}
