import React, { useEffect, useState } from 'react';
import { Trend, getTrendForecast, refineTrendForecast } from '../services/trendService';
import { TrendingUp, Calendar, Zap, MessageSquare, AlertCircle, Globe } from 'lucide-react';
import { AppSettings } from '../types';
import RefineButton from './RefineButton';
import { motion, AnimatePresence } from 'motion/react';

export default function TrendForecast({ niche, settings, onSelect }: { niche?: string, settings: AppSettings, onSelect?: (niche: string) => void }) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [refining, setRefining] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchTrends() {
      setLoading(true);
      const data = await getTrendForecast(niche, settings);
      setTrends(data);
      setLoading(false);
    }
    fetchTrends();
  }, [niche, settings]);

  const handleRefine = async (trend: Trend) => {
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
    <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-white/5 rounded-3xl border border-white/10">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <TrendingUp size={16} className="text-accent animate-pulse" />
        </div>
      </div>
      <div className="text-slate-400 text-sm font-medium animate-pulse">Menganalisis tren pasar 2026...</div>
    </div>
  );

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-xl">
            <TrendingUp className="text-accent" size={24} />
          </div>
          Market Trend Intelligence 2026
        </h3>
        <div className="text-xs text-slate-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <Globe size={12} /> Live Market Data
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {trends.map((trend, index) => (
            <motion.div 
              key={trend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-6 group hover:border-accent/40 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-accent/10 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg group-hover:text-accent transition-colors">{trend.niche}</h4>
                    {onSelect && (
                      <button 
                        onClick={() => onSelect(trend.niche)}
                        className="mt-2 text-[10px] font-bold uppercase tracking-widest text-accent hover:text-white bg-accent/10 hover:bg-accent px-3 py-1 rounded-full transition-all border border-accent/20"
                      >
                        Gunakan Tren Ini
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Forecast Score</span>
                    <span className="text-xl font-black text-accent">{trend.forecastScore}%</span>
                  </div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                  {trend.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Seasonality</span>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Calendar size={14} className="text-accent" />
                      {trend.seasonality}
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Recommended Action</span>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Zap size={14} className="text-accent" />
                      {trend.recommendedAction}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={feedback[trend.id] || ''} 
                      onChange={(e) => setFeedback(prev => ({ ...prev, [trend.id]: e.target.value }))} 
                      placeholder="Berikan feedback untuk refine..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent/50 transition-colors"
                    />
                    <RefineButton 
                      onClick={() => handleRefine(trend)}
                      isRefining={refining[trend.id]}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 italic px-1">
                    <AlertCircle size={10} />
                    Refining will use Google Search to re-verify this specific trend.
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
