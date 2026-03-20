import React from 'react';
import { motion } from 'motion/react';
import { Calendar, TrendingUp, Zap, Target, Sparkles, ArrowRight, BrainCircuit, Globe, Loader2 } from 'lucide-react';
import { TrendForecast } from '../types';

interface TrendForecastProps {
  forecasts: TrendForecast[];
  onRefresh: () => void;
  isRefreshing: boolean;
  onSelectNiche: (niche: string) => void;
}

export default function TrendForecastTab({ forecasts, onRefresh, isRefreshing, onSelectNiche }: TrendForecastProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <BrainCircuit className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">Advanced <span className="text-purple-400">Trend Forecasting</span></h2>
          </div>
          <p className="text-slate-400 max-w-2xl leading-relaxed font-light">
            AI-driven predictive analysis for the next 3-6 months. Grounded in global events and your historical sales performance.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-3 px-8 py-4 bg-purple-500 text-white font-bold rounded-2xl hover:bg-purple-400 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
        >
          {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe size={18} />}
          {isRefreshing ? 'Synchronizing Neural Data...' : 'Generate 6-Month Forecast'}
        </motion.button>
      </div>

      {forecasts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {forecasts.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel border-white/5 overflow-hidden group hover:border-purple-500/30 transition-all duration-700"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500/0 via-purple-500/40 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-8 sm:p-10">
                <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-3xl font-bold text-white font-display tracking-tight group-hover:text-purple-400 transition-colors">{item.niche}</h3>
                      {item.isHighPriority && (
                        <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                          <Zap size={12} fill="currentColor" /> High Priority
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        <Calendar size={14} className="text-purple-400" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{item.predictionDate}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        <Target size={14} className="text-emerald-400" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{item.confidence}% Confidence</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Growth Potential</p>
                      <div className="flex items-center gap-4">
                        <span className="text-5xl font-mono font-bold text-white tracking-tighter">+{item.growthPotential}%</span>
                        <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 flex items-center justify-center relative">
                          <div 
                            className="absolute inset-0 rounded-full border-2 border-purple-500 border-t-transparent -rotate-45"
                            style={{ clipPath: `conic-gradient(from 0deg, transparent 0%, transparent ${100 - item.growthPotential}%, white ${100 - item.growthPotential}%, white 100%)` }}
                          />
                          <TrendingUp size={20} className="text-purple-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={14} className="text-purple-400" /> Neural Reasoning
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-light italic">
                      "{item.reasoning}"
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Target size={14} className="text-rose-400" /> Market Gap
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {item.marketGap}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Zap size={14} className="text-amber-400" /> Visual Aesthetic
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {item.visualStyle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {item.recommendedKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/5 group-hover:border-purple-500/20 transition-all">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectNiche(item.niche)}
                    className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-purple-500 text-slate-300 hover:text-white rounded-xl border border-white/10 hover:border-purple-500 transition-all uppercase tracking-widest text-[10px] font-bold"
                  >
                    Analyze Niche <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 glass-panel bg-white/5 border-dashed border-white/10">
          <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
            <Globe className="w-10 h-10 text-slate-700" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 font-display tracking-tight">No Forecast Data</h3>
          <p className="text-slate-400 mb-8 font-light max-w-md mx-auto">
            Click the button above to initiate a 6-month predictive analysis based on global market signals.
          </p>
        </div>
      )}
    </div>
  );
}
