import { z } from "zod";

export const SERVICE_OPTIONS = [
  "MVP development",
  "Startup tech partner",
  "Vibe-code to production",
  "AI app security audit",
  "Custom ERP & CRM",
  "Application development",
  "AI & machine learning",
  "Custom AI agents",
  "Workflow automation",
  "Data & business intelligence",
  "Industry 4.0 & industrial automation",
  "Mobile apps",
  "Cloud & DevOps",
  "SEO & GEO",
  "Technology consulting",
  "Not sure yet",
] as const;

export const BUDGET_OPTIONS = ["u1", "1-5", "5-15", "15p", "open"] as const;

export const BUDGET_LABELS: Record<(typeof BUDGET_OPTIONS)[number], string> = {
  u1: "Under $1k",
  "1-5": "$1k – $5k",
  "5-15": "$5k – $15k",
  "15p": "$15k+",
  open: "Open",
};

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please add your name"),
  email: z.string().trim().email("Please use a valid email"),
  company: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  service: z.enum(SERVICE_OPTIONS),
  budget: z.enum(BUDGET_OPTIONS),
  message: z.string().trim().min(12, "A couple of sentences is enough").max(5000),
  _url: z.string().optional(),
});

export type EnquiryPayload = z.infer<typeof enquirySchema>;
