"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  AdminOverviewTab, 
  AdminReportsTab, 
  AdminSuspiciousLaunchesTab, 
  AdminDuplicatePostsTab, 
  AdminCreatorClaimsTab, 
  AdminCreatorDisputesTab, 
  AdminTakedownRequestsTab, 
  AdminHiddenMarketsTab, 
  AdminPausedMarketsTab, 
  AdminContractEventsTab, 
  AdminAuditLogsTab, 
  AdminSettingsTab 
} from "@/components/admin/AdminModules";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  switch (tab) {
    case "overview":
      return <AdminOverviewTab />;
    case "reports":
      return <AdminReportsTab />;
    case "suspicious-launches":
      return <AdminSuspiciousLaunchesTab />;
    case "duplicate-posts":
      return <AdminDuplicatePostsTab />;
    case "creator-claims":
      return <AdminCreatorClaimsTab />;
    case "creator-disputes":
      return <AdminCreatorDisputesTab />;
    case "takedown-requests":
      return <AdminTakedownRequestsTab />;
    case "hidden-markets":
      return <AdminHiddenMarketsTab />;
    case "paused-markets":
      return <AdminPausedMarketsTab />;
    case "contract-events":
      return <AdminContractEventsTab />;
    case "audit-logs":
      return <AdminAuditLogsTab />;
    case "settings":
      return <AdminSettingsTab />;
    default:
      return <AdminOverviewTab />;
  }
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--text-muted)] font-bold">Loading admin interface...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
