import React from 'react';
import { CategoryResult } from '../types';
import { motion } from 'motion/react';
import { Target, Zap } from 'lucide-react';

interface MarketMapProps {
  results: CategoryResult[];
  onSelect?: (id: string) => void;
}

export default function MarketMap({ results, onSelect }: MarketMapProps) {
  if (results.length === 0) return null;

  const width = 800;
  const height = 500;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 mt-12 overflow-hidden relative"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
            <Target size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">Visual Strategy Map</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Niche Opportunity Matrix</p>
          </div>
        </div>
      </div>

      <div className="relative flex justify-center">
        <svg 
          width="800" 
          height="500" 
          viewBox="0 0 800 500"
          className="max-w-full h-auto"
        >
          {results.map((d, i) => {
            const x = (d.competitionScore / 100) * width;
            const y = ((100 - d.opportunityScore) / 100) * height;
            const fill = d.opportunityScore > 70 && d.competitionScore < 40 ? "#10b981" : "#3b82f6";
            
            return (
              <g key={i} onClick={() => onSelect?.(d.id)} className="cursor-pointer">
                <circle cx={x} cy={y} r={8 + (d.volumeNumber / 2000)} fill={fill} stroke="#fff" strokeWidth={2} />
                <text x={x} y={y - 15} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  {d.categoryName.length > 15 ? d.categoryName.substring(0, 15) + "..." : d.categoryName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
        <Zap size={20} className="text-accent shrink-0" />
        <p className="text-sm text-slate-400 leading-relaxed font-light">
          <span className="text-white font-bold">Neural Insight:</span> Niche opportunity matrix.
        </p>
      </div>
    </motion.div>
  );
}
