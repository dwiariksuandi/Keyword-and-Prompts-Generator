import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  current: number;
  total: number;
  message: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, message }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/50">
        <motion.span
          key={message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white"
        >
          {message}
        </motion.span>
        <span className="text-white/80">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
        <motion.div
          className="h-full bg-gradient-to-r from-white/40 via-white to-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
      </div>
    </div>
  );
};
