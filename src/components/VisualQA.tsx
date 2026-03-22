import React, { useEffect, useState } from 'react';
import { QualityReport, analyzeAssetQuality } from '../services/qaService';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

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

  if (loading) return (
    <div className="flex items-center gap-3 py-8">
      <Loader2 className="animate-spin text-white/20" size={18} />
      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Analyzing Visual Integrity...</span>
    </div>
  );
  
  if (!report) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-12"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xl ${
          report.isApproved 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/5 border-white/10'
        }`}>
          {report.isApproved 
            ? <CheckCircle2 className="text-white" size={20} /> 
            : <AlertTriangle className="text-white/40" size={20} />
          }
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Visual QA Report</h3>
          <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-0.5">Neural Quality Assessment</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] shadow-2xl">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block">Overall Integrity Score</span>
            <span className="text-5xl font-black text-white tracking-tighter">{report.overallScore}<span className="text-white/20 text-2xl">/100</span></span>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            report.isApproved 
              ? 'bg-white text-black border-white' 
              : 'bg-white/5 text-white/40 border-white/10'
          }`}>
            {report.isApproved ? 'Approved' : 'Review Required'}
          </div>
        </div>
        
        {report.issues.length > 0 && (
          <div className="space-y-3 pt-8 border-t border-white/5">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Detected Anomalies</p>
            {report.issues.map((issue, i) => (
              <div key={`issue-${issue.description}-${i}`} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <AlertTriangle size={14} className="text-white/40 shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-white/60 leading-relaxed">{issue.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
