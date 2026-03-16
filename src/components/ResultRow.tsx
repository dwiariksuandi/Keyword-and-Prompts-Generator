import React from 'react';
import { Star, TrendingUp, TrendingDown, Minus, Sparkles, FileText, Zap } from 'lucide-react';
import { CategoryResult } from '../types';
import { motion } from 'motion/react';

const OpportunityScore = ({ score }: { score: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-400";
    if (s >= 60) return "text-accent";
    if (s >= 40) return "text-yellow-400";
    return "text-rose-400";
  };

  const getGlow = (s: number) => {
    if (s >= 80) return "drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]";
    if (s >= 60) return "drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]";
    if (s >= 40) return "drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]";
    return "drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]";
  };

  return (
    <div className="relative flex items-center justify-center w-14 h-14 group">
      <div className="absolute inset-0 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <svg className="transform -rotate-90 w-14 h-14 relative z-10">
        <circle cx="28" cy="28" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="transparent" />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "circOut" }}
          cx="28" cy="28" r={radius} 
          stroke="currentColor" strokeWidth="3" fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className={`${getColor(score)} ${getGlow(score)}`}
        />
      </svg>
      <span className={`absolute text-[11px] font-bold font-mono tracking-tighter relative z-20 ${getColor(score)}`}>{score}</span>
    </div>
  );
};

interface ResultRowProps {
  result: CategoryResult;
  onToggleStar: (id: string) => void;
  onViewPrompts: (id: string) => void;
}

export const ResultRow: React.FC<ResultRowProps> = ({ result, onToggleStar, onViewPrompts }) => {
  return (
    <motion.tr 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="group hover:bg-white/[0.03] transition-all duration-500 border-b border-white/[0.05]"
    >
      <td className="px-8 py-6 align-middle">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.3, rotate: 15 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => onToggleStar(result.id)} 
            className={`transition-all duration-300 ${result.isStarred ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <Star size={20} fill={result.isStarred ? 'currentColor' : 'none'} />
          </motion.button>
          <span className="text-white font-bold tracking-tight font-display text-xl group-hover:text-accent transition-all duration-500">
            {result.categoryName}
          </span>
        </div>
      </td>
      <td className="px-8 py-6 align-middle">
        <div className="flex flex-wrap gap-2.5 max-w-[300px]">
          {result.mainKeywords.map((kw, i) => (
            <span key={i} className="bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl border border-white/5 group-hover:border-accent/30 transition-all duration-500">
              {kw}
            </span>
          ))}
        </div>
      </td>
      <td className="px-8 py-6 align-middle">
        <div className="flex flex-col gap-1">
          <span className="text-white font-bold font-mono text-lg tracking-tighter">{result.volumeLevel}</span>
          <span className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em] font-bold">{result.volumeNumber.toLocaleString()}</span>
        </div>
      </td>
      <td className="px-8 py-6 align-middle">
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-xl border ${
          result.competition === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
          result.competition === 'Medium' ? 'bg-accent/10 text-accent border-accent/20' :
          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {result.competition}
        </span>
      </td>
      <td className="px-8 py-6 align-middle">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            result.trend === 'down' ? 'bg-rose-500/5' : 
            result.trend === 'up' ? 'bg-emerald-500/5' : 'bg-white/5'
          }`}>
            {result.trend === 'down' ? (
              <TrendingDown size={18} className="text-rose-400" />
            ) : result.trend === 'up' ? (
              <TrendingUp size={18} className="text-emerald-400" />
            ) : (
              <Minus size={18} className="text-slate-500" />
            )}
          </div>
          <span className={`font-bold font-mono text-base tracking-tighter ${
            result.trend === 'down' ? 'text-rose-400' : 
            result.trend === 'up' ? 'text-emerald-400' : 'text-slate-500'
          }`}>{result.trendPercent}%</span>
        </div>
      </td>
      <td className="px-8 py-6 align-middle">
        <OpportunityScore score={result.opportunityScore} />
      </td>
      <td className="px-8 py-6 align-middle text-right">
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewPrompts(result.id)}
          className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 border ${
            result.generatedPrompts.length > 0 
              ? 'bg-white/5 text-white border-white/10 hover:border-accent/50 hover:bg-accent/5' 
              : 'bg-accent text-slate-900 border-accent/20 shadow-xl shadow-accent/20'
          }`}
        >
          {result.generatedPrompts.length > 0 ? (
            <span className="flex items-center gap-3"><FileText size={16} /> View Assets</span>
          ) : (
            <span className="flex items-center gap-3"><Zap size={16} /> Synthesize</span>
          )}
        </motion.button>
      </td>
    </motion.tr>
  );
};
