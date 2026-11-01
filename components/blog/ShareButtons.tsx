"use client";

import { useState } from "react";
import { Link2, Twitter, Linkedin, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link copied", variant: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Couldn't copy link", variant: "error" });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs uppercase tracking-widest text-muted">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X / Twitter"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/10 text-muted transition-all duration-300 hover:border-accent/50 hover:text-foreground"
      >
        <Twitter className="h-4 w-4" aria-hidden />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/10 text-muted transition-all duration-300 hover:border-accent/50 hover:text-foreground"
      >
        <Linkedin className="h-4 w-4" aria-hidden />
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/10 text-muted transition-all duration-300 hover:border-accent/50 hover:text-foreground"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-400" aria-hidden />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
