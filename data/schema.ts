import professionalService from "./schema/professional-service.json";
import website from "./schema/website.json";
import offerCatalog from "./schema/offer-catalog.json";
import faqPage from "./schema/faq.json";

/**
 * The four home-page JSON-LD blocks, extracted verbatim from the contract file
 * (see scripts/extract-contract.mjs). Do not edit the JSON by hand.
 */
export const homeSchemas: object[] = [
  professionalService,
  website,
  offerCatalog,
  faqPage,
];
