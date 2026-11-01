"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (input: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

let toastId = 0;

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />,
  error: <XCircle className="h-5 w-5 text-rose-400" aria-hidden />,
  info: <Info className="h-5 w-5 text-cyan" aria-hidden />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: Omit<Toast, "id">) => {
      const id = ++toastId;
      setToasts((current) => [...current.slice(-3), { ...input, id }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-[95] flex w-[min(92vw,360px)] flex-col gap-3"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 liquid rounded-2xl p-4 shadow-soft"
              )}
            >
              <span className="mt-0.5 shrink-0">{icons[t.variant]}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.description ? (
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {t.description}
                  </p>
                ) : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
