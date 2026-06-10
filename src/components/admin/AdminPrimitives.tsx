"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export function AdminStatusBadge({ status }: { status: string }) {
  const getColors = (s: string) => {
    switch (s.toLowerCase()) {
      case "new":
      case "open":
      case "auto-flagged":
      case "pending verification":
        return "bg-blue-100 text-blue-700";
      case "under review":
      case "investigating":
      case "needs more info":
      case "waiting on user":
        return "bg-amber-100 text-amber-700";
      case "resolved":
      case "cleared":
      case "verified":
      case "claimed":
      case "processed":
      case "action taken":
        return "bg-emerald-100 text-emerald-700";
      case "rejected":
      case "failed":
      case "closed":
      case "expired":
      case "duplicate blocked":
        return "bg-gray-100 text-gray-700";
      case "hidden":
      case "paused":
      case "escalated":
      case "disputed":
      case "escalated legal":
      case "hidden from frontend":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span className={`inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-black uppercase ${getColors(status)}`}>
      {status}
    </span>
  );
}

export function AdminSeverityBadge({ severity }: { severity: string }) {
  const getColors = (s: string) => {
    switch (s.toLowerCase()) {
      case "low":
        return "bg-emerald-100 text-emerald-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "critical":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[12px] font-black uppercase ${getColors(severity)}`}>
      {severity.toLowerCase() === "critical" && <AlertTriangle className="h-3 w-3" />}
      {severity}
    </span>
  );
}

export function AdminRiskScoreBadge({ score }: { score: number }) {
  let color = "bg-emerald-100 text-emerald-700";
  if (score > 30 && score <= 60) color = "bg-amber-100 text-amber-700";
  if (score > 60 && score <= 80) color = "bg-orange-100 text-orange-700";
  if (score > 80) color = "bg-red-100 text-red-700";

  return (
    <span className={`inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-black ${color}`}>
      {score}/100
    </span>
  );
}

export function AdminConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  targetName, 
  actionKeyword,
  consequences 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: (reason: string) => void;
  title: string;
  targetName: string;
  actionKeyword: string;
  consequences: string;
}) {
  const [typed, setTyped] = useState("");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (typed === actionKeyword && reason.trim()) {
      onConfirm(reason);
      setTyped("");
      setReason("");
    }
  };

  const isReady = typed === actionKeyword && reason.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--ink-solid)]/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[var(--surface-primary)] rounded-[24px] shadow-2xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--surface-secondary)]">
          <h3 className="text-[18px] font-black text-[var(--text-primary)] flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
            {title}
          </h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <p className="text-[14px] text-[var(--text-secondary)] font-medium mb-1">Target:</p>
            <p className="text-[15px] font-bold text-[var(--text-primary)]">{targetName}</p>
          </div>

          <div className="p-4 bg-[var(--surface-peach)] rounded-xl border border-[#FFAB66]/30">
            <p className="text-[13px] font-bold text-[#FF6B1A] uppercase tracking-wide mb-1">Consequences</p>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{consequences}</p>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-[var(--text-primary)] mb-2">
              Reason (Required for Audit Log)
            </label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-24 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] p-3 text-[14px] font-medium text-[var(--text-primary)] focus:border-[#FF6B1A] focus:outline-none focus:ring-1 focus:ring-[#FF6B1A]"
              placeholder="Provide a detailed reason..."
            />
          </div>

          <div>
            <label className="block text-[14px] font-bold text-[var(--text-primary)] mb-2">
              Type <span className="text-[#EF4444] font-black select-none">{actionKeyword}</span> to confirm
            </label>
            <input 
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="w-full h-11 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 text-[14px] font-bold text-[var(--text-primary)] focus:border-[#EF4444] focus:outline-none focus:ring-1 focus:ring-[#EF4444]"
              placeholder={actionKeyword}
            />
          </div>
        </div>

        <div className="p-6 border-t border-[var(--border-subtle)] flex gap-3 bg-[var(--surface-secondary)]">
          <button 
            onClick={onClose}
            className="flex-1 h-11 rounded-full bg-[var(--surface-primary)] border border-[var(--border-strong)] text-[14px] font-bold text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/30 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!isReady}
            className={`flex-1 h-11 rounded-full text-[14px] font-bold text-white transition-all ${
              isReady 
                ? "bg-[#EF4444] hover:bg-[#DC2626] shadow-md shadow-[#EF4444]/20" 
                : "bg-[var(--border-strong)] cursor-not-allowed"
            }`}
          >
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  );
}
