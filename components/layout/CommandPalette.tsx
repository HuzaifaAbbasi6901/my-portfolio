"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Copy,
  Download,
  FileText,
  Home,
  Moon,
  PenLine,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import { useToast } from "@/components/ui/Toast";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface PaletteAction {
  id: string;
  label: string;
  hint?: string;
  icon: ReactNode;
  group: string;
  perform: () => void;
}

interface PaletteContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const noop = () => {};
const PaletteContext = createContext<PaletteContextValue>({
  open: false,
  setOpen: noop,
});

export function useCommandPalette() {
  return useContext(PaletteContext);
}

export function CommandPalette({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <PaletteContext.Provider value={{ open, setOpen }}>
      {children}
      <PaletteDialog open={open} setOpen={setOpen} />
    </PaletteContext.Provider>
  );
}

function PaletteDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();
  const { scrollTo } = useSmoothScroll();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const actions = useMemo<PaletteAction[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      if (href.startsWith("#")) scrollTo(href);
      else router.push(href);
    };

    const section = (id: string, label: string): PaletteAction => ({
      id: `section-${id}`,
      label,
      hint: id,
      icon: <Home className="h-4 w-4" aria-hidden />,
      group: "Navigate",
      perform: () => {
        setOpen(false);
        // On non-home routes, go home first then scroll.
        if (window.location.pathname === "/") scrollTo(`#${id}`);
        else {
          router.push("/");
          setTimeout(() => scrollTo(`#${id}`), 700);
        }
      },
    });

    return [
      section("about", "About"),
      section("skills", "Skills"),
      section("work", "Projects"),
      section("experience", "Experience"),
      section("contact", "Contact"),
      {
        id: "page-blog",
        label: "Blog",
        hint: "/blog",
        icon: <PenLine className="h-4 w-4" aria-hidden />,
        group: "Navigate",
        perform: go("/blog"),
      },
      {
        id: "page-home",
        label: "Home",
        hint: "/",
        icon: <Home className="h-4 w-4" aria-hidden />,
        group: "Navigate",
        perform: go("/"),
      },
      {
        id: "theme-toggle",
        label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`,
        icon:
          resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" aria-hidden />
          ) : (
            <Moon className="h-4 w-4" aria-hidden />
          ),
        group: "Actions",
        perform: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          setOpen(false);
        },
      },
      {
        id: "copy-email",
        label: "Copy email address",
        hint: siteConfig.email,
        icon: <Copy className="h-4 w-4" aria-hidden />,
        group: "Actions",
        perform: () => {
          void navigator.clipboard.writeText(siteConfig.email);
          toast({
            title: "Email copied",
            description: siteConfig.email,
            variant: "success",
          });
          setOpen(false);
        },
      },
      {
        id: "download-resume",
        label: "Download resume",
        hint: "PDF",
        icon: <Download className="h-4 w-4" aria-hidden />,
        group: "Actions",
        perform: () => {
          const a = document.createElement("a");
          a.href = siteConfig.resumePath;
          a.download = siteConfig.resumeFileName;
          a.click();
          setOpen(false);
        },
      },
      ...siteConfig.socials.map((social): PaletteAction => ({
        id: `social-${social.label}`,
        label: `Open ${social.label}`,
        hint: "External",
        icon: <ArrowUpRight className="h-4 w-4" aria-hidden />,
        group: "Social",
        perform: () => {
          window.open(social.href, "_blank", "noopener,noreferrer");
          setOpen(false);
        },
      })),
    ];
  }, [resolvedTheme, router, scrollTo, setTheme, setOpen, toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((action) =>
      `${action.label} ${action.group} ${action.hint ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [actions, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, PaletteAction[]>();
    for (const action of filtered) {
      const list = map.get(action.group) ?? [];
      list.push(action);
      map.set(action.group, list);
    }
    return [...map.entries()];
  }, [filtered]);

  // Global hotkey.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  // Focus input + reset state when opening.
  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const flat = grouped.flatMap(([, items]) => items);

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => Math.min(c + 1, flat.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      flat[cursor]?.perform();
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    const activeEl = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[95] flex items-start justify-center bg-background/60 px-4 pt-[14vh] backdrop-blur-md"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl overflow-hidden liquid rounded-2xl shadow-glow"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border/10 px-5">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCursor(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search sections, pages, actions…"
                aria-label="Search commands"
                className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
              <kbd className="hidden shrink-0 rounded-md border border-border/15 px-1.5 py-0.5 text-[10px] text-muted sm:block">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
              {flat.length === 0 ? (
                <p className="flex items-center gap-2 px-4 py-8 text-sm text-muted">
                  <Sparkles className="h-4 w-4" aria-hidden /> No results — try
                  “theme”, “email” or “resume”.
                </p>
              ) : (
                grouped.map(([group, items]) => (
                  <div key={group} className="mb-1">
                    <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                      {group}
                    </p>
                    {items.map((action) => {
                      const index = flat.indexOf(action);
                      const isActive = index === cursor;
                      return (
                        <button
                          key={action.id}
                          type="button"
                          data-active={isActive}
                          onMouseMove={() => setCursor(index)}
                          onClick={() => {
                            playSound("click");
                            action.perform();
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                            isActive
                              ? "bg-accent/15 text-foreground"
                              : "text-muted hover:bg-card/40 hover:text-foreground"
                          )}
                        >
                          <span className="shrink-0 text-accent">{action.icon}</span>
                          <span className="flex-1 truncate">{action.label}</span>
                          {action.hint ? (
                            <span className="shrink-0 text-xs text-muted">
                              {action.hint}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-border/10 px-5 py-3 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-border/15 px-1">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-border/15 px-1">↵</kbd>
                select
              </span>
              <span className="ml-auto flex items-center gap-1.5">
                <FileText className="h-3 w-3" aria-hidden /> {siteConfig.name}
                <span className="text-accent">Ctrl + K</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
