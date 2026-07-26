import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { services, getService } from "@/data/services";
import JsonLd from "@/components/site/JsonLd";
import { SITE_URL } from "@/data/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      type: "website",
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/services/${service.slug}`,
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function RelatedProse({
  prose,
  related,
}: {
  prose: string;
  related: string[];
}) {
  const targets = related
    .map((slug) => ({ slug, name: getService(slug)?.name }))
    .filter((t): t is { slug: string; name: string } => Boolean(t.name));
  if (targets.length === 0) return <p className="related-note">{prose}</p>;
  const pattern = new RegExp(
    `(${targets.map((t) => escapeRegExp(t.name)).join("|")})`,
    "g"
  );
  const parts = prose.split(pattern);
  return (
    <p className="related-note">
      {parts.map((part, i) => {
        const target = targets.find((t) => t.name === part);
        return target ? (
          <Link key={i} href={`/services/${target.slug}`}>
            {part}
          </Link>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </p>
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    name: service.name,
    description: service.metaDescription,
    provider: {
      "@type": "Organization",
      name: "FirstCompile",
      url: SITE_URL,
    },
    areaServed: ["India", "United States", "Worldwide"],
    url: `${SITE_URL}/services/${service.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: service.name,
        item: `${SITE_URL}/services/${service.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs rv" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#services">Services</Link>
            <span aria-hidden="true">/</span>
            <span>{service.name}</span>
          </nav>
          <span className="kick rv">{service.kicker}</span>
          <h1 className="h1i rv d1" style={{ marginTop: 14 }}>
            {service.h1}
          </h1>
          <p className="lede rv d2">{service.intro[0]}</p>
          {service.intro.slice(1).map((para) => (
            <p
              key={para.slice(0, 32)}
              className="mut rv d2"
              style={{
                marginTop: 16,
                fontSize: 15.5,
                lineHeight: 1.66,
                maxWidth: "62ch",
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="kick rv">Who this is for</span>
          </div>
          {service.whoFor.map((para) => (
            <p
              key={para.slice(0, 32)}
              className="mut rv"
              style={{
                marginTop: 18,
                fontSize: 15.5,
                lineHeight: 1.66,
                maxWidth: "66ch",
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="kick rv">What&apos;s included</span>
            <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
              Scoped in writing. Delivered in your accounts.
            </h2>
          </div>
          <div style={{ marginTop: "clamp(28px,3.6vw,42px)" }}>
            {service.included.map((item) => (
              <div className="inc-row rv" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="kick rv">How it works</span>
          </div>
          <div className="steps">
            {service.steps.map((step, i) => (
              <div className="step rv" key={step.title}>
                <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
                <span className="step-d">{step.range}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="kick rv">Questions</span>
          </div>
          <div className="faq rv">
            {service.faq.map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <span className="fico" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="fa">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="cta-band rv">
            <div>
              <span className="kick">Start</span>
              <h2 className="h3" style={{ marginTop: 12 }}>
                Thirty minutes. Bring the problem.
              </h2>
              <ul className="meta">
                <li>
                  <span className="k">WITH</span>
                  <span>
                    <b>An engineer</b>, not an account manager
                  </span>
                </li>
                <li>
                  <span className="k">NDA</span>
                  <span>
                    <b>Signed first</b>, before you share anything
                  </span>
                </li>
                <li>
                  <span className="k">AFTER</span>
                  <span>A written scope and fixed quote within 48 hours</span>
                </li>
              </ul>
            </div>
            <Link className="btn btn-pri btn-lg" href="/#book">
              Book a call
              <svg
                className="go"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="15"
                height="15"
                aria-hidden="true"
              >
                <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
              </svg>
            </Link>
          </div>
          <RelatedProse prose={service.relatedProse} related={service.related} />
        </div>
      </section>
    </>
  );
}
