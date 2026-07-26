import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  body: string; // raw markdown
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? "1970-01-01"),
        excerpt: String(data.excerpt ?? ""),
        body: content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false, gfm: true }) as string;
}

/** "2026-07-21" → "21 Jul 2026", matching the contract's date format. */
export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${d} ${months[(m || 1) - 1]} ${y}`;
}
