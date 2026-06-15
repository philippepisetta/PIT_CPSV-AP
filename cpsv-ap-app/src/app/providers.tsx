// src/app/providers.tsx

"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { PITPerspectiveProvider } from "../design-system/PITPerspectiveProvider";
import { PITWorkspaceProvider } from "../design-system/PITWorkspaceProvider";

// Light theme by default, respect system preference
export function Providers({ children }: { children: ReactNode }) {
  return (
    <PITPerspectiveProvider>
      <PITWorkspaceProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </PITWorkspaceProvider>
    </PITPerspectiveProvider>
  );
}

