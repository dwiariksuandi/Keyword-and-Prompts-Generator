import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TabRenderer } from './components/TabRenderer';
import { GlobalModals } from './components/GlobalModals';

// Hooks & Types
import { useAppLogic } from './hooks/useAppLogic';

export default function App() {
  const logic = useAppLogic();
  const {
    activeTab, setActiveTab,
    isVisualizing, setIsVisualizing,
    visualizedImage, visualizingPrompt,
    errorModal, setErrorModal,
    toast
  } = logic;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabRenderer activeTab={activeTab} logic={logic} />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />

      <GlobalModals 
        errorModal={errorModal}
        setErrorModal={setErrorModal}
        isVisualizing={isVisualizing}
        setIsVisualizing={setIsVisualizing}
        visualizedImage={visualizedImage}
        visualizingPrompt={visualizingPrompt}
        toast={toast}
      />
    </div>
  );
}
