import Link from "next/link";
import { WifiOff } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-border/15 bg-card/40">
        <WifiOff className="h-7 w-7 text-accent" aria-hidden />
      </span>
      <h1 className="mt-8 font-display text-4xl font-bold tracking-tight">
        You&apos;re offline
      </h1>
      <p className="mt-4 max-w-sm text-muted">
        No internet connection. Previously visited pages still work — that&apos;s
        the magic of the service worker.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white shadow-glow transition-all hover:brightness-110"
      >
        Try the homepage
      </Link>
    </div>
  );
}
