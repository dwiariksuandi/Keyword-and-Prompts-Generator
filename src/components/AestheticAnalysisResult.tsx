import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, ChevronUp, ChevronDown, Palette, Zap, Activity, Layers, Box, Target } from 'lucide-react';
import { AestheticAnalysis } from '../types';

interface AestheticAnalysisResultProps {
  aestheticAnalysis: AestheticAnalysis;
  setAestheticAnalysis: React.Dispatch<React.SetStateAction<AestheticAnalysis | null>>;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

export const AestheticAnalysisResult: React.FC<AestheticAnalysisResultProps> = ({
  aestheticAnalysis,
  setAestheticAnalysis,
  setKeyword
}) => {
  const [isAestheticExpanded, setIsAestheticExpanded] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 20, height: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"
    >
      <div className="bg-black/40 backdrop-blur-xl border border-accent/20 rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.05)]">
        {/* Header / Toggle */}
        <div 
          className="p-6 sm:p-8 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsAestheticExpanded(!isAestheticExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Terminal size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">Aesthetic DNA Decoded</h3>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-[0.2em] mt-1">
                {aestheticAnalysis.detectedContentType || 'Analysis Complete'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); setAestheticAnalysis(null); }} 
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
              title="Dismiss Analysis"
            >
              <X size={18} />
            </button>
            <div className="w-px h-8 bg-white/10" />
            <div className="p-2 text-slate-400">
              {isAestheticExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        <AnimatePresence>
          {isAestheticExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {/* Artistic Style */}
                  <div className="space-y-3 lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <Palette size={14} className="text-accent" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Artistic Style</span>
                    </div>
                    <p className="text-sm text-slate-200 font-light leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                      {aestheticAnalysis.artisticStyle}
                    </p>
                  </div>

                  {/* Lighting */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-amber-400" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Lighting</span>
                    </div>
                    <p className="text-sm text-slate-200 font-light leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                      {aestheticAnalysis.lighting}
                    </p>
                  </div>

                  {/* Mood */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-rose-400" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Mood</span>
                    </div>
                    <p className="text-sm text-slate-200 font-light leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                      {aestheticAnalysis.mood}
                    </p>
                  </div>

                  {/* Composition */}
                  <div className="space-y-3 lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-emerald-400" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Composition</span>
                    </div>
                    <p className="text-sm text-slate-200 font-light leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                      {aestheticAnalysis.composition}
                    </p>
                  </div>

                  {/* Chromatic Profile */}
                  <div className="space-y-3 lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <Box size={14} className="text-indigo-400" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Chromatic Profile</span>
                    </div>
                    <div className="flex flex-wrap gap-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                      {aestheticAnalysis.colorPalette?.map((color, i) => (
                        <span key={i} className="px-3 py-1.5 bg-black/40 rounded-xl text-[10px] text-slate-300 border border-white/10 font-mono uppercase tracking-wider">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Neural Insights */}
                  <div className="space-y-3 lg:col-span-4">
                    <div className="flex items-center gap-2">
                      <Target size={14} className="text-accent" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Strategic Neural Insights (Click to Add)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {aestheticAnalysis.suggestions?.map((suggestion, i) => (
                        <motion.button 
                          key={i} 
                          whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,255,255,0.08)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setKeyword(prev => prev ? `${prev}, ${suggestion}` : suggestion)}
                          className="text-left p-4 rounded-2xl border border-white/10 hover:border-accent/40 transition-all flex items-start gap-3 group bg-white/5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0 shadow-[0_0_8px_rgba(0,255,255,0.5)] group-hover:scale-150 transition-transform" />
                          <span className="text-xs text-slate-300 group-hover:text-white font-light leading-relaxed">{suggestion}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
