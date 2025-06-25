import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount, useChainId } from 'wagmi';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Shield,
  Info,
  DollarSign,
  Activity,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getTokenDetails, getUserTokenPosition } from '../utils/mockData';
import { SUPPORTED_CHAINS } from '../config/wagmi';

const AssetDetail = () => {
  const { tokenAddress } = useParams();
  const [token, setToken] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    const loadTokenDetails = async () => {
      setLoading(true);
      try {
        const tokenData = await getTokenDetails(tokenAddress);
        setToken(tokenData);

        if (isConnected && address) {
          const position = await getUserTokenPosition(address, tokenAddress);
          setUserPosition(position);
        }
      } catch (error) {
        console.error('Error loading token details:', error);
        toast.error('Failed to load token details');
      } finally {
        setLoading(false);
      }
    };

    if (tokenAddress) {
      loadTokenDetails();
    }
  }, [tokenAddress, address, isConnected]);

  const currentChain = SUPPORTED_CHAINS[chainId];

  const handleSupply = () => {
    toast.success(`Supply ${token?.symbol} - Coming soon!`);
  };

  const handleBorrow = () => {
    toast.success(`Borrow ${token?.symbol} - Coming soon!`);
  };

  const handleRedeem = () => {
    toast.success(`Redeem ${token?.symbol} - Coming soon!`);
  };

  const handleRepay = () => {
    toast.success(`Repay ${token?.symbol} - Coming soon!`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading asset details...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Asset Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The requested asset could not be found.</p>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/app/dashboard"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${token.color} flex items-center justify-center`}>
            <span className="text-lg font-bold text-white">
              {token.symbol.substring(0, 2)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {token.name} ({token.symbol})
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentChain?.name} • ${token.price}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Reserve Status & Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Reserve Status & Configuration</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Supplied</span>
                    <span className="font-medium text-gray-900 dark:text-white">{token.totalSupplied} {token.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Borrowed</span>
                    <span className="font-medium text-gray-900 dark:text-white">{token.totalBorrowed} {token.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Utilization Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">{token.utilizationRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Oracle Price</span>
                    <span className="font-medium text-gray-900 dark:text-white">${token.price}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Supply APY</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{token.supplyApy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Borrow APY</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{token.borrowApy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Max LTV</span>
                    <span className="font-medium text-gray-900 dark:text-white">{token.maxLtv}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Liquidation Threshold</span>
                    <span className="font-medium text-gray-900 dark:text-white">{token.liquidationThreshold}%</span>
                  </div>
                </div>
              </div>
              
              {/* Utilization Chart */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Utilization</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${token.utilizationRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span>0%</span>
                  <span>{token.utilizationRate}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Borrow Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Borrow Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <PieChart className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Borrow Cap</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{token.borrowCap} {token.symbol}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Activity className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{token.availableToBorrow} {token.symbol}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Liquidation Penalty</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{token.liquidationPenalty}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* APR Graph Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Interest Rate Model</h2>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Interest rate chart coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Info Sidebar */}
        <div className="space-y-6">
          {/* Wallet Balance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Info</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Wallet Balance</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {userPosition?.walletBalance || '0.00'} {token.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Supplied</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {userPosition?.supplied || '0.00'} {token.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Borrowed</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {userPosition?.borrowed || '0.00'} {token.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Available to Supply</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {token.availableToSupply} {token.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Available to Borrow</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {token.availableToBorrow} {token.symbol}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 space-y-3">
              <button
                onClick={handleSupply}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Supply {token.symbol}</span>
              </button>
              
              <button
                onClick={handleBorrow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <TrendingDown className="w-4 h-4" />
                <span>Borrow {token.symbol}</span>
              </button>
              
              {userPosition?.supplied && parseFloat(userPosition.supplied) > 0 && (
                <button
                  onClick={handleRedeem}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Redeem {token.symbol}
                </button>
              )}
              
              {userPosition?.borrowed && parseFloat(userPosition.borrowed) > 0 && (
                <button
                  onClick={handleRepay}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Repay {token.symbol}
                </button>
              )}
            </div>
          </div>

          {/* Risk Parameters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Risk Parameters</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Max LTV</span>
                <span className="font-medium text-gray-900 dark:text-white">{token.maxLtv}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Liquidation Threshold</span>
                <span className="font-medium text-gray-900 dark:text-white">{token.liquidationThreshold}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Liquidation Penalty</span>
                <span className="font-medium text-gray-900 dark:text-white">{token.liquidationPenalty}%</span>
              </div>
            </div>
          </div>

          {/* Cross-Chain Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Cross-Chain Collateral
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Assets supplied on this chain can be used as collateral for borrowing on other supported chains.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                >
                  Learn more
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;