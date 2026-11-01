import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background: "rgb(var(--rgb-background) / <alpha-value>)",
        surface: "rgb(var(--rgb-surface) / <alpha-value>)",
        card: "rgb(var(--rgb-card) / <alpha-value>)",
        border: "rgb(var(--rgb-border) / <alpha-value>)",
        foreground: "rgb(var(--rgb-foreground) / <alpha-value>)",
        muted: "rgb(var(--rgb-muted) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--rgb-accent) / <alpha-value>)",
          foreground: "rgb(var(--rgb-accent-foreground) / <alpha-value>)",
        },
        cyan: {
          DEFAULT: "rgb(var(--rgb-cyan) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--rgb-gold) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-space)", ...defaultTheme.fontFamily.sans],
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "display-xl": "clamp(2.75rem, 6.5vw, 5.5rem)",
        display: "clamp(2.25rem, 4.5vw, 3.75rem)",
        "display-sm": "clamp(1.75rem, 3vw, 2.5rem)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgb(0 0 0 / 0.06)",
        glow: "0 0 40px -8px rgb(var(--rgb-accent) / 0.5)",
        "glow-cyan": "0 0 40px -8px rgb(var(--rgb-cyan) / 0.5)",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.8)" },
        },
        "ping-soft": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        caret: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-soft": "ping-soft 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        float: "float 6s ease-in-out infinite",
        caret: "caret 1s step-end infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "spin-slow": "spin-slow 14s linear infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgb(var(--rgb-foreground) / 0.85)",
            "--tw-prose-headings": "rgb(var(--rgb-foreground) / 1)",
            "--tw-prose-links": "rgb(var(--rgb-accent) / 1)",
            "--tw-prose-code": "rgb(var(--rgb-cyan) / 1)",
            "--tw-prose-quotes": "rgb(var(--rgb-foreground) / 1)",
            "--tw-prose-quote-borders": "rgb(var(--rgb-accent) / 1)",
            "--tw-prose-bold": "rgb(var(--rgb-foreground) / 1)",
            "--tw-prose-hr": "rgb(var(--rgb-border) / 0.15)",
            "--tw-prose-th-borders": "rgb(var(--rgb-border) / 0.15)",
            "--tw-prose-td-borders": "rgb(var(--rgb-border) / 0.1)",
            "--tw-prose-captions": "rgb(var(--rgb-muted) / 1)",
            a: {
              textDecoration: "none",
              fontWeight: "500",
              "&:hover": { textDecoration: "underline" },
            },
            code: {
              backgroundColor: "rgb(var(--rgb-card) / 0.06)",
              border: "1px solid rgb(var(--rgb-border) / 0.12)",
              borderRadius: "0.375rem",
              padding: "0.125rem 0.375rem",
              fontWeight: "500",
              "&::before": { content: "none" },
              "&::after": { content: "none" },
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
