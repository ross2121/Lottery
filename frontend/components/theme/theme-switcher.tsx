"use client";

import { motion } from "framer-motion";
import { useTheme, ThemeType } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const themeColors: Record<ThemeType, { primary: string; secondary: string; accent: string }> = {
  purple: { primary: "bg-purple-600", secondary: "bg-pink-600", accent: "bg-yellow-400" },
  blue: { primary: "bg-blue-600", secondary: "bg-cyan-600", accent: "bg-indigo-400" },
  green: { primary: "bg-emerald-600", secondary: "bg-green-600", accent: "bg-teal-400" },
  orange: { primary: "bg-orange-600", secondary: "bg-red-600", accent: "bg-yellow-400" },
  pink: { primary: "bg-pink-600", secondary: "bg-rose-600", accent: "bg-violet-400" },
  cyber: { primary: "bg-cyan-500", secondary: "bg-green-500", accent: "bg-lime-400" },
};

export function ThemeSwitcher() {
  const { currentTheme, setTheme, allThemes } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-sm"
        >
          <Palette className="w-4 h-4 mr-2" />
          Theme
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-white/20 backdrop-blur-xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Palette className="w-5 h-5 mr-2 text-purple-400" />
            Choose Your Theme
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {Object.entries(allThemes).map(([key, theme]) => {
            const themeKey = key as ThemeType;
            const colors = themeColors[themeKey];
            const isActive = currentTheme === themeKey;

            return (
              <motion.div
                key={themeKey}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`cursor-pointer relative overflow-hidden ${
                    isActive 
                      ? "ring-2 ring-white/50 bg-white/10" 
                      : "hover:bg-white/5 bg-white/5"
                  } border-white/10 backdrop-blur-sm`}
                  onClick={() => setTheme(themeKey)}
                >
                  <CardContent className="p-6">
                    {/* Theme Preview */}
                    <div className="space-y-4">
                      {/* Theme Name */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">{theme.name}</h3>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                          >
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Check className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          </motion.div>
                        )}
                      </div>

                      {/* Color Palette Preview */}
                      <div className="flex space-x-2">
                        <div className={`w-8 h-8 rounded-full ${colors.primary} shadow-lg`} />
                        <div className={`w-8 h-8 rounded-full ${colors.secondary} shadow-lg`} />
                        <div className={`w-8 h-8 rounded-full ${colors.accent} shadow-lg`} />
                      </div>

                      {/* Mini UI Preview */}
                      <div className={`rounded-lg p-3 bg-gradient-to-br ${theme.background.replace('from-slate-900', 'from-black/50')}`}>
                        <div className="space-y-2">
                          <div className={`h-2 w-16 rounded bg-gradient-to-r ${theme.primary} opacity-80`} />
                          <div className={`h-1.5 w-12 rounded ${theme.cardBg.split(' ')[0]} opacity-60`} />
                          <div className={`h-1.5 w-8 rounded ${theme.cardBg.split(' ')[0]} opacity-40`} />
                        </div>
                      </div>

                      {/* Hover Effect */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </div>
                  </CardContent>

                  {/* Active Theme Glow */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${theme.primary} opacity-10 rounded-lg`} />
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Preview Text */}
        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            Click any theme to preview it instantly
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Compact theme switcher for mobile
export function CompactThemeSwitcher() {
  const { currentTheme, setTheme, allThemes } = useTheme();

  return (
    <div className="flex space-x-1">
      {Object.entries(allThemes).map(([key, theme]) => {
        const themeKey = key as ThemeType;
        const colors = themeColors[themeKey];
        const isActive = currentTheme === themeKey;

        return (
          <motion.button
            key={themeKey}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(themeKey)}
            className={`w-8 h-8 rounded-full border-2 ${
              isActive ? "border-white/60" : "border-white/20"
            } hover:border-white/60 transition-colors duration-200 overflow-hidden relative`}
            title={theme.name}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary} ${colors.secondary} opacity-80`} />
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white drop-shadow-lg" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
} 