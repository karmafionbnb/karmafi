"use client";

import { useEffect } from "react";
import { RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--page-shell)]">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-[var(--tint-danger)]">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-[26px] font-black text-[var(--text-primary)] mb-3">Something went wrong</h1>
        <p className="text-[var(--text-secondary)] text-[15px] font-medium mb-8 leading-relaxed">
          An unexpected error occurred. Please try again — if this keeps happening, reach out to the team.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-6 py-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,107,26,0.3)] hover:scale-[1.02] transition-transform"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-6 py-3 text-[14.5px] font-extrabold text-[var(--text-primary)] hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
