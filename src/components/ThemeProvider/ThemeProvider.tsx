"use client";

import React, { createContext, useContext, useState } from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const backgroundStyle = isDarkMode
    ? {
        backgroundColor: "#020617",
        backgroundImage: `
        linear-gradient(to right, rgba(59,130,246,0.12) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(99,102,241,0.12) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(59,130,246,0.25) 0%, rgba(99,102,241,0.15) 40%, rgba(139,92,246,0.05) 70%)
      `,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%",
      }
    : {
        backgroundColor: "#e2e8f0",
        backgroundImage: `
        linear-gradient(to right, rgba(59,130,246,0.12) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(99,102,241,0.12) 1px, transparent 1px),
        radial-gradient(circle at 0% 0%, rgba(59,130,246,0.25) 0%, rgba(99,102,241,0.15) 40%, rgba(139,92,246,0.05) 70%)
      `,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%",
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div
        className={`min-h-screen w-full relative transition-colors duration-500 ${
          isDarkMode ? " text-white" : " text-black"
        }`}
      >
        <div className="absolute inset-0 z-0" style={backgroundStyle} />

        <div className="relative z-10">{children}</div>
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
