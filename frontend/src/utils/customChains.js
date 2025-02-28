

export const anvilChain = {
    id: 31337, // Hardhat/Anvil Chain ID
    name: 'Anvil',
    network: 'anvil',
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['http://127.0.0.1:8545'], // Anvil default RPC URL
        },
        public: {
            http: ['http://127.0.0.1:8545'],
        },
    },
    blockExplorers: {
        default: { name: 'Localhost Explorer', url: 'http://localhost:8545' },
    },
    testnet: true,
};