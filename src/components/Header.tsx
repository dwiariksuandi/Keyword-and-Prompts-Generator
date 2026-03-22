import React from 'react';
import { Sparkles, Settings as SettingsIcon, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Tab, WORKFLOW_STEPS } from '../types';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 15 }}
            onClick={() => setActiveTab('top')}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl shadow-white/5 cursor-pointer"
          >
            <Sparkles className="w-6 h-6 text-black" />
          </motion.div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Microstock.AI</h1>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Neural Market Intelligence</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center bg-white/5 p-1 rounded-2xl border border-white/5">
          {WORKFLOW_STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveTab(step.id as Tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === step.id 
                  ? 'bg-white text-black shadow-xl' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {step.label.split('. ')[1]}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab("settings")}
            className={`p-2.5 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-white text-black shadow-xl shadow-white/5' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            <SettingsIcon className={`w-5 h-5`} />
          </button>
        </div>
      </div>
    </header>
  );
};
