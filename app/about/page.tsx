import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/site/JsonLd";
import { aboutSchema, breadcrumb } from "@/data/schema";

const ABOUT_DESCRIPTION =
  "FirstCompile is an AI-native software company with offices in Noida, India and the San Francisco Bay Area. AI handles volume; engineers make every decision that matters.";

export const metadata: Metadata = {
  title: "About",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutSchema(ABOUT_DESCRIPTION)} />
      <JsonLd data={breadcrumb([{ name: "About", path: "/about" }])} />
      <section className="page-hero">
        <div className="wrap">
          <span className="kick rv">About</span>
          <h1 className="h1i rv d1" style={{ marginTop: 14 }}>
            An AI-native software company.
          </h1>
          <p className="lede rv d2">
            FirstCompile builds custom software for clients in India, the United
            States and elsewhere. Two engines under one roof: client work, from
            MVPs to ERP systems to industrial automation, and our own products,
            with ShipFlow in private beta. Indian clients are billed in INR with
            GST, US and international clients in USD. Same process, same
            standards either way.
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kick rv">The AI-native argument</span>
            <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
              AI-built is not vibe-coded.
            </h2>
            <p className="lede rv d2" style={{ marginTop: 18 }}>
              Here is the split. AI writes the volume: boilerplate, tests,
              migrations, the same refactor applied forty times. Engineers make
              every decision that matters: data models, permissions,
              authorisation rules, anything touching money or personal data.
            </p>
            <p
              className="mut rv d2"
              style={{ marginTop: 16, fontSize: 15.5, lineHeight: 1.66, maxWidth: "62ch" }}
            >
              An engineer reads every change before it lands. Then a second
              model checks the generated code against the requirement it came
              from. Two reviews on everything, one human, one machine. The
              trade-off is real. This is slower than letting a model run
              unsupervised. It is also the only version of AI development we are
              willing to put our name on.
            </p>
          </div>
          <div>
            <span className="kick rv">The stack</span>
            <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
              Deliberately narrow.
            </h2>
            <p className="lede rv d2" style={{ marginTop: 18 }}>
              Next.js, TypeScript, PostgreSQL and React Native for most builds.
              Node with Inngest for background jobs. Shopify, WordPress and
              WooCommerce for platform work. MQTT, Modbus, TimescaleDB and
              Grafana when the software has to talk to machines.
            </p>
            <p
              className="mut rv d2"
              style={{ marginTop: 16, fontSize: 15.5, lineHeight: 1.66, maxWidth: "62ch" }}
            >
              AI features run on OpenAI or Anthropic models, always with hard
              cost ceilings. The stack is common on purpose: any engineer you
              hire later can take over without us.
            </p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="kick rv">How engagements run</span>
            <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
              The terms are the same for every client.
            </h2>
          </div>
          <div className="deflist" style={{ marginTop: "clamp(28px,3.6vw,42px)" }}>
            <div className="defrow rv">
              <h4>NDA first</h4>
              <p>
                A mutual NDA is signed before you share anything. Same day, as
                standard.
              </p>
            </div>
            <div className="defrow rv">
              <h4>One fixed price</h4>
              <p>
                After a scoping call you get one fixed price, in writing, within
                48 hours. Never hourly. The number does not change after
                kickoff.
              </p>
            </div>
            <div className="defrow rv">
              <h4>Your repo, your IP</h4>
              <p>
                The repository is created in your GitHub organisation on day
                one, with full IP assignment.
              </p>
            </div>
            <div className="defrow rv">
              <h4>The product, weekly</h4>
              <p>
                A live, clickable URL from the end of week one, updated
                continuously, and a written update every day. MVPs typically go
                live in 2–4 weeks; custom business systems take 3–8 weeks.
              </p>
            </div>
            <div className="defrow rv">
              <h4>30 days after launch</h4>
              <p>
                Anything we built that breaks, we fix at no cost. After that,
                optional monthly care you can stop at any time.
              </p>
            </div>
          </div>
          <p
            className="mut rv"
            style={{ marginTop: 26, fontSize: 15, maxWidth: "66ch", lineHeight: 1.66 }}
          >
            One more note for startups. Any of{" "}
            <Link
              href="/#services"
              style={{ borderBottom: "1px solid var(--line2)" }}
            >
              our services
            </Link>{" "}
            is open to you; the four we label as startup services are just the
            most common entry points.
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="kick rv">Two offices, one working day</span>
            <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
              Noida and the Bay Area.
            </h2>
            <p className="lede rv d2">
              Working hours overlap both time zones, so daily updates land
              during your day, wherever your day is. The cost falls on us, not
              on you: some of our internal meetings happen at strange hours. We
              accept that. Reach us at{" "}
              <a
                href="mailto:hello@firstcompile.com"
                style={{ borderBottom: "1px solid var(--line2)" }}
              >
                hello@firstcompile.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
