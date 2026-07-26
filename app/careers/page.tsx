import type { Metadata } from "next";
import JsonLd from "@/components/site/JsonLd";
import { careersSchema, breadcrumb } from "@/data/schema";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Careers at FirstCompile. No open roles right now. If you think you belong here anyway, write to careers@firstcompile.com.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <JsonLd data={careersSchema()} />
      <JsonLd data={breadcrumb([{ name: "Careers", path: "/careers" }])} />
      <section className="page-hero">
        <div className="wrap">
          <span className="kick rv">Careers</span>
          <h1 className="h1i rv d1" style={{ marginTop: 14 }}>
            Work at FirstCompile.
          </h1>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="empty rv">
            <p>
              No open roles right now. If you think you belong here anyway,
              write to{" "}
              <a
                href="mailto:careers@firstcompile.com"
                style={{ borderBottom: "1px solid var(--line2)" }}
              >
                careers@firstcompile.com
              </a>
              .
            </p>
            <p>
              Tell us what you have built and where to see it running. A person
              reads every email.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
