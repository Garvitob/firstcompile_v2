import mvpDevelopment from "./services-drafts/mvp-development.json";
import startupTechPartner from "./services-drafts/startup-tech-partner.json";
import vibeCodeToProduction from "./services-drafts/vibe-code-to-production.json";
import aiAppSecurityAudit from "./services-drafts/ai-app-security-audit.json";
import customErpCrm from "./services-drafts/custom-erp-crm.json";
import applicationDevelopment from "./services-drafts/application-development.json";
import aiMachineLearning from "./services-drafts/ai-machine-learning.json";
import customAiAgents from "./services-drafts/custom-ai-agents.json";
import workflowAutomation from "./services-drafts/workflow-automation.json";
import dataBusinessIntelligence from "./services-drafts/data-business-intelligence.json";
import industry40 from "./services-drafts/industry-4-0-industrial-automation.json";
import mobileApps from "./services-drafts/mobile-apps.json";
import cloudDevops from "./services-drafts/cloud-devops.json";
import seoGeo from "./services-drafts/seo-geo.json";
import technologyConsulting from "./services-drafts/technology-consulting.json";

export type ServiceContent = {
  slug: string;
  name: string;
  oneLiner: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  intro: string[];
  whoFor: string[];
  included: { title: string; line: string }[];
  steps: { title: string; body: string; range: string }[];
  faq: { q: string; a: string }[];
  related: string[];
  relatedProse: string;
};

/** All 15 services in catalogue order (1.1–1.4, then 2.1–2.11). */
export const services: ServiceContent[] = [
  mvpDevelopment,
  startupTechPartner,
  vibeCodeToProduction,
  aiAppSecurityAudit,
  customErpCrm,
  applicationDevelopment,
  aiMachineLearning,
  customAiAgents,
  workflowAutomation,
  dataBusinessIntelligence,
  industry40,
  mobileApps,
  cloudDevops,
  seoGeo,
  technologyConsulting,
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}
