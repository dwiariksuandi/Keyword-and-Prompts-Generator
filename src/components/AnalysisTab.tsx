import React from 'react';
import { BarChart3, Target, TrendingUp, Zap, Star, TrendingDown, Minus } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto px-6 pb-20 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Keyword Analysis</h1>
        <p className="text-slate-400">Deep dive into keyword metrics and opportunities</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-sm text-slate-400">Total Categories</span>
          </div>
          <p className="text-3xl font-bold text-white">{results.length}</p>
        </div>
        
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-slate-400">Total Keywords</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalKeywords}</p>
        </div>
        
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-slate-400">Avg Opportunity</span>
          </div>
          <p className="text-3xl font-bold text-white">{avgOpportunity}%</p>
        </div>
        
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-sm text-slate-400">High Opportunity</span>
          </div>
          <p className="text-3xl font-bold text-white">{highOpportunityCount}</p>
        </div>
      </div>
      
      {/* Category Analysis Cards */}
      <div className="space-y-4">
        {results.map((category) => (
          <div 
            key={category.id}
            className="bg-[#111827] rounded-xl border border-slate-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#00D8B6]">{category.categoryName}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCompetitionColor(category.competition)}`}>
                    {category.competition} Competition
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(category.trend)}
                    <span className={category.trend === "up" ? "text-emerald-400" : category.trend === "down" ? "text-rose-400" : "text-slate-400"}>
                      {category.trendPercent}%
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onToggleStar(category.id)}
                className={`p-2 rounded-lg transition-colors ${category.isStarred ? "text-yellow-400 bg-yellow-400/10" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <Star className={`w-5 h-5 ${category.isStarred ? "fill-current" : ""}`} />
              </button>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Search Volume</p>
                <p className="text-lg font-semibold text-white">{category.volumeNumber.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Difficulty Score</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${category.difficultyScore}%` }} />
                  </div>
                  <span className={`text-sm font-medium ${getScoreColor(100 - category.difficultyScore)}`}>{category.difficultyScore}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Competition Score</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${category.competitionScore}%` }} />
                  </div>
                  <span className={`text-sm font-medium ${getScoreColor(100 - category.competitionScore)}`}>{category.competitionScore}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Opportunity Score</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${category.opportunityScore}%` }} />
                  </div>
                  <span className={`text-sm font-medium ${getScoreColor(category.opportunityScore)}`}>{category.opportunityScore}</span>
                </div>
              </div>
            </div>
            
            {/* Keywords */}
            <div className="flex flex-wrap gap-2 mb-4">
              {category.mainKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Creative Advice */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h4 className="text-sm font-medium text-slate-300 mb-1">Creative Advice</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{category.creativeAdvice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
