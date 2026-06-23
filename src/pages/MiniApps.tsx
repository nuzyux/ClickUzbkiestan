import React from 'react';
import { Download, LayoutGrid, ChevronLeft } from 'lucide-react';
import { Tab } from '../App';

export default function MiniAppsPage({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const handleExport = () => {
    window.location.href = '/api/export';
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#0a0a0a] relative">
      <div className="flex items-center justify-between px-4 py-4 bg-[#121212] border-b border-zinc-800">
        <button onClick={() => onNavigate('home')} className="text-white hover:bg-zinc-800 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <LayoutGrid size={20} className="text-[#007BFF]" /> Mini Apps
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col items-center justify-center gap-6">
        
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
             <Download size={40} className="text-[#007BFF]" />
          </div>
          <h2 className="text-2xl font-bold text-white">Export Project Source Code</h2>
          <p className="text-zinc-400 text-sm max-w-sm">
            Download the complete source code to host it on Vercel or deploy it to your own GitHub repository.
          </p>
        </div>

        <button 
          onClick={handleExport}
          className="bg-[#007BFF] hover:bg-blue-600 active:scale-95 transition-all text-white font-bold py-4 px-8 rounded-2xl shadow-lg flex items-center gap-3 w-full max-w-xs justify-center"
        >
          <Download size={20} />
          Export to .zip
        </button>

      </div>
    </div>
  );
}
