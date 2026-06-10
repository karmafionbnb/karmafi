"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(true);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !isDark;
    root.classList.toggle("dark", next);
    localStorage.setItem("karmafi-theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-primary)] text-[var(--text-muted)] hover:bg-[var(--surface-peach)] hover:text-[#FF6B1A] transition-colors"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
