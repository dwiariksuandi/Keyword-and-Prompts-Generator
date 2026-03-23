import React, { useState } from 'react';
import { VisualGap, analyzeCompetitorGaps } from '../services/competitorService';
import { Target } from 'lucide-react';

export default function CompetitorGapAnalysis({ niche, onSelect, setQuotaWarning }: { niche: string, onSelect?: (niche: string) => void, setQuotaWarning?: (msg: string | null) => void }) {
  const [gaps, setGaps] = useState<VisualGap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchGaps() {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeCompetitorGaps(niche);
      setGaps(data);
    } catch (error: any) {
      if (error.message === 'QUOTA_EXCEEDED') {
        setQuotaWarning?.('API Quota exceeded. Please try again later or switch API keys.');
      } else {
        setError('Gagal menganalisis celah kompetitor.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="text-rose-500" /> Celah Kompetitor (Visual Gaps)
        </h3>
        <button
          onClick={fetchGaps}
          disabled={loading}
          className="text-[10px] font-bold uppercase tracking-widest text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 px-4 py-2 rounded-lg transition-all border border-rose-500/20 disabled:opacity-50"
        >
          {loading ? 'Menganalisis...' : 'Analisis Celah'}
        </button>
      </div>
      
      {loading && <div className="text-slate-500 text-sm">Menganalisis celah kompetitor...</div>}
      {error && <div className="text-rose-500 text-sm">{error}</div>}
      {!loading && !error && gaps.length === 0 && <div className="text-slate-500 text-sm">Klik tombol untuk menganalisis celah kompetitor.</div>}
      
      {!loading && gaps.length > 0 && (
        <div className="grid gap-4">
          {gaps.map((gap, i) => (
            <div key={`gap-${gap.niche}-${gap.missingElement}-${i}`} className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-rose-400">{gap.missingElement}</h4>
                  {onSelect && (
                    <button 
                      onClick={() => onSelect(gap.missingElement)}
                      className="mt-2 text-[10px] font-bold uppercase tracking-widest text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 px-3 py-1 rounded-full transition-all border border-rose-500/20"
                    >
                      Gunakan Ide Ini
                    </button>
                  )}
                </div>
                <span className="text-xs font-bold bg-rose-500/20 text-rose-400 px-2 py-1 rounded">Score: {gap.opportunityScore}</span>
              </div>
              <p className="text-sm text-slate-400">{gap.reasoning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
