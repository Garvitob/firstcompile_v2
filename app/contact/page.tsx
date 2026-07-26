import type { Metadata } from "next";
import Booking from "@/components/site/Booking";
import JsonLd from "@/components/site/JsonLd";
import { contactSchema, breadcrumb } from "@/data/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a 30-minute intro call on Google Meet or send the details in writing. NDA signed first, and a written scope with a fixed quote within 48 hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactSchema()} />
      <JsonLd data={breadcrumb([{ name: "Contact", path: "/contact" }])} />
      <section className="page-hero">
        <div className="wrap">
          <span className="kick rv">Contact</span>
          <h1 className="h1i rv d1" style={{ marginTop: 14 }}>
            Talk to an engineer.
          </h1>
          <p className="lede rv d2">
            A call if you want to think out loud, a form if you would rather
            write. Either way, an NDA comes first and a fixed quote follows
            within 48 hours.
          </p>
        </div>
      </section>
      <Booking />
    </>
  );
}
