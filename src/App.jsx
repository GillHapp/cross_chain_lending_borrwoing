import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import AssetDetail from './pages/AssetDetail';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="asset/:tokenAddress" element={<AssetDetail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;