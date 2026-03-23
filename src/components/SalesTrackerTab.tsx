import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, DollarSign, TrendingUp, BarChart3, FileSpreadsheet, Loader2, Sparkles } from 'lucide-react';
import { SalesRecord } from '../types';

interface SalesTrackerTabProps {
  salesRecords: SalesRecord[];
  onParseCSV: () => void;
  isParsing: boolean;
}

export default function SalesTrackerTab({ salesRecords, onParseCSV, isParsing }: SalesTrackerTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalEarnings = salesRecords.reduce((sum, r) => sum + r.earnings, 0);
  const totalDownloads = salesRecords.reduce((sum, r) => sum + r.downloads, 0);
  const avgEarnings = salesRecords.length > 0 ? totalEarnings / salesRecords.length : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onParseCSV();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
              Sales <span className="text-white/40">Tracking</span>
            </h1>
          </div>
          <p className="text-white/40 max-w-2xl font-bold text-lg uppercase tracking-tight leading-tight">
            Import your Adobe Stock sales data to train the AI Sales Predictor. 
            The more data you provide, the more accurate the revenue predictions.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isParsing}
            className="flex items-center gap-4 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-white/90 transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px] border border-white/10"
          >
            {isParsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload size={20} />}
            {isParsing ? 'Parsing...' : 'Upload Adobe CSV'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Earnings', value: `$${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-white' },
          { label: 'Total Downloads', value: totalDownloads.toLocaleString(), icon: TrendingUp, color: 'text-white/60' },
          { label: 'Avg per Asset', value: `$${avgEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: BarChart3, color: 'text-white/40' }
        ].map((stat, idx) => (
          <motion.div
            key={`stat-${stat.label}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#0A0A0A] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
            <div className={`text-4xl font-black font-mono ${stat.color} tracking-tighter uppercase`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Sales Data Table */}
      <div className="bg-[#0A0A0A] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileSpreadsheet className="w-6 h-6 text-white/20" />
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Historical Sales Data</h3>
          </div>
          <span className="text-[10px] font-black font-mono text-white/20 uppercase tracking-widest">{salesRecords.length} Assets Tracked</span>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          {salesRecords.length > 0 ? (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black border-b border-white/5 bg-white/[0.01]">
                <tr>
                  <th className="px-10 py-6">Asset ID</th>
                  <th className="px-10 py-6">Title</th>
                  <th className="px-10 py-6 text-center">Downloads</th>
                  <th className="px-10 py-6 text-center">Earnings</th>
                  <th className="px-10 py-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {salesRecords.sort((a, b) => b.earnings - a.earnings).map((record) => (
                  <tr key={record.assetId} className="hover:bg-white/[0.02] transition-all duration-500 group">
                    <td className="px-10 py-6 font-mono text-[11px] text-white/20">{record.assetId}</td>
                    <td className="px-10 py-6 font-black text-white uppercase tracking-tight max-w-xs truncate">{record.title}</td>
                    <td className="px-10 py-6 text-center font-black font-mono text-white/60">{record.downloads}</td>
                    <td className="px-10 py-6 text-center font-black font-mono text-white">${record.earnings.toFixed(2)}</td>
                    <td className="px-10 py-6 text-right text-[10px] text-white/20 font-black uppercase tracking-widest">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-32 flex flex-col items-center justify-center text-center space-y-8">
              <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center border border-dashed border-white/10 shadow-2xl">
                <Upload className="w-10 h-10 text-white/10" />
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-black uppercase tracking-widest text-lg">No Sales Data Yet</h4>
                <p className="text-white/20 text-sm max-w-xs leading-relaxed font-bold uppercase tracking-tight">
                  Upload your Adobe Stock contributor CSV to synchronize historical performance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Training Status */}
      <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-start gap-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 shadow-xl">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="space-y-3">
          <h4 className="text-white font-black text-lg uppercase tracking-widest">AI Training Status: <span className="text-white/40">{salesRecords.length > 0 ? 'Enhanced' : 'Baseline'}</span></h4>
          <p className="text-white/40 text-sm leading-relaxed font-bold uppercase tracking-tight max-w-3xl">
            {salesRecords.length > 0 
              ? `AI Sales Predictor is now utilizing ${salesRecords.length} data points from your authentic performance to provide personalized revenue forecasting.`
              : 'AI Sales Predictor is currently utilizing general market data. Upload your historical sales to activate personalized forecasting.'}
          </p>
        </div>
      </div>
    </div>
  );
}
