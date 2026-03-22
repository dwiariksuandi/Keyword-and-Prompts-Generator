import React from 'react';
import { motion } from 'motion/react';

interface ToastProps {
  show: boolean;
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ show, message }) => {
  if (!show) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 50, x: '-50%' }}
      className="fixed bottom-28 left-1/2 z-[110] px-6 py-3 bg-white text-black text-xs font-bold rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3"
    >
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      {message}
    </motion.div>
  );
};
