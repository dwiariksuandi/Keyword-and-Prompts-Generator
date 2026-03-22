import React from 'react';
import { motion } from 'motion/react';
import { CategoryResult } from '../types';
import { ResultRow } from './ResultRow';

interface ResultsTableProps {
  results: CategoryResult[];
  onToggleStar: (id: string) => void;
  onViewPrompts: (id: string) => void;
}

export function ResultsTable({ results, onToggleStar, onViewPrompts }: ResultsTableProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden border-white/10"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1000px] text-left text-sm border-collapse">
            <thead className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold border-b border-white/5 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 font-bold">Neural Sector</th>
                <th className="px-6 py-4 font-bold">Data Vectors</th>
                <th className="px-6 py-4 font-bold">Volume</th>
                <th className="px-6 py-4 font-bold">Competition</th>
                <th className="px-6 py-4 font-bold">Trend</th>
                <th className="px-6 py-4 font-bold text-center">Opportunity</th>
                <th className="px-6 py-4 font-bold text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {results.map((result) => (
                <ResultRow 
                  key={result.id} 
                  result={result} 
                  onToggleStar={onToggleStar}
                  onViewPrompts={onViewPrompts}
                />
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
