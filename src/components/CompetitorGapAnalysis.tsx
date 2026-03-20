import React, { useEffect, useState } from 'react';
import { VisualGap, analyzeCompetitorGaps } from '../services/competitorService';
import { Target, AlertTriangle } from 'lucide-react';

export default function CompetitorGapAnalysis({ niche }: { niche: string }) {
  const [gaps, setGaps] = useState<VisualGap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGaps() {
      setLoading(true);
      const data = await analyzeCompetitorGaps(niche);
      setGaps(data);
      setLoading(false);
    }
    fetchGaps();
  }, [niche]);

  if (loading) return <div className="text-slate-500 text-sm">Menganalisis celah kompetitor...</div>;
  if (gaps.length === 0) return <div className="text-slate-500 text-sm">Tidak ada celah kompetitor yang ditemukan.</div>;

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Target className="text-rose-500" /> Celah Kompetitor (Visual Gaps)
      </h3>
      <div className="grid gap-4">
        {gaps.map((gap, i) => (
          <div key={i} className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-rose-400">{gap.missingElement}</h4>
              <span className="text-xs font-bold bg-rose-500/20 text-rose-400 px-2 py-1 rounded">Score: {gap.opportunityScore}</span>
            </div>
            <p className="text-sm text-slate-400">{gap.reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
