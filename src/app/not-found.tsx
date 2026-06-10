import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--page-shell)]">
      <div className="text-center max-w-md">
        <div className="text-[80px] font-black text-[var(--border-subtle)] leading-none mb-2">404</div>
        <h1 className="text-[28px] font-black text-[var(--text-primary)] mb-3">Page not found</h1>
        <p className="text-[var(--text-secondary)] text-[15px] font-medium mb-8 leading-relaxed">
          This page doesn&apos;t exist or may have been moved. Try exploring active attention markets instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/feed"
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-6 py-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,107,26,0.3)] hover:scale-[1.02] transition-transform"
          >
            <Search className="h-4 w-4" />
            Explore Markets
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-6 py-3 text-[14.5px] font-extrabold text-[var(--text-primary)] hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors"
          >
            Go Home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
