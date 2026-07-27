import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const dir = path.join(process.cwd(), "public", "work");
const has = (file: string) => fs.existsSync(path.join(dir, file));

/**
 * Case-study screenshot slot. Renders the real product screenshot from
 * /public/work/<name>.png when it exists; until then it renders the contract's
 * bordered placeholder so the layout never looks broken.
 *
 * When a <name>-light.png is present too, both are emitted and CSS shows the
 * one matching the current theme. The panel behind them is var(--bg2), which
 * flips with the theme, so a single fixed screenshot would sit wrong in one of
 * the two modes. Exactly one is ever displayed, so exactly one is exposed to
 * assistive tech — hence the same alt on both rather than an aria-hidden pair.
 */
export default function Shot({ name, alt }: { name: string; alt: string }) {
  if (!has(`${name}.png`)) {
    return (
      <div className="shot">
        PRODUCT SCREENSHOT
        <br />
        1600 × 1040 · dark UI
      </div>
    );
  }

  const light = has(`${name}-light.png`);

  return (
    <>
      <Image
        src={`/work/${name}.png`}
        alt={alt}
        width={1600}
        height={1040}
        sizes="(max-width: 1040px) 100vw, 640px"
        className={`shot-img${light ? " shot-dark" : ""}`}
      />
      {light && (
        <Image
          src={`/work/${name}-light.png`}
          alt={alt}
          width={1600}
          height={1040}
          sizes="(max-width: 1040px) 100vw, 640px"
          className="shot-img shot-light"
        />
      )}
    </>
  );
}
