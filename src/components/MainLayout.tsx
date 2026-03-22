import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Navbar } from './Navbar';
import { Tab } from '../types';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  setSelectedPromptCategoryId: (id: string | null) => void;
  errorModal: { show: boolean; title: string; message: string };
  setErrorModal: (modal: { show: boolean; title: string; message: string }) => void;
  toast: { show: boolean; message: string };
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, activeTab, setActiveTab, setSelectedPromptCategoryId, 
  errorModal, setErrorModal, toast 
}) => {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-cyan-500/30 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-cyan-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[25%] h-[25%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} setSelectedPromptCategoryId={setSelectedPromptCategoryId} />

      <main className="relative z-10 pb-20">
        {children}
      </main>

      <AnimatePresence>
        {errorModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setErrorModal({ ...errorModal, show: false })}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-panel border border-red-500/30 rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">{errorModal.title}</h3>
                </div>
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 mb-8">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {errorModal.message}
                  </p>
                </div>
                <button
                  onClick={() => setErrorModal({ ...errorModal, show: false })}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs"
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold shadow-2xl futuristic-glow"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] tracking-[0.2em] uppercase">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
