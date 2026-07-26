import CalBooking from "./CalBooking";
import EnquiryForm from "./EnquiryForm";

export default function Booking() {
  return (
    <section className="sec" id="book">
      <div className="wrap">
        <div className="sec-head">
          <span className="kick rv">Start</span>
          <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
            Thirty minutes. Bring the problem.
          </h2>
          <p className="lede rv d2">
            We go through what you are building, what exists, and what shipping
            it properly involves. You leave with a scope and a number, whether or
            not you work with us.
          </p>
        </div>

        <div className="book-grid">
          <div className="rv">
            <ul className="meta">
              <li>
                <span className="k">FORMAT</span>
                <span>
                  <b>Google Meet</b> · link arrives with the invite
                </span>
              </li>
              <li>
                <span className="k">LENGTH</span>
                <span>
                  <b>30 minutes</b>, or 15 if you just need a number
                </span>
              </li>
              <li>
                <span className="k">WITH</span>
                <span>
                  <b>An engineer</b>, not an account manager
                </span>
              </li>
              <li>
                <span className="k">NDA</span>
                <span>
                  <b>Signed first</b>, before you share anything
                </span>
              </li>
              <li>
                <span className="k">AFTER</span>
                <span>A written scope and fixed quote within 48 hours</span>
              </li>
              <li>
                <span className="k">COST</span>
                <span>Nothing. No card, no sales sequence.</span>
              </li>
            </ul>
          </div>

          <CalBooking />
        </div>

        <div className="write">
          <div className="rv">
            <span className="kick">Prefer to write?</span>
            <h3 className="h3" style={{ marginTop: 12 }}>
              Send the details instead.
            </h3>
            <p
              className="mut"
              style={{
                marginTop: 12,
                fontSize: 15,
                maxWidth: "38ch",
                lineHeight: 1.62,
              }}
            >
              Two or three sentences is enough. A person reads it and replies
              with questions and a rough direction.
            </p>
            <ul className="meta" style={{ marginTop: 22 }}>
              <li>
                <span className="k">EMAIL</span>
                <span>
                  <a
                    href="mailto:hello@firstcompile.com"
                    style={{ borderBottom: "1px solid var(--line2)" }}
                  >
                    <b>hello@firstcompile.com</b>
                  </a>
                </span>
              </li>
              <li>
                <span className="k">REPLY</span>
                <span>
                  Within <b>one working day</b>, from a person
                </span>
              </li>
              <li>
                <span className="k">NDA</span>
                <span>Available before you share anything</span>
              </li>
            </ul>
          </div>

          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
