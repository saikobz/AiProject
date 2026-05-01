import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { ActivityRecord, DashboardStat, DocumentRecord } from "@/types";

const documents: DocumentRecord[] = [
  {
    id: "onboarding-playbook",
    slug: "onboarding-playbook",
    title: "คู่มือเริ่มงาน",
    category: "People Ops",
    tags: ["onboarding", "people", "checklist"],
    summary:
      "คู่มือเริ่มงานที่ครอบคลุมสัปดาห์แรก เครื่องมือสำคัญ ผู้รับผิดชอบ และความคาดหวังของทีม",
    content:
      "เอกสารนี้สรุปการตั้งค่าบัญชี การแนะนำทีม การขอสิทธิ์ใช้งาน แนวทางการสื่อสาร และจุดตรวจสอบในสัปดาห์แรก",
    updatedAt: "2026-04-28",
    author: "Padon",
    status: "published",
  },
  {
    id: "support-escalation-policy",
    slug: "support-escalation-policy",
    title: "นโยบายการส่งต่อเคส Support",
    category: "Operations",
    tags: ["support", "sla", "incident"],
    summary:
      "กำหนดระดับความรุนแรง เวลาในการตอบกลับ เส้นทาง escalation และเจ้าของงานระหว่างทีม support กับ engineering",
    content:
      "Incident ถูกแบ่งเป็นหลายระดับ แต่ละระดับกำหนดวิธีแจ้งเตือน ความถี่ในการอัปเดต และความรับผิดชอบของเจ้าของงาน",
    updatedAt: "2026-04-27",
    author: "Support Lead",
    status: "published",
  },
  {
    id: "release-checklist",
    slug: "release-checklist",
    title: "เช็กลิสต์ก่อน Release",
    category: "Engineering",
    tags: ["release", "qa", "deployment"],
    summary:
      "เช็กลิสต์ก่อน release สำหรับการทดสอบ migration observability แผน rollback และการสื่อสารกับผู้เกี่ยวข้อง",
    content:
      "ก่อน release ให้ตรวจ test coverage, migration safety, alert dashboard และกำหนดผู้รับผิดชอบ rollback",
    updatedAt: "2026-04-25",
    author: "Platform Team",
    status: "draft",
  },
  {
    id: "sales-discovery-template",
    slug: "sales-discovery-template",
    title: "เทมเพลต Discovery Call",
    category: "Sales",
    tags: ["sales", "discovery", "template"],
    summary:
      "โครงคำถามและรูปแบบการจดโน้ตสำหรับ discovery call ครอบคลุม pain point, budget, stakeholder และ next step",
    content:
      "ใช้เทมเพลตนี้เพื่อให้ discovery call มีมาตรฐานและเก็บข้อมูลสำหรับประเมินโอกาสทางการขาย",
    updatedAt: "2026-04-22",
    author: "Revenue Ops",
    status: "published",
  },
];

const dashboardStats: DashboardStat[] = [
  { label: "เอกสาร", value: "48", detail: "+6 ในเดือนนี้" },
  { label: "สรุปด้วย AI", value: "123", detail: "บันทึกผลไว้เพื่อลดการเรียก API" },
  { label: "ค้นหาสำเร็จ", value: "89%", detail: "อ้างอิงจากคำค้นล่าสุด" },
];

const activity: ActivityRecord[] = [
  { id: "a1", label: "แก้ไขเช็กลิสต์ก่อน Release", timestamp: "2 ชั่วโมงที่แล้ว" },
  { id: "a2", label: "สร้างสรุปด้วย AI สำหรับนโยบาย Support", timestamp: "5 ชั่วโมงที่แล้ว" },
  { id: "a3", label: "สร้างเทมเพลต Discovery Call", timestamp: "เมื่อวาน" },
];

export function getMockDocuments() {
  return documents;
}

export function getMockDocumentById(id: string) {
  return documents.find((document) => document.id === id) ?? null;
}

export function getMockDashboardStats(locale: Locale = "th") {
  if (locale === "th") {
    return dashboardStats;
  }

  const t = getDictionary(locale).dashboard.stats;
  return [
    { label: t.documents, value: "48", detail: "+6 this month" },
    { label: t.aiSummaries, value: "123", detail: "Saved results reduce repeat API calls" },
    { label: "Search success", value: "89%", detail: "Based on recent queries" },
  ];
}

export function getMockActivity() {
  return activity;
}
