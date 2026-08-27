import {
  useState
} from "react";

import {
  formatUnits,
  parseUnits
} from "viem";

import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";

import {
  LAUNCHPAD_ADDRESS
} from "../lib/config";

import {
  launchpadAbi,
  erc20Abi
} from "../lib/abi";

type Props = {
  token: `0x${string}`;
  pair: `0x${string}`;
  pairSymbol: string;
};

export default function TradePanel({
  token,
  pair,
  pairSymbol
}: Props) {
  const [mode, setMode] =
    useState<"buy" | "sell">(
      "buy"
    );

  const [amount, setAmount] =
    useState("");

  const {
    address
  } = useAccount();

  const {
    data: pairDecimals
  } = useReadContract({
    address: pair,
    abi: erc20Abi,
    functionName: "decimals"
  });

  const {
    data: tokenDecimals
  } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "decimals"
  });

  const decimals =
    mode === "buy"
      ? pairDecimals
      : tokenDecimals;

  const amountWei =
    amount &&
    decimals !== undefined
      ? parseUnits(
          amount,
          decimals
        )
      : 0n;

  const assetForApproval =
    mode === "buy"
      ? pair
      : token;

  const {
    data: allowance,
    refetch: refetchAllowance
  } = useReadContract({
    address: assetForApproval,
    abi: erc20Abi,
    functionName: "allowance",
    args: address
      ? [
          address,
          LAUNCHPAD_ADDRESS
        ]
      : undefined,
    query: {
      enabled: Boolean(address)
    }
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

  const needsApproval =
    allowance === undefined ||
    allowance < amountWei;

  function approve() {
    if (amountWei <= 0n) {
      return;
    }

    writeContract({
      address:
        assetForApproval,

      abi:
        erc20Abi,

      functionName:
        "approve",

      args: [
        LAUNCHPAD_ADDRESS,
        amountWei
      ]
    });
  }

  function trade() {
    if (amountWei <= 0n) {
      return;
    }

    if (mode === "buy") {
      writeContract({
        address:
          LAUNCHPAD_ADDRESS,

        abi:
          launchpadAbi,

        functionName:
          "buy",

        args: [
          token,
          amountWei,
          0n
        ]
      });
    } else {
      writeContract({
        address:
          LAUNCHPAD_ADDRESS,

        abi:
          launchpadAbi,

        functionName:
          "sell",

        args: [
          token,
          amountWei,
          0n
        ]
      });
    }
  }

  if (
    isSuccess &&
    !isPending
  ) {
    setTimeout(() => {
      refetchAllowance();
    }, 1000);
  }

  return (
    <div className="trade-panel">
      <div className="trade-tabs">
        <button
          className={
            mode === "buy"
              ? "active"
              : ""
          }
          onClick={() =>
            setMode("buy")
          }
        >
          Buy
        </button>

        <button
          className={
            mode === "sell"
              ? "active sell"
              : ""
          }
          onClick={() =>
            setMode("sell")
          }
        >
          Sell
        </button>
      </div>

      <div className="trade-input">
        <input
          type="number"
          step="any"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
        />

        <span>
          {mode === "buy"
            ? pairSymbol
            : "TOKEN"}
        </span>
      </div>

      {!address && (
        <button
          className="primary-button disabled"
        >
          Connect wallet first
        </button>
      )}

      {address &&
        amountWei > 0n &&
        needsApproval && (
          <button
            className="primary-button"
            disabled={
              isPending ||
              isConfirming
            }
            onClick={approve}
          >
            {isPending ||
            isConfirming
              ? "Processing..."
              : `Approve ${
                  mode === "buy"
                    ? pairSymbol
                    : "Token"
                }`}
          </button>
        )}

      {address &&
        amountWei > 0n &&
        !needsApproval && (
          <button
            className="primary-button"
            disabled={
              isPending ||
              isConfirming
            }
            onClick={trade}
          >
            {isPending ||
            isConfirming
              ? "Processing..."
              : mode === "buy"
                ? "Buy"
                : "Sell"}
          </button>
        )}

      {error && (
        <div className="error-message">
          {error.shortMessage ||
            error.message}
        </div>
      )}

      {isSuccess && (
        <div className="success-message">
          ✓ Transaction confirmed
        </div>
      )}
    </div>
  );
}
