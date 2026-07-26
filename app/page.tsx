import type { Metadata } from "next";
import Hero from "@/components/site/Hero";
import TechBelt from "@/components/site/TechBelt";
import Commitments from "@/components/site/Commitments";
import Services from "@/components/site/Services";
import Difference from "@/components/site/Difference";
import Work from "@/components/site/Work";
import Products from "@/components/site/Products";
import Process from "@/components/site/Process";
import Compare from "@/components/site/Compare";
import Writing from "@/components/site/Writing";
import Faq from "@/components/site/Faq";
import Booking from "@/components/site/Booking";
import JsonLd from "@/components/site/JsonLd";
import { homeSchemas } from "@/data/schema";
import { HOME_TITLE, HOME_DESCRIPTION, SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  // No `alternates` here: Next strips the root trailing slash, and the
  // contract pins the canonical as "https://firstcompile.com/". The tag is
  // rendered explicitly in the page instead — see the <link> below.
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hoisted into <head> by React. Kept out of `metadata` so the trailing
          slash survives, matching the contract exactly. */}
      <link rel="canonical" href={`${SITE_URL}/`} />
      {homeSchemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <Hero />
      <TechBelt />
      <Commitments />
      <Services />
      <Difference />
      <Work />
      <Products />
      <Process />
      <Compare />
      <Writing />
      <Faq />
      <Booking />
    </>
  );
}
