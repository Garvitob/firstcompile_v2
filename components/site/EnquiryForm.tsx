"use client";

import { useState } from "react";

const SERVICES = [
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
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Bad = { name: boolean; email: boolean; msg: boolean };

export default function EnquiryForm() {
  const [bad, setBad] = useState<Bad>({ name: false, email: false, msg: false });
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const clear = (field: keyof Bad) =>
    setBad((b) => (b[field] ? { ...b, [field]: false } : b));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget;
    const fd = new FormData(form);

    if (String(fd.get("_url") || "")) return; // honeypot

    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const next: Bad = {
      name: !name,
      email: !EMAIL_RE.test(email),
      msg: message.length < 12,
    };
    setBad(next);
    if (next.name || next.email || next.msg) {
      const first = form.querySelector<HTMLElement>(".bad input,.bad textarea");
      // state not applied yet on this tick; focus by field order instead
      if (first) first.focus();
      else if (next.name) form.querySelector<HTMLInputElement>("#fn")?.focus();
      else if (next.email) form.querySelector<HTMLInputElement>("#fe")?.focus();
      else form.querySelector<HTMLTextAreaElement>("#fm")?.focus();
      return;
    }

    setFormError(null);
    setPending(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: String(fd.get("company") || "").trim(),
          service: String(fd.get("service") || SERVICES[0]),
          budget: String(fd.get("budget") || "1-5"),
          message,
          _url: String(fd.get("_url") || ""),
        }),
      });
      if (res.ok) {
        setDone(true);
        return;
      }
      const data: { error?: string; errors?: Record<string, string> } | null =
        await res.json().catch(() => null);
      if (res.status === 400 && data?.errors) {
        setBad({
          name: "name" in data.errors,
          email: "email" in data.errors,
          msg: "message" in data.errors,
        });
        return;
      }
      setFormError(
        data?.error ||
          "Something went wrong sending this. Email hello@firstcompile.com instead."
      );
    } catch {
      setFormError(
        "Could not reach the server. Email hello@firstcompile.com instead."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="write-panel rv d1">
      <form
        className="form"
        id="leadForm"
        noValidate
        onSubmit={onSubmit}
        style={done ? { display: "none" } : undefined}
      >
        <div className="f2">
          <div className={`field${bad.name ? " bad" : ""}`} data-f="name">
            <label htmlFor="fn">Name</label>
            <input
              id="fn"
              name="name"
              autoComplete="name"
              placeholder="Priya Menon"
              onChange={() => clear("name")}
            />
            <span className="err">Please add your name</span>
          </div>
          <div className={`field${bad.email ? " bad" : ""}`} data-f="email">
            <label htmlFor="fe">Email</label>
            <input
              id="fe"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="priya@company.com"
              onChange={() => clear("email")}
            />
            <span className="err">Please use a valid email</span>
          </div>
        </div>
        <div className="f2">
          <div className="field">
            <label htmlFor="fc">Company</label>
            <input
              id="fc"
              name="company"
              autoComplete="organization"
              placeholder="Optional"
            />
          </div>
          <div className="field">
            <label htmlFor="fs">What do you need?</label>
            <select id="fs" name="service" defaultValue={SERVICES[0]}>
              {SERVICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <span className="lbl">Rough budget</span>
          <div className="chips">
            <input type="radio" id="b1" name="budget" value="u1" />
            <label htmlFor="b1">Under $1k</label>
            <input type="radio" id="b2" name="budget" value="1-5" defaultChecked />
            <label htmlFor="b2">$1k – $5k</label>
            <input type="radio" id="b3" name="budget" value="5-15" />
            <label htmlFor="b3">$5k – $15k</label>
            <input type="radio" id="b4" name="budget" value="15p" />
            <label htmlFor="b4">$15k+</label>
            <input type="radio" id="b5" name="budget" value="open" />
            <label htmlFor="b5">Open</label>
          </div>
        </div>
        <div className={`field${bad.msg ? " bad" : ""}`} data-f="msg">
          <label htmlFor="fm">Tell us about the project</label>
          <textarea
            id="fm"
            name="message"
            placeholder="What it does, who uses it, what exists already, and what is blocking you right now."
            onChange={() => clear("msg")}
          />
          <span className="err">A couple of sentences is enough</span>
        </div>
        <input
          className="hp"
          name="_url"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className="f-foot">
          <button
            className="btn btn-pri btn-lg"
            type="submit"
            id="sendBtn"
            disabled={pending}
          >
            {pending ? (
              "Sending"
            ) : (
              <>
                Send enquiry
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
              </>
            )}
          </button>
          <span className="f-note">No mailing list. No sequences.</span>
          {formError && (
            <span className="f-note" role="alert" style={{ color: "#e5484d" }}>
              {formError}
            </span>
          )}
        </div>
      </form>
      <div className={`done${done ? " show" : ""}`} id="done" role="status">
        <h3>
          <span style={{ color: "var(--ok)", fontWeight: 700 }} aria-hidden="true">
            ✓
          </span>{" "}
          Enquiry received
        </h3>
        <p>
          A person will reply within one working day, usually with two or three
          questions and a rough number.
        </p>
      </div>
    </div>
  );
}
