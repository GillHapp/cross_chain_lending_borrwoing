import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, avalancheFuji } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'CrossChainLend',
  projectId: 'YOUR_PROJECT_ID', // Replace with your WalletConnect project ID
  chains: [sepolia, avalancheFuji],
  ssr: false,
});

export const SUPPORTED_CHAINS = {
  [sepolia.id]: sepolia,
  [avalancheFuji.id]: avalancheFuji,
};