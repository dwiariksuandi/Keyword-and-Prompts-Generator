import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Target, 
  Zap, 
  Search, 
  BarChart3, 
  Eye, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info,
  RefreshCw
} from 'lucide-react';
import { CategoryResult } from '../types';

interface IntelligenceTabProps {
  results: CategoryResult[];
  onAnalyzeCompetitor: (category: CategoryResult) => void;
  isAnalyzing: boolean;
  onSelectTrend: (niche: string) => void;
  isMonitoring: boolean;
  onToggleMonitor: () => void;
}

export default function IntelligenceTab({ 
  results, 
  onAnalyzeCompetitor, 
  isAnalyzing, 
  onSelectTrend,
  isMonitoring,
  onToggleMonitor
}: IntelligenceTabProps) {
  const isStale = (timestamp: string) => {
    const lastUpdate = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;
    return (now - lastUpdate) > fourteenDays;
  };

  const onRefreshAll = () => {
    const staleResults = results.filter(r => r.competitorIntel && r.competitorIntel.timestamp && isStale(r.competitorIntel.timestamp));
    if (staleResults.length === 0) {
      return;
    }
    staleResults.forEach(r => onAnalyzeCompetitor(r));
  };

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 mb-8">
          <ShieldAlert className="w-12 h-12 text-white/20" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">No Intelligence Data</h3>
        <p className="text-white/40 max-w-md font-medium leading-relaxed">Perform a keyword analysis first to start monitoring competitors in your niche.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-3">Neural Intelligence</h2>
          <p className="text-white/40 font-medium max-w-xl">Monitor, dissect, and outmaneuver top competitors with deep market synthesis.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleMonitor}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${
              isMonitoring 
                ? 'bg-white text-black border-white shadow-xl shadow-white/5' 
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-black animate-pulse' : 'bg-white/20'}`} />
            {isMonitoring ? 'Monitor Active' : 'Start Monitor'}
          </button>
          <button 
            onClick={onRefreshAll}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
            Refresh Intel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {results.map((category) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-white/5">
                  <Target className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{category.categoryName}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">Niche Target</span>
                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                    <span className="text-[10px] text-white/60 uppercase tracking-widest font-black">{category.contentType}</span>
                  </div>
                </div>
              </div>
              
              {!category.competitorIntel ? (
                <button 
                  onClick={() => onAnalyzeCompetitor(category)}
                  disabled={isAnalyzing}
                  className="flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl shadow-white/5"
                >
                  {isAnalyzing ? 'Processing...' : 'Run Intelligence'}
                  <ChevronRight size={16} />
                </button>
              ) : (
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <div className="text-[9px] text-white/30 uppercase tracking-widest font-black">Last Sync</div>
                      {category.competitorIntel.timestamp && isStale(category.competitorIntel.timestamp) && (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[8px] font-black rounded-full border border-rose-500/20 animate-pulse">STALE</span>
                      )}
                    </div>
                    <div className="text-xs text-white font-mono font-bold">{category.competitorIntel.timestamp ? new Date(category.competitorIntel.timestamp).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <button 
                    onClick={() => onAnalyzeCompetitor(category)}
                    disabled={isAnalyzing}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all border border-white/5"
                  >
                    <RefreshCw size={18} className={isAnalyzing ? 'animate-spin' : ''} />
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            {!category.competitorIntel ? (
              <div className="p-16 text-center">
                <p className="text-white/20 font-bold uppercase tracking-widest text-xs italic">Initialize intelligence protocol to dissect competitor strategy.</p>
              </div>
            ) : (
              <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Column 1: Aesthetic DNA & Counter Strategy */}
                <div className="space-y-10">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                        <Eye size={16} className="text-white/60" />
                      </div>
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Visual DNA</h4>
                    </div>
                    <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5 space-y-6">
                      {category.competitorIntel.aestheticDNA && (
                        <>
                          <div>
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-2">Lighting Protocol</div>
                            <p className="text-sm text-white/80 leading-relaxed font-medium">{category.competitorIntel.aestheticDNA.lighting}</p>
                          </div>
                          <div>
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-2">Compositional Logic</div>
                            <p className="text-sm text-white/80 leading-relaxed font-medium">{category.competitorIntel.aestheticDNA.composition}</p>
                          </div>
                          <div>
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-3">Chromatic Profile</div>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(category.competitorIntel.aestheticDNA.colorPalette) &&
                                category.competitorIntel.aestheticDNA.colorPalette.map((color, i) => (
                                  <div 
                                    key={`${category.id}-color-${i}`} 
                                    className="w-10 h-10 rounded-xl border border-white/10 shadow-2xl"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                        <Zap size={16} className="text-white" />
                      </div>
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Counter Protocol</h4>
                    </div>
                    <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5">
                      {category.competitorIntel.counterStrategy && (
                        <>
                          <div className="mb-6">
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-2">Dominant Aesthetic</div>
                            <p className="text-sm text-white font-bold">{category.competitorIntel.counterStrategy.dominantStyle}</p>
                          </div>
                          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                            <div className="text-[9px] text-white uppercase tracking-widest font-black mb-2">Strategic Pivot</div>
                            <p className="text-sm text-white font-black mb-2">{category.competitorIntel.counterStrategy.recommendedPivot}</p>
                            <p className="text-[11px] text-white/40 leading-relaxed font-medium">{category.competitorIntel.counterStrategy.pivotReason}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </section>
                </div>

                {/* Column 2: Keyword Hijacking & Market Velocity */}
                <div className="space-y-10">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                        <Search size={16} className="text-white" />
                      </div>
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Keyword Hijack</h4>
                    </div>
                    <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5 space-y-8">
                      {category.competitorIntel.keywordHijack && (
                        <>
                          <div>
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-4">Winning Patterns</div>
                            <div className="flex flex-wrap gap-2">
                              {category.competitorIntel.keywordHijack.winningKeywords?.map((kw, i) => (
                                <span key={`${category.id}-win-${i}`} className="px-3 py-1.5 bg-white/5 text-white/60 rounded-lg text-[10px] font-black border border-white/10 uppercase tracking-wider">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-4">Market Gaps (Exploitable)</div>
                            <div className="flex flex-wrap gap-2">
                              {category.competitorIntel.keywordHijack.missedGaps?.map((kw, i) => (
                                <span key={`${category.id}-gap-${i}`} className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-[10px] font-black border border-white/20 uppercase tracking-wider">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                        <BarChart3 size={16} className="text-white" />
                      </div>
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Market Velocity</h4>
                    </div>
                    <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5">
                      {category.competitorIntel.marketVelocity && (
                        <>
                          <div className="flex items-center justify-between mb-6">
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-black">Competitor Status</div>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              category.competitorIntel.marketVelocity.status === 'Aggressive' ? 'bg-white text-black' :
                              category.competitorIntel.marketVelocity.status === 'Steady' ? 'bg-white/10 text-white/60' :
                              'bg-white/5 text-white/20'
                            }`}>
                              {category.competitorIntel.marketVelocity.status}
                            </span>
                          </div>
                          <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                            <AlertCircle className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[9px] text-white/40 uppercase tracking-widest font-black mb-1.5">Trend Alert</div>
                              <p className="text-xs text-white/80 leading-relaxed font-medium">{category.competitorIntel.marketVelocity.trendAlert}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </section>
                </div>

                {/* Column 3: Metadata Benchmarking */}
                <section className="h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Metadata Benchmark</h4>
                  </div>
                  <div className="bg-white/[0.02] rounded-[2.5rem] p-8 border border-white/5 h-full flex flex-col">
                    {category.competitorIntel.metadataBenchmark && (
                      <>
                        <div className="grid grid-cols-2 gap-5 mb-10">
                          <div className="text-center p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                            <div className="text-3xl font-black text-white mb-2 tracking-tighter">{category.competitorIntel.metadataBenchmark.titleScore}</div>
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-black">Title Score</div>
                          </div>
                          <div className="text-center p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                            <div className="text-3xl font-black text-white mb-2 tracking-tighter">{category.competitorIntel.metadataBenchmark.descriptionScore}</div>
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-black">Desc Score</div>
                          </div>
                        </div>

                        <div className="space-y-5 flex-1">
                          <div className="flex items-center gap-2 text-white/60 mb-4">
                            <Info size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Neural Recommendations</span>
                          </div>
                          {category.competitorIntel.metadataBenchmark.recommendations?.map((rec, i) => (
                            <div key={`${category.id}-rec-${i}`} className="flex gap-4">
                              <div className="w-1.5 h-1.5 bg-white/40 rounded-full mt-2 shrink-0 shadow-lg shadow-white/50" />
                              <p className="text-xs text-white/40 leading-relaxed font-medium">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="mt-10 pt-10 border-t border-white/5">
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectTrend(category.categoryName)}
                        className="w-full p-5 bg-white hover:bg-white/90 text-black rounded-2xl text-center transition-all shadow-xl shadow-white/5"
                      >
                        <div className="text-[9px] font-black uppercase tracking-widest mb-1.5 opacity-40">Takeover Protocol</div>
                        <div className="text-xs font-black uppercase tracking-widest">Inject Intel to Vault</div>
                      </motion.button>
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
