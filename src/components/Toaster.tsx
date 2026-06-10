"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { subscribeToasts, dismiss, type ToastItem } from "@/lib/toast";

export default function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => subscribeToasts(setItems), []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[130] flex flex-col gap-2 w-[min(92vw,360px)]">
      {items.map((t) => {
        const styles =
          t.type === "success"
            ? "border-[#19C37D]/30 bg-[var(--tint-success)] text-[var(--text-success-deep)]"
            : t.type === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-[var(--border-subtle)] bg-[var(--surface-primary)] text-[var(--text-primary)]";
        const Icon = t.type === "success" ? CheckCircle2 : t.type === "error" ? AlertTriangle : Info;
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-2xl border ${styles} p-3.5 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <span className="flex-1 text-[13px] font-bold leading-snug">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
