import Link from "next/link";

export default function Footer() {
  return (
    <footer id="careers-link">
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <Link className="logo" href="/">
              <span className="logo-mark" aria-hidden="true">
                {">"}
              </span>
              FirstCompile
            </Link>
            <p>An AI-native software company. Built in India, shipped worldwide.</p>
            <p style={{ marginTop: 14, fontSize: 13, color: "var(--tx2)" }}>
              Taking new projects — August 2026.
            </p>
            <div className="offices">
              <div className="office">
                <svg viewBox="0 0 20 14" aria-hidden="true">
                  <defs>
                    <clipPath id="fin">
                      <rect width="20" height="14" rx="3" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#fin)">
                    <rect width="20" height="14" fill="#fff" />
                    <rect width="20" height="4.67" fill="#FF9933" />
                    <rect y="9.33" width="20" height="4.67" fill="#138808" />
                    <circle
                      cx="10"
                      cy="7"
                      r="1.7"
                      fill="none"
                      stroke="#054187"
                      strokeWidth=".55"
                    />
                    <circle cx="10" cy="7" r=".35" fill="#054187" />
                  </g>
                </svg>
                <div>
                  <b>Noida, India</b>
                  <a href="tel:+917017304973">+91 70173 04973</a>
                </div>
              </div>
              <div className="office">
                <svg viewBox="0 0 20 14" aria-hidden="true">
                  <defs>
                    <clipPath id="fus">
                      <rect width="20" height="14" rx="3" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#fus)">
                    <rect width="20" height="14" fill="#fff" />
                    <g fill="#B22234">
                      <rect width="20" height="2" />
                      <rect y="4" width="20" height="2" />
                      <rect y="8" width="20" height="2" />
                      <rect y="12" width="20" height="2" />
                    </g>
                    <rect width="9" height="7" fill="#3C3B6E" />
                    <g fill="#fff">
                      <circle cx="1.8" cy="1.6" r=".45" />
                      <circle cx="4.5" cy="1.6" r=".45" />
                      <circle cx="7.2" cy="1.6" r=".45" />
                      <circle cx="3.15" cy="3.5" r=".45" />
                      <circle cx="5.85" cy="3.5" r=".45" />
                      <circle cx="1.8" cy="5.4" r=".45" />
                      <circle cx="4.5" cy="5.4" r=".45" />
                      <circle cx="7.2" cy="5.4" r=".45" />
                    </g>
                  </g>
                </svg>
                <div>
                  <b>San Francisco Bay Area, USA</b>
                </div>
              </div>
            </div>
          </div>
          <div className="fcol">
            <h5>Startups</h5>
            <ul>
              <li>
                <Link href="/services/mvp-development">MVP development</Link>
              </li>
              <li>
                <Link href="/services/startup-tech-partner">Startup tech partner</Link>
              </li>
              <li>
                <Link href="/services/vibe-code-to-production">
                  Vibe-code to production
                </Link>
              </li>
              <li>
                <Link href="/services/ai-app-security-audit">AI security audit</Link>
              </li>
            </ul>
          </div>
          <div className="fcol">
            <h5>Businesses</h5>
            <ul>
              <li>
                <Link href="/services/custom-erp-crm">Custom ERP &amp; CRM</Link>
              </li>
              <li>
                <Link href="/services/application-development">
                  Application development
                </Link>
              </li>
              <li>
                <Link href="/services/ai-machine-learning">
                  AI &amp; machine learning
                </Link>
              </li>
              <li>
                <Link href="/services/custom-ai-agents">Custom AI agents</Link>
              </li>
              <li>
                <Link href="/services/workflow-automation">Workflow automation</Link>
              </li>
              <li>
                <Link href="/services/data-business-intelligence">
                  Data &amp; business intelligence
                </Link>
              </li>
              <li>
                <Link href="/services/industry-4-0-industrial-automation">
                  Industry 4.0 &amp; automation
                </Link>
              </li>
              <li>
                <Link href="/services/cloud-devops">Cloud &amp; DevOps</Link>
              </li>
              <li>
                <Link href="/services/technology-consulting">
                  Technology consulting
                </Link>
              </li>
            </ul>
          </div>
          <div className="fcol">
            <h5>Company</h5>
            <ul>
              <li>
                <Link href="/work">Work</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/blog">Writing</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>
          </div>
          <div className="fcol">
            <h5>Contact</h5>
            <ul>
              <li>
                <a href="mailto:hello@firstcompile.com">hello@firstcompile.com</a>
              </li>
              <li>
                <Link href="/#book">Book a call</Link>
              </li>
              <li>
                <Link href="/#book">Start a project</Link>
              </li>
              <li>
                <a href="/llms.txt">llms.txt</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fbot">
          <span>© 2026 FirstCompile. All rights reserved.</span>
          <span>Every diff is read by a person.</span>
        </div>
      </div>
    </footer>
  );
}
