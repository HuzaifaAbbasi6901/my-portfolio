"use client";

import { useEffect } from "react";

/** Registers the PWA service worker in production. */
export function ClientBoot() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration is best-effort; ignore failures.
      });
    }
  }, []);

  return null;
}
