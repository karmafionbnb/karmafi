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
import { 
  AlertTriangle, ShieldAlert, EyeOff, PauseCircle, Activity, FileText, 
  Users, Scale, AlertOctagon, Settings2, CheckCircle2, XCircle, ExternalLink 
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: number, icon: React.ElementType, colorClass: string }) => (
  <div className="bg-white rounded-[20px] p-5 border border-[#F2D8C8] shadow-sm flex items-start justify-between">
    <div>
      <p className="text-[13px] font-bold text-[#8A817A] uppercase tracking-wider mb-2">{title}</p>
      <h4 className="text-[28px] font-black text-[#161616] leading-none">{value}</h4>
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
        <StatCard title="Unprocessed Events" value={data.unprocessedEvents} icon={Activity} colorClass="bg-[#F3BA2F]/20 text-[#D49E1F]" />
        <StatCard title="Takedown Requests" value={data.takedownRequests} icon={Scale} colorClass="bg-orange-100 text-orange-600" />
        <StatCard title="High-Risk Markets" value={data.highRiskMarkets} icon={AlertOctagon} colorClass="bg-red-100 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[24px] border border-[#F2D8C8] p-6">
          <h3 className="text-[16px] font-black text-[#161616] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="h-12 bg-[#FFFAF5] border border-[#E8D4C8] rounded-xl text-[14px] font-bold text-[#161616] hover:border-[#FF6B1A] transition-colors">Review Reports</button>
            <button className="h-12 bg-[#FFFAF5] border border-[#E8D4C8] rounded-xl text-[14px] font-bold text-[#161616] hover:border-[#FF6B1A] transition-colors">Verify Claims</button>
            <button className="h-12 bg-[#FFFAF5] border border-[#E8D4C8] rounded-xl text-[14px] font-bold text-[#161616] hover:border-[#FF6B1A] transition-colors">View Events</button>
            <button className="h-12 bg-[#FFFAF5] border border-[#E8D4C8] rounded-xl text-[14px] font-bold text-[#161616] hover:border-[#FF6B1A] transition-colors">Moderation Queue</button>
          </div>
        </div>
        <div className="bg-[#FFF1ED] rounded-[24px] border border-[#FFAB66]/30 p-6 flex flex-col justify-center items-center text-center">
          <ShieldAlert className="h-10 w-10 text-[#FF6B1A] mb-3" />
          <h3 className="text-[16px] font-black text-[#161616] mb-2">System Status Normal</h3>
          <p className="text-[14px] text-[#5F5B57]">All core contracts are responding correctly. 12 automated flags raised in the last 24 hours.</p>
        </div>
      </div>
    </div>
  );
}

