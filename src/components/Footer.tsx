import React from 'react';
import { DollarSign } from 'lucide-react';
import { Tab } from '../types';

interface FooterProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, setActiveTab }) => {
  return (
    <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/5 backdrop-blur-2xl px-8 py-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-10">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveTab("top")}
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'top' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
          >
            Research
          </button>
          <button 
            onClick={() => setActiveTab("analysis")}
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analysis' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
          >
            Market
          </button>
          <button 
            onClick={() => setActiveTab("prompt")}
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'prompt' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
          >
            Vault
          </button>
        </div>
        
        <div className="h-4 w-px bg-white/10" />
        
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveTab("sales")}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sales' ? 'text-emerald-400' : 'text-white/40 hover:text-white/60'}`}
          >
            <DollarSign className="w-3 h-3" />
            Sales
          </button>
          <button 
            onClick={() => setActiveTab("wizard")}
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'wizard' ? 'text-amber-400' : 'text-white/40 hover:text-white/60'}`}
          >
            Wizard
          </button>
        </div>
      </div>
    </footer>
  );
};
