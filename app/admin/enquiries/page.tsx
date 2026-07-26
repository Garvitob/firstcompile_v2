import type { Metadata } from "next";
import { getStore } from "@/lib/enquiry-store";
import { BUDGET_LABELS } from "@/lib/enquiry-schema";

export const metadata: Metadata = {
  title: "Enquiries · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(d: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} · ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default async function AdminEnquiriesPage() {
  const store = getStore();
  const rows = store ? await store.listAll(500) : null;

  return (
    <div className="wrap adm-wrap">
      <span className="kick">Admin</span>
      <h1 className="h2" style={{ marginTop: 14 }}>
        Enquiries
      </h1>
      <p className="adm-count" style={{ marginTop: 10 }}>
        {rows === null
          ? "Storage is not configured. Set DATABASE_URL to record enquiries."
          : `${rows.length} ${rows.length === 1 ? "enquiry" : "enquiries"} · newest first`}
      </p>

      {rows !== null && rows.length === 0 && (
        <p className="adm-empty">Nothing yet. Enquiries appear here as they arrive.</p>
      )}

      {rows !== null && rows.length > 0 && (
        <div className="tscroll" style={{ marginTop: 24 }}>
          <table className="ct">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Company</th>
                <th scope="col">Service</th>
                <th scope="col">Budget</th>
                <th scope="col">Message</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="adm-date">{formatDate(new Date(row.createdAt))}</td>
                  <td>{row.name}</td>
                  <td>
                    <a className="adm-mail" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  </td>
                  <td>{row.company ?? "—"}</td>
                  <td>{row.service}</td>
                  <td>
                    {BUDGET_LABELS[row.budget as keyof typeof BUDGET_LABELS] ??
                      row.budget}
                  </td>
                  <td className="adm-msg">{row.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
