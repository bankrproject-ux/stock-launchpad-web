import {
  useState
} from "react";

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";

import {
  parseUnits
} from "viem";

import {
  LAUNCHPAD_ADDRESS,
  PAIR_ASSETS
} from "../lib/config";

import {
  launchpadAbi
} from "../lib/abi";

export default function LaunchForm() {
  const {
    isConnected
  } = useAccount();

  const [name, setName] =
    useState("");

  const [symbol, setSymbol] =
    useState("");

  const [pairIndex, setPairIndex] =
    useState(0);

  const [reserve, setReserve] =
    useState("1");

  const selectedPair =
    PAIR_ASSETS[pairIndex];

  const {
    data: hash,
    writeContract,
    isPending,
    error
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess
  } =
    useWaitForTransactionReceipt({
      hash
    });

  function launch() {
    if (!name.trim()) {
      alert("Masukkan nama token");
      return;
    }

    if (!symbol.trim()) {
      alert("Masukkan ticker token");
      return;
    }

    if (
      !reserve ||
      Number(reserve) <= 0
    ) {
      alert(
        "Starting reserve harus lebih dari 0"
      );

      return;
    }

    writeContract({
      address:
        LAUNCHPAD_ADDRESS,

      abi:
        launchpadAbi,

      functionName:
        "launchToken",

      args: [
        name.trim(),
        symbol.trim().toUpperCase(),
        selectedPair.address,
        parseUnits(reserve, 18)
      ]
    });
  }

  return (
    <div className="launch-form">
      <div className="section-label">
        Launch a coin
      </div>

      <div className="field">
        <label>Name</label>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Token name"
        />
      </div>

      <div className="field">
        <label>Ticker</label>

        <input
          value={symbol}
          onChange={(e) =>
            setSymbol(
              e.target.value
            )
          }
          placeholder="$TICKER"
        />
      </div>

      <div className="field">
        <label>Pool pairing</label>

        <div className="pair-grid">
          {PAIR_ASSETS.map(
            (pair, index) => (
              <button
                key={pair.address}
                className={
                  pairIndex === index
                    ? "pair-option active"
                    : "pair-option"
                }
                onClick={() =>
                  setPairIndex(index)
                }
              >
                {pair.symbol}
              </button>
            )
          )}
        </div>
      </div>

      <div className="field">
        <label>
          Starting virtual reserve
        </label>

        <input
          type="number"
          min="0"
          step="any"
          value={reserve}
          onChange={(e) =>
            setReserve(e.target.value)
          }
          placeholder="1"
        />

        <span className="field-hint">
          {selectedPair.symbol}
        </span>
      </div>

      <div className="launch-info">
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

        <div>
          <span>Supply</span>
          <strong>1B</strong>
        </div>
      </div>

      {!isConnected ? (
        <button
          className="primary-button disabled"
        >
          Connect wallet first
        </button>
      ) : (
        <button
          className="primary-button"
          disabled={
            isPending ||
            isConfirming
          }
          onClick={launch}
        >
          {isPending &&
            "Confirm wallet..."}

          {isConfirming &&
            "Launching..."}

          {!isPending &&
            !isConfirming &&
            "Launch coin"}
        </button>
      )}

      {isSuccess && (
        <div className="success-message">
          ✓ Token launched successfully
        </div>
      )}

      {error && (
        <div className="error-message">
          {error.shortMessage ||
            error.message}
        </div>
      )}
    </div>
  );
}
