import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatPostDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Plain-English notes on building software: MVPs, production readiness, security, and the engineering behind AI-native delivery. New notes weekly.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kick rv">Writing · weekly</span>
          <h1 className="h1i rv d1" style={{ marginTop: 14 }}>
            Plain-English notes on building software.
          </h1>
          <p className="lede rv d2">
            What we learn shipping MVPs, rescuing vibe-coded apps, and running
            production systems. Written for the people paying for the software,
            not for other engineers.
          </p>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="posts" style={{ marginTop: 0 }}>
            {posts.map((post) => (
              <Link className="post rv" href={`/blog/${post.slug}`} key={post.slug}>
                <span className="post-d">{formatPostDate(post.date)}</span>
                <span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </span>
                <span className="post-go" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
