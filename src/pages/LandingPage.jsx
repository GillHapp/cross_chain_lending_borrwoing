import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Github,
  MessageCircle,
  FileText,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">BridgeFi</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {theme === 'light' ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-400" />}
              </button>
              <Link to="/app" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2">
                <span>Enter App</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Cross-Chain
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> DeFi</span>
            <br />Lending Protocol
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto">
            Lend ETH on Sepolia, borrow custom USD-pegged tokens on Avalanche, and manage your cross-chain DeFi position with Chainlink CCIP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/app" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center space-x-2">
              <span>Start Lending</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button onClick={() => scrollToSection('how-it-works')} className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg">
              Learn More
            </button>
          </div>
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400 mx-auto cursor-pointer" onClick={() => scrollToSection('how-it-works')} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              BridgeFi uses Chainlink CCIP and decentralized oracles to enable trustless lending and borrowing across chains like Ethereum and Avalanche.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-blue-100 dark:bg-blue-900/20 border dark:border-blue-800">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">ETH Lending</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Lenders deposit ETH on Sepolia and receive a receipt token. Later, they can redeem their ETH by returning the token.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-purple-100 dark:bg-purple-900/20 border dark:border-purple-800">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Cross-Chain Borrowing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Borrowers lock ETH on Sepolia and mint custom USD-pegged tokens on Avalanche via Chainlink CCIP bridge.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 border dark:border-emerald-800">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Liquidation & Repay</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Check collateral health, liquidate risky positions, and repay borrowed tokens to reclaim your ETH collateral.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Chain Flow */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cross-Chain Flow</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              End-to-end flow of collateral, token minting, and redemption across Ethereum Sepolia and Avalanche Fuji.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              {[
                ['Connect Wallet', 'User connects to Sepolia testnet and approves access.'],
                ['Lend ETH', 'Deposit ETH and receive a receipt token used for redeeming later.'],
                ['Mint Custom Token', 'Use ETH as collateral and mint YOR (USD-pegged) token on Avalanche.'],
                ['Check Borrow Limit', 'Enter address to view available minting amount.'],
                ['Transfer Token', 'Bridge YOR token to user Avalanche address.'],
                ['Health Check & Liquidate', 'Monitor user health factor and liquidate if needed.'],
                ['Repay Loan', 'Deposit YOR token on Avalanche and trigger unlock on Sepolia.'],
                ['Redeem ETH', 'Withdraw ETH by burning your receipt token.']
              ].map(([title, text], i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="opacity-90">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-center">Powered by Chainlink</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <span className="font-medium">CCIP Messaging</span>
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <span className="font-medium">Price Feeds</span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                {/* <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <span className="font-medium">Automation</span>
                  <Shield className="w-5 h-5" />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chainlink Integration */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Built with Chainlink</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Secure, decentralized infrastructure using Chainlink’s Cross-Chain Interoperability Protocol, Price Feed.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* CCIP Card */}
            <div className="p-8 rounded-2xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-xl font-semibold dark:text-white mb-4">CCIP</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
                <li>
                  <strong>Cross-Chain Messaging:</strong> Enables reliable messaging between Sepolia and Avalanche Fuji via Chainlink CCIP.
                </li>
                <li>
                  <strong>Token Transfers:</strong> Handles secure cross-chain token bridging backed by LINK.
                </li>
                <li>
                  <strong>On-Chain Coordination:</strong> Synchronizes repayment and collateral status across chains.
                </li>
              </ul>
            </div>

            {/* Price Feeds Card */}
            <div className="p-8 rounded-2xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-xl font-semibold dark:text-white mb-4">Price Feeds</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
                <li>
                  <strong>Chainlink Oracles:</strong> Uses ETH/USD feeds to calculate loan health in real-time.
                </li>
                <li>
                  <strong>Risk Management:</strong> Prevents liquidations caused by stale or manipulated prices.
                </li>
                <li>
                  <strong>Collateral Checks:</strong> Ensures borrowing limits are dynamically enforced.
                </li>
              </ul>
            </div>

            {/* Cross-Chain Token Manager Card */}
            <div className="p-8 rounded-2xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-xl font-semibold dark:text-white mb-4">Cross-Chain Token Manager</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
                <li>
                  <strong>Chainlink CCTM:</strong> Simplifies cross-chain token deployment and lifecycle management.
                </li>
                <li>
                  <strong>Multi-Network Support:</strong> Tokens deployed on Sepolia and Avalanche Fuji with CCIP routing.
                </li>
                <li>
                  <strong>Integrated Frontend:</strong> Built with React + wagmi for seamless minting and transfers.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-8 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">BridgeFi</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="flex items-center space-x-2 hover:text-blue-400">
                <FileText className="w-5 h-5" />
                <span>Docs</span>
              </a>
              <a
                href="https://discord.com/users/harpreetsingh3059"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-blue-400"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Discord</span>
              </a>

              <a
                href="https://github.com/GillHapp/cross_chain_lending_borrwoing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-blue-400"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>

            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BridgeFi. Built with ❤️ for Chainlink.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
