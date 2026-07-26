import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Case-study screenshot slot. Renders the real product screenshot from
 * /public/work/<name>.png when the founder has added it; until then it renders
 * the contract's bordered placeholder so the layout never looks broken.
 */
export default function Shot({ name, alt }: { name: string; alt: string }) {
  const file = path.join(process.cwd(), "public", "work", `${name}.png`);
  const exists = fs.existsSync(file);

  if (exists) {
    return (
      <Image
        src={`/work/${name}.png`}
        alt={alt}
        width={1600}
        height={1040}
        sizes="(max-width: 1040px) 100vw, 640px"
        style={{
          width: "100%",
          height: "auto",
          border: "1px solid var(--line)",
          borderRadius: 12,
        }}
      />
    );
  }

  return (
    <div className="shot">
      PRODUCT SCREENSHOT
      <br />
      1600 × 1040 · dark UI
    </div>
  );
}
