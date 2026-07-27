import { PRODUCT_URLS } from "@/data/site";

/**
 * Outbound link to a running product. The label is the bare hostname in mono:
 * an address, shown as one. It deliberately makes no status claim, so it can
 * sit beside "Private beta" without contradicting it.
 *
 * rel is `noopener` and not `noreferrer` — these are our own deployments, and
 * the referrer is how they see the traffic arriving from here.
 */
export default function LiveLink({
  product,
}: {
  product: keyof typeof PRODUCT_URLS;
}) {
  const url = PRODUCT_URLS[product];
  return (
    <a className="live" href={url} target="_blank" rel="noopener">
      {url.replace(/^https:\/\//, "")}
      <span className="ext" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
