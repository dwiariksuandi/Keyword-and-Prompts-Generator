import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Target, 
  Zap, 
  TrendingUp, 
  Search, 
  BarChart3, 
  Eye, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { CategoryResult, CompetitorAnalysis } from '../types';

interface IntelligenceTabProps {
  results: CategoryResult[];
  onAnalyzeCompetitor: (category: CategoryResult) => void;
  isAnalyzing: boolean;
  onSelectTrend: (niche: string) => void;
}

export default function IntelligenceTab({ results, onAnalyzeCompetitor, isAnalyzing, onSelectTrend }: IntelligenceTabProps) {
  const isStale = (timestamp: string) => {
    const lastUpdate = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;
    return (now - lastUpdate) > fourteenDays;
  };

  const onRefreshAll = () => {
    const staleResults = results.filter(r => r.competitorIntel && isStale(r.competitorIntel.timestamp));
    if (staleResults.length === 0) {
      alert('Semua data intelijen masih segar (kurang dari 14 hari).');
      return;
    }
    staleResults.forEach(r => onAnalyzeCompetitor(r));
  };

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-6 bg-white/5 rounded-full mb-6">
          <ShieldAlert className="w-12 h-12 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Belum Ada Data Intelijen</h3>
        <p className="text-slate-400 max-w-md">Lakukan analisis kata kunci terlebih dahulu untuk mulai memantau kompetitor di ceruk pasar Anda.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-32 pt-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-bold text-white font-display tracking-tight mb-2">Intelligence Command Center</h2>
          <p className="text-slate-400 font-light">Pantau, bedah, dan kalahkan kompetitor teratas di Adobe Stock.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onRefreshAll}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-bold text-slate-300 transition-all"
          >
            <TrendingUp size={14} />
            Refresh Stale Intel
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Live Market Monitoring</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {results.map((category) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-2xl">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{category.categoryName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Niche Target</span>
                    <div className="w-1 h-1 bg-slate-700 rounded-full" />
                    <span className="text-[10px] text-accent uppercase tracking-widest font-bold">{category.contentType}</span>
                  </div>
                </div>
              </div>
              
              {!category.competitorIntel ? (
                <button 
                  onClick={() => onAnalyzeCompetitor(category)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-slate-900 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Run Competitor Intel'}
                  <ChevronRight size={16} />
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Last Analysis</div>
                      {isStale(category.competitorIntel.timestamp) && (
                        <span className="px-2 py-0.5 bg-red-400/10 text-red-400 text-[8px] font-bold rounded-full border border-red-400/20 animate-pulse">STALE</span>
                      )}
                    </div>
                    <div className="text-xs text-white font-mono">{new Date(category.competitorIntel.timestamp).toLocaleDateString()}</div>
                  </div>
                  <button 
                    onClick={() => onAnalyzeCompetitor(category)}
                    disabled={isAnalyzing}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all"
                  >
                    <TrendingUp size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            {!category.competitorIntel ? (
              <div className="p-12 text-center">
                <p className="text-slate-500 italic">Klik "Run Competitor Intel" untuk membedah strategi kompetitor di ceruk ini.</p>
              </div>
            ) : (
              <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Aesthetic DNA & Counter Strategy */}
                <div className="space-y-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-accent">
                      <Eye size={18} />
                      <h4 className="text-xs font-bold uppercase tracking-widest">Portfolio DNA</h4>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-4">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Lighting</div>
                        <p className="text-sm text-white leading-relaxed">{category.competitorIntel.aestheticDNA.lighting}</p>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Composition</div>
                        <p className="text-sm text-white leading-relaxed">{category.competitorIntel.aestheticDNA.composition}</p>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Color Palette</div>
                        <div className="flex gap-2">
                          {category.competitorIntel.aestheticDNA.colorPalette.map((color, i) => (
                            <div 
                              key={i} 
                              className="w-8 h-8 rounded-lg border border-white/10 shadow-inner"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4 text-orange-400">
                      <Zap size={18} />
                      <h4 className="text-xs font-bold uppercase tracking-widest">Counter-Strategy</h4>
                    </div>
                    <div className="bg-orange-400/5 rounded-2xl p-6 border border-orange-400/10">
                      <div className="mb-4">
                        <div className="text-[10px] text-orange-400/60 uppercase tracking-widest font-bold mb-1">Dominant Style</div>
                        <p className="text-sm text-white font-medium">{category.competitorIntel.counterStrategy.dominantStyle}</p>
                      </div>
                      <div className="p-4 bg-orange-400/10 rounded-xl border border-orange-400/20">
                        <div className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-1">Recommended Pivot</div>
                        <p className="text-sm text-white font-bold mb-2">{category.competitorIntel.counterStrategy.recommendedPivot}</p>
                        <p className="text-[11px] text-orange-400/80 leading-relaxed">{category.competitorIntel.counterStrategy.pivotReason}</p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Column 2: Keyword Hijacking & Market Velocity */}
                <div className="space-y-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                      <Search size={18} />
                      <h4 className="text-xs font-bold uppercase tracking-widest">Keyword Hijacking</h4>
                    </div>
                    <div className="bg-blue-400/5 rounded-2xl p-6 border border-blue-400/10 space-y-6">
                      <div>
                        <div className="text-[10px] text-blue-400/60 uppercase tracking-widest font-bold mb-3">Winning Keywords</div>
                        <div className="flex flex-wrap gap-2">
                          {category.competitorIntel.keywordHijack.winningKeywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-lg text-[10px] font-bold border border-blue-400/20">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-blue-400/60 uppercase tracking-widest font-bold mb-3">Missed Gaps (High Potential)</div>
                        <div className="flex flex-wrap gap-2">
                          {category.competitorIntel.keywordHijack.missedGaps.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-lg text-[10px] font-bold border border-emerald-400/20">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4 text-purple-400">
                      <BarChart3 size={18} />
                      <h4 className="text-xs font-bold uppercase tracking-widest">Market Velocity</h4>
                    </div>
                    <div className="bg-purple-400/5 rounded-2xl p-6 border border-purple-400/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[10px] text-purple-400/60 uppercase tracking-widest font-bold">Competitor Status</div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          category.competitorIntel.marketVelocity.status === 'Aggressive' ? 'bg-red-400/20 text-red-400' :
                          category.competitorIntel.marketVelocity.status === 'Steady' ? 'bg-blue-400/20 text-blue-400' :
                          'bg-slate-400/20 text-slate-400'
                        }`}>
                          {category.competitorIntel.marketVelocity.status}
                        </span>
                      </div>
                      <div className="flex gap-3 p-4 bg-purple-400/10 rounded-xl border border-purple-400/20">
                        <AlertCircle className="w-5 h-5 text-purple-400 shrink-0" />
                        <div>
                          <div className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-1">Trend Alert</div>
                          <p className="text-xs text-white leading-relaxed">{category.competitorIntel.marketVelocity.trendAlert}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Column 3: Metadata Benchmarking */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-emerald-400">
                    <CheckCircle2 size={18} />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Metadata Benchmark</h4>
                  </div>
                  <div className="bg-emerald-400/5 rounded-[2rem] p-8 border border-emerald-400/10 h-full">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="text-center p-4 bg-black/20 rounded-2xl border border-white/5">
                        <div className="text-[2rem] font-bold text-white mb-1">{category.competitorIntel.metadataBenchmark.titleScore}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Title Score</div>
                      </div>
                      <div className="text-center p-4 bg-black/20 rounded-2xl border border-white/5">
                        <div className="text-[2rem] font-bold text-white mb-1">{category.competitorIntel.metadataBenchmark.descriptionScore}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Desc Score</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <Info size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Recommendations</span>
                      </div>
                      {category.competitorIntel.metadataBenchmark.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0" />
                          <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-emerald-400/10">
                      <button 
                        onClick={() => onSelectTrend(category.categoryName)}
                        className="w-full p-4 bg-emerald-400 hover:bg-emerald-300 text-slate-900 rounded-2xl text-center transition-all"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1">Takeover Strategy</div>
                        <div className="text-xs font-bold">Apply Intel to Prompts</div>
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
