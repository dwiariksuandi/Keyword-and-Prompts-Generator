import React from 'react';
import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CategoryResult } from '../types';

const OpportunityScore = ({ score }: { score: number }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      <svg className="transform -rotate-90 w-10 h-10">
        <circle cx="20" cy="20" r={radius} stroke="#334155" strokeWidth="3" fill="transparent" />
        <circle
          cx="20" cy="20" r={radius} stroke={color} strokeWidth="3" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-bold text-white">{score}</span>
    </div>
  );
};

interface ResultRowProps {
  result: CategoryResult;
  onToggleStar: (id: string) => void;
  onViewPrompts: (id: string) => void;
}

export const ResultRow: React.FC<ResultRowProps> = ({ result, onToggleStar, onViewPrompts }) => {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors border-b border-slate-800/50">
      <td className="px-6 py-4 align-top">
        <div className="flex items-start gap-2">
          <button onClick={() => onToggleStar(result.id)} className={`mt-0.5 ${result.isStarred ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-400'}`}>
            <Star size={16} fill={result.isStarred ? 'currentColor' : 'none'} />
          </button>
          <span className="text-[#00D8B6] font-medium leading-tight max-w-[150px] block">{result.categoryName}</span>
        </div>
      </td>
      <td className="px-6 py-4 align-top">
        <div className="flex flex-wrap gap-2 max-w-[200px]">
          {result.mainKeywords.map((kw, i) => (
            <span key={i} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-md border border-slate-700">
              {kw}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 align-top">
        <div className="flex flex-col">
          <span className="text-white font-medium">{result.volumeLevel}</span>
          <span className="text-slate-500 text-xs">{result.volumeNumber.toLocaleString()}</span>
        </div>
      </td>
      <td className="px-6 py-4 align-top">
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${
          result.competition === 'High' ? 'bg-red-500/20 text-red-400' :
          result.competition === 'Medium' ? 'bg-[#00D8B6]/20 text-[#00D8B6]' :
          'bg-green-500/20 text-green-400'
        }`}>
          {result.competition}
        </span>
      </td>
      <td className="px-6 py-4 align-top">
        <div className="flex items-center gap-1">
          {result.trend === 'down' ? (
            <TrendingDown size={14} className="text-red-400" />
          ) : result.trend === 'up' ? (
            <TrendingUp size={14} className="text-green-400" />
          ) : (
            <Minus size={14} className="text-slate-400" />
          )}
          <span className={
            result.trend === 'down' ? 'text-red-400' : 
            result.trend === 'up' ? 'text-green-400' : 'text-slate-400'
          }>{result.trendPercent}%</span>
        </div>
      </td>
      <td className="px-6 py-4 align-top">
        <OpportunityScore score={result.opportunityScore} />
      </td>
      <td className="px-6 py-4 align-top text-right">
        <button 
          onClick={() => onViewPrompts(result.id)}
          className="bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 px-4 py-1.5 rounded-md text-xs font-medium transition-colors"
        >
          {result.generatedPrompts.length > 0 ? 'View Prompts' : 'Create Prompts'}
        </button>
      </td>
    </tr>
  );
};
