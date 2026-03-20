import React, { useEffect, useState } from 'react';
import { QualityReport, analyzeAssetQuality } from '../services/qaService';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function VisualQA({ assetUrl }: { assetUrl: string }) {
  const [report, setReport] = useState<QualityReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runQA() {
      setLoading(true);
      const data = await analyzeAssetQuality(assetUrl);
      setReport(data);
      setLoading(false);
    }
    runQA();
  }, [assetUrl]);

  if (loading) return <div className="text-slate-500 text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Menganalisis kualitas visual...</div>;
  if (!report) return null;

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        {report.isApproved ? <CheckCircle2 className="text-emerald-500" /> : <AlertTriangle className="text-amber-500" />}
        Laporan Kualitas Visual (QA)
      </h3>
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-slate-400">Skor Keseluruhan:</span>
          <span className={`text-2xl font-bold ${report.isApproved ? 'text-emerald-400' : 'text-amber-400'}`}>{report.overallScore}/100</span>
        </div>
        
        {report.issues.length > 0 && (
          <div className="space-y-2">
            {report.issues.map((issue, i) => (
              <div key={i} className="text-sm text-amber-400 flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{issue.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
