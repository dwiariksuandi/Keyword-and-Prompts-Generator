import React from 'react';
import { motion } from 'motion/react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingIndicator({ size = 'md', text }: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} rounded-full border-2 border-slate-800 border-t-cyan-500 futuristic-glow`}
      />
      {text && (
        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
