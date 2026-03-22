import React from 'react';
import { Star, TrendingUp, TrendingDown, Minus, Sparkles, FileText, Zap, DollarSign, Users, Share2, Loader2 } from 'lucide-react';
import { CategoryResult } from '../types';
import { motion } from 'motion/react';

const OpportunityScore = ({ score }: { score: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 80) return "text-white";
    if (s >= 60) return "text-white/80";
    if (s >= 40) return "text-white/60";
    return "text-white/40";
  };

  const getGlow = (s: number) => {
    if (s >= 80) return "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]";
    return "";
  };

  return (
    <div className="relative flex items-center justify-center w-14 h-14 group">
      <div className="absolute inset-0 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <svg className="transform -rotate-90 w-14 h-14 relative z-10">
        <circle cx="28" cy="28" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="transparent" />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "circOut" }}
          cx="28" cy="28" r={radius} 
          stroke="currentColor" strokeWidth="2" fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className={`${getColor(score)} ${getGlow(score)}`}
        />
      </svg>
      <span className={`absolute text-[10px] font-black font-mono tracking-tighter relative z-20 ${getColor(score)}`}>{score}</span>
    </div>
  );
};

interface ResultRowProps {
  result: CategoryResult;
  onToggleStar: (id: string) => void;
  onViewPrompts: (id: string) => void;
  onPredictSales?: (id: string) => void;
  onShare?: (id: string) => void;
}

export const ResultRow: React.FC<ResultRowProps> = ({ result, onToggleStar, onViewPrompts, onPredictSales, onShare }) => {
  return (
    <motion.tr 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="group hover:bg-white/[0.02] transition-all duration-500 border-b border-white/[0.05]"
    >
      <td className="px-6 py-6 align-middle">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleStar(result.id)} 
            className={`transition-all duration-300 shrink-0 ${result.isStarred ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/10 hover:text-white/40'}`}
          >
            <Star size={18} fill={result.isStarred ? 'currentColor' : 'none'} />
          </motion.button>
          <span className="text-white font-black tracking-tighter uppercase text-lg group-hover:translate-x-1 transition-all duration-500 leading-tight">
            {result.categoryName}
          </span>
        </div>
      </td>
      <td className="px-6 py-6 align-middle">
        <div className="flex flex-wrap gap-2 max-w-[220px]">
          {result.mainKeywords.slice(0, 3).map((kw, i) => (
            <span key={`${result.id}-kw-${i}`} className="bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-white/20 transition-all duration-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
              {kw}
            </span>
          ))}
          {result.mainKeywords.length > 3 && (
            <span className="bg-white/10 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/20">
              +{result.mainKeywords.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-6 align-middle">
        <div className="flex flex-col gap-1">
          <span className="text-white font-black font-mono text-base tracking-tighter uppercase">{result.volumeLevel}</span>
          <span className="text-white/20 text-[10px] font-mono uppercase tracking-[0.2em] font-black">{result.volumeNumber.toLocaleString()}</span>
        </div>
      </td>
      <td className="px-6 py-6 align-middle">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border inline-block transition-all duration-500 ${
          result.competition === 'High' ? 'bg-white/5 text-white/40 border-white/10' :
          result.competition === 'Medium' ? 'bg-white/10 text-white/60 border-white/20' :
          'bg-white text-black border-white shadow-lg shadow-white/5'
        }`}>
          {result.competition}
        </span>
      </td>
      <td className="px-6 py-6 align-middle">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border transition-all duration-500 ${
            result.trend === 'down' ? 'bg-white/5 border-white/5' : 
            result.trend === 'up' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'
          }`}>
            {result.trend === 'down' ? (
              <TrendingDown size={18} className="text-white/40" />
            ) : result.trend === 'up' ? (
              <TrendingUp size={18} className="text-white" />
            ) : (
              <Minus size={18} className="text-white/20" />
            )}
          </div>
          <span className={`font-black font-mono text-sm tracking-tighter ${
            result.trend === 'down' ? 'text-white/40' : 
            result.trend === 'up' ? 'text-white' : 'text-white/20'
          }`}>{result.trendPercent}%</span>
        </div>
      </td>
      <td className="px-6 py-6 align-middle">
        <div className="flex justify-center">
          <OpportunityScore score={result.opportunityScore} />
        </div>
      </td>
      <td className="px-6 py-6 align-middle">
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => onPredictSales?.(result.id)}
            className="p-3 rounded-xl bg-white/5 text-white/40 border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all group/sales shadow-xl shadow-white/0 hover:shadow-white/5"
            title="AI Sales Predictor"
          >
            <DollarSign size={18} className="group-hover/sales:scale-110 transition-transform" />
          </button>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Predict</span>
        </div>
      </td>
      <td className="px-6 py-6 align-middle">
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => onShare?.(result.id)}
            className={`p-3 rounded-xl border transition-all group/share shadow-xl ${
              result.isShared 
                ? 'bg-white text-black border-white shadow-white/5' 
                : 'bg-white/5 text-white/40 border-white/10 hover:text-white shadow-white/0'
            }`}
            title="Collaborative Vault"
          >
            <Share2 size={18} className="group-hover/share:scale-110 transition-transform" />
          </button>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
            {result.isShared ? 'Shared' : 'Private'}
          </span>
        </div>
      </td>
      <td className="px-6 py-6 align-middle text-right">
        <motion.button 
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewPrompts(result.id)}
          className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border shadow-xl ${
            result.generatedPrompts.length > 0 
              ? 'bg-white/5 text-white border-white/10 hover:bg-white hover:text-black hover:border-white shadow-white/0 hover:shadow-white/5' 
              : 'bg-white text-black border-white shadow-white/10'
          }`}
        >
          {result.generatedPrompts.length > 0 ? (
            <span className="flex items-center gap-3">
              <FileText size={16} /> Assets
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <Zap size={16} /> Synthesize
            </span>
          )}
        </motion.button>
      </td>
    </motion.tr>
  );
};
