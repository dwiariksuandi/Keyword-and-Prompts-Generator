import React from 'react';
import { CategoryResult } from '../types';

interface NeuralMarketMapProps {
  keyword: string;
  results: CategoryResult[];
}

export const NeuralMarketMap: React.FC<NeuralMarketMapProps> = ({ keyword, results }) => {
  if (results.length === 0) return null;

  // Simple SVG visualization without D3
  const width = 800;
  const height = 400;

  return (
    <div className="w-full h-[400px] bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Neural Market Topology</h4>
        <p className="text-[10px] text-emerald-400/60 font-mono">Relational Intelligence Map</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full cursor-move">
        <text x={width / 2} y={height / 2} textAnchor="middle" fill="white" fontSize="20">
          {keyword}
        </text>
        {results.map((res, i) => {
          const angle = (i / results.length) * 2 * Math.PI;
          const x = width / 2 + 100 * Math.cos(angle);
          const y = height / 2 + 100 * Math.sin(angle);
          return (
            <g key={i}>
              <line x1={width / 2} y1={height / 2} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" />
              <circle cx={x} cy={y} r={8} fill="#10b981" />
              <text x={x + 12} y={y + 4} fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="monospace">
                {res.categoryName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
