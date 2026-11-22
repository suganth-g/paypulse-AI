import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Overview        from './pages/Overview';
import Transactions    from './pages/Transactions';
import SmartRouting    from './pages/SmartRouting';
import FraudMonitoring from './pages/FraudMonitoring';
import PaymentRecovery from './pages/PaymentRecovery';
import Analytics       from './pages/Analytics';
import DeveloperPortal from './pages/DeveloperPortal';
import Settings        from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"           element={<Overview />}        />
          <Route path="/transactions" element={<Transactions />}  />
          <Route path="/routing"    element={<SmartRouting />}    />
          <Route path="/fraud"      element={<FraudMonitoring />} />
          <Route path="/recovery"   element={<PaymentRecovery />} />
          <Route path="/analytics"  element={<Analytics />}       />
          <Route path="/developer"  element={<DeveloperPortal />} />
          <Route path="/settings"   element={<Settings />}        />
          {/* 404 fallback */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-4xl font-bold text-slate-200 mb-2">404</p>
              <p className="text-slate-500 text-sm">Page not found</p>
            </div>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
