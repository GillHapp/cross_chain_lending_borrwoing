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
              <span className="text-xl font-bold text-gray-900 dark:text-white">CrossChainLend</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? 
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : 
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                }
              </button>
              
              <Link
                to="/app"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>Enter App</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Cross-Chain
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> DeFi</span>
            <br />Lending Protocol
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto">
            Lend and borrow assets across multiple blockchains with the power of Chainlink's Cross-Chain Interoperability Protocol (CCIP)
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/app"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2"
            >
              <span>Start Lending</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
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
              CrossChainLend leverages Chainlink CCIP to enable seamless lending and borrowing across different blockchains
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Supply Assets</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Deposit your crypto assets to earn competitive interest rates. Your assets are secured by smart contracts and earn yield automatically.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Cross-Chain Collateral</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use your deposited assets as collateral to borrow on different chains. Chainlink CCIP handles the cross-chain communication securely.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-800">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Secure Borrowing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Borrow assets on any supported chain while your collateral remains secure. Automated liquidation protects the protocol and lenders.
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
              Experience seamless lending and borrowing across Ethereum and Avalanche networks
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lend ETH on Sepolia</h3>
                  <p className="opacity-90">Deposit ETH on Sepolia testnet and receive receipt tokens representing your deposit plus accrued interest.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cross-Chain Collateral</h3>
                  <p className="opacity-90">Your ETH deposit automatically becomes available as collateral for borrowing on Avalanche testnet.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Borrow on Avalanche</h3>
                  <p className="opacity-90">Borrow custom tokens on Avalanche while your ETH remains securely locked as collateral on Sepolia.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Repay & Redeem</h3>
                  <p className="opacity-90">Repay your loan on Avalanche to unlock your collateral, then redeem your ETH plus interest on Sepolia.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-center">Powered by Chainlink</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <span className="font-medium">CCIP Cross-Chain</span>
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <span className="font-medium">Price Feeds</span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <span className="font-medium">Automation</span>
                  <Shield className="w-5 h-5" />
                </div>
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
            CrossChainLend leverages multiple Chainlink services to deliver a secure, reliable, and truly decentralized cross-chain lending experience
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">CCIP</h3>
              <p className="text-gray-600 dark:text-gray-300">Cross-Chain Interoperability Protocol enables secure message and token transfers between chains</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Price Feeds</h3>
              <p className="text-gray-600 dark:text-gray-300">Decentralized price oracles provide accurate, tamper-proof asset pricing for liquidations</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Automation</h3>
              <p className="text-gray-600 dark:text-gray-300">Automated liquidations and interest rate updates ensure protocol health and efficiency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-8 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CrossChainLend</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>Documentation</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Discord</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CrossChainLend. Built for Chainlink Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;