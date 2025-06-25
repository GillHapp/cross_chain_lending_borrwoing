import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useChainId } from 'wagmi';
import { TrendingUp, ExternalLink, Info, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { SUPPORTED_CHAINS } from '../config/wagmi';
import { ethers } from 'ethers';
import { LENDING_BORROWING_ADDRESS, LENDING_BORROWING_ABI } from '../constants/lending_borrowing.js';
import { COMNINED_ABI } from '../constants/cross_chain_token.js';
import AssetDetails from './AssetDetail';
const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const START_BLOCK = "8616839";
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState(null);
  const [supplyApy, setSupplyApy] = useState(null);
  const [walletEthBalance, setWalletEthBalance] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplyAmount, setSupplyAmount] = useState('');
  const [isSupplying, setIsSupplying] = useState(false);

  const [isBorrowing, setIsBorrowing] = useState(false);

  const [provider, setProvider] = useState(null);
  const [yokBalance, setYokBalance] = useState(null);
  const [collateralAmount, setCollateralAmount] = useState('');
  const [isCollateralModalOpen, setIsCollateralModalOpen] = useState(false);

  const [healthCheckAddress, setHealthCheckAddress] = useState('');
  const [collateralHealth, setCollateralHealth] = useState(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [isLiquidating, setIsLiquidating] = useState(false);
  const [userHealthData, setUserHealthData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const RPC_URL = "https://sepolia.infura.io/v3/2de477c3b1b74816ae5475da6d289208";

  useEffect(() => {
    const load = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        try {
          const data = await fetchUserCollateralHealth(browserProvider, START_BLOCK);
          setUserData(data);
        } catch (error) {
          console.error("Failed to fetch user health data:", error);
        }
      }
    };

    load();
  }, []);


  async function fetchUserCollateralHealth(fromBlock, toBlock = "latest") {
    const providers = new ethers.JsonRpcApiProvider(RPC_URL);
    const lending = new ethers.Contract(
      LENDING_BORROWING_ADDRESS, LENDING_BORROWING_ABI, providers)
    const filter = lending.filters.MessageSent(); // event filter
    const events = await lending.queryFilter(filter, fromBlock, toBlock);

    // Extract unique borrower addresses
    const uniqueAddresses = [...new Set(events.map(e => e.args[2]))]; // e.args[2] = msg.sender

    // Query each user's health
    const userHealthData = await Promise.allSettled(
      uniqueAddresses.map(async (user) => {
        try {
          const [ethPrice, collateralUsd, loanUsd, ltv, status] = await lending.checkCollateralHealth(user);
          return {
            address: user,
            ethPrice: Number(ethPrice),
            collateralUsd: Number(collateralUsd),
            loanUsd: Number(loanUsd),
            ltv: Number(ltv) / 100, // Convert BPS to %
            status
          };
        } catch (err) {
          return null; // skip if no collateral or fails
        }
      })
    );

    return userHealthData
      .filter(res => res.status === "fulfilled" && res.value)
      .map(res => res.value);
  }

  const checkHealth = async () => {
    if (!healthCheckAddress || !ethers.isAddress(healthCheckAddress)) {
      toast.error('Please enter a valid address');
      return;
    }

    try {
      setIsHealthLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(LENDING_BORROWING_ADDRESS, LENDING_BORROWING_ABI, signer);

      const [
        ethPrice,
        collateralUsd,
        loanUsd,
        ltv,
        status
      ] = await contract.checkCollateralHealth(healthCheckAddress);

      setCollateralHealth({
        ethPrice,
        collateralUsd,
        loanUsd,
        ltv,
        status
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to check collateral health');
    } finally {
      setIsHealthLoading(false);
    }
  };

  const handleLiquidate = async () => {
    if (!collateralHealth || collateralHealth.ltv < 8000) {
      toast.error('This user is not eligible for liquidation');
      return;
    }

    try {
      setIsLiquidating(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(LENDING_BORROWING_ADDRESS, LENDING_BORROWING_ABI, signer);

      const YOK_TOKEN = "0x4e9097fa54f0a31f4c049ddb4092f0a7503f908e"; // update if needed

      const tx = await contract.liquidateBorrower(healthCheckAddress, YOK_TOKEN);
      await tx.wait();

      toast.success('Liquidation successful!');
      setCollateralHealth(null);
      setHealthCheckAddress('');
    } catch (error) {
      console.error(error);
      toast.error('Liquidation failed');
    } finally {
      setIsLiquidating(false);
    }
  };



  const handleConfirmCollateral = async () => {
    if (!collateralAmount || isNaN(collateralAmount) || Number(collateralAmount) <= 0) {
      toast.error("Please enter a valid ETH amount");
      return;
    }

    try {
      setIsBorrowing(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        LENDING_BORROWING_ADDRESS,
        LENDING_BORROWING_ABI,
        signer
      );

      const destinationChainSelector = "14767482510784806043"; // example: Sepolia selector
      const receiver = "0xD1ae674f6332Ae704125271238e192ffaFb0fbfB"; // change this to the correct receiver
      const message = "Loan Request";
      const tokenAddress = "0x4e9097fa54f0a31f4c049ddb4092f0a7503f908e"; // YOK token address

      const tx = await contract.sendMessageWithCollateralInETH(
        destinationChainSelector,
        receiver,
        message,
        tokenAddress,
        {
          value: ethers.parseEther(collateralAmount),
        }
      );

      await tx.wait();

      toast.success("Collateral deposited and YOK message sent!");
      setCollateralAmount('');
      setIsCollateralModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Collateral deposit failed");
    } finally {
      setIsBorrowing(false);
    }
  };



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

          const yokContract = new ethers.Contract(
            "0x4e9097fa54f0a31f4c049ddb4092f0a7503f908e",
            COMNINED_ABI,
            provider
          );

          const yokBal = await yokContract.balanceOf(address);
          setYokBalance(ethers.formatUnits(yokBal, 18));
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

  const handleRedeem = async () => {
    if (!contract) {
      toast.error('Contract not connected');
      return;
    }

    try {
      setIsSupplying(true); // reuse the same loading state

      const tx = await contract.redeemaToken();
      await tx.wait();

      toast.success('Redeemed successfully! ETH returned to your wallet');

      // Refresh balances
      const provider = new ethers.BrowserProvider(window.ethereum);
      const newContractBalance = await provider.getBalance(LENDING_BORROWING_ADDRESS);
      const newWalletBalance = await provider.getBalance(address);
      setContractBalance(ethers.formatEther(newContractBalance));
      setWalletEthBalance(ethers.formatEther(newWalletBalance));
    } catch (err) {
      console.error(err);
      toast.error('Redeem transaction failed');
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


      {
        isCollateralModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Deposit Collateral (ETH)</h2>
              <input
                type="number"
                placeholder="Enter amount in ETH"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                step="0.0001"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsCollateralModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCollateral}
                  disabled={isBorrowing}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isBorrowing ? 'Depositing...' : 'Confirm Deposit'}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Asset Table */}
      <div className="flex items-center space-x-3 mb-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Lending
        </h2>
      </div>
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
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-end">
                    <button
                      onClick={handleSupply}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30"
                    >
                      Supply
                    </button>
                    <button
                      onClick={handleRedeem}
                      disabled={isSupplying}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30 disabled:opacity-50"
                    >
                      {isSupplying ? 'Processing...' : 'Redeem'}
                    </button>
                  </div>
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

      {/* Borrowing Table */}
      <div className="flex items-center space-x-3 mt-12 mb-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Borrowing
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Collateral</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Borrowed YOK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Collateral</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Interest / Month</th>
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
                  {yokBalance !== null ? `${Number(yokBalance).toFixed(2)} YOK` : 'Loading...'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {contractBalance !== null ? `${Number(contractBalance).toFixed(4)} ETH` : 'Loading...'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      2.00%
                    </span>
                  </div>
                </td>


                <td className="px-6 py-4 text-right text-sm">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-end">
                    <button
                      onClick={() => setIsCollateralModalOpen(true)}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30"
                    >
                      Deposit Collateral
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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


      {/* Collateral Health Check & Liquidation Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Collateral Health & Liquidation</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          {/* Address Input & Check Button */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Enter borrower’s address"
              value={healthCheckAddress}
              onChange={(e) => setHealthCheckAddress(e.target.value)}
              className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={checkHealth}
              disabled={isHealthLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isHealthLoading ? 'Checking...' : 'Check Health'}
            </button>
          </div>

          {/* Display Health Results */}
          {collateralHealth && (
            <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded p-4 space-y-2">
              <div className="text-sm text-gray-800 dark:text-gray-100">
                <p><strong>ETH Price:</strong> ${Number(collateralHealth.ethPrice).toFixed(2)}</p>
                <p><strong>Collateral Value:</strong> ${(Number(collateralHealth.collateralUsd) / 1e18).toFixed(2)}</p>
                <p><strong>Loan Value YOK Token Worth:</strong> ${(Number(collateralHealth.loanUsd) / 1e18).toFixed(2)}</p>
                <p><strong>LTV:</strong> {(Number(collateralHealth.ltv) / 100).toFixed(2)}%</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`font-semibold ${Number(collateralHealth.ltv) >= 8000
                    ? 'text-red-600'
                    : Number(collateralHealth.ltv) >= 7000
                      ? 'text-yellow-500'
                      : 'text-green-600'
                    }`}>
                    {collateralHealth.status}
                  </span>
                </p>
              </div>

              {/* Show Liquidate Button if needed */}
              {Number(collateralHealth.ltv) >= 8000 && (
                <div className="pt-4">
                  <button
                    onClick={handleLiquidate}
                    disabled={isLiquidating}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    {isLiquidating ? 'Liquidating...' : '⚠ Liquidate Borrower'}
                  </button>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Liquidation allowed when LTV is 80% or higher. Liquidator repays loan in YOK and receives borrower's ETH minus a 5% fee.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* <AssetDetails /> */}

      {/* All Users' Collateral Health */}
      {/* <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">All Borrowers' Collateral Health</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading health data...</p>
          ) : userHealthData.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No data available.</p>
          ) : (
            <table className="min-w-full text-left table-auto">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr className="text-sm text-gray-600 dark:text-gray-300">
                  <th className="py-2">Address</th>
                  <th className="py-2">ETH Price</th>
                  <th className="py-2">Collateral ($)</th>
                  <th className="py-2">Loan ($)</th>
                  <th className="py-2">LTV (%)</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {userHealthData.map((user, i) => (
                  <tr key={i} className="text-sm border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                    <td className="py-2 break-all">{user.address}</td>
                    <td className="py-2">${user.ethPrice.toFixed(2)}</td>
                    <td className="py-2">${user.collateralUsd.toFixed(2)}</td>
                    <td className="py-2">${user.loanUsd.toFixed(2)}</td>
                    <td className="py-2">{user.ltv.toFixed(2)}%</td>
                    <td className="py-2">{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div> */}


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
