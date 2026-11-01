"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import {
  initSoundFlag,
  isSoundEnabled,
  setSoundEnabled,
} from "@/lib/sound";

/** Optional UI sound toggle — off by default, persisted to localStorage. */
export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initSoundFlag();
    setEnabled(isSoundEnabled());
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      aria-label={enabled ? "Disable interface sounds" : "Enable interface sounds"}
      aria-pressed={enabled}
      onClick={() => {
        const next = !enabled;
        setSoundEnabled(next);
        setEnabled(next);
      }}
      className="liquid flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:border-accent/40 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {mounted && enabled ? (
        <Volume2 className="h-[18px] w-[18px]" aria-hidden />
      ) : (
        <VolumeX className="h-[18px] w-[18px]" aria-hidden />
      )}
    </button>
  );
}
