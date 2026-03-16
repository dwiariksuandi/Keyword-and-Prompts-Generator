import React from 'react';
import { BarChart3, Target, TrendingUp, Zap, Star, TrendingDown, Minus, Sparkles, BrainCircuit, Activity, Globe, Database } from 'lucide-react';
import { CategoryResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AnalysisTabProps {
  results: CategoryResult[];
  onToggleStar: (id: string) => void;
  onGenerateAll: () => void;
  isGeneratingAll: boolean;
}

export default function AnalysisTab({ results, onToggleStar, onGenerateAll, isGeneratingAll }: AnalysisTabProps) {
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

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "down": return <TrendingDown className="w-4 h-4 text-rose-400" />;
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
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mt-16"
      >
        <div className="text-center lg:text-left space-y-2">
          <h1 className="text-5xl font-bold text-white tracking-tighter font-display">
            Market <span className="text-accent">Intelligence</span>
          </h1>
          <p className="text-slate-400 max-w-2xl font-light text-lg">
            Synthesized data streams from global search trends and competitive neural landscapes.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGenerateAll}
          disabled={isGeneratingAll}
          className="flex items-center gap-4 bg-accent hover:bg-accent/90 text-slate-900 font-bold px-10 py-5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-accent/20 border border-accent/20 uppercase tracking-widest text-xs"
        >
          {isGeneratingAll ? (
            <><Activity className="w-5 h-5 animate-spin" /> Synchronizing...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Execute Full Insight</>
          )}
        </motion.button>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
            className="glass-panel p-8 group relative overflow-hidden hover:border-accent/30 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-all duration-700" />
            <div className="flex items-center gap-5 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-500">
                <stat.icon className="w-7 h-7 text-slate-400 group-hover:text-accent transition-colors" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{stat.label}</span>
            </div>
            <p className="text-5xl font-bold text-white font-mono tracking-tighter">{stat.value}</p>
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
              
              <div className="p-10 sm:p-12">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 mb-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <h3 className="text-4xl font-bold text-white tracking-tight font-display group-hover:text-accent transition-colors duration-500">{category.categoryName}</h3>
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onToggleStar(category.id)}
                        className={`p-3 rounded-2xl transition-all duration-500 ${category.isStarred ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 shadow-lg shadow-yellow-400/10" : "text-slate-600 hover:text-white hover:bg-white/5 border border-transparent"}`}
                      >
                        <Star className={`w-7 h-7 ${category.isStarred ? "fill-current" : ""}`} />
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap items-center gap-5">
                      <span className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border ${getCompetitionColor(category.competition)}`}>
                        {category.competition} Competition
                      </span>
                      <div className="flex items-center gap-3 bg-white/5 px-5 py-2 rounded-xl border border-white/10">
                        {getTrendIcon(category.trend)}
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${category.trend === "up" ? "text-emerald-400" : category.trend === "down" ? "text-rose-400" : "text-slate-400"}`}>
                          {category.trendPercent}% Trend
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center lg:items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Opportunity Index</span>
                    <div className="flex items-center gap-8">
                      <span className={`text-7xl font-black font-mono tracking-tighter ${getScoreColor(category.opportunityScore)}`}>{category.opportunityScore}</span>
                      <div className={`w-20 h-20 rounded-full border-4 border-white/5 relative flex items-center justify-center ${getScoreGlow(category.opportunityScore)}`}>
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={226.2}
                            strokeDashoffset={226.2 - (226.2 * category.opportunityScore) / 100}
                            className={`${getScoreColor(category.opportunityScore)} transition-all duration-1000`}
                          />
                        </svg>
                        <div className="absolute inset-0 bg-current opacity-5 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                  {[
                    { label: 'Search Volume', value: category.volumeNumber.toLocaleString(), progress: Math.min(100, (category.volumeNumber / 50000) * 100), color: 'accent' },
                    { label: 'Difficulty', value: `${category.difficultyScore}/100`, progress: category.difficultyScore, color: 'rose-500' },
                    { label: 'Competition', value: `${category.competitionScore}/100`, progress: category.competitionScore, color: 'orange-500' }
                  ].map((metric, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{metric.label}</p>
                        <span className={`text-2xl font-bold font-mono tracking-tight ${i === 0 ? 'text-white' : getScoreColor(100 - metric.progress)}`}>{metric.value}</span>
                      </div>
                      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                          className={`h-full rounded-full ${i === 0 ? 'bg-accent futuristic-glow' : i === 1 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]'}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Keywords & Advice */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Neural Vectors</h4>
                    <div className="flex flex-wrap gap-3">
                      {category.mainKeywords.map((keyword, idx) => (
                        <motion.span
                          key={idx}
                          whileHover={{ scale: 1.05, borderColor: 'var(--color-accent)', backgroundColor: 'rgba(0, 216, 182, 0.05)' }}
                          className="bg-white/5 text-slate-200 text-xs px-6 py-3 rounded-2xl border border-white/10 transition-all cursor-default font-light tracking-wide"
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-accent/5 rounded-3xl p-8 border border-accent/10 relative overflow-hidden group/advice">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-accent/20 group-hover/advice:bg-accent transition-all duration-500" />
                    <h4 className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                      <Sparkles size={16} /> Strategic Directive
                    </h4>
                    <p className="text-lg text-slate-300 leading-relaxed italic font-light">
                      "{category.creativeAdvice}"
                    </p>
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
