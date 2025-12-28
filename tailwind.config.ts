import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1.08)" },
          "50%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1.15)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "glow-ring": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(59, 130, 246, 0)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(59, 130, 246, 0.3)" },
          "50%": { borderColor: "rgba(59, 130, 246, 0.8)" },
        },
        "spotlight": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "vote-bar": {
          "0%": { width: "0%" },
          "100%": { width: "var(--vote-percentage)" },
        },
        "card-entrance": {
          "0%": { opacity: "0", transform: "translateY(30px) rotateX(10deg)" },
          "100%": { opacity: "1", transform: "translateY(0) rotateX(0deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(2deg)" },
        },
        "orb-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(10%, 5%) scale(1.05)" },
          "50%": { transform: "translate(5%, 10%) scale(0.95)" },
          "75%": { transform: "translate(-5%, 5%) scale(1.02)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)", boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.4)" },
          "50%": { opacity: "0.9", transform: "scale(1.02)", boxShadow: "0 0 20px 4px rgba(255, 255, 255, 0.2)" },
        },
      },
      animation: {
        kenburns: "kenburns 10s ease-in-out forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-up-delay-1": "fade-up 0.6s ease-out 0.1s forwards",
        "fade-up-delay-2": "fade-up 0.6s ease-out 0.2s forwards",
        "fade-up-delay-3": "fade-up 0.6s ease-out 0.3s forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-out": "fade-out 0.3s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "glow-ring": "glow-ring 2s ease-in-out infinite",
        "border-glow": "border-glow 2s ease-in-out infinite",
        spotlight: "spotlight 0.5s ease-out forwards",
        "vote-bar": "vote-bar 1s ease-out forwards",
        "card-entrance": "card-entrance 0.6s ease-out forwards",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "orb-drift": "orb-drift 20s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
      },

      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",

        card: "oklch(var(--card) / <alpha-value>)",
        "card-foreground": "oklch(var(--card-foreground) / <alpha-value>)",

        popover: "oklch(var(--popover) / <alpha-value>)",
        "popover-foreground":
          "oklch(var(--popover-foreground) / <alpha-value>)",

        primary: "oklch(var(--primary) / <alpha-value>)",
        "primary-foreground":
          "oklch(var(--primary-foreground) / <alpha-value>)",

        secondary: "oklch(var(--secondary) / <alpha-value>)",
        "secondary-foreground":
          "oklch(var(--secondary-foreground) / <alpha-value>)",

        muted: "oklch(var(--muted) / <alpha-value>)",
        "muted-foreground": "oklch(var(--muted-foreground) / <alpha-value>)",

        accent: "oklch(var(--accent) / <alpha-value>)",
        "accent-foreground": "oklch(var(--accent-foreground) / <alpha-value>)",

        destructive: "oklch(var(--destructive) / <alpha-value>)",
        "destructive-foreground": "oklch(var(--foreground) / <alpha-value>)",

        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",

        // Charts
        "chart-1": "oklch(var(--chart-1) / <alpha-value>)",
        "chart-2": "oklch(var(--chart-2) / <alpha-value>)",
        "chart-3": "oklch(var(--chart-3) / <alpha-value>)",
        "chart-4": "oklch(var(--chart-4) / <alpha-value>)",
        "chart-5": "oklch(var(--chart-5) / <alpha-value>)",

        // Sidebar
        sidebar: "oklch(var(--sidebar) / <alpha-value>)",
        "sidebar-foreground":
          "oklch(var(--sidebar-foreground) / <alpha-value>)",
        "sidebar-primary": "oklch(var(--sidebar-primary) / <alpha-value>)",
        "sidebar-primary-foreground":
          "oklch(var(--sidebar-primary-foreground) / <alpha-value>)",
        "sidebar-accent": "oklch(var(--sidebar-accent) / <alpha-value>)",
        "sidebar-accent-foreground":
          "oklch(var(--sidebar-accent-foreground) / <alpha-value>)",
        "sidebar-border": "oklch(var(--sidebar-border) / <alpha-value>)",
        "sidebar-ring": "oklch(var(--sidebar-ring) / <alpha-value>)",

        // Semantic tokens
        success: "oklch(var(--success) / <alpha-value>)",
        "success-foreground":
          "oklch(var(--success-foreground) / <alpha-value>)",
        warning: "oklch(var(--warning) / <alpha-value>)",
        "warning-foreground":
          "oklch(var(--warning-foreground) / <alpha-value>)",
        info: "oklch(var(--info) / <alpha-value>)",
        "info-foreground": "oklch(var(--info-foreground) / <alpha-value>)",
      },

      // Typography
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
