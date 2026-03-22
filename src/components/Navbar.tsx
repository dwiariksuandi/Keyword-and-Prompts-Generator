import React from 'react';
import { Sparkles } from 'lucide-react';
import { Tab } from '../types';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  setSelectedPromptCategoryId: (id: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, setSelectedPromptCategoryId }) => {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-center p-6 pointer-events-none">
      <div className="flex items-center space-x-1 glass-panel rounded-full p-1.5 pointer-events-auto shadow-2xl">
        <div className="p-2 bg-white/5 rounded-full text-cyan-400 mr-2">
          <Sparkles size={14} />
        </div>
        <div className="flex items-center gap-1">
          {[
            { id: 'top', label: 'DASHBOARD' },
            { id: 'analysis', label: 'ANALYSIS' },
            { id: 'intelligence', label: 'INTEL' },
            { id: 'visual', label: 'TRENDS' },
            { id: 'pipeline', label: 'PIPELINE' },
            { id: 'results', label: 'HISTORY' },
            { id: 'prompt', label: 'PROMPTS' },
            { id: 'settings', label: 'SALES' },
            { id: 'guide', label: 'GUIDE' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as Tab);
                if (tab.id === 'prompt') setSelectedPromptCategoryId(null);
              }} 
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-white text-black futuristic-glow' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-white/10 mx-2" />
        <button 
          onClick={() => setActiveTab('donate')}
          className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] transition-all ${
            activeTab === 'donate' ? 'text-pink-400 bg-pink-400/10' : 'text-slate-500 hover:text-pink-400'
          }`}
        >
          SUPPORT
        </button>
      </div>
    </nav>
  );
};
