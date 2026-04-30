import { z } from "zod";

export const documentSchema = z.object({
  title: z.string().min(3).max(120),
  category: z.string().min(2).max(40),
  content: z.string().min(20).max(10000),
  tags: z.array(z.string().min(1).max(24)).max(8),
});

export const aiSummarySchema = z.object({
  content: z.string().min(20).max(10000),
});

export const aiQuestionSchema = z.object({
  content: z.string().min(20).max(10000),
  question: z.string().min(3).max(400),
});
