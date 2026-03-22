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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Neural <span className="text-white/40">Forecast</span></h2>
          </div>
          <p className="text-white/40 max-w-2xl leading-relaxed font-medium">
            AI-driven predictive analysis for the next 3-6 months. Grounded in global events and your historical sales performance.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px]"
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
              className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-white/20 transition-all duration-700"
            >
              <div className="p-8 sm:p-10">
                <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-white transition-colors">{item.niche}</h3>
                      {item.isHighPriority && (
                        <span className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Zap size={12} fill="currentColor" /> High Priority
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        <Calendar size={14} className="text-white/40" />
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{item.predictionDate}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        <Target size={14} className="text-white/40" />
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{item.confidence}% Confidence</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Growth Potential</p>
                      <div className="flex items-center gap-4">
                        <span className="text-5xl font-black text-white tracking-tighter">+{item.growthPotential}%</span>
                        <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center relative">
                          <div 
                            className="absolute inset-0 rounded-full border-2 border-white border-t-transparent -rotate-45"
                            style={{ clipPath: `conic-gradient(from 0deg, transparent 0%, transparent ${100 - item.growthPotential}%, white ${100 - item.growthPotential}%, white 100%)` }}
                          />
                          <TrendingUp size={20} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={14} className="text-white/60" /> Neural Reasoning
                    </h4>
                    <p className="text-sm text-white/60 leading-relaxed font-medium italic">
                      "{item.reasoning}"
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                      <Target size={14} className="text-white/60" /> Market Gap
                    </h4>
                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                      {item.marketGap}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                      <Zap size={14} className="text-white/60" /> Visual Aesthetic
                    </h4>
                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                      {item.visualStyle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {item.recommendedKeywords.map((kw, i) => (
                      <span key={`${item.id}-kw-${i}`} className="px-3 py-1.5 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5 group-hover:border-white/20 transition-all">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectNiche(item.niche)}
                    className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white text-white/60 hover:text-black rounded-xl border border-white/10 hover:border-white transition-all uppercase tracking-widest text-[10px] font-black"
                  >
                    Analyze Niche <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
          <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
            <Globe className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">No Forecast Data</h3>
          <p className="text-white/40 mb-8 font-medium max-w-md mx-auto">
            Click the button above to initiate a 6-month predictive analysis based on global market signals.
          </p>
        </div>
      )}
    </div>
  );
}
