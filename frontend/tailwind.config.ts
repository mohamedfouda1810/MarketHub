import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#f0f4ff',
          100: '#e1e9ff',
          200: '#c7d6ff',
          300: '#a3b8ff',
          400: '#7a92ff',
          500: '#5c73ff', // Soft vibrant blue
          600: '#4a59ff',
          700: '#3d47f5',
          800: '#3239c7',
          900: '#2d339e',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#0ea5e9",
          foreground: "#ffffff",
        },
        violet: {
          500: "#8b5cf6",
          600: "#7c3aed",
          glow: "0 0 20px rgba(139, 92, 246, 0.3)",
        },
        rose: {
          500: "#f43f5e",
          600: "#e11d48",
          glow: "0 0 20px rgba(244, 63, 94, 0.3)",
        },
        amber: {
          500: "#f59e0b",
          600: "#d97706",
          glow: "0 0 20px rgba(245, 158, 11, 0.3)",
        },
        emerald: {
          500: "#10b981",
          600: "#059669",
          glow: "0 0 20px rgba(16, 185, 129, 0.3)",
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          glow: "0 0 20px rgba(34, 197, 94, 0.3)",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.25rem",
        "4xl": "3rem",
        "5xl": "4rem",
        "squircle-sm": "1.5rem 1rem 1.5rem 1rem",
        "squircle-md": "2.5rem 1.5rem 2.5rem 1.5rem",
        "squircle-lg": "4rem 2.5rem 4rem 2.5rem",
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 12px -2px rgba(0, 0, 0, 0.03)',
        'premium': '0 20px 40px -12px rgba(0, 0, 0, 0.08), 0 10px 20px -10px rgba(0, 0, 0, 0.05)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
        // Primary (Indigo)
        'glow': '0 0 20px rgba(92, 115, 255, 0.2)',
        'glow-primary': '0 0 25px rgba(92, 115, 255, 0.4)',
        // Amber
        'amber-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.4)',
        // Emerald
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.4)',
        // Rose
        'rose-glow': '0 0 20px rgba(244, 63, 94, 0.3)',
        'glow-rose': '0 0 25px rgba(244, 63, 94, 0.4)',
        // Violet
        'violet-glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-violet': '0 0 25px rgba(139, 92, 246, 0.4)',
        // Teal
        'teal-glow': '0 0 20px rgba(20, 184, 166, 0.3)',
        'glow-teal': '0 0 25px rgba(20, 184, 166, 0.4)',
        // Legacy (keep for compat)
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.4)',
        'glow-error': '0 0 20px rgba(244, 63, 94, 0.4)',
        'glow-green': '0 0 25px rgba(34, 197, 94, 0.3)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.5)", opacity: "0.7" }
        },
        "slide-in-right": {
          "from": { transform: "translateX(100%)", opacity: "0" },
          "to": { transform: "translateX(0)", opacity: "1" }
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "shimmer": "shimmer 1.8s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.22,1,0.36,1)",
        "gradient-shift": "gradient-shift 4s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config