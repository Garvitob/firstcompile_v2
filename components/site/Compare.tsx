export default function Compare() {
  return (
    <section className="sec" id="compare">
      <div className="wrap">
        <div className="sec-head">
          <span className="kick rv">Compared honestly</span>
          <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
            The other three ways to get this built.
          </h2>
          <p className="lede rv d2">
            Each is right for someone. Choose on these terms, not on a proposal
            deck. We lose two rows below on purpose.
          </p>
        </div>
        <div className="tscroll rv">
          <table className="ct">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Big agency</th>
                <th scope="col">Freelancer</th>
                <th scope="col">Offshore team</th>
                <th scope="col" className="us">
                  FirstCompile
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Pricing</th>
                <td>Retainer. Estimates are ranges.</td>
                <td>Hourly. Cheap per hour, unpredictable in total.</td>
                <td>Per seat, per month.</td>
                <td className="us">One fixed number, in writing, before kickoff.</td>
              </tr>
              <tr>
                <th scope="row">Time to live</th>
                <td>3–6 months with discovery.</td>
                <td>Depends on their other clients.</td>
                <td>2–4 months once staffed.</td>
                <td className="us">Weeks. Committed in the quote.</td>
              </tr>
              <tr>
                <th scope="row">Who builds it</th>
                <td>Seniors sell, juniors build.</td>
                <td>One person, one skillset.</td>
                <td>A rotating pool.</td>
                <td className="us">The engineers who scoped it. No handoff.</td>
              </tr>
              <tr>
                <th scope="row">Code ownership</th>
                <td>Transferred on final invoice.</td>
                <td>Whatever the contract says.</td>
                <td>Often tied to their tooling.</td>
                <td className="us">Your repo from commit one.</td>
              </tr>
              <tr>
                <th scope="row">After launch</th>
                <td>A new retainer.</td>
                <td>When they are free.</td>
                <td>Through an account manager.</td>
                <td className="us">30 days of free fixes, then optional care.</td>
              </tr>
              <tr>
                <th scope="row">Best when</th>
                <td>You are funded and need many teams in parallel.</td>
                <td>The scope is tiny and fully defined.</td>
                <td>You need volume for years.</td>
                <td className="us">You need one system live, properly, soon.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
