import React, { useState } from 'react';
import { 
  TrendingUp, 
  Zap, 
  BrainCircuit, 
  Globe, 
  Database, 
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  RefreshCw,
  Star,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { CategoryResult } from '../types';
import { motion } from 'motion/react';
import { ResultsTable } from './ResultsTable';

interface AnalysisTabProps {
  results: CategoryResult[];
  sortBy: string;
  setSortBy: (val: string) => void;
  filterCompetition: string;
  setFilterCompetition: (val: string) => void;
  onViewPrompts: (id: string) => void;
  onGeneratePrompts: (id: string) => void;
  onGenerateAllPrompts: () => void;
  isAnalyzing: boolean;
  onToggleStar: (id: string) => void;
  onPredictSales: (category: CategoryResult) => void;
  onAnalyzeCompetitor: (category: CategoryResult) => void;
  onGenerateMetadata: (id: string) => void;
}

export default function AnalysisTab({ 
  results, 
  sortBy, 
  setSortBy, 
  filterCompetition, 
  setFilterCompetition,
  onViewPrompts,
  onGeneratePrompts,
  onGenerateAllPrompts,
  isAnalyzing,
  onToggleStar,
  onPredictSales,
  onAnalyzeCompetitor,
  onGenerateMetadata
}: AnalysisTabProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const totalKeywords = results.reduce((sum, c) => sum + c.mainKeywords.length, 0);
  const avgOpportunity = results.length > 0 
    ? Math.round(results.reduce((sum, c) => sum + c.opportunityScore, 0) / results.length)
    : 0;
  const highOpportunityCount = results.filter(c => c.opportunityScore >= 70).length;

  if (results.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-32 max-w-6xl mx-auto px-6"
      >
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
          <BrainCircuit className="w-12 h-12 text-white/20" />
        </div>
        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Intelligence Offline</h3>
        <p className="text-white/40 max-w-md mx-auto font-medium leading-relaxed">
          The neural network requires data. Initialize analysis in the <span className="text-white font-black">RESEARCH</span> sector to unlock market insights.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            Market <span className="text-white/40">Intelligence</span>
          </h1>
          <p className="text-white/40 max-w-2xl font-bold text-lg uppercase tracking-tight">
            Synthesized data streams from global search trends and competitive landscapes.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/5 p-1 rounded-xl flex items-center border border-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onGenerateAllPrompts}
            disabled={isAnalyzing}
            className="flex items-center justify-center gap-3 bg-white text-black font-black px-8 py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5 uppercase tracking-widest text-[10px] border border-white/10"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <><Sparkles className="w-4 h-4" /> Execute Full Insight</>
            )}
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Neural Sectors', value: results.length, icon: Globe },
          { label: 'Data Points', value: totalKeywords, icon: Database },
          { label: 'Avg Potential', value: `${avgOpportunity}%`, icon: TrendingUp },
          { label: 'Prime Targets', value: highOpportunityCount, icon: Zap }
        ].map((stat) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: results.indexOf(results.find(r => r.categoryName === stat.label) || results[0]) * 0.1 }}
            className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
            <p className="text-5xl font-black text-white tracking-tighter leading-none">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-[#0A0A0A] p-6 px-8 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Sort By:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-white/30 transition-all"
            >
              <option value="opportunity">Opportunity Score</option>
              <option value="volume">Search Volume</option>
              <option value="trend">Trend Momentum</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Competition:</span>
            <select 
              value={filterCompetition}
              onChange={(e) => setFilterCompetition(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-white/30 transition-all"
            >
              <option value="all">All Levels</option>
              <option value="low">Low Only</option>
              <option value="medium">Medium Only</option>
              <option value="high">High Only</option>
            </select>
          </div>
        </div>
        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
          Showing {results.length} results
        </div>
      </div>
      
      {/* Results List */}
      <div className="pb-20">
        {viewMode === 'table' ? (
          <ResultsTable 
            results={results}
            sortBy={sortBy}
            filterCompetition={filterCompetition}
            onViewPrompts={onViewPrompts}
            onGeneratePrompts={onGeneratePrompts}
            onToggleStar={onToggleStar}
            onPredictSales={onPredictSales}
            onAnalyzeCompetitor={onAnalyzeCompetitor}
            onGenerateMetadata={onGenerateMetadata}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {results.map((result) => (
              <ResultCard 
                key={result.id} 
                result={result} 
                onViewPrompts={onViewPrompts}
                onGeneratePrompts={onGeneratePrompts}
                onToggleStar={onToggleStar}
                onAnalyzeCompetitor={onAnalyzeCompetitor}
                onPredictSales={onPredictSales}
                onGenerateMetadata={onGenerateMetadata}
                isAnalyzing={isAnalyzing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ResultCardProps {
  result: CategoryResult;
  onViewPrompts: (id: string) => void;
  onGeneratePrompts: (id: string) => void;
  onToggleStar: (id: string) => void;
  onAnalyzeCompetitor: (category: CategoryResult) => void;
  onPredictSales: (id: string) => void;
  onGenerateMetadata: (id: string) => void;
  isAnalyzing: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  onViewPrompts, 
  onGeneratePrompts, 
  onToggleStar, 
  onAnalyzeCompetitor,
  onPredictSales,
  onGenerateMetadata,
  isAnalyzing 
}) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-white/20 transition-all flex flex-col"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-white group-hover:text-white transition-colors uppercase tracking-tight">
              {result.categoryName}
            </h3>
            <button 
              onClick={() => onToggleStar(result.id)}
              className={`transition-colors ${result.isStarred ? 'text-white' : 'text-white/10 hover:text-white/20'}`}
            >
              <Star className={`w-5 h-5 ${result.isStarred ? 'fill-current' : ''}`} />
            </button>
          </div>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{result.contentType}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-white leading-none tracking-tighter">{result.opportunityScore}</div>
          <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1.5">Opportunity</div>
        </div>
      </div>

      <p className="text-sm text-white/40 mb-10 line-clamp-3 italic leading-relaxed flex-grow font-medium">
        "{result.creativeAdvice}"
      </p>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
          <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1.5">Volume</div>
          <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">{result.volumeLevel}</div>
        </div>
        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
          <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1.5">Competition</div>
          <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">{result.competition}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => onAnalyzeCompetitor(result)}
          disabled={isAnalyzing}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors border border-white/5"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Intel
        </button>
        <button
          onClick={() => onPredictSales(result)}
          disabled={isAnalyzing}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors border border-white/5"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Sales
        </button>
      </div>

      <div className="flex items-center justify-between gap-6 mt-auto">
        <div className="flex flex-wrap gap-2 flex-1">
          {result.mainKeywords.slice(0, 3).map((kw, i) => (
            <span key={`${result.id}-kw-${i}`} className="px-3 py-1 bg-white/5 text-white/40 text-[9px] font-black rounded-lg border border-white/10 uppercase tracking-tight">
              {kw}
            </span>
          ))}
        </div>
        
        {result.generatedPrompts.length > 0 ? (
          <button
            onClick={() => onViewPrompts(result.id)}
            className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-all shadow-xl shadow-white/5 border border-white/10"
          >
            View Prompts
          </button>
        ) : (
          <button
            onClick={() => onGeneratePrompts(result.id)}
            disabled={result.isGeneratingPrompts || isAnalyzing}
            className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 disabled:opacity-50 transition-all shadow-xl shadow-white/5 border border-white/10"
          >
            {result.isGeneratingPrompts ? 'Generating...' : 'Generate'}
          </button>
        )}
      </div>
    </motion.div>
  );
};
