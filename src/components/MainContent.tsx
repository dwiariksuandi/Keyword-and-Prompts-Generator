import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabRenderer } from './TabRenderer';

export function MainContent({ activeTab, logic }: { activeTab: string, logic: any }) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 pb-32 relative z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <TabRenderer activeTab={activeTab} logic={logic} />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
