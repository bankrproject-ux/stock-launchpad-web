import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain
} from "wagmi";

import {
  ROBINHOOD_CHAIN_ID
} from "../lib/config";

function shortAddress(
  address: string
) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletButton() {
  const {
    address,
    isConnected,
    chainId
  } = useAccount();

  const {
    connect,
    connectors
  } = useConnect();

  const {
    disconnect
  } = useDisconnect();

  const {
    switchChain
  } = useSwitchChain();

  if (!isConnected) {
    return (
      <button
        className="wallet-button"
        onClick={() => {
          const connector =
            connectors[0];

          if (connector) {
            connect({
              connector
            });
          }
        }}
      >
        Connect Wallet
      </button>
    );
  }

  if (chainId !== ROBINHOOD_CHAIN_ID) {
    return (
      <button
        className="wallet-button warning"
        onClick={() =>
          switchChain({
            chainId:
              ROBINHOOD_CHAIN_ID
          })
        }
      >
        Switch Network
      </button>
    );
  }

  return (
    <button
      className="wallet-button"
      onClick={() => disconnect()}
      title="Disconnect wallet"
    >
      {shortAddress(address!)}
    </button>
  );
}
