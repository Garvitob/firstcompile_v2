import Link from "next/link";
import { getAllPosts, formatPostDate } from "@/lib/posts";

export default function Writing() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section className="sec" id="writing">
      <div className="wrap">
        <div className="sec-head">
          <span className="kick rv">Writing · weekly</span>
          <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
            Plain-English notes on building software.
          </h2>
        </div>
        <div className="posts">
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
  );
}
