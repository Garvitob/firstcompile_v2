import GridAligner from "./GridAligner";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-in">
        <div className="hero-copy">
          <h1 className="h1 rv">Enterprise-grade software, at startup speed.</h1>
          <p className="lede rv d1">
            FirstCompile is an AI-native software company. We build MVPs, websites
            and web apps, custom business systems, mobile apps, and automation that
            hold up in production. AI gives us the speed. Engineers make every
            decision that matters.
          </p>
          <div className="hero-ctas rv d2">
            <a className="btn btn-pri btn-lg" href="#book">
              Book a call
              <svg
                className="go"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="15"
                height="15"
                aria-hidden="true"
              >
                <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
              </svg>
            </a>
            <a className="btn btn-gh btn-lg" href="#work">
              See our work
            </a>
          </div>
          <div className="hero-terms rv d2">
            <span>Fixed-price quotes</span>
            <span aria-hidden="true">·</span>
            <span>Your code, your repo</span>
            <span aria-hidden="true">·</span>
            <span>NDA first</span>
            <span aria-hidden="true">·</span>
            <span>India &amp; US</span>
          </div>
        </div>

        <div className="hero-visual rv d1" aria-hidden="true">
          <div className="mock hvw">
            <div className="mock-bar">
              <span className="mdots">
                <i></i>
                <i></i>
                <i></i>
              </span>
              <span className="maddr">app.yourcompany.com/pipeline</span>
            </div>
            <div className="crm">
              <div className="crm-side">
                <div className="crm-ws">Acme Distributors</div>
                <div className="crm-nav">Overview</div>
                <div className="crm-nav on">Pipeline</div>
                <div className="crm-nav">Orders</div>
                <div className="crm-nav">Invoices</div>
                <div className="crm-nav">Reports</div>
                <div className="crm-nav">Settings</div>
              </div>
              <div className="crm-main">
                <div className="crm-tools">
                  <span className="crm-search">Search deals</span>
                  <span className="crm-filter">Stage · All</span>
                  <span className="crm-filter">Owner · All</span>
                  <span className="crm-new">New deal</span>
                </div>
                <table className="crm-t">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Owner</th>
                      <th>Stage</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Nandini Textiles</td>
                      <td>
                        <span className="own">
                          <span className="av">AR</span>Aarav
                        </span>
                      </td>
                      <td>
                        <span className="bdg">Quote sent</span>
                      </td>
                      <td>₹4,20,000</td>
                    </tr>
                    <tr>
                      <td>Orbit Logistics</td>
                      <td>
                        <span className="own">
                          <span className="av">KP</span>Kavya
                        </span>
                      </td>
                      <td>
                        <span className="bdg wn">Approval</span>
                      </td>
                      <td>₹1,85,000</td>
                    </tr>
                    <tr>
                      <td>Halden Foods</td>
                      <td>
                        <span className="own">
                          <span className="av">JS</span>Jordan
                        </span>
                      </td>
                      <td>
                        <span className="bdg ok">Won</span>
                      </td>
                      <td>$9,400</td>
                    </tr>
                    <tr>
                      <td>Cortex Labs</td>
                      <td>
                        <span className="own">
                          <span className="av">VT</span>Vidya
                        </span>
                      </td>
                      <td>
                        <span className="bdg ac">Negotiation</span>
                      </td>
                      <td>$12,400</td>
                    </tr>
                    <tr>
                      <td>Meridian Clinics</td>
                      <td>
                        <span className="own">
                          <span className="av">AR</span>Aarav
                        </span>
                      </td>
                      <td>
                        <span className="bdg">New lead</span>
                      </td>
                      <td>$6,800</td>
                    </tr>
                    <tr>
                      <td>Sundaram Motors</td>
                      <td>
                        <span className="own">
                          <span className="av">KP</span>Kavya
                        </span>
                      </td>
                      <td>
                        <span className="bdg ok">Invoiced</span>
                      </td>
                      <td>₹9,60,000</td>
                    </tr>
                  </tbody>
                </table>
                <div className="crm-stats">
                  <div className="mstat">
                    <b>₹18.4L</b>
                    <span>Open pipeline</span>
                  </div>
                  <div className="mstat">
                    <b>34</b>
                    <span>Active deals</span>
                  </div>
                  <div className="mstat">
                    <b>+18.4%</b>
                    <span>Revenue, 10 months</span>
                    <div className="spark-s">
                      <i style={{ height: "34%" }}></i>
                      <i style={{ height: "46%" }}></i>
                      <i style={{ height: "41%" }}></i>
                      <i style={{ height: "58%" }}></i>
                      <i style={{ height: "53%" }}></i>
                      <i style={{ height: "68%" }}></i>
                      <i style={{ height: "64%" }}></i>
                      <i style={{ height: "81%" }}></i>
                      <i style={{ height: "77%" }}></i>
                      <i style={{ height: "94%" }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GridAligner />
    </section>
  );
}
