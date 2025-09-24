"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center rounded-full bg-gray-100/20 p-1 relative cursor-pointer"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div
        className={`absolute top-1 bottom-1 rounded-full bg-blue-400/90 transition-all duration-300 ${
          isDarkMode ? "left-1 right-1/2" : "left-1/2 right-1"
        }`}
      />
      <Moon className="h-7 w-7 relative z-10 p-1" />
      <Sun className="h-7 w-7 relative z-10 p-1" />
    </button>
  );
}
