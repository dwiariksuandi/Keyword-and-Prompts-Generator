import React from 'react';
import { BarChart3, Target, TrendingUp, Zap, Star, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { CategoryResult } from '../types';

interface AnalysisTabProps {
  results: CategoryResult[];
  onToggleStar: (id: string) => void;
}

export default function AnalysisTab({ results, onToggleStar }: AnalysisTabProps) {
  const totalKeywords = results.reduce((sum, c) => sum + c.mainKeywords.length, 0);
  const avgOpportunity = results.length > 0 
    ? Math.round(results.reduce((sum, c) => sum + c.opportunityScore, 0) / results.length)
    : 0;
  const highOpportunityCount = results.filter(c => c.opportunityScore >= 70).length;

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case "High": return "bg-rose-500/20 text-rose-400";
      case "Medium": return "bg-teal-500/20 text-teal-400";
      case "Low": return "bg-emerald-500/20 text-emerald-400";
      default: return "bg-slate-800 text-slate-400";
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
    if (score >= 60) return "text-teal-400";
    if (score >= 40) return "text-yellow-400";
    return "text-rose-400";
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-20 max-w-6xl mx-auto px-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#111827] flex items-center justify-center border border-slate-800">
          <BarChart3 className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No analysis data</h3>
        <p className="text-slate-400">
          Go to the TOP tab and analyze a keyword to see detailed metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20 space-y-8">
      <div className="text-center mt-10 mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Market Intelligence</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Deep dive into keyword metrics, competition levels, and creative opportunities discovered for your niche.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Categories', value: results.length, icon: BarChart3, color: 'teal' },
          { label: 'Total Keywords', value: totalKeywords, icon: Target, color: 'purple' },
          { label: 'Avg Opportunity', value: `${avgOpportunity}%`, icon: TrendingUp, color: 'emerald' },
          { label: 'High Potential', value: highOpportunityCount, icon: Zap, color: 'yellow' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#111827] rounded-2xl border border-slate-800 p-5 shadow-lg hover:border-slate-700 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
      
      {/* Category Analysis Cards */}
      <div className="grid grid-cols-1 gap-6">
        {results.map((category) => (
          <div 
            key={category.id}
            className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-xl hover:shadow-[#00D8B6]/5 transition-all"
          >
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{category.categoryName}</h3>
                    <button
                      onClick={() => onToggleStar(category.id)}
                      className={`p-2 rounded-xl transition-all ${category.isStarred ? "text-yellow-400 bg-yellow-400/10" : "text-slate-500 hover:text-white hover:bg-slate-800"}`}
                    >
                      <Star className={`w-5 h-5 ${category.isStarred ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCompetitionColor(category.competition)}`}>
                      {category.competition} Competition
                    </span>
                    <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                      {getTrendIcon(category.trend)}
                      <span className={`text-xs font-bold ${category.trend === "up" ? "text-emerald-400" : category.trend === "down" ? "text-rose-400" : "text-slate-400"}`}>
                        {category.trendPercent}% Trend
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Opportunity Score</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-4xl font-black ${getScoreColor(category.opportunityScore)}`}>{category.opportunityScore}</span>
                    <div className="w-12 h-12 rounded-full border-4 border-slate-800 relative flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeDasharray={125.6}
                          strokeDashoffset={125.6 - (125.6 * category.opportunityScore) / 100}
                          className={getScoreColor(category.opportunityScore)}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Search Volume</p>
                    <span className="text-lg font-bold text-white">{category.volumeNumber.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00D8B6]" style={{ width: `${Math.min(100, (category.volumeNumber / 50000) * 100)}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Difficulty</p>
                    <span className={`text-lg font-bold ${getScoreColor(100 - category.difficultyScore)}`}>{category.difficultyScore}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${category.difficultyScore}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Competition</p>
                    <span className={`text-lg font-bold ${getScoreColor(100 - category.competitionScore)}`}>{category.competitionScore}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${category.competitionScore}%` }} />
                  </div>
                </div>
              </div>
              
              {/* Keywords & Advice */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.mainKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-800/80 text-slate-200 text-xs px-4 py-2 rounded-xl border border-slate-700/50 hover:border-[#00D8B6]/30 transition-colors cursor-default"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00D8B6]/50" />
                  <h4 className="text-[10px] font-bold text-[#00D8B6] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles size={12} /> Creative Direction
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed italic">"{category.creativeAdvice}"</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