export function AdminReportsTab() {
  const { reports } = useAdminReports();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-[24px] border border-[#F2D8C8] overflow-hidden">
      <AdminConfirmationModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={(reason) => { console.log(reason); setModalOpen(false); }}
        title="Hide Market"
        targetName="Will GPT-5 release in 2026?"
        actionKeyword="HIDE"
        consequences="This market will be immediately hidden from the KarmaFi frontend and search results. Trading will still be technically possible via direct contract calls unless paused."
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#FFFAF5]/50 border-b border-[#F2D8C8]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">ID</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Reason</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Severity</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-b border-[#F2D8C8] hover:bg-[#FFFAF5] transition-colors">
                <td className="px-6 py-4 text-[13px] font-bold text-[#5F5B57]">{r.id}</td>
                <td className="px-6 py-4">
                  <p className="text-[14px] font-bold text-[#161616] truncate max-w-[200px]">{r.market}</p>
                  <p className="text-[12px] text-[#8A817A] mt-0.5">{r.ticker}</p>
                </td>
                <td className="px-6 py-4 text-[14px] font-medium text-[#161616]">{r.reason} ({r.reportCount})</td>
                <td className="px-6 py-4"><AdminSeverityBadge severity={r.severity} /></td>
                <td className="px-6 py-4"><AdminStatusBadge status={r.status} /></td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="px-3 py-1.5 rounded-md bg-[#F2D8C8]/30 text-[#161616] text-[13px] font-bold hover:bg-[#F2D8C8]">Review</button>
                  <button onClick={() => setModalOpen(true)} className="px-3 py-1.5 rounded-md bg-red-50 text-red-600 text-[13px] font-bold hover:bg-red-100">Hide</button>
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
    <div className="bg-white rounded-[24px] border border-[#F2D8C8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#FFFAF5]/50 border-b border-[#F2D8C8]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">ID / Time</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Curator</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Risk Score</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {launches.map(l => (
              <tr key={l.id} className="border-b border-[#F2D8C8] hover:bg-[#FFFAF5]">
                <td className="px-6 py-4">
                  <p className="text-[13px] font-bold text-[#5F5B57]">{l.id}</p>
                  <p className="text-[12px] text-[#8A817A] mt-0.5">{new Date(l.launchTime).toLocaleTimeString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[14px] font-bold text-[#161616]">{l.market}</p>
                  <p className="text-[12px] text-[#FF4500] mt-0.5">{l.source}</p>
                </td>
                <td className="px-6 py-4 text-[13px] font-mono text-[#5F5B57]">{l.curatorWallet}</td>
                <td className="px-6 py-4">
                  <AdminRiskScoreBadge score={l.riskScore} />
                  <p className="text-[11px] text-[#8A817A] mt-1">{l.riskReasons.join(", ")}</p>
                </td>
                <td className="px-6 py-4"><AdminStatusBadge status={l.status} /></td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="px-3 py-1.5 rounded-md bg-[#F2D8C8]/30 text-[#161616] text-[13px] font-bold hover:bg-[#F2D8C8]">Inspect</button>
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
    <div className="bg-white rounded-[24px] border border-[#F2D8C8] p-8 text-center text-[#5F5B57]">
      {duplicates.length > 0 ? (
        <div className="overflow-x-auto text-left -mx-8 -my-8">
           <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FFFAF5]/50 border-b border-[#F2D8C8]">
                <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Post ID</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Existing Market</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Attempted Market</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Similarity</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Status</th>
              </tr>
            </thead>
            <tbody>
              {duplicates.map(d => (
                <tr key={d.id} className="border-b border-[#F2D8C8]">
                  <td className="px-6 py-4 text-[13px] font-mono text-[#FF4500]">{d.redditPostId}</td>
                  <td className="px-6 py-4 text-[14px] font-bold text-[#161616]">{d.existingMarket}</td>
                  <td className="px-6 py-4 text-[14px] text-[#5F5B57]">{d.attemptedMarket}</td>
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
  return (
    <div className="bg-white rounded-[24px] border border-[#F2D8C8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#FFFAF5]/50 border-b border-[#F2D8C8]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">ID / Date</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Reddit User (Masked)</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Amount</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map(c => (
              <tr key={c.id} className="border-b border-[#F2D8C8] hover:bg-[#FFFAF5]">
                <td className="px-6 py-4">
                  <p className="text-[13px] font-bold text-[#5F5B57]">{c.id}</p>
                  <p className="text-[12px] text-[#8A817A] mt-0.5">{new Date(c.date).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4 text-[14px] font-bold text-[#161616]">{c.market}</td>
                <td className="px-6 py-4 text-[13px] font-mono bg-gray-100 rounded px-2 py-1 w-fit text-[#5F5B57]">{c.redditUsernameHash}</td>
                <td className="px-6 py-4 text-[14px] font-black text-[#161616]">${c.claimAmount.toFixed(2)}</td>
                <td className="px-6 py-4"><AdminStatusBadge status={c.status} /></td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="px-3 py-1.5 rounded-md bg-[#FF6B1A]/10 text-[#FF6B1A] text-[13px] font-bold hover:bg-[#FF6B1A]/20">Review</button>
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
    <div className="bg-white rounded-[24px] border border-[#F2D8C8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#FFFAF5]/50 border-b border-[#F2D8C8]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Dispute ID</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Type</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Priority</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map(d => (
              <tr key={d.id} className="border-b border-[#F2D8C8] hover:bg-[#FFFAF5]">
                <td className="px-6 py-4 text-[13px] font-bold text-[#5F5B57]">{d.id}</td>
                <td className="px-6 py-4 text-[14px] font-bold text-[#161616]">{d.market}</td>
                <td className="px-6 py-4 text-[14px] text-[#5F5B57]">{d.disputeType}</td>
                <td className="px-6 py-4"><AdminSeverityBadge severity={d.priority} /></td>
                <td className="px-6 py-4"><AdminStatusBadge status={d.status} /></td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1.5 rounded-md bg-[#F2D8C8]/30 text-[#161616] text-[13px] font-bold hover:bg-[#F2D8C8]">Resolve</button>
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
    <div className="bg-white rounded-[24px] border border-[#F2D8C8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#FFFAF5]/50 border-b border-[#F2D8C8]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">ID / Date</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Requester / Reason</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Priority</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="border-b border-[#F2D8C8] hover:bg-[#FFFAF5]">
                <td className="px-6 py-4">
                  <p className="text-[13px] font-bold text-[#5F5B57]">{r.id}</p>
                  <p className="text-[12px] text-[#8A817A] mt-0.5">{new Date(r.date).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4 text-[14px] font-bold text-[#161616]">{r.market}</td>
                <td className="px-6 py-4">
                  <p className="text-[14px] text-[#161616]">{r.requesterType}</p>
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
    <div className="bg-white rounded-[24px] border border-[#F2D8C8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#FFFAF5]/50 border-b border-[#F2D8C8]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Reason</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Hidden By</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hidden.map((h, i) => (
              <tr key={i} className="border-b border-[#F2D8C8] hover:bg-[#FFFAF5]">
                <td className="px-6 py-4 text-[14px] font-bold text-[#161616]">{h.market}</td>
                <td className="px-6 py-4 text-[14px] text-[#5F5B57]">{h.reason}</td>
                <td className="px-6 py-4 text-[13px] font-medium text-[#8A817A]">{h.hiddenBy} ({new Date(h.date).toLocaleDateString()})</td>
                <td className="px-6 py-4"><AdminStatusBadge status={h.status} /></td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1.5 rounded-md border border-[#E8D4C8] text-[#161616] text-[13px] font-bold hover:bg-[#F2D8C8]/50">Unhide</button>
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
    <div className="bg-white rounded-[24px] border border-[#F2D8C8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#FFFAF5]/50 border-b border-[#F2D8C8]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Reason</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Paused By</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Tx Hash</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Status</th>
            </tr>
          </thead>
          <tbody>
            {paused.map((p, i) => (
              <tr key={i} className="border-b border-[#F2D8C8] hover:bg-[#FFFAF5]">
                <td className="px-6 py-4 text-[14px] font-bold text-[#161616]">{p.market}</td>
                <td className="px-6 py-4 text-[14px] text-[#5F5B57]">{p.pauseReason}</td>
                <td className="px-6 py-4 text-[13px] font-medium text-[#8A817A]">{p.pausedBy}</td>
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
    <div className="bg-white rounded-[24px] border border-[#F2D8C8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#FFFAF5]/50 border-b border-[#F2D8C8]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">ID</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Event Type</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Block / Tx</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id} className="border-b border-[#F2D8C8] hover:bg-[#FFFAF5]">
                <td className="px-6 py-4 text-[13px] font-bold text-[#5F5B57]">{e.id}</td>
                <td className="px-6 py-4 text-[14px] font-bold text-[#161616]">{e.eventType}</td>
                <td className="px-6 py-4 text-[14px] text-[#5F5B57]">{e.market}</td>
                <td className="px-6 py-4">
                  <p className="text-[13px] font-medium text-[#161616]">Block: {e.blockNumber}</p>
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
    <div className="bg-white rounded-[24px] border border-[#F2D8C8] overflow-hidden">
      <div className="p-4 border-b border-[#F2D8C8] bg-[#FFFAF5] flex justify-between items-center">
        <p className="text-[13px] font-bold text-[#8A817A]">Read-only audit trail of all admin actions.</p>
        <button className="h-8 px-4 rounded-full bg-[#E8D4C8]/50 text-[#161616] text-[12px] font-bold">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#FFFAF5]/50 border-b border-[#F2D8C8]">
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Timestamp</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Admin</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Action</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Target</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">State Change</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase text-[#8A817A]">Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-b border-[#F2D8C8] hover:bg-[#FFFAF5]">
                <td className="px-6 py-4 text-[13px] font-medium text-[#8A817A]">{new Date(l.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <p className="text-[13px] font-mono text-[#161616]">{l.admin}</p>
                  <p className="text-[11px] font-bold text-[#FF6B1A] uppercase">{l.role}</p>
                </td>
                <td className="px-6 py-4 text-[14px] font-bold text-[#161616]">{l.actionType}</td>
                <td className="px-6 py-4 text-[13px] font-mono text-[#5F5B57]">{l.targetType}: {l.targetId}</td>
                <td className="px-6 py-4 text-[13px] text-[#5F5B57]">{l.previousState} ➔ {l.newState}</td>
                <td className="px-6 py-4 text-[13px] text-[#161616] max-w-[200px] truncate">{l.reason}</td>
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
    <div className="max-w-2xl bg-white rounded-[24px] border border-[#F2D8C8] p-8 space-y-8">
      <div>
        <h3 className="text-[18px] font-black text-[#161616] mb-1">Global Configuration</h3>
        <p className="text-[14px] text-[#8A817A] mb-6">Modify automated moderation thresholds and system states.</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#FFFAF5] rounded-xl border border-[#E8D4C8]">
            <div>
              <p className="text-[14px] font-bold text-[#161616]">Alpha Mode</p>
              <p className="text-[12px] text-[#5F5B57]">Enables mock transactions without real BNB</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.sandboxAlphaStatus ? "bg-[#22C55E]" : "bg-[#E8D4C8]"}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.sandboxAlphaStatus ? "translate-x-6" : "translate-x-0"}`}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#FFFAF5] rounded-xl border border-[#E8D4C8]">
            <div>
              <p className="text-[14px] font-bold text-[#161616]">Maintenance Mode</p>
              <p className="text-[12px] text-[#5F5B57]">Pauses all frontend interactions for users</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.maintenanceMode ? "bg-[#EF4444]" : "bg-[#E8D4C8]"}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.maintenanceMode ? "translate-x-6" : "translate-x-0"}`}></div>
            </div>
          </div>

          <div className="p-4 bg-[#FFFAF5] rounded-xl border border-[#E8D4C8]">
            <label className="text-[14px] font-bold text-[#161616] block mb-1">Auto-hide Report Threshold</label>
            <p className="text-[12px] text-[#5F5B57] mb-3">Number of unique reports before a market is auto-hidden.</p>
            <input type="number" defaultValue={settings.autoHideThreshold} className="w-full h-10 rounded-lg border border-[#D1C3B8] px-3 font-medium text-[#161616]" />
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-[#F2D8C8]">
        <button className="h-11 px-6 rounded-full bg-[#FF6B1A] text-white text-[14px] font-bold hover:bg-[#E9500E] shadow-sm transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}
