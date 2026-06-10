export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--page-shell)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-[3px] border-[var(--border-subtle)] border-t-[#FF6B1A] animate-spin" />
        <p className="text-[14px] font-bold text-[var(--text-muted)]">Loading…</p>
      </div>
    </div>
  );
}
