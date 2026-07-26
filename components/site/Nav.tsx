import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link className="logo" href="/">
          <span className="logo-mark" aria-hidden="true">
            {">"}
          </span>
          FirstCompile
        </Link>
        <nav className="nav-mid" aria-label="Primary">
          <Link href="/#services">Services</Link>
          <Link href="/#products">Products</Link>
          <Link href="/#work">Work</Link>
          <Link href="/#process">Process</Link>
          <Link href="/#writing">Writing</Link>
          <Link href="/careers">Careers</Link>
        </nav>
        <div className="nav-end">
          <ThemeToggle />
          <Link className="btn btn-pri btn-sm nav-cta" href="/#book">
            Start a project
          </Link>
          <button
            className="icon-btn burger"
            id="burger"
            type="button"
            aria-label="Menu"
            aria-expanded="false"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
            </svg>
          </button>
        </div>
      </div>
      <div className="drawer" id="drawer">
        <Link href="/#services">Services</Link>
        <Link href="/#products">Products</Link>
        <Link href="/#work">Work</Link>
        <Link href="/#process">Process</Link>
        <Link href="/#writing">Writing</Link>
        <Link href="/careers">Careers</Link>
        <Link href="/#book">Start a project</Link>
      </div>
    </header>
  );
}
