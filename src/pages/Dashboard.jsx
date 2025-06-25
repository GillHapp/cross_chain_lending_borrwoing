import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useChainId } from 'wagmi';
import { TrendingUp, ExternalLink, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { SUPPORTED_CHAINS } from '../config/wagmi';
import { ethers } from 'ethers';
import { LENDING_BORROWING_ADDRESS, LENDING_BORROWING_ABI } from '../constants/lending_borrowing.js';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('supply');
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState(null);
  const [supplyApy, setSupplyApy] = useState(null);
  const [walletEthBalance, setWalletEthBalance] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplyAmount, setSupplyAmount] = useState('');
  const [isSupplying, setIsSupplying] = useState(false);

  const currentChain = SUPPORTED_CHAINS[chainId];

  useEffect(() => {
    const initContract = async () => {
      if (typeof window.ethereum !== 'undefined' && isConnected) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const instance = new ethers.Contract(LENDING_BORROWING_ADDRESS, LENDING_BORROWING_ABI, signer);
          setContract(instance);

          const balance = await provider.getBalance(LENDING_BORROWING_ADDRESS);
          setContractBalance(ethers.formatEther(balance));

          const apy = await instance.getAPY();
          setSupplyApy(Number(apy) / 100);

          const userBalance = await provider.getBalance(address);
          setWalletEthBalance(ethers.formatEther(userBalance));
        } catch (error) {
          console.error('Error initializing contract:', error);
          toast.error('Failed to connect to contract');
        }
      }
    };

    initContract();
  }, [isConnected, address]);

  const handleSupply = () => {
    setIsModalOpen(true);
  };

  const confirmSupply = async () => {
    if (!contract || !supplyAmount || isNaN(supplyAmount)) {
      toast.error('Invalid input');
      return;
    }

    try {
      setIsSupplying(true);

      const tx = await contract.depositETH({
        value: ethers.parseEther(supplyAmount),
      });

      await tx.wait();

      toast.success(`Successfully deposited ${supplyAmount} ETH`);

      // Refresh balances
      const provider = new ethers.BrowserProvider(window.ethereum);
      const newContractBalance = await provider.getBalance(LENDING_BORROWING_ADDRESS);
      const newWalletBalance = await provider.getBalance(address);
      setContractBalance(ethers.formatEther(newContractBalance));
      setWalletEthBalance(ethers.formatEther(newWalletBalance));

      setIsModalOpen(false);
      setSupplyAmount('');
    } catch (err) {
      console.error(err);
      toast.error('Transaction failed');
    } finally {
      setIsSupplying(false);
    }
  };



  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Connect your wallet to start lending and borrowing assets across chains
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Supply assets to earn interest or borrow against your collateral
        </p>
        {currentChain && (
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
            Connected to {currentChain.name}
          </div>
        )}
      </div>

      {/* Asset Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wallet Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Supply</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supply APY</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">ETH</div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Ethereum</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ETH • {currentChain?.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {walletEthBalance !== null ? `${Number(walletEthBalance).toFixed(4)} ETH` : 'Loading...'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {contractBalance !== null ? `${Number(contractBalance).toFixed(4)} ETH` : 'Loading...'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {supplyApy !== null ? `${supplyApy.toFixed(2)}%` : 'Loading...'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button
                    onClick={handleSupply}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30"
                  >
                    Supply
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Token Import Notice */}
      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 rounded p-4">
        <p className="text-sm">
          <strong>Note:</strong> If you don't see your <strong>aTOK</strong> token after supplying, please import it manually to MetaMask using this contract address:
        </p>
        <div className="mt-2 text-sm font-mono bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600">
          0xce8C76D90679d5b34DB1e9F50771cB39F79B36FC
        </div>
        <p className="mt-2 text-sm">
          You can do this in MetaMask by clicking “Import Tokens” and pasting the address above.
        </p>
      </div>


      {/* Supply Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Supply ETH</h2>
            <input
              type="number"
              placeholder="Enter amount in ETH"
              value={supplyAmount}
              onChange={(e) => setSupplyAmount(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
              step="0.0001"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmSupply}
                disabled={isSupplying}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isSupplying ? 'Supplying...' : 'Confirm Supply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Cross-Chain Lending</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Supply assets on one chain and use them as collateral to borrow on another.
              Your collateral is secured by Chainlink CCIP cross-chain infrastructure.
            </p>
            <a
              href="#"
              className="inline-flex items-center mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              Learn more about cross-chain lending
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
