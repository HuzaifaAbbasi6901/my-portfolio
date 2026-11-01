"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ToastProvider } from "@/components/ui/Toast";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Preloader } from "@/components/layout/Preloader";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";
import { KonamiEgg } from "@/components/layout/KonamiEgg";
import { ClientBoot } from "@/components/layout/ClientBoot";

/**
 * Composes every global client-side provider + overlay widget.
 * Order matters: the command palette sits inside SmoothScroll so its
 * "scroll to section" actions can use the Lenis instance.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ToastProvider>
        <SmoothScroll>
          <CommandPalette>
            {children}
            <BackToTop />
          </CommandPalette>
          <ScrollProgress />
          <CustomCursor />
          <Preloader />
          <KonamiEgg />
        </SmoothScroll>
      </ToastProvider>
      <ClientBoot />
    </ThemeProvider>
  );
}
