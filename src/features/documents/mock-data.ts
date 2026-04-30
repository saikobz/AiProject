import type { ActivityRecord, DashboardStat, DocumentRecord } from "@/types";

const documents: DocumentRecord[] = [
  {
    id: "onboarding-playbook",
    title: "Onboarding Playbook",
    category: "People Ops",
    tags: ["onboarding", "people", "checklist"],
    summary:
      "A structured onboarding guide covering the first week, key tools, owners, and expectations for new team members.",
    content:
      "This playbook outlines account setup, team introductions, access requests, communication norms, and success checkpoints for the first week.",
    updatedAt: "2026-04-28",
    author: "Padon",
    status: "published",
  },
  {
    id: "support-escalation-policy",
    title: "Support Escalation Policy",
    category: "Operations",
    tags: ["support", "sla", "incident"],
    summary:
      "Defines severity levels, expected response times, escalation paths, and ownership across support and engineering.",
    content:
      "Incidents are classified into four severity levels. Each level defines paging behavior, update cadence, and owner responsibilities.",
    updatedAt: "2026-04-27",
    author: "Support Lead",
    status: "published",
  },
  {
    id: "release-checklist",
    title: "Release Checklist",
    category: "Engineering",
    tags: ["release", "qa", "deployment"],
    summary:
      "A pre-release checklist for testing, migrations, observability, rollback plans, and stakeholder communication.",
    content:
      "Before each release, verify test coverage, review migration safety, confirm dashboard alerts, and assign a rollback owner.",
    updatedAt: "2026-04-25",
    author: "Platform Team",
    status: "draft",
  },
  {
    id: "sales-discovery-template",
    title: "Sales Discovery Template",
    category: "Sales",
    tags: ["sales", "discovery", "template"],
    summary:
      "Question prompts and note structure for discovery calls, including pain points, budget, stakeholders, and next steps.",
    content:
      "Use this template to run discovery consistently and capture information that helps qualify the opportunity.",
    updatedAt: "2026-04-22",
    author: "Revenue Ops",
    status: "published",
  },
];

const dashboardStats: DashboardStat[] = [
  { label: "Documents", value: "48", detail: "+6 this month" },
  { label: "AI summaries", value: "123", detail: "Cached to reduce API calls" },
  { label: "Search success", value: "89%", detail: "Based on recent queries" },
];

const activity: ActivityRecord[] = [
  { id: "a1", label: "Updated Release Checklist", timestamp: "2 hours ago" },
  { id: "a2", label: "Generated AI summary for Support Escalation Policy", timestamp: "5 hours ago" },
  { id: "a3", label: "Created Sales Discovery Template", timestamp: "Yesterday" },
];

export function getMockDocuments() {
  return documents;
}

export function getMockDocumentById(id: string) {
  return documents.find((document) => document.id === id) ?? null;
}

export function getMockDashboardStats() {
  return dashboardStats;
}

export function getMockActivity() {
  return activity;
}
