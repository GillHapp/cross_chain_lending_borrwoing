import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, PieChart, Activity } from 'lucide-react';
import { getUserPortfolio } from '../utils/mockData';
import { SUPPORTED_CHAINS } from '../config/wagmi';
import { ethers } from 'ethers';
import { LENDING_BORROWING_ADDRESS, LENDING_BORROWING_ABI } from '../constants/lending_borrowing';
import { CROSS_CHAIN_TOKEN_ADDRESS_AVALANCE_FUJI, COMNINED_ABI } from '../constants/cross_chain_token';
import { REPAY_ADDRESS, REPAY_ABI } from '../constants/repay';
import { use } from 'react';
import { toast } from 'react-hot-toast';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const [ethDeposited, setEthDeposited] = useState(null); // Step 1: Hook
  const [yokDeposited, setYokDeposited] = useState(null); // Step 1: Hook
  const [health, setHealth] = useState(null); // Step 1: Hook
  const [isClaiming, setIsClaiming] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [repay, setRepay] = useState(false); // Step 1: Hook




  const chainId = useChainId();

  const handleClaimCollateral = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet first");
      return;
    }

    try {
      setRepay(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const repayContract = new ethers.Contract(
        REPAY_ADDRESS,
        REPAY_ABI,
        signer
      );
      // Parameters
      const destinationChainSelector = "16015286601757825753"; // e.g. Ethereum Sepolia
      const token = "0xe1f9ff43f85d777866dc378412c6cd21fd23dcc6"; // YOK token on Avalanche Fuji
      const receiver = "0x6b3f9B8e960B50492bDC5D545d23456c33bD2421"; // Receiver address on dest chain
      const message = "repay borrow"; // Optional text

      // Call the smart contract function
      const tx = await repayContract.sendMessagePayLINK(
        destinationChainSelector,
        token,
        receiver,
        message
      );
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      toast.success("Collateral claim sent successfully via CCIP!");
      toast.success(
        // https://ccip.chain.link/#/side-drawer/msg/0x554cf82938d0f44df1e51c35f69f4596a794d6405ccea8cddc4655fd9ab36540
        <div>
          ✅ Repay Token and message dispatched! <br />
          🔗 <a href={`https://ccip.chain.link/#/side-drawer/msg/${tx.hash}`} target="_blank" rel="noopener noreferrer">View on CCIP Explorer</a> <br />
          📄 <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">View on Etherscan</a>
        </div>
      );
    } catch (err) {
      console.error("Claim collateral failed:", err);
      toast.error("Collateral claim failed. Check logs.");
    } finally {
      setRepay(false);
    }
  };



  const handleDepositYOK = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet first");
      return;
    }

    try {
      setIsDepositing(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const repayContract = new ethers.Contract(REPAY_ADDRESS, REPAY_ABI, signer);

      // Step 1: Get user's receipt
      const [tokenAddress, amount, claimed] = await repayContract.getUserReceipt(address);

      // if (claimed) {
      //   toast.error("Tokens already deposited.");
      //   return;
      // }

      if (amount <= 0n) {
        toast.error("No tokens to deposit.");
        return;
      }

      // Step 2: Approve the repayment contract to spend tokens
      const yokToken = new ethers.Contract(tokenAddress, COMNINED_ABI, signer);

      const allowance = await yokToken.allowance(address, REPAY_ADDRESS);

      if (allowance < amount) {
        const approveTx = await yokToken.approve(REPAY_ADDRESS, amount);
        await approveTx.wait();
        toast.success("Approval successful.");
      } else {
        console.log("Already approved.");
      }

      // Step 3: Deposit repayment
      const depositTx = await repayContract.depositRepaymentToken();
      await depositTx.wait();

      toast.success("YOK token deposited successfully!");
    } catch (err) {
      console.error("Deposit failed:", err);
      toast.error("Deposit failed. Check logs.");
    } finally {
      setIsDepositing(false);
    }
  };




  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      try {
        if (isConnected && address && chainId) {
          const portfolioData = await getUserPortfolio(address);
          setPortfolio(portfolioData);

          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(LENDING_BORROWING_ADDRESS, LENDING_BORROWING_ABI, provider);
          const contractEthBalance = await provider.getBalance(LENDING_BORROWING_ADDRESS);
          const contractEthBalanceFormatted = ethers.formatEther(contractEthBalance);
          setEthDeposited(contractEthBalanceFormatted);
          const userBalance = await contract.userCollateral(address);
          const ethDepositedWei = userBalance.ethAmount;
          const ethDepositedFormatted = ethers.formatEther(ethDepositedWei);
          // setEthDeposited(ethDepositedFormatted);

          const yokDepositedWei = userBalance.loanAmount;
          const yokDepositedFormatted = ethers.formatEther(yokDepositedWei);
          setYokDeposited(yokDepositedFormatted);

          const [
            currentEthPrice,
            currentCollateralUsdValue,
            loanValue,
            ltvBasisPoints,
            healthStatus
          ] = await contract.checkCollateralHealth(address);

          setHealth(healthStatus);
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [address, isConnected, chainId]);


  const currentChain = SUPPORTED_CHAINS[chainId];

  const handleClaim = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet first");
      return;
    }

    try {
      setIsClaiming(true); // Start loading
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const repayContract = new ethers.Contract(REPAY_ADDRESS, REPAY_ABI, signer);

      const tx = await repayContract.claimReceivedTokens(address);
      await tx.wait();

      toast.success("Tokens claimed successfully!");
    } catch (err) {
      console.error("Claim failed:", err);
      toast.error("Claim failed. Check eligibility or try again.");
    } finally {
      setIsClaiming(false); // Stop loading
    }
  };




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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{ethDeposited || '0.00'} ETH</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>

            </div>



            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Borrowed YOK token</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{yokDeposited || '0.00'} YOK</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

            </div>



            <div className={`rounded-lg shadow-sm border p-6 ${healthFactorBg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Health Factor</p>
                  <p className={`text-2xl font-bold ${healthFactorColor}`}>
                    {health}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${portfolio?.healthFactor >= 2 ? 'bg-green-100 dark:bg-green-900/20' :
                  portfolio?.healthFactor >= 1.5 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    'bg-red-100 dark:bg-red-900/20'
                  }`}>
                  <Activity className={`w-6 h-6 ${healthFactorColor}`} />
                </div>
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



          <div className="space-y-6 mt-8">

            {/* Chain Switch Notice */}
            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-300 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7"></path>
              </svg>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Please switch to the <span className="font-medium">Avalanche</span> network to continue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

              {/* Claim Rewards Card */}
              <div className="flex flex-col justify-between bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-6 shadow-sm">
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Claim YOK Rewards</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Rewards are available. Don’t miss your chance to claim your YOK tokens.</p>
                </div>
                <button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="mt-6 w-full px-4 py-2 text-sm font-semibold rounded bg-yellow-600 text-white hover:bg-yellow-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isClaiming ? 'Claiming...' : 'Claim YOK'}
                </button>

              </div>

              {/* Deposit YOK Card */}
              <div className="flex flex-col justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 shadow-sm">
                <div>
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">Deposit YOK Tokens</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">Deposit your YOK tokens back into the platform.</p>
                </div>
                <button
                  onClick={handleDepositYOK}
                  disabled={isDepositing}
                  className="mt-6 w-full px-4 py-2 text-sm font-semibold rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isDepositing ? 'Depositing...' : 'Deposit YOK'}
                </button>

              </div>

              {/* Claim Collateral Card */}
              <div className="flex flex-col justify-between bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6 shadow-sm">
                <div>
                  <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">Claim Collateral</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">You’re eligible to claim back your collateral. Take action now.</p>
                </div>
                <button
                  onClick={handleClaimCollateral}
                  disabled={isClaiming}
                  className={`mt-6 w-full px-4 py-2 text-sm font-semibold rounded ${isClaiming ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                    } text-white transition`}
                >
                  {repay ? "Claiming..." : "Claim Collateral"}
                </button>

              </div>

            </div>


          </div>

        </>
      )}
    </div>
  );
};

export default Portfolio;