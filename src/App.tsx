import { useState } from 'react';
import { CircleDot, Wallet, ArrowDownUp, PieChart, LayoutGrid, Sparkles } from 'lucide-react';
import HomePage from './pages/Home';
import SettingsPage from './pages/Settings';
import AssistantPage from './pages/Assistant';
import AvatarPage from './pages/Avatar';

import MiniAppsPage from './pages/MiniApps';

export type Tab = 'home' | 'payment' | 'transfers' | 'reports' | 'miniapps' | 'settings' | 'assistant' | 'avatar';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage onNavigate={setActiveTab} />;
      case 'settings': return <SettingsPage onNavigate={setActiveTab} />;
      case 'assistant': return <AssistantPage onNavigate={setActiveTab} />;
      case 'avatar': return <AvatarPage onNavigate={setActiveTab} />;
      case 'miniapps': return <MiniAppsPage onNavigate={setActiveTab} />;
      default: return <div className="flex-1 flex items-center justify-center text-zinc-500">Section in development</div>;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-lg mx-auto bg-[#0a0a0a] text-white font-sans overflow-hidden relative">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative hide-scrollbar">
        {renderContent()}
      </div>

      {/* Floating Assistant Button */}
      {(activeTab === 'home' || activeTab === 'payment' || activeTab === 'transfers' || activeTab === 'reports' || activeTab === 'miniapps') && (
        <button 
          onClick={() => setActiveTab('assistant')}
          className="absolute bottom-24 right-4 w-12 h-12 bg-zinc-800/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg border border-zinc-700/50 hover:bg-zinc-700 transition"
        >
          <Sparkles className="text-white w-6 h-6" />
        </button>
      )}

      {/* Bottom Navigation */}
      {(activeTab === 'home' || activeTab === 'payment' || activeTab === 'transfers' || activeTab === 'reports' || activeTab === 'miniapps') && (
        <div className="flex items-center justify-between px-2 pb-6 pt-3 bg-[#121212] border-t border-zinc-800">
          <NavItem icon={<CircleDot size={22} className={activeTab === 'home' ? 'text-blue-500' : 'text-zinc-400'} />} label="Main" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<Wallet size={22} />} label="Payment" isActive={activeTab === 'payment'} onClick={() => setActiveTab('payment')} />
          <NavItem icon={<ArrowDownUp size={22} />} label="Transfers" isActive={activeTab === 'transfers'} onClick={() => setActiveTab('transfers')} />
          <NavItem icon={<PieChart size={22} />} label="Reports" isActive={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <NavItem icon={<LayoutGrid size={22} />} label="Mini Apps" isActive={activeTab === 'miniapps'} onClick={() => setActiveTab('miniapps')} badge="New" />
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick, badge }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, badge?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 gap-1.5 ${isActive ? 'text-blue-500' : 'text-zinc-400'} hover:text-blue-400 transition-colors relative`}
    >
      <div className="relative">
        {icon}
        {badge && (
          <div className="absolute -top-1 -right-3 bg-orange-600 text-white text-[8px] font-bold px-1 rounded border border-black">
            {badge}
          </div>
        )}
      </div>
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </button>
  );
}
