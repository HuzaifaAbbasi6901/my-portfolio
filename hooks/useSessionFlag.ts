"use client";

import { useEffect, useState } from "react";

/** Reads sessionStorage on mount — avoids SSR/hydration mismatch. */
export function useSessionFlag(key: string): [boolean, boolean] {
  const [value, setValue] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setValue(sessionStorage.getItem(key) === "1");
    setLoaded(true);
  }, [key]);

  return [value, loaded];
}

export function setSessionFlag(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // Private mode — flags simply won't persist.
  }
}
