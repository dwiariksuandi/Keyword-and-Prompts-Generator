import React, { useEffect, useState } from 'react';
import { getTrendForecast, refineTrendForecast } from '../services/trendService';
import { TrendingUp, Calendar, Zap, MessageSquare, AlertCircle, Globe, Info } from 'lucide-react';
import { AppSettings, TrendForecast } from '../types';
import RefineButton from './RefineButton';
import { motion, AnimatePresence } from 'motion/react';

export default function TrendForecastComponent({ niche, settings, onSelect }: { niche?: string, settings: AppSettings, onSelect?: (niche: string) => void }) {
  const [trends, setTrends] = useState<TrendForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [refining, setRefining] = useState<Record<string, boolean>>({});

  const fetchTrends = async () => {
    setLoading(true);
    const data = await getTrendForecast(niche, settings);
    setTrends(data);
    setLoading(false);
  };

  const handleRefine = async (trend: TrendForecast) => {
    const trendFeedback = feedback[trend.id] || '';
    if (!trendFeedback.trim()) return;
    setRefining(prev => ({ ...prev, [trend.id]: true }));
    try {
      const refined = await refineTrendForecast([trend], trendFeedback, settings);
      if (refined && refined.length > 0) {
        setTrends(prev => prev.map(t => t.id === trend.id ? refined[0] : t));
        setFeedback(prev => ({ ...prev, [trend.id]: '' }));
      }
    } catch (error) {
      console.error("Refinement failed:", error);
    } finally {
      setRefining(prev => ({ ...prev, [trend.id]: false }));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-white/5 border-t-white rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <TrendingUp size={20} className="text-white animate-pulse" />
        </div>
      </div>
      <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Analyzing 2026 Market Dynamics...</div>
    </div>
  );

  if (trends.length === 0) return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
      <button 
        onClick={fetchTrends}
        className="text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all font-black uppercase tracking-widest text-xs"
      >
        Mulai Analisis Tren
      </button>
    </div>
  );

  return (
    <div className="space-y-12 mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <TrendingUp className="text-white" size={24} />
            </div>
            Market <span className="text-white/40">Intelligence</span> 2026
          </h3>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-16">Neural Trend Forecasting Engine</p>
        </div>
        <div className="text-[10px] font-black text-white/40 bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3 uppercase tracking-widest">
          <Globe size={14} className="text-white/20" /> Live Market Data Stream
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {trends.map((trend, index) => (
            <motion.div 
              key={trend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 group hover:border-white/20 transition-all duration-500 relative overflow-hidden shadow-2xl"
            >
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{trend.niche}</h4>
                    {onSelect && (
                      <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(trend.niche)}
                        className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white bg-white/5 px-4 py-2 rounded-xl transition-all border border-white/5"
                      >
                        Deploy This Trend
                      </motion.button>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-black mb-2">Confidence</span>
                    <span className="text-3xl font-black text-white tracking-tighter">{trend.confidence}%</span>
                  </div>
                </div>

                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-[9px] text-white uppercase tracking-widest font-black mb-2">Trend Analysis</div>
                  <p className="text-sm text-white font-black mb-2">{trend.trend}</p>
                  <p className="text-[11px] text-white/40 leading-relaxed font-medium">{trend.forecast}</p>
                </div>

                <p className="text-sm text-white/60 leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                  {trend.reasoning}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-black block mb-3">Growth Potential</span>
                    <div className="flex items-center gap-3 text-white/80 text-xs font-bold">
                      <TrendingUp size={14} className="text-white/20" />
                      +{trend.growthPotential}%
                    </div>
                  </div>
                  <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-black block mb-3">Visual Style</span>
                    <div className="flex items-center gap-3 text-white/80 text-xs font-bold">
                      <Zap size={14} className="text-white/20" />
                      {trend.visualStyle}
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-black block mb-3">Market Gap</span>
                  <div className="flex items-center gap-3 text-white/80 text-xs font-medium italic">
                    <Info size={14} className="text-white/20 not-italic" />
                    {trend.marketGap}
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={feedback[trend.id] || ''} 
                      onChange={(e) => setFeedback(prev => ({ ...prev, [trend.id]: e.target.value }))} 
                      placeholder="Add specific constraints..."
                      className="flex-1 bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all font-medium"
                    />
                    <RefineButton 
                      onClick={() => handleRefine(trend)}
                      isRefining={refining[trend.id]}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-[9px] text-white/20 font-bold uppercase tracking-widest px-1">
                    <AlertCircle size={12} className="text-white/10" />
                    Neural refinement via real-time search verification
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
