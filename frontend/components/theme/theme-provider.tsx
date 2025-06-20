"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ThemeType = "purple" | "blue" | "green" | "orange" | "pink" | "cyber";

interface ThemeConfig {
  name: string;
  background: string;
  cardBg: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  gradient: string;
  glow: string;
}

const themes: Record<ThemeType, ThemeConfig> = {
  purple: {
    name: "Purple Cosmos",
    background: "from-slate-900 via-purple-900 to-slate-900",
    cardBg: "bg-white/5 border-white/10",
    primary: "from-purple-600 to-pink-600",
    secondary: "from-purple-500 to-pink-500",
    accent: "text-purple-400",
    text: "text-white",
    gradient: "from-yellow-400 via-purple-400 to-pink-400",
    glow: "shadow-purple-500/50",
  },
  blue: {
    name: "Ocean Depths",
    background: "from-slate-900 via-blue-900 to-indigo-900",
    cardBg: "bg-blue-950/30 border-blue-500/20",
    primary: "from-blue-600 to-cyan-600",
    secondary: "from-blue-500 to-cyan-500",
    accent: "text-blue-400",
    text: "text-blue-50",
    gradient: "from-cyan-400 via-blue-400 to-indigo-400",
    glow: "shadow-blue-500/50",
  },
  green: {
    name: "Emerald Forest",
    background: "from-slate-900 via-emerald-900 to-green-900",
    cardBg: "bg-emerald-950/30 border-emerald-500/20",
    primary: "from-emerald-600 to-green-600",
    secondary: "from-emerald-500 to-green-500",
    accent: "text-emerald-400",
    text: "text-emerald-50",
    gradient: "from-green-400 via-emerald-400 to-teal-400",
    glow: "shadow-emerald-500/50",
  },
  orange: {
    name: "Sunset Blaze",
    background: "from-slate-900 via-orange-900 to-red-900",
    cardBg: "bg-orange-950/30 border-orange-500/20",
    primary: "from-orange-600 to-red-600",
    secondary: "from-orange-500 to-red-500",
    accent: "text-orange-400",
    text: "text-orange-50",
    gradient: "from-yellow-400 via-orange-400 to-red-400",
    glow: "shadow-orange-500/50",
  },
  pink: {
    name: "Rose Garden",
    background: "from-slate-900 via-pink-900 to-rose-900",
    cardBg: "bg-pink-950/30 border-pink-500/20",
    primary: "from-pink-600 to-rose-600",
    secondary: "from-pink-500 to-rose-500",
    accent: "text-pink-400",
    text: "text-pink-50",
    gradient: "from-pink-400 via-rose-400 to-violet-400",
    glow: "shadow-pink-500/50",
  },
  cyber: {
    name: "Cyber Neon",
    background: "from-black via-gray-900 to-black",
    cardBg: "bg-gray-900/50 border-cyan-500/30",
    primary: "from-cyan-500 to-green-500",
    secondary: "from-cyan-400 to-green-400",
    accent: "text-cyan-400",
    text: "text-cyan-50",
    gradient: "from-cyan-400 via-green-400 to-lime-400",
    glow: "shadow-cyan-500/50",
  },
};

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeConfig: ThemeConfig;
  allThemes: Record<ThemeType, ThemeConfig>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("purple");

  const value = {
    currentTheme,
    setTheme: setCurrentTheme,
    themeConfig: themes[currentTheme],
    allThemes: themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
} 