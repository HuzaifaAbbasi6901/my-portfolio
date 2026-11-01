"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  Loader2,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import { contactSchema, type ContactPayload } from "@/lib/validation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";
import { useCommandPalette } from "@/components/layout/CommandPalette";
import { burstConfetti } from "@/components/layout/KonamiEgg";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-2xl liquid px-5 py-3.5 text-sm outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-muted focus:border-accent/60 focus:shadow-glow";

function SuccessCheck() {
  return (
    <svg viewBox="0 0 52 52" className="mx-auto h-16 w-16" aria-hidden>
      <motion.circle
        cx="26"
        cy="26"
        r="23"
        fill="none"
        stroke="#34D399"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.path
        d="M15 27l7.5 7.5L37 20"
        fill="none"
        stroke="#34D399"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
      />
    </svg>
  );
}

export function Contact() {
  const [formState, setFormState] = useState<FormState>("idle");
  const { toast } = useToast();
  const { setOpen: setPaletteOpen } = useCommandPalette();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  async function onSubmit(values: ContactPayload) {
    setFormState("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        simulated?: boolean;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "Something went wrong.");
      }

      setFormState("success");
      burstConfetti({ x: 0.5, y: 0.75 });
      toast({
        title: data.simulated
          ? "Message received (dev mode)"
          : "Message sent",
        description: data.simulated
          ? "Set RESEND_API_KEY to deliver real email."
          : "Thanks for reaching out — I'll reply within 24 hours.",
        variant: "success",
      });
      reset();
    } catch (error) {
      setFormState("error");
      toast({
        title: "Couldn't send your message",
        description:
          error instanceof Error ? error.message : "Please try again shortly.",
        variant: "error",
      });
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-accent/15 blur-[140px]"
      />
      <div className="container grid gap-16 lg:grid-cols-[1fr_1.1fr]">
        {/* Info panel */}
        <div>
          <SectionHeading
            eyebrow="Contact"
            title={
              <SplitText text="Tell me about your project." as="span" onScroll />
            }
            description="A role, a product, a wild idea — my inbox is open. I reply to everything within 24 hours."
          />

          <Reveal className="space-y-4" stagger={0.08}>
            <a
              href={`mailto:${siteConfig.email}`}
              className="group flex items-center gap-4 rounded-3xl liquid p-5 transition-all duration-300 hover:border-accent/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-muted">Email</p>
                <p className="truncate font-medium">{siteConfig.email}</p>
              </div>
              <ArrowUpRight
                className="ml-auto h-4 w-4 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                aria-hidden
              />
            </a>

            <div className="flex items-center gap-4 rounded-3xl liquid p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">Based in</p>
                <p className="font-medium">{siteConfig.location}</p>
              </div>
            </div>

            {siteConfig.calcomUrl ? (
              <a
                href={siteConfig.calcomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-3xl liquid p-5 transition-all duration-300 hover:border-accent/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                  <Calendar className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted">Prefer calls?</p>
                  <p className="font-medium">Book a 30-min intro</p>
                </div>
                <ArrowUpRight
                  className="ml-auto h-4 w-4 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden
                />
              </a>
            ) : null}
          </Reveal>
        </div>

        {/* Form */}
        <Reveal y={24}>
          <div className="relative rounded-[2rem] liquid p-8 backdrop-blur-md sm:p-10">
            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[28rem] flex-col items-center justify-center text-center"
                >
                  <SuccessCheck />
                  <h3 className="mt-6 font-display text-2xl font-semibold">
                    Message sent
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-muted">
                    Thanks for writing in — I&apos;ll get back to you within 24
                    hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormState("idle")}
                    className="mt-8 rounded-full border border-border/15 px-6 py-2.5 text-sm transition-colors hover:border-accent/50"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="space-y-5"
                >
                  {/* Honeypot — hidden from humans, irresistible to bots */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label>
                      Website
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        {...register("website")}
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Ada Lovelace"
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                        className={cn(inputClasses, errors.name && "border-rose-500/60")}
                        {...register("name")}
                      />
                      {errors.name ? (
                        <p className="mt-2 text-xs text-rose-400">{errors.name.message}</p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="ada@example.com"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        className={cn(inputClasses, errors.email && "border-rose-500/60")}
                        {...register("email")}
                      />
                      {errors.email ? (
                        <p className="mt-2 text-xs text-rose-400">{errors.email.message}</p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Let's build something great"
                      aria-invalid={Boolean(errors.subject)}
                      className={cn(inputClasses, errors.subject && "border-rose-500/60")}
                      {...register("subject")}
                    />
                    {errors.subject ? (
                      <p className="mt-2 text-xs text-rose-400">{errors.subject.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell me about your project, timeline and budget…"
                      aria-invalid={Boolean(errors.message)}
                      className={cn(inputClasses, "resize-none", errors.message && "border-rose-500/60")}
                      {...register("message")}
                    />
                    {errors.message ? (
                      <p className="mt-2 text-xs text-rose-400">{errors.message.message}</p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-accent px-8 py-4 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {formState === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <Send
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden
                        />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-muted">
                    Prefer browsing first?{" "}
                    <button
                      type="button"
                      onClick={() => setPaletteOpen(true)}
                      className="text-accent hover:underline"
                    >
                      Press Ctrl + K
                    </button>{" "}
                    to copy my email instead.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
