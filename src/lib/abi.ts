export const launchpadAbi = [
  {
    type: "function",
    name: "launchToken",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "name_",
        type: "string"
      },
      {
        name: "symbol_",
        type: "string"
      },
      {
        name: "pairAsset",
        type: "address"
      },
      {
        name: "virtualPairReserve",
        type: "uint256"
      }
    ],
    outputs: [
      {
        name: "tokenAddress",
        type: "address"
      }
    ]
  },

  {
    type: "function",
    name: "buy",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "tokenAddress",
        type: "address"
      },
      {
        name: "pairAmountIn",
        type: "uint256"
      },
      {
        name: "minTokensOut",
        type: "uint256"
      }
    ],
    outputs: []
  },

  {
    type: "function",
    name: "sell",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "tokenAddress",
        type: "address"
      },
      {
        name: "tokenAmountIn",
        type: "uint256"
      },
      {
        name: "minPairOut",
        type: "uint256"
      }
    ],
    outputs: []
  },

  {
    type: "function",
    name: "getAllTokensLength",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "uint256"
      }
    ]
  },

  {
    type: "function",
    name: "allTokens",
    stateMutability: "view",
    inputs: [
      {
        type: "uint256"
      }
    ],
    outputs: [
      {
        type: "address"
      }
    ]
  },

  {
    type: "function",
    name: "getMarket",
    stateMutability: "view",
    inputs: [
      {
        name: "tokenAddress",
        type: "address"
      }
    ],
    outputs: [
      {
        name: "token",
        type: "address"
      },
      {
        name: "creator",
        type: "address"
      },
      {
        name: "pairAsset",
        type: "address"
      },
      {
        name: "virtualTokenReserve",
        type: "uint256"
      },
      {
        name: "virtualPairReserve",
        type: "uint256"
      },
      {
        name: "realPairReserve",
        type: "uint256"
      },
      {
        name: "active",
        type: "bool"
      }
    ]
  },

  {
    type: "function",
    name: "getBuyAmountOut",
    stateMutability: "view",
    inputs: [
      {
        name: "tokenAddress",
        type: "address"
      },
      {
        name: "pairAmountIn",
        type: "uint256"
      }
    ],
    outputs: [
      {
        type: "uint256"
      }
    ]
  },

  {
    type: "function",
    name: "getSellAmountOut",
    stateMutability: "view",
    inputs: [
      {
        name: "tokenAddress",
        type: "address"
      },
      {
        name: "tokenAmountIn",
        type: "uint256"
      }
    ],
    outputs: [
      {
        type: "uint256"
      }
    ]
  }
] as const;

export const erc20Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "spender",
        type: "address"
      },
      {
        name: "amount",
        type: "uint256"
      }
    ],
    outputs: [
      {
        type: "bool"
      }
    ]
  },

  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      {
        name: "owner",
        type: "address"
      },
      {
        name: "spender",
        type: "address"
      }
    ],
    outputs: [
      {
        type: "uint256"
      }
    ]
  },

  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [
      {
        name: "account",
        type: "address"
      }
    ],
    outputs: [
      {
        type: "uint256"
      }
    ]
  },

  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "string"
      }
    ]
  },

  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "string"
      }
    ]
  },

  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "uint8"
      }
    ]
  }
] as const;
