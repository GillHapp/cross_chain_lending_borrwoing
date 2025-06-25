import { sepolia, avalancheFuji } from 'wagmi/chains';

// Mock token data
export const mockTokens = [
  // Sepolia tokens
  {
    address: '0x1234567890123456789012345678901234567890',
    name: 'Ethereum',
    symbol: 'ETH',
    chainId: sepolia.id,
    price: '2,450.00',
    supplyApy: 3.2,
    borrowApy: 4.8,
    totalSupplied: '12,450.50',
    totalBorrowed: '8,320.75',
    availableToSupply: '1,000.00',
    availableToBorrow: '4,129.75',
    utilizationRate: 66.8,
    maxLtv: 80,
    liquidationThreshold: 85,
    liquidationPenalty: 5,
    borrowCap: '15,000',
    color: 'bg-blue-500',
    walletBalance: '2.5'
  },
  {
    address: '0x2345678901234567890123456789012345678901',
    name: 'USD Coin',
    symbol: 'USDC',
    chainId: sepolia.id,
    price: '1.00',
    supplyApy: 2.1,
    borrowApy: 3.5,
    totalSupplied: '45,230.00',
    totalBorrowed: '32,150.00',
    availableToSupply: '10,000.00',
    availableToBorrow: '13,080.00',
    utilizationRate: 71.1,
    maxLtv: 85,
    liquidationThreshold: 90,
    liquidationPenalty: 4,
    borrowCap: '50,000',
    color: 'bg-green-500',
    walletBalance: '1,250.00'
  },
  // Avalanche tokens
  {
    address: '0x3456789012345678901234567890123456789012',
    name: 'Avalanche',
    symbol: 'AVAX',
    chainId: avalancheFuji.id,
    price: '28.50',
    supplyApy: 4.1,
    borrowApy: 6.2,
    totalSupplied: '8,750.25',
    totalBorrowed: '5,420.10',
    availableToSupply: '2,000.00',
    availableToBorrow: '3,330.15',
    utilizationRate: 61.9,
    maxLtv: 75,
    liquidationThreshold: 80,
    liquidationPenalty: 6,
    borrowCap: '12,000',
    color: 'bg-red-500',
    walletBalance: '15.75'
  },
  {
    address: '0x4567890123456789012345678901234567890123',
    name: 'CrossChain Token',
    symbol: 'CCT',
    chainId: avalancheFuji.id,
    price: '0.85',
    supplyApy: 5.8,
    borrowApy: 8.1,
    totalSupplied: '125,300.00',
    totalBorrowed: '89,150.00',
    availableToSupply: '50,000.00',
    availableToBorrow: '36,150.00',
    utilizationRate: 71.2,
    maxLtv: 70,
    liquidationThreshold: 75,
    liquidationPenalty: 8,
    borrowCap: '200,000',
    color: 'bg-purple-500',
    walletBalance: '5,000.00'
  }
];

// Mock user balances
export const getUserBalances = async (address, chainId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const balances = {};
  const chainTokens = mockTokens.filter(token => token.chainId === chainId);
  
  chainTokens.forEach(token => {
    balances[token.address] = token.walletBalance;
  });
  
  return balances;
};

// Mock token details
export const getTokenDetails = async (tokenAddress) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const token = mockTokens.find(t => t.address === tokenAddress);
  if (!token) {
    throw new Error('Token not found');
  }
  
  return token;
};

// Mock user token position
export const getUserTokenPosition = async (address, tokenAddress) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const token = mockTokens.find(t => t.address === tokenAddress);
  if (!token) {
    return null;
  }
  
  // Mock user position data
  return {
    walletBalance: token.walletBalance,
    supplied: '0.00',
    borrowed: '0.00'
  };
};

// Mock user portfolio
export const getUserPortfolio = async (address) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock portfolio data
  return {
    totalSupplied: '5,250.00',
    totalBorrowed: '2,100.00',
    estimatedEarnings: '125.50',
    borrowUtilization: 40,
    healthFactor: 2.5,
    supplies: [
      {
        symbol: 'ETH',
        amount: '2.14',
        valueUSD: '5,243.00',
        apy: 3.2,
        chain: 'Sepolia',
        color: 'bg-blue-500'
      }
    ],
    borrows: [
      {
        symbol: 'CCT',
        amount: '2,470.59',
        valueUSD: '2,100.00',
        apy: 8.1,
        chain: 'Avalanche',
        color: 'bg-purple-500'
      }
    ]
  };
};