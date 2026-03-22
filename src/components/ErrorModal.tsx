import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorModalProps {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#0A0A0A] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10"
      >
        <div className="bg-rose-500 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-white" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">{title}</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8">
          <div className="bg-rose-500/10 rounded-2xl p-6 border border-rose-500/20">
            <p className="text-rose-200 font-medium leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>
          <div className="mt-8 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
