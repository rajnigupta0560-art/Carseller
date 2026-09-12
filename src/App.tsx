import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { InventoryProvider } from './context/InventoryContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppFloatingButton } from './components/common/WhatsAppButton';
import { ToastContainer } from './components/common/Toast';
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { CarDetailPage } from './pages/CarDetailPage';
import { SellCarPage } from './pages/SellCarPage';
import { AdminPage } from './pages/AdminPage';

// Scroll to top on route change or scroll to hash target
function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, hash]);

  return null;
}

export function App() {
  return (
    <ThemeProvider>
      <InventoryProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white w-full max-w-full overflow-x-hidden transition-colors duration-200">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/inventory/:id" element={<CarDetailPage />} />
                <Route path="/sell-car" element={<SellCarPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </div>
            <Footer />
            <WhatsAppFloatingButton />
            <ToastContainer />
          </div>
        </Router>
      </InventoryProvider>
    </ThemeProvider>
  );
}

export default App;
