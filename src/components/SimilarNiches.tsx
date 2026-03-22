import React, { useState, useEffect } from 'react';
import { vectorStoreService } from '../services/vectorStore';
import { AppSettings } from '../types';

interface SimilarNichesProps {
  currentKeyword: string;
  settings: AppSettings;
}

export const SimilarNiches: React.FC<SimilarNichesProps> = ({ currentKeyword, settings }) => {
  const [similarNiches, setSimilarNiches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!currentKeyword) return;
      setIsLoading(true);
      try {
        const results = await vectorStoreService.findSimilar(currentKeyword, settings.apiKey);
        setSimilarNiches(results);
      } catch (error) {
        console.error("Failed to fetch similar niches:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSimilar();
  }, [currentKeyword, settings.apiKey]);

  if (isLoading) return <div className="text-slate-500 text-xs">Mencari niche serupa...</div>;
  if (similarNiches.length === 0) return null;

  return (
    <div className="mt-6 glass-panel p-4 rounded-xl">
      <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider">NICHE SERUPA</h3>
      <div className="space-y-2">
        {similarNiches.map((item, index) => (
          <div key={index} className="text-xs text-slate-300 p-2 bg-white/5 rounded-lg">
            <span className="font-semibold text-cyan-400">{item.analysis[0].categoryName}</span>
            <p className="text-[10px] text-slate-500 mt-1">{item.analysis[0].creativeAdvice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
