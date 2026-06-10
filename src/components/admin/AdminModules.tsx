"use client";

import React, { useState } from "react";
import { 
  AdminStatusBadge, 
  AdminSeverityBadge, 
  AdminRiskScoreBadge,
  AdminConfirmationModal 
} from "./AdminPrimitives";
import { 
  useAdminOverview, 
  useAdminReports, 
  useAdminSuspiciousLaunches, 
  useAdminDuplicatePosts, 
  useAdminCreatorClaims, 
  useAdminCreatorDisputes, 
  useAdminTakedownRequests, 
  useAdminHiddenMarkets, 
  useAdminPausedMarkets, 
  useAdminContractEvents, 
  useAdminAuditLogs, 
  useAdminSettings 
} from "@/hooks/useAdminData";
import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/context/wallet";
import { adminAction } from "@/lib/adminAction";
import { toast } from "@/lib/toast";
import { 
  AlertTriangle, ShieldAlert, EyeOff, PauseCircle, Activity, FileText, 
  Users, Scale, AlertOctagon, Settings2, CheckCircle2, XCircle, ExternalLink 
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: number, icon: React.ElementType, colorClass: string }) => (
  <div className="bg-[var(--surface-primary)] rounded-[20px] p-5 border border-[var(--border-subtle)] shadow-sm flex items-start justify-between">
    <div>
      <p className="text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{title}</p>
      <h4 className="text-[28px] font-black text-[var(--text-primary)] leading-none">{value}</h4>
    </div>
    <div className={`p-3 rounded-full ${colorClass}`}>
      <Icon className="h-5 w-5" />
    </div>
  </div>
);

export function AdminOverviewTab() {
  const data = useAdminOverview();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Open Reports" value={data.openReports} icon={AlertTriangle} colorClass="bg-red-100 text-red-600" />
        <StatCard title="Pending Claims" value={data.pendingClaims} icon={Users} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="Suspicious" value={data.suspiciousLaunches} icon={ShieldAlert} colorClass="bg-amber-100 text-amber-600" />
        <StatCard title="Hidden Markets" value={data.hiddenMarkets} icon={EyeOff} colorClass="bg-gray-100 text-gray-600" />
        <StatCard title="Paused Markets" value={data.pausedMarkets} icon={PauseCircle} colorClass="bg-purple-100 text-purple-600" />
        <StatCard title="Unprocessed Events" value={data.unprocessedEvents} icon={Activity} colorClass="bg-[#F3BA2F]/20 text-[var(--text-gold)]" />
        <StatCard title="Takedown Requests" value={data.takedownRequests} icon={Scale} colorClass="bg-orange-100 text-orange-600" />
        <StatCard title="High-Risk Markets" value={data.highRiskMarkets} icon={AlertOctagon} colorClass="bg-red-100 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] p-6">
          <h3 className="text-[16px] font-black text-[var(--text-primary)] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="h-12 bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-xl text-[14px] font-bold text-[var(--text-primary)] hover:border-[#FF6B1A] transition-colors">Review Reports</button>
            <button className="h-12 bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-xl text-[14px] font-bold text-[var(--text-primary)] hover:border-[#FF6B1A] transition-colors">Verify Claims</button>
            <button className="h-12 bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-xl text-[14px] font-bold text-[var(--text-primary)] hover:border-[#FF6B1A] transition-colors">View Events</button>
            <button className="h-12 bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-xl text-[14px] font-bold text-[var(--text-primary)] hover:border-[#FF6B1A] transition-colors">Moderation Queue</button>
          </div>
        </div>
        <div className="bg-[var(--surface-peach)] rounded-[24px] border border-[#FFAB66]/30 p-6 flex flex-col justify-center items-center text-center">
          <ShieldAlert className="h-10 w-10 text-[#FF6B1A] mb-3" />
          <h3 className="text-[16px] font-black text-[var(--text-primary)] mb-2">System Status Normal</h3>
          <p className="text-[14px] text-[var(--text-secondary)]">All core contracts are responding correctly. 12 automated flags raised in the last 24 hours.</p>
        </div>
      </div>
    </div>
  );
}

