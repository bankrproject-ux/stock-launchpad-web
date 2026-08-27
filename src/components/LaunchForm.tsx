import {
  useState
} from "react";

import {
  parseUnits
} from "viem";

import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";

import {
  LAUNCHPAD_ADDRESS,
  PAIR_ASSETS
} from "../lib/config";

import {
  launchpadAbi,
  erc20Abi
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
    data: pairDecimals
  } = useReadContract({
    address:
      selectedPair.address,
    abi:
      erc20Abi,
    functionName:
      "decimals"
  });

  const {
    writeContract,
    data: hash,
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

    if (
      pairDecimals === undefined
    ) {
      alert(
        "Sedang membaca decimals pair asset"
      );

      return;
    }

    let reserveAmount: bigint;

    try {
      reserveAmount =
        parseUnits(
          reserve,
          pairDecimals
        );
    } catch {
      alert(
        "Jumlah reserve tidak valid"
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
        symbol
          .trim()
          .toUpperCase(),
        selectedPair.address,
        reserveAmount
      ]
    });
  }

  const loading =
    isPending ||
    isConfirming;

  return (
    <div className="launch-form">
      <div className="section-label">
        LAUNCH A COIN
      </div>

      <div className="field">
        <label>
          Token name
        </label>

        <input
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="Example Token"
        />
      </div>

      <div className="field">
        <label>
          Token ticker
        </label>

        <input
          value={symbol}
          onChange={(e) =>
            setSymbol(
              e.target.value
            )
          }
          placeholder="TOKEN"
        />
      </div>

      <div className="field">
        <label>
          Pair asset
        </label>

        <div className="pair-grid">
          {PAIR_ASSETS.map(
            (
              pair,
              index
            ) => (
              <button
                key={pair.address}
                type="button"
                className={
                  pairIndex ===
                  index
                    ? "pair-option active"
                    : "pair-option"
                }
                onClick={() =>
                  setPairIndex(
                    index
                  )
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
          Virtual starting reserve
        </label>

        <input
          type="text"
          inputMode="decimal"
          value={reserve}
          onChange={(e) =>
            setReserve(
              e.target.value
            )
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
          <span>Creator fee</span>
          <strong>0.85%</strong>
        </div>

        <div>
          <span>Platform fee</span>
          <strong>0.65%</strong>
        </div>
      </div>

      {!isConnected ? (
        <button
          disabled
          className="primary-button disabled"
        >
          Connect wallet first
        </button>
      ) : (
        <button
          className="primary-button"
          disabled={loading}
          onClick={launch}
        >
          {isPending &&
            "Confirm wallet..."}

          {isConfirming &&
            "Launching..."}

          {!loading &&
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
