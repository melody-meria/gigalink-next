// src/components/ThemeToggle.tsx
"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(savedTheme || systemTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
        "hover:bg-slate-100 dark:hover:bg-slate-700",
        "text-slate-700 dark:text-slate-200"
      )}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
      <span className="text-sm font-medium">{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}