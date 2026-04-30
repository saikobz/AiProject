export type UserRole = "admin" | "member";

export type DocumentRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  updatedAt: string;
  author: string;
  status: "draft" | "published";
};

export type DashboardStat = {
  label: string;
  value: string;
  detail: string;
};

export type ActivityRecord = {
  id: string;
  label: string;
  timestamp: string;
};

export type AiConversationRecord = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};
