import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="wrap">
        <span className="kick">404</span>
        <h1 className="h1i" style={{ marginTop: 14 }}>
          This page does not exist.
        </h1>
        <div style={{ marginTop: 28 }}>
          <Link className="btn btn-pri" href="/">
            Back to the home page
          </Link>
        </div>
      </div>
    </section>
  );
}
