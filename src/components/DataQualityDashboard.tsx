import React from 'react';
import { CategoryResult } from '../types';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle, BarChart2 } from 'lucide-react';

interface Props {
  results: CategoryResult[];
}

export default function DataQualityDashboard({ results }: Props) {
  const allPrompts = results.flatMap(r => r.promptScores || []);
  const validatedPrompts = allPrompts.filter(p => p.aiValidation);
  const validCount = validatedPrompts.filter(p => p.aiValidation?.isValid).length;
  const invalidCount = validatedPrompts.filter(p => !p.aiValidation?.isValid).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <BarChart2 className="text-accent" />
        <h3 className="text-lg font-bold text-white">Data Quality Dashboard</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
          <div className="text-slate-400 text-xs">Total Prompts</div>
          <div className="text-2xl font-bold text-white">{allPrompts.length}</div>
        </div>
        <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
          <div className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Valid</div>
          <div className="text-2xl font-bold text-emerald-400">{validCount}</div>
        </div>
        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
          <div className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> Invalid</div>
          <div className="text-2xl font-bold text-red-400">{invalidCount}</div>
        </div>
      </div>
    </div>
  );
}
