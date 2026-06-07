import { createConfig, http } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Fallback logic for RPCs if env vars are missing
const bscRpcUrl = process.env.NEXT_PUBLIC_BNB_MAINNET_RPC_URL || 'https://bsc-dataseed.binance.org'
const bscTestnetRpcUrl = process.env.NEXT_PUBLIC_BNB_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545'

// WalletConnect project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '' 

const isTestnet = process.env.NEXT_PUBLIC_CHAIN_ENV === 'testnet'

// The first chain in the array is the default chain
export const chains = isTestnet ? ([bscTestnet, bsc] as const) : ([bsc, bscTestnet] as const)

const connectors = [injected()]
if (projectId) {
  connectors.push(walletConnect({ projectId }))
}

export const config = createConfig({
  chains,
  transports: {
    [bsc.id]: http(bscRpcUrl),
    [bscTestnet.id]: http(bscTestnetRpcUrl),
  },
  connectors,
  // Discover each installed wallet (MetaMask, Phantom, …) as its own connector
  // via EIP-6963 so we can target MetaMask precisely.
  multiInjectedProviderDiscovery: true,
})
