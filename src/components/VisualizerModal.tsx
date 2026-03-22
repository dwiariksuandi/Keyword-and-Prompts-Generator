import React from 'react';
import { motion } from 'motion/react';
import { Eye, X, Loader2 } from 'lucide-react';

interface VisualizerModalProps {
  show: boolean;
  onClose: () => void;
  image: string | null;
  prompt: string;
}

export const VisualizerModal: React.FC<VisualizerModalProps> = ({ show, onClose, image, prompt }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0A0A0A] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-white/10"
      >
        <div className="p-8 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Visual Preview</h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">AI Visualization Engine</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full aspect-video bg-white/5 rounded-2xl overflow-hidden relative flex items-center justify-center border border-white/5">
            {image ? (
              <img src={image} alt="Visual Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-white/20 animate-spin" />
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest animate-pulse">Generating Visual...</p>
              </div>
            )}
          </div>

          <div className="mt-8 w-full bg-white/5 p-6 rounded-2xl border border-white/5">
            <p className="text-sm font-medium text-white/60 leading-relaxed italic">"{prompt}"</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
