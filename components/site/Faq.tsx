import { homeFaq } from "@/data/faq";

export default function Faq() {
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <div className="sec-head">
          <span className="kick rv">Questions</span>
          <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
            Asked before every first call.
          </h2>
        </div>
        <div className="faq rv">
          {homeFaq.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <span className="fico" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="fa">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
