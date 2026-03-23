import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  RefreshCw, 
  BarChart3, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { CategoryResult } from '../types';

interface ResultsTableProps {
  results: CategoryResult[];
  sortBy: string;
  filterCompetition: string;
  onViewPrompts: (id: string) => void;
  onGeneratePrompts: (id: string) => void;
  onToggleStar: (id: string) => void;
  onPredictSales: (category: CategoryResult) => void;
  onAnalyzeCompetitor: (category: CategoryResult) => void;
  isAnalyzing: boolean;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  sortBy,
  filterCompetition,
  onViewPrompts,
  onGeneratePrompts,
  onToggleStar,
  onPredictSales,
  onAnalyzeCompetitor,
  isAnalyzing
}) => {
  const filteredResults = results
    .filter(r => filterCompetition === 'all' || r.competition.toLowerCase() === filterCompetition.toLowerCase())
    .sort((a, b) => {
      if (sortBy === 'opportunity') return b.opportunityScore - a.opportunityScore;
      if (sortBy === 'volume') return b.volumeNumber - a.volumeNumber;
      if (sortBy === 'trend') return b.trendPercent - a.trendPercent;
      return 0;
    });

  if (filteredResults.length === 0) {
    return (
      <div className="text-center py-32 bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10">
          <Search className="w-12 h-12 text-white/20" />
        </div>
        <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">No Intelligence Found</h3>
        <p className="text-white/40 max-w-md mx-auto font-medium leading-relaxed">
          The search parameters yielded zero results. Adjust your filters or initiate a new research cycle.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-6">
        <thead>
          <tr className="text-left text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            <th className="px-8 py-2">Niche & Strategy</th>
            <th className="px-8 py-2">Market Stats</th>
            <th className="px-8 py-2">Opportunity</th>
            <th className="px-8 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {filteredResults.map((result) => (
              <ResultRow 
                key={result.id} 
                result={result} 
                onViewPrompts={onViewPrompts}
                onGeneratePrompts={onGeneratePrompts}
                onToggleStar={onToggleStar}
                onPredictSales={onPredictSales}
                onAnalyzeCompetitor={onAnalyzeCompetitor}
                isAnalyzing={isAnalyzing}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

interface ResultRowProps {
  result: CategoryResult;
  onViewPrompts: (id: string) => void;
  onGeneratePrompts: (id: string) => void;
  onToggleStar: (id: string) => void;
  onPredictSales: (category: CategoryResult) => void;
  onAnalyzeCompetitor: (category: CategoryResult) => void;
  isAnalyzing: boolean;
}

const ResultRow: React.FC<ResultRowProps> = ({ 
  result, 
  onViewPrompts, 
  onGeneratePrompts, 
  onToggleStar, 
  onPredictSales, 
  onAnalyzeCompetitor,
  isAnalyzing 
}) => {
  return (
    <motion.tr 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-[#0A0A0A] hover:bg-[#0F0F0F] transition-all duration-500 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden"
    >
      <td className="px-8 py-10 align-top rounded-l-[2.5rem]">
        <div className="flex items-start gap-6">
          <button 
            onClick={() => onToggleStar(result.id)}
            className={`mt-1.5 transition-colors ${result.isStarred ? 'text-white' : 'text-white/10 hover:text-white/20'}`}
          >
            <Star className={`w-6 h-6 ${result.isStarred ? 'fill-current' : ''}`} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h3 className="text-xl font-black text-white group-hover:text-white transition-colors uppercase tracking-tight">
                {result.categoryName}
              </h3>
              {result.rejectionRisk && result.rejectionRisk.riskLevel !== 'Low' && (
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${
                  result.rejectionRisk.riskLevel === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`} title={result.rejectionRisk.reason}>
                  <AlertCircle className="w-2.5 h-2.5" />
                  Risk: {result.rejectionRisk.riskLevel}
                </div>
              )}
              {result.isBlueOcean && (
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-lg border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                >
                  <Sparkles className="w-3 h-3" />
                  Blue Ocean
                </motion.span>
              )}
              {result.isShared && (
                <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-black rounded-lg border border-white/10 uppercase tracking-widest">
                  Shared
                </span>
              )}
            </div>
            <p className="text-sm text-white/40 mb-6 line-clamp-2 italic leading-relaxed font-medium">
              "{result.creativeAdvice}"
            </p>
            <div className="flex flex-wrap gap-2">
              {result.mainKeywords.slice(0, 4).map((kw, i) => (
                <span key={`${result.id}-kw-${i}`} className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-black rounded-lg border border-white/10 uppercase tracking-tight">
                  {kw}
                </span>
              ))}
              {result.mainKeywords.length > 4 && (
                <span className="px-3 py-1 bg-white/5 text-white/20 text-[10px] font-black rounded-lg uppercase tracking-tight">
                  +{result.mainKeywords.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-8 py-10 align-top">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-12">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Volume</span>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-white/40 rounded-full" 
                    style={{ width: `${Math.min(100, (result.volumeNumber / 10000) * 100)}%` }} 
                  />
                </div>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{result.volumeLevel}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Trend</span>
              <div className={`flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest ${result.trendPercent >= 0 ? 'text-white' : 'text-white/40'}`}>
                {result.trendPercent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {Math.abs(result.trendPercent)}%
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-12">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Competition</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                result.competitionScore < 40 ? 'text-white' : 
                result.competitionScore < 70 ? 'text-white/60' : 'text-white/30'
              }`}>
                {result.competition}
              </span>
            </div>
            {result.groundingScore !== undefined ? (
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Grounding</span>
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{result.groundingScore}%</span>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Intent</span>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{result.commercialIntent || 'Commercial'}</span>
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-8 py-10 align-top">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                initial={{ strokeDashoffset: 226.2 }}
                animate={{ strokeDashoffset: 226.2 * (1 - result.opportunityScore / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={226.2}
                className={result.opportunityScore > 80 ? "text-emerald-500" : result.opportunityScore > 60 ? "text-white" : "text-white/40"}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute text-xl font-black tracking-tighter ${result.opportunityScore > 80 ? "text-emerald-500" : "text-white"}`}>
              {result.opportunityScore}
            </span>
          </div>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-3">Score</span>
        </div>
      </td>

      <td className="px-8 py-10 align-top text-right rounded-r-[2.5rem]">
        <div className="flex flex-col gap-3">
          {result.generatedPrompts.length > 0 ? (
            <button
              onClick={() => onViewPrompts(result.id)}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-all shadow-xl shadow-white/5 border border-white/10"
            >
              <Zap className="w-4 h-4 fill-current" />
              View {result.generatedPrompts.length} Prompts
            </button>
          ) : (
            <button
              onClick={() => onGeneratePrompts(result.id)}
              disabled={result.isGeneratingPrompts || isAnalyzing}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-white/5 border border-white/10"
            >
              {result.isGeneratingPrompts ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate Prompts
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAnalyzeCompetitor(result)}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors border border-white/5"
              title="Competitor Intel"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Intel
            </button>
            <button
              onClick={() => onPredictSales(result)}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors border border-white/5"
              title="Predict Sales"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Sales
            </button>
          </div>
        </div>
      </td>
    </motion.tr>
  );
};
