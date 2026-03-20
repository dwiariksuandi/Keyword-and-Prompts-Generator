import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, DollarSign, TrendingUp, BarChart3, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { SalesRecord } from '../types';

interface SalesTrackerTabProps {
  salesRecords: SalesRecord[];
  onParseCSV: (file: File) => void;
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
      onParseCSV(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">Sales Tracking Integration</h2>
          </div>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Impor data penjualan Adobe Stock Anda untuk melatih AI Sales Predictor. 
            Semakin banyak data yang Anda berikan, semakin akurat prediksi pendapatan untuk prompt baru Anda.
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
            className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
          >
            {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload size={18} />}
            {isParsing ? 'Parsing...' : 'Upload Adobe CSV'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Earnings', value: `$${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total Downloads', value: totalDownloads.toLocaleString(), icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Avg per Asset', value: `$${avgEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-8 border-white/5 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-3xl -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center border border-white/5`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
            <div className={`text-3xl font-mono font-bold ${stat.color} tracking-tighter`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Sales Data Table */}
      <div className="glass-panel border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Historical Sales Data</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{salesRecords.length} Assets Tracked</span>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          {salesRecords.length > 0 ? (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold border-b border-white/5 bg-white/[0.01]">
                <tr>
                  <th className="px-6 py-4">Asset ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 text-center">Downloads</th>
                  <th className="px-6 py-4 text-center">Earnings</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {salesRecords.sort((a, b) => b.earnings - a.earnings).map((record) => (
                  <tr key={record.assetId} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{record.assetId}</td>
                    <td className="px-6 py-4 font-bold text-white max-w-xs truncate">{record.title}</td>
                    <td className="px-6 py-4 text-center font-mono text-cyan-400">{record.downloads}</td>
                    <td className="px-6 py-4 text-center font-mono text-emerald-400">${record.earnings.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-[10px] text-slate-500 uppercase tracking-widest">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-dashed border-white/10">
                <Upload className="w-8 h-8 text-slate-600" />
              </div>
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">No Sales Data Yet</h4>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                Unggah file CSV dari dashboard kontributor Adobe Stock Anda untuk memulai sinkronisasi data.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Training Status */}
      <div className="mt-8 p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h4 className="text-cyan-400 font-bold text-sm mb-1">AI Training Status: {salesRecords.length > 0 ? 'Enhanced' : 'Baseline'}</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            {salesRecords.length > 0 
              ? `AI Sales Predictor sekarang menggunakan ${salesRecords.length} data poin dari performa asli Anda untuk memberikan prediksi yang lebih personal.`
              : 'AI Sales Predictor saat ini menggunakan data pasar umum. Unggah data Anda untuk personalisasi prediksi.'}
          </p>
        </div>
      </div>
    </div>
  );
}