export function AdminReportsTab() {
  const { reports } = useAdminReports();
  const { walletAddress, signMessage } = useWallet();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (label: string, endpoint: string, body: Record<string, unknown>, keys: string[][]) => {
    setBusy(label);
    try {
      await adminAction(endpoint, body, walletAddress || "", signMessage);
      toast.success("Action completed.");
      keys.forEach((k) => qc.invalidateQueries({ queryKey: k }));
    } catch (e: any) {
      toast.error(e?.message || "Action failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[var(--surface-secondary)]/50 border-b border-[var(--border-subtle)]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">ID</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Reason</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Severity</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)] transition-colors">
                <td className="px-6 py-4 text-[13px] font-bold text-[var(--text-secondary)]">{r.id}</td>
                <td className="px-6 py-4">
                  <p className="text-[14px] font-bold text-[var(--text-primary)] truncate max-w-[200px]">{r.market}</p>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{r.ticker}</p>
                </td>
                <td className="px-6 py-4 text-[14px] font-medium text-[var(--text-primary)]">{r.reason} ({r.reportCount})</td>
                <td className="px-6 py-4"><AdminSeverityBadge severity={r.severity} /></td>
                <td className="px-6 py-4"><AdminStatusBadge status={r.status} /></td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => run(`resolve-${r.id}`, "/api/admin/reports", { action: "RESOLVE", id: r.id }, [["admin", "reports"]])}
                    disabled={busy === `resolve-${r.id}`}
                    className="px-3 py-1.5 rounded-md bg-[var(--tint-success)] text-[var(--text-success-deep)] text-[13px] font-bold hover:bg-[var(--tint-success-strong)] disabled:opacity-60"
                  >
                    {busy === `resolve-${r.id}` ? "…" : "Resolve"}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Hide this market from the app?"))
                        run(`hide-${r.id}`, "/api/admin/markets", { marketAddress: r.market, status: "HIDDEN" }, [["admin", "markets"], ["admin", "reports"]]);
                    }}
                    disabled={busy === `hide-${r.id}`}
                    className="px-3 py-1.5 rounded-md bg-red-50 text-red-600 text-[13px] font-bold hover:bg-red-100 disabled:opacity-60"
                  >
                    {busy === `hide-${r.id}` ? "…" : "Hide"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminSuspiciousLaunchesTab() {
  const { launches } = useAdminSuspiciousLaunches();
  return (
    <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[var(--surface-secondary)]/50 border-b border-[var(--border-subtle)]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">ID / Time</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Curator</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Risk Score</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {launches.map(l => (
              <tr key={l.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)]">
                <td className="px-6 py-4">
                  <p className="text-[13px] font-bold text-[var(--text-secondary)]">{l.id}</p>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{new Date(l.launchTime).toLocaleTimeString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[14px] font-bold text-[var(--text-primary)]">{l.market}</p>
                  <p className="text-[12px] text-[#FF4500] mt-0.5">{l.source}</p>
                </td>
                <td className="px-6 py-4 text-[13px] font-mono text-[var(--text-secondary)]">{l.curatorWallet}</td>
                <td className="px-6 py-4">
                  <AdminRiskScoreBadge score={l.riskScore} />
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">{l.riskReasons.join(", ")}</p>
                </td>
                <td className="px-6 py-4"><AdminStatusBadge status={l.status} /></td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="px-3 py-1.5 rounded-md bg-[var(--border-subtle)]/30 text-[var(--text-primary)] text-[13px] font-bold hover:bg-[var(--border-subtle)]">Inspect</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminDuplicatePostsTab() {
  const { duplicates } = useAdminDuplicatePosts();
  return (
    <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] p-8 text-center text-[var(--text-secondary)]">
      {duplicates.length > 0 ? (
        <div className="overflow-x-auto text-left -mx-8 -my-8">
           <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--surface-secondary)]/50 border-b border-[var(--border-subtle)]">
                <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Post ID</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Existing Market</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Attempted Market</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Similarity</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {duplicates.map(d => (
                <tr key={d.id} className="border-b border-[var(--border-subtle)]">
                  <td className="px-6 py-4 text-[13px] font-mono text-[#FF4500]">{d.redditPostId}</td>
                  <td className="px-6 py-4 text-[14px] font-bold text-[var(--text-primary)]">{d.existingMarket}</td>
                  <td className="px-6 py-4 text-[14px] text-[var(--text-secondary)]">{d.attemptedMarket}</td>
                  <td className="px-6 py-4 font-bold text-[#22C55E]">{d.similarityScore}%</td>
                  <td className="px-6 py-4"><AdminStatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No duplicate post attempts logged recently.</p>
      )}
    </div>
  );
}

export function AdminCreatorClaimsTab() {
  const { claims } = useAdminCreatorClaims();
  const { walletAddress, signMessage } = useWallet();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (label: string, action: "APPROVE" | "REJECT", sourceHash: string) => {
    setBusy(label);
    try {
      const res = await adminAction("/api/admin/creator-claim", { sourceHash, action }, walletAddress || "", signMessage);
      toast.success(action === "APPROVE" ? `Approved — paid ${res.paidBnb || "0"} BNB on-chain.` : "Claim rejected.");
      qc.invalidateQueries({ queryKey: ["admin", "claims"] });
    } catch (e: any) {
      toast.error(e?.message || "Action failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[var(--surface-secondary)]/50 border-b border-[var(--border-subtle)]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">ID / Date</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Reddit User (Masked)</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Amount</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map(c => (
              <tr key={c.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)]">
                <td className="px-6 py-4">
                  <p className="text-[13px] font-bold text-[var(--text-secondary)]">{c.id}</p>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{new Date(c.date).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4 text-[14px] font-bold text-[var(--text-primary)]">{c.market}</td>
                <td className="px-6 py-4 text-[13px] font-mono bg-gray-100 rounded px-2 py-1 w-fit text-[var(--text-secondary)]">{c.redditUsernameHash}</td>
                <td className="px-6 py-4 text-[14px] font-black text-[var(--text-primary)]">${c.claimAmount.toFixed(2)}</td>
                <td className="px-6 py-4"><AdminStatusBadge status={c.status} /></td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => { if (window.confirm("Approve and release vault rewards on-chain to this creator?")) run(`approve-${c.id}`, "APPROVE", c.market); }}
                    disabled={busy === `approve-${c.id}` || c.status === "APPROVED"}
                    className="px-3 py-1.5 rounded-md bg-[var(--tint-success)] text-[var(--text-success-deep)] text-[13px] font-bold hover:bg-[var(--tint-success-strong)] disabled:opacity-60"
                  >
                    {busy === `approve-${c.id}` ? "…" : "Approve & Pay"}
                  </button>
                  <button
                    onClick={() => run(`reject-${c.id}`, "REJECT", c.market)}
                    disabled={busy === `reject-${c.id}` || c.status === "APPROVED"}
                    className="px-3 py-1.5 rounded-md bg-red-50 text-red-600 text-[13px] font-bold hover:bg-red-100 disabled:opacity-60"
                  >
                    {busy === `reject-${c.id}` ? "…" : "Reject"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminCreatorDisputesTab() {
  const { disputes } = useAdminCreatorDisputes();
  return (
    <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[var(--surface-secondary)]/50 border-b border-[var(--border-subtle)]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Dispute ID</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Type</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Priority</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map(d => (
              <tr key={d.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)]">
                <td className="px-6 py-4 text-[13px] font-bold text-[var(--text-secondary)]">{d.id}</td>
                <td className="px-6 py-4 text-[14px] font-bold text-[var(--text-primary)]">{d.market}</td>
                <td className="px-6 py-4 text-[14px] text-[var(--text-secondary)]">{d.disputeType}</td>
                <td className="px-6 py-4"><AdminSeverityBadge severity={d.priority} /></td>
                <td className="px-6 py-4"><AdminStatusBadge status={d.status} /></td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1.5 rounded-md bg-[var(--border-subtle)]/30 text-[var(--text-primary)] text-[13px] font-bold hover:bg-[var(--border-subtle)]">Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminTakedownRequestsTab() {
  const { requests } = useAdminTakedownRequests();
  return (
    <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[var(--surface-secondary)]/50 border-b border-[var(--border-subtle)]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">ID / Date</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Requester / Reason</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Priority</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)]">
                <td className="px-6 py-4">
                  <p className="text-[13px] font-bold text-[var(--text-secondary)]">{r.id}</p>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{new Date(r.date).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4 text-[14px] font-bold text-[var(--text-primary)]">{r.market}</td>
                <td className="px-6 py-4">
                  <p className="text-[14px] text-[var(--text-primary)]">{r.requesterType}</p>
                  <p className="text-[12px] text-[#EF4444] font-medium mt-0.5">{r.reason}</p>
                </td>
                <td className="px-6 py-4"><AdminSeverityBadge severity={r.priority} /></td>
                <td className="px-6 py-4"><AdminStatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminHiddenMarketsTab() {
  const { hidden } = useAdminHiddenMarkets();
  return (
    <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[var(--surface-secondary)]/50 border-b border-[var(--border-subtle)]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Reason</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Hidden By</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hidden.map((h, i) => (
              <tr key={i} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)]">
                <td className="px-6 py-4 text-[14px] font-bold text-[var(--text-primary)]">{h.market}</td>
                <td className="px-6 py-4 text-[14px] text-[var(--text-secondary)]">{h.reason}</td>
                <td className="px-6 py-4 text-[13px] font-medium text-[var(--text-muted)]">{h.hiddenBy} ({new Date(h.date).toLocaleDateString()})</td>
                <td className="px-6 py-4"><AdminStatusBadge status={h.status} /></td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1.5 rounded-md border border-[var(--border-strong)] text-[var(--text-primary)] text-[13px] font-bold hover:bg-[var(--border-subtle)]/50">Unhide</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPausedMarketsTab() {
  const { paused } = useAdminPausedMarkets();
  return (
    <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[var(--surface-secondary)]/50 border-b border-[var(--border-subtle)]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Reason</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Paused By</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Tx Hash</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {paused.map((p, i) => (
              <tr key={i} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)]">
                <td className="px-6 py-4 text-[14px] font-bold text-[var(--text-primary)]">{p.market}</td>
                <td className="px-6 py-4 text-[14px] text-[var(--text-secondary)]">{p.pauseReason}</td>
                <td className="px-6 py-4 text-[13px] font-medium text-[var(--text-muted)]">{p.pausedBy}</td>
                <td className="px-6 py-4 text-[13px] font-mono text-[#FF6B1A] hover:underline cursor-pointer flex items-center gap-1">
                  {p.pauseTxHash.substring(0, 10)}... <ExternalLink className="h-3 w-3" />
                </td>
                <td className="px-6 py-4"><AdminStatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminContractEventsTab() {
  const { events } = useAdminContractEvents();
  return (
    <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[var(--surface-secondary)]/50 border-b border-[var(--border-subtle)]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">ID</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Event Type</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Block / Tx</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)]">
                <td className="px-6 py-4 text-[13px] font-bold text-[var(--text-secondary)]">{e.id}</td>
                <td className="px-6 py-4 text-[14px] font-bold text-[var(--text-primary)]">{e.eventType}</td>
                <td className="px-6 py-4 text-[14px] text-[var(--text-secondary)]">{e.market}</td>
                <td className="px-6 py-4">
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">Block: {e.blockNumber}</p>
                  <p className="text-[12px] text-[#FF6B1A] font-mono mt-0.5 truncate max-w-[120px]">{e.txHash}</p>
                </td>
                <td className="px-6 py-4"><AdminStatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminAuditLogsTab() {
  const { logs } = useAdminAuditLogs();
  return (
    <div className="bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] overflow-hidden">
      <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)] flex justify-between items-center">
        <p className="text-[13px] font-bold text-[var(--text-muted)]">Read-only audit trail of all admin actions.</p>
        <button className="h-8 px-4 rounded-full bg-[var(--border-strong)]/50 text-[var(--text-primary)] text-[12px] font-bold">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[var(--surface-secondary)]/50 border-b border-[var(--border-subtle)]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Timestamp</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Admin</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Action</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Target</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">State Change</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[var(--text-muted)]">Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)]">
                <td className="px-6 py-4 text-[13px] font-medium text-[var(--text-muted)]">{new Date(l.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <p className="text-[13px] font-mono text-[var(--text-primary)]">{l.admin}</p>
                  <p className="text-[11px] font-bold text-[#FF6B1A] uppercase">{l.role}</p>
                </td>
                <td className="px-6 py-4 text-[14px] font-bold text-[var(--text-primary)]">{l.actionType}</td>
                <td className="px-6 py-4 text-[13px] font-mono text-[var(--text-secondary)]">{l.targetType}: {l.targetId}</td>
                <td className="px-6 py-4 text-[13px] text-[var(--text-secondary)]">{l.previousState} ➔ {l.newState}</td>
                <td className="px-6 py-4 text-[13px] text-[var(--text-primary)] max-w-[200px] truncate">{l.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminSettingsTab() {
  const settings = useAdminSettings();
  return (
    <div className="max-w-2xl bg-[var(--surface-primary)] rounded-[24px] border border-[var(--border-subtle)] p-8 space-y-8">
      <div>
        <h3 className="text-[18px] font-black text-[var(--text-primary)] mb-1">Global Configuration</h3>
        <p className="text-[14px] text-[var(--text-muted)] mb-6">Modify automated moderation thresholds and system states.</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-strong)]">
            <div>
              <p className="text-[14px] font-bold text-[var(--text-primary)]">Alpha Mode</p>
              <p className="text-[12px] text-[var(--text-secondary)]">Enables mock transactions without real BNB</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.sandboxAlphaStatus ? "bg-[#22C55E]" : "bg-[var(--border-strong)]"}`}>
              <div className={`w-4 h-4 rounded-full bg-[var(--surface-primary)] transition-transform ${settings.sandboxAlphaStatus ? "translate-x-6" : "translate-x-0"}`}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-strong)]">
            <div>
              <p className="text-[14px] font-bold text-[var(--text-primary)]">Maintenance Mode</p>
              <p className="text-[12px] text-[var(--text-secondary)]">Pauses all frontend interactions for users</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.maintenanceMode ? "bg-[#EF4444]" : "bg-[var(--border-strong)]"}`}>
              <div className={`w-4 h-4 rounded-full bg-[var(--surface-primary)] transition-transform ${settings.maintenanceMode ? "translate-x-6" : "translate-x-0"}`}></div>
            </div>
          </div>

          <div className="p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-strong)]">
            <label className="text-[14px] font-bold text-[var(--text-primary)] block mb-1">Auto-hide Report Threshold</label>
            <p className="text-[12px] text-[var(--text-secondary)] mb-3">Number of unique reports before a market is auto-hidden.</p>
            <input type="number" defaultValue={settings.autoHideThreshold} className="w-full h-10 rounded-lg border border-[var(--border-mid)] px-3 font-medium text-[var(--text-primary)]" />
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-[var(--border-subtle)]">
        <button className="h-11 px-6 rounded-full bg-[#FF6B1A] text-white text-[14px] font-bold hover:bg-[#E9500E] shadow-sm transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}
