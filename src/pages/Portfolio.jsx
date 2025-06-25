import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, PieChart, Activity } from 'lucide-react';
import { getUserPortfolio } from '../utils/mockData';
import { SUPPORTED_CHAINS } from '../config/wagmi';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      try {
        if (isConnected && address) {
          const portfolioData = await getUserPortfolio(address);
          setPortfolio(portfolioData);
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [address, isConnected]);

  const currentChain = SUPPORTED_CHAINS[chainId];

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Connect your wallet to view your lending and borrowing positions
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const healthFactorColor = portfolio?.healthFactor >= 2 ? 'text-green-600 dark:text-green-400' :
                            portfolio?.healthFactor >= 1.5 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400';

  const healthFactorBg = portfolio?.healthFactor >= 2 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                         portfolio?.healthFactor >= 1.5 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                         'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Portfolio
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your lending and borrowing positions across all chains
        </p>
        {currentChain && (
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
            Connected to {currentChain.name}
          </div>
        )}
      </div>

      {!portfolio?.supplies?.length && !portfolio?.borrows?.length ? (
        <div className="text-center py-20">
          <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No positions yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start by supplying assets or borrowing to see your portfolio here
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Supplied</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${portfolio?.totalSupplied || '0.00'}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400 font-medium">+${portfolio?.estimatedEarnings || '0.00'}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">estimated earnings</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Borrowed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${portfolio?.totalBorrowed || '0.00'}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-blue-600 dark:text-blue-400 font-medium">{portfolio?.borrowUtilization || '0'}%</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">utilization</span>
              </div>
            </div>

            <div className={`rounded-lg shadow-sm border p-6 ${healthFactorBg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Health Factor</p>
                  <p className={`text-2xl font-bold ${healthFactorColor}`}>
                    {portfolio?.healthFactor ? portfolio.healthFactor.toFixed(2) : '∞'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  portfolio?.healthFactor >= 2 ? 'bg-green-100 dark:bg-green-900/20' :
                  portfolio?.healthFactor >= 1.5 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <Activity className={`w-6 h-6 ${healthFactorColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={`font-medium ${healthFactorColor}`}>
                  {portfolio?.healthFactor >= 2 ? 'Healthy' :
                   portfolio?.healthFactor >= 1.5 ? 'Moderate Risk' :
                   'High Risk'}
                </span>
              </div>
            </div>
          </div>

          {/* Health Factor Warning */}
          {portfolio?.healthFactor && portfolio.healthFactor < 1.5 && (
            <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    Liquidation Risk Warning
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Your health factor is below 1.5. Consider supplying more collateral or repaying some of your loans to avoid liquidation.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Your Supplies */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Supplies</h3>
              </div>
              <div className="p-6">
                {portfolio?.supplies?.length ? (
                  <div className="space-y-4">
                    {portfolio.supplies.map((supply, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full ${supply.color} flex items-center justify-center`}>
                            <span className="text-sm font-bold text-white">
                              {supply.symbol.substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{supply.amount} {supply.symbol}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">${supply.valueUSD}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">{supply.apy}% APY</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{supply.chain}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No supplied assets</p>
                )}
              </div>
            </div>

            {/* Your Borrows */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Borrows</h3>
              </div>
              <div className="p-6">
                {portfolio?.borrows?.length ? (
                  <div className="space-y-4">
                    {portfolio.borrows.map((borrow, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full ${borrow.color} flex items-center justify-center`}>
                            <span className="text-sm font-bold text-white">
                              {borrow.symbol.substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{borrow.amount} {borrow.symbol}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">${borrow.valueUSD}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-red-600 dark:text-red-400">{borrow.apy}% APY</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{borrow.chain}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No borrowed assets</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Portfolio;