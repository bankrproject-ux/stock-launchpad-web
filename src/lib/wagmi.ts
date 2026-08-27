import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const robinhoodChain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [
        "https://rpc.mainnet.chain.robinhood.com"
      ]
    }
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://robinhoodchain.blockscout.com"
    }
  }
});

export const config = createConfig({
  chains: [
    robinhoodChain
  ],
  connectors: [
    injected()
  ],
  transports: {
    [robinhoodChain.id]: http(
      "https://rpc.mainnet.chain.robinhood.com"
    )
  }
});
