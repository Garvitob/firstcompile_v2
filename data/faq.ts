import faqSchema from "./schema/faq.json";

export type FaqItem = { q: string; a: string };

type FaqQuestion = {
  "@type": string;
  name: string;
  acceptedAnswer: { "@type": string; text: string };
};

/**
 * Single source of truth: the FAQPage JSON-LD extracted verbatim from the
 * contract. The on-page accordion renders from this same data, so the schema
 * and the visible text can never drift apart.
 */
export const homeFaq: FaqItem[] = (
  faqSchema.mainEntity as FaqQuestion[]
).map((item) => ({ q: item.name, a: item.acceptedAnswer.text }));
