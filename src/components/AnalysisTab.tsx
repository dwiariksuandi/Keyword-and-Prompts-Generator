import React, { useState } from 'react';
import { BarChart3, Target, TrendingUp, Zap, Star, TrendingDown, Minus, Sparkles, BrainCircuit, Activity, Globe, Database, RefreshCw, MessageSquare } from 'lucide-react';
import { CategoryResult, AppSettings, ReferenceFile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import LoadingIndicator from './LoadingIndicator';
import { analyzeKeyword } from '../services/gemini';
import RefineButton from './RefineButton';

interface AnalysisTabProps {
  results: CategoryResult[];
  onToggleStar: (id: string) => void;
  onGenerateAll: () => void;
  isGeneratingAll: boolean;
  settings: AppSettings;
  setResults: React.Dispatch<React.SetStateAction<CategoryResult[]>>;
  onSelect?: (niche: string) => void;
}

export default function AnalysisTab({ results, onToggleStar, onGenerateAll, isGeneratingAll, settings, setResults, onSelect }: AnalysisTabProps) {
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [refining, setRefining] = useState<Record<string, boolean>>({});

  const handleRefine = async (category: CategoryResult) => {
    console.log("Refine button clicked for:", category.categoryName);
    setRefining(prev => ({ ...prev, [category.id]: true }));
    try {
      const refined = await analyzeKeyword(
        `${category.categoryName} (Refinement: ${feedback[category.id] || ''})`, 
        category.contentType,
        category.categoryName,
        settings
      );
      
      if (refined && Array.isArray(refined) && refined.length > 0) {
        const refinedCategory = refined[0];
        setResults(prev => prev.map(r => r.id === category.id ? { 
          ...refinedCategory, 
          id: category.id, 
          isStarred: r.isStarred, 
          isGeneratingPrompts: r.isGeneratingPrompts, 
          isUpgrading: r.isUpgrading,
          isGeneratingMetadata: r.isGeneratingMetadata,
          metadata: r.metadata,
          generatedPrompts: r.generatedPrompts,
          promptScores: r.promptScores
        } : r));
        setFeedback(prev => ({ ...prev, [category.id]: '' }));
      }
    } catch (error) {
      console.error("Refinement failed:", error);
    } finally {
      setRefining(prev => ({ ...prev, [category.id]: false }));
    }
  };
  const totalKeywords = results.reduce((sum, c) => sum + c.mainKeywords.length, 0);
  const avgOpportunity = results.length > 0 
    ? Math.round(results.reduce((sum, c) => sum + c.opportunityScore, 0) / results.length)
    : 0;
  const highOpportunityCount = results.filter(c => c.opportunityScore >= 70).length;

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case "High": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Medium": return "bg-accent/10 text-accent border-accent/20";
      case "Low": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-slate-800/50 text-slate-400 border-slate-700/50";
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable" | "explosive" | "cyclical") => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "down": return <TrendingDown className="w-4 h-4 text-rose-400" />;
      case "explosive": return <Zap className="w-4 h-4 text-amber-400" />;
      case "cyclical": return <RefreshCw className="w-4 h-4 text-blue-400" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-accent";
    if (score >= 40) return "text-yellow-400";
    return "text-rose-400";
  };

  const getScoreGlow = (score: number) => {
    if (score >= 80) return "shadow-[0_0_20px_rgba(52,211,153,0.2)]";
    if (score >= 60) return "shadow-[0_0_20px_rgba(0,216,182,0.2)]";
    if (score >= 40) return "shadow-[0_0_20px_rgba(250,204,21,0.2)]";
    return "shadow-[0_0_20px_rgba(251,113,133,0.2)]";
  };

  if (results.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-32 max-w-6xl mx-auto px-6"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="w-24 h-24 mx-auto mb-8 rounded-3xl glass-panel flex items-center justify-center futuristic-glow bg-accent/5"
        >
          <BrainCircuit className="w-12 h-12 text-accent/40" />
        </motion.div>
        <h3 className="text-3xl font-bold text-white mb-4 font-display tracking-tight">Intelligence <span className="text-accent">Offline</span></h3>
        <p className="text-slate-400 max-w-md mx-auto font-light leading-relaxed">
          The neural network requires data. Initialize analysis in the <span className="text-accent font-medium">TOP</span> sector to unlock market insights.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-32 space-y-16">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-10 mt-12 sm:mt-16"
      >
        <div className="text-center lg:text-left space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tighter font-display">
            Market <span className="text-accent">Intelligence</span>
          </h1>
          <p className="text-slate-400 max-w-2xl font-light text-base sm:text-lg">
            Synthesized data streams from global search trends and competitive neural landscapes.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGenerateAll}
          disabled={isGeneratingAll}
          className="flex items-center justify-center gap-4 bg-accent hover:bg-accent/90 text-slate-900 font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-accent/20 border border-accent/20 uppercase tracking-widest text-[10px] sm:text-xs"
        >
          {isGeneratingAll ? (
            <LoadingIndicator size="sm" text="Synchronizing..." />
          ) : (
            <><Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> Execute Full Insight</>
          )}
        </motion.button>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {[
          { label: 'Neural Sectors', value: results.length, icon: Globe, color: 'accent' },
          { label: 'Data Points', value: totalKeywords, icon: Database, color: 'purple' },
          { label: 'Avg Potential', value: `${avgOpportunity}%`, icon: TrendingUp, color: 'emerald' },
          { label: 'Prime Targets', value: highOpportunityCount, icon: Zap, color: 'yellow' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 sm:p-8 group relative overflow-hidden hover:border-accent/30 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-all duration-700" />
            <div className="flex items-center gap-4 sm:gap-5 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-500">
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 group-hover:text-accent transition-colors" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{stat.label}</span>
            </div>
            <p className="text-4xl sm:text-5xl font-bold text-white font-mono tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Category Analysis Cards */}
      <div className="grid grid-cols-1 gap-12">
        <AnimatePresence>
          {results.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel overflow-hidden group hover:border-accent/40 transition-all duration-700 relative"
            >
              {/* Decorative side bar */}
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-accent/0 via-accent/40 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="p-8 sm:p-12">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 sm:gap-12 mb-10 sm:mb-12">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display group-hover:text-accent transition-colors duration-500">{category.categoryName}</h3>
                      {onSelect && (
                        <button 
                          onClick={() => onSelect(category.categoryName)}
                          className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-white bg-accent/10 hover:bg-accent px-4 py-2 rounded-xl transition-all border border-accent/20"
                        >
                          Gunakan Ide Ini
                        </button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onToggleStar(category.id)}
                        className={`p-2 sm:p-3 rounded-2xl transition-all duration-500 ${category.isStarred ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 shadow-lg shadow-yellow-400/10" : "text-slate-600 hover:text-white hover:bg-white/5 border border-transparent"}`}
                      >
                        <Star className={`w-5 h-5 sm:w-7 sm:h-7 ${category.isStarred ? "fill-current" : ""}`} />
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                      <span className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] border ${getCompetitionColor(category.competition)}`}>
                        {category.competition} Competition
                      </span>
                      <div className="flex items-center gap-2 sm:gap-3 bg-white/5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl border border-white/10">
                        {getTrendIcon(category.trend)}
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] ${category.trend === "up" ? "text-emerald-400" : category.trend === "down" ? "text-rose-400" : category.trend === "explosive" ? "text-amber-400" : category.trend === "cyclical" ? "text-blue-400" : "text-slate-400"}`}>
                          {category.trendPercent}% Trend
                        </span>
                      </div>
                      {category.demandVariance && (
                        <span className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] border border-blue-500/20 bg-blue-500/10 text-blue-400">
                          {category.demandVariance} Demand
                        </span>
                      )}
                      {category.commercialIntent && (
                        <span className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] border border-purple-500/20 bg-purple-500/10 text-purple-400">
                          {category.commercialIntent} Intent
                        </span>
                      )}
                      {category.assetTypeSuitability && category.assetTypeSuitability.length > 0 && (
                        <span className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] border border-pink-500/20 bg-pink-500/10 text-pink-400">
                          {category.assetTypeSuitability.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] lg:mb-4">Opportunity Index</span>
                    <div className="flex items-center gap-4 sm:gap-8">
                      <span className={`text-5xl sm:text-7xl font-black font-mono tracking-tighter ${getScoreColor(category.opportunityScore)}`}>{category.opportunityScore}</span>
                      <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 border-white/5 relative flex items-center justify-center ${getScoreGlow(category.opportunityScore)}`}>
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={150.8}
                            strokeDashoffset={150.8 - (150.8 * category.opportunityScore) / 100}
                            className={`${getScoreColor(category.opportunityScore)} transition-all duration-1000 sm:hidden`}
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={226.2}
                            strokeDashoffset={226.2 - (226.2 * category.opportunityScore) / 100}
                            className={`${getScoreColor(category.opportunityScore)} transition-all duration-1000 hidden sm:block`}
                          />
                        </svg>
                        <div className="absolute inset-0 bg-current opacity-5 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-12 mb-10 sm:mb-12">
                  {[
                    { label: 'Search Volume', value: category.volumeNumber.toLocaleString(), progress: Math.min(100, (category.volumeNumber / 50000) * 100), color: 'accent' },
                    { label: 'Difficulty', value: `${category.difficultyScore}/100`, progress: category.difficultyScore, color: 'rose-500' },
                    { label: 'Competition', value: `${category.competitionScore}/100`, progress: category.competitionScore, color: 'orange-500' },
                    { label: 'Niche Score', value: `${category.nicheScore || 0}/100`, progress: category.nicheScore || 0, color: 'purple-500' },
                    { label: 'KEI Score', value: `${category.keiScore || 0}/100`, progress: category.keiScore || 0, color: 'emerald-500' }
                  ].map((metric, i) => (
                    <div key={i} className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-end">
                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{metric.label}</p>
                        <span className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${i === 0 ? 'text-white' : getScoreColor(100 - metric.progress)}`}>{metric.value}</span>
                      </div>
                      <div className="h-2 sm:h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                          className={`h-full rounded-full ${i === 0 ? 'bg-accent futuristic-glow' : i === 1 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : i === 2 ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : i === 3 ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Keywords & Advice */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                  <div className="space-y-4 sm:space-y-5">
                    <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Neural Vectors (Broad)</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {category.mainKeywords.map((keyword, idx) => (
                        <motion.span
                          key={idx}
                          whileHover={{ scale: 1.05, borderColor: 'var(--color-accent)', backgroundColor: 'rgba(0, 216, 182, 0.05)' }}
                          className="bg-white/5 text-slate-200 text-[11px] sm:text-xs px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-white/10 transition-all cursor-default font-light tracking-wide"
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>

                    {category.longTailKeywords && category.longTailKeywords.length > 0 && (
                      <div className="mt-6 space-y-4 sm:space-y-5">
                        <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Smart Long-Tail Keywords</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {category.longTailKeywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="bg-emerald-500/10 text-emerald-300 text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-emerald-500/20 font-medium tracking-wide"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {category.visualTrends && category.visualTrends.length > 0 && (
                      <div className="mt-6 space-y-4 sm:space-y-5">
                        <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">2026 Visual Trends</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {category.visualTrends.map((trend, idx) => (
                            <span
                              key={idx}
                              className="bg-purple-500/10 text-purple-300 text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-purple-500/20 font-medium tracking-wide"
                            >
                              {trend}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-accent/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-accent/10 relative overflow-hidden group/advice">
                      <div className="absolute top-0 left-0 w-1 sm:w-1.5 h-full bg-accent/20 group-hover/advice:bg-accent transition-all duration-500" />
                      <h4 className="text-[9px] sm:text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                        <Sparkles size={14} className="sm:w-4 sm:h-4" /> Strategic Directive
                      </h4>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed italic font-light mb-6">
                        "{category.creativeAdvice}"
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {category.commercialIntent && (
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Commercial Intent</span>
                            <div className="flex items-center gap-2 text-white text-xs">
                              <Target size={12} className="text-accent" />
                              {category.commercialIntent}
                            </div>
                          </div>
                        )}
                        {category.demandVariance && (
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Demand Variance</span>
                            <div className="flex items-center gap-2 text-white text-xs">
                              <Activity size={12} className="text-accent" />
                              {category.demandVariance}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {category.metadataStrategy && (
                      <div className="bg-blue-500/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-500/10 relative overflow-hidden">
                        <h4 className="text-[9px] sm:text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                          <Database size={14} className="sm:w-4 sm:h-4" /> Metadata Architecture 2026
                        </h4>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                          {category.metadataStrategy}
                        </p>
                      </div>
                    )}

                    {category.buyerPersona && (
                      <div className="bg-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
                        <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                          <Target size={14} className="sm:w-4 sm:h-4" /> Target Buyer Persona
                        </h4>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                          {category.buyerPersona}
                        </p>
                      </div>
                    )}

                    {category.groundingSources && category.groundingSources.length > 0 && (
                      <div className="bg-emerald-500/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-500/10 relative overflow-hidden">
                        <h4 className="text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                          <Globe size={14} className="sm:w-4 sm:h-4" /> Real-Time Sources
                        </h4>
                        <ul className="space-y-2">
                          {category.groundingSources.map((source, idx) => (
                            <li key={idx} className="text-sm sm:text-base text-slate-300 leading-relaxed font-light truncate">
                              <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors underline decoration-emerald-500/30 underline-offset-4">
                                {source.title || source.uri}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="bg-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 relative">
                      <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                        <MessageSquare size={14} className="sm:w-4 sm:h-4" /> Refine Analysis
                      </h4>
                      <div className="flex gap-2 relative z-50 pointer-events-auto">
                        <input 
                          type="text" 
                          value={feedback[category.id] || ''} 
                          onChange={(e) => setFeedback(prev => ({ ...prev, [category.id]: e.target.value }))} 
                          placeholder="Berikan feedback untuk refine..."
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white"
                        />
                        <RefineButton 
                          onClick={() => handleRefine(category)}
                          isRefining={refining[category.id]}
                        />
                      </div>
                    </div>
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
