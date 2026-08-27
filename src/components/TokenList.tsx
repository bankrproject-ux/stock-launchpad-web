import {
  useEffect,
  useState
} from "react";

import {
  formatUnits,
  zeroAddress
} from "viem";

import {
  usePublicClient
} from "wagmi";

import {
  LAUNCHPAD_ADDRESS,
  PAIR_ASSETS
} from "../lib/config";

import {
  launchpadAbi,
  erc20Abi
} from "../lib/abi";

import TradePanel from "./TradePanel";

type TokenData = {
  address: `0x${string}`;
  name: string;
  symbol: string;
  pair: `0x${string}`;
  pairSymbol: string;
  reserve: bigint;
};

function shortAddress(
  address: string
) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function TokenList() {
  const publicClient =
    usePublicClient();

  const [tokens, setTokens] =
    useState<TokenData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedToken, setSelectedToken] =
    useState<TokenData | null>(
      null
    );

  async function loadTokens() {
    if (!publicClient) {
      return;
    }

    try {
      setLoading(true);

      const length =
        await publicClient.readContract({
          address:
            LAUNCHPAD_ADDRESS,
          abi:
            launchpadAbi,
          functionName:
            "getAllTokensLength"
        });

      const list: TokenData[] = [];

      for (
        let i = Number(length) - 1;
        i >= 0;
        i--
      ) {
        const tokenAddress =
          await publicClient.readContract({
            address:
              LAUNCHPAD_ADDRESS,
            abi:
              launchpadAbi,
            functionName:
              "allTokens",
            args: [
              BigInt(i)
            ]
          });

        const [
          name,
          symbol,
          market
        ] = await Promise.all([
          publicClient.readContract({
            address:
              tokenAddress,
            abi:
              erc20Abi,
            functionName:
              "name"
          }),

          publicClient.readContract({
            address:
              tokenAddress,
            abi:
              erc20Abi,
            functionName:
              "symbol"
          }),

          publicClient.readContract({
            address:
              LAUNCHPAD_ADDRESS,
            abi:
              launchpadAbi,
            functionName:
              "getMarket",
            args: [
              tokenAddress
            ]
          })
        ]);

        const pair =
          market[2];

        const pairInfo =
          PAIR_ASSETS.find(
            (item) =>
              item.address.toLowerCase() ===
              pair.toLowerCase()
          );

        list.push({
          address:
            tokenAddress,
          name,
          symbol,
          pair,
          pairSymbol:
            pairInfo?.symbol ||
            shortAddress(pair),
          reserve:
            market[5]
        });
      }

      setTokens(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTokens();
  }, [publicClient]);

  if (selectedToken) {
    return (
      <div>
        <button
          className="back-button"
          onClick={() =>
            setSelectedToken(null)
          }
        >
          ← Back to markets
        </button>

        <div className="token-detail">
          <div className="token-detail-header">
            <div>
              <div className="token-symbol">
                {selectedToken.symbol}
              </div>

              <h2>
                {selectedToken.name}
              </h2>

              <span>
                {shortAddress(
                  selectedToken.address
                )}
              </span>
            </div>

            <div className="pair-badge">
              {selectedToken.pairSymbol}
            </div>
          </div>

          <TradePanel
            token={
              selectedToken.address
            }
            pair={
              selectedToken.pair
            }
            pairSymbol={
              selectedToken.pairSymbol
            }
          />
        </div>
      </div>
    );
  }

  return (
    <section className="markets">
      <div className="section-header">
        <div>
          <div className="section-label">
            Markets
          </div>

          <h2>
            Latest launches
          </h2>
        </div>

        <button
          className="refresh-button"
          onClick={loadTokens}
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="empty-state">
          Loading markets...
        </div>
      )}

      {!loading &&
        tokens.length === 0 && (
          <div className="empty-state">
            No tokens launched yet.
          </div>
        )}

      <div className="token-grid">
        {tokens.map(
          (token) => (
            <button
              key={token.address}
              className="token-card"
              onClick={() =>
                setSelectedToken(token)
              }
            >
              <div className="token-card-top">
                <div className="token-icon">
                  $
                </div>

                <div className="pair-badge">
                  {token.pairSymbol}
                </div>
              </div>

              <h3>
                {token.name}
              </h3>

              <div className="ticker">
                ${token.symbol}
              </div>

              <div className="token-address">
                {shortAddress(
                  token.address
                )}
              </div>
            </button>
          )
        )}
      </div>
    </section>
  );
}
