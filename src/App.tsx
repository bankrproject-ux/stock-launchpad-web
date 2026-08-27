import {
  useState
} from "react";

import WalletButton from "./components/WalletButton";

import LaunchForm from "./components/LaunchForm";

import TokenList from "./components/TokenList";

function App() {
  const [page, setPage] =
    useState<"home" | "launch">(
      "home"
    );

  return (
    <div className="app">
      <nav className="navbar">
        <button
          className="logo"
          onClick={() =>
            setPage("home")
          }
        >
          <span>$</span>
          Stock<span>Launch</span>
        </button>

        <div className="nav-right">
          <button
            className={
              page === "home"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() =>
              setPage("home")
            }
          >
            Markets
          </button>

          <button
            className={
              page === "launch"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() =>
              setPage("launch")
            }
          >
            Launch
          </button>

          <WalletButton />
        </div>
      </nav>

      <main className="container">
        {page === "home" && (
          <>
            <section className="hero">
              <div>
                <div className="eyebrow">
                  ROBINHOOD CHAIN
                </div>

                <h1>
                  Launch a coin.
                  <br />
                  Pair it with markets.
                </h1>

                <p>
                  Create tokens and pair
                  them with WETH, USDG,
                  or tokenized stocks.
                </p>

                <button
                  className="hero-button"
                  onClick={() =>
                    setPage("launch")
                  }
                >
                  Launch a coin →
                </button>
              </div>

              <div className="hero-card">
                <div className="hero-card-label">
                  MARKET PAIRS
                </div>

                <div className="hero-pairs">
                  <div>WETH</div>
                  <div>USDG</div>
                  <div>NVDA</div>
                </div>

                <div className="hero-stats">
                  <div>
                    <span>Market fee</span>
                    <strong>1.50%</strong>
                  </div>

                  <div>
                    <span>Creator</span>
                    <strong>0.85%</strong>
                  </div>

                  <div>
                    <span>Platform</span>
                    <strong>0.65%</strong>
                  </div>
                </div>
              </div>
            </section>

            <TokenList />
          </>
        )}

        {page === "launch" && (
          <section className="launch-page">
            <div className="launch-copy">
              <div className="eyebrow">
                CREATE MARKET
              </div>

              <h1>
                Launch your coin
              </h1>

              <p>
                Your token starts with
                1 billion supply and can
                be paired with crypto or
                tokenized stock assets.
              </p>
            </div>

            <LaunchForm />
          </section>
        )}
      </main>

      <footer>
        Stock Launchpad ·
        Robinhood Chain
      </footer>
    </div>
  );
}

export default App;
