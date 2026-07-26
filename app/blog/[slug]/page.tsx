import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPost,
  renderMarkdown,
  formatPostDate,
} from "@/lib/posts";
import JsonLd from "@/components/site/JsonLd";
import { SITE_URL } from "@/data/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "FirstCompile", url: SITE_URL },
    publisher: { "@type": "Organization", name: "FirstCompile", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs rv" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog">Writing</Link>
          </nav>
          <h1 className="h1i rv d1">{post.title}</h1>
          <div className="art-meta rv d2">
            <span>{formatPostDate(post.date)}</span>
            <span aria-hidden="true">·</span>
            <span>FirstCompile</span>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <article
            className="art rv"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
          />
        </div>
      </section>
    </>
  );
}
