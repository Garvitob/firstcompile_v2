import { BELT_A, BELT_B } from "./belt-data";

/**
 * The two counter-scrolling logo belts. Chip markup (27 chips, official marks
 * inline) is extracted byte-for-byte from the contract file — see belt-data.ts.
 * The animation is pure CSS (48s linear, reverse on row B, paused on hover,
 * static wrap under prefers-reduced-motion). Duplicate halves are aria-hidden.
 */
export default function TechBelt() {
  return (
    <section className="tech">
      <div className="wrap">
        <div className="tech-l rv">Technologies we work in</div>
        <p className="belt-cats rv d1">
          Web<i>·</i>Mobile<i>·</i>Platforms<i>·</i>Data<i>·</i>AI<i>·</i>Cloud
          <i>·</i>Industrial
        </p>
        <div className="rv d2">
          <div className="belt" aria-label="Technologies">
            <div className="belt-track">
              <div
                className="belt-half"
                dangerouslySetInnerHTML={{ __html: BELT_A }}
              />
              <div
                className="belt-half"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: BELT_A }}
              />
            </div>
          </div>
          <div className="belt rev" aria-label="Technologies">
            <div className="belt-track">
              <div
                className="belt-half"
                dangerouslySetInnerHTML={{ __html: BELT_B }}
              />
              <div
                className="belt-half"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: BELT_B }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
