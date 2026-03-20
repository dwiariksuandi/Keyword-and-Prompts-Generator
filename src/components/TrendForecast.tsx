import React, { useEffect, useState } from 'react';
import { Trend, getTrendForecast } from '../services/trendService';
import { TrendingUp, Calendar, Zap } from 'lucide-react';

export default function TrendForecast({ niche }: { niche?: string }) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      setLoading(true);
      const data = await getTrendForecast(niche);
      setTrends(data);
      setLoading(false);
    }
    fetchTrends();
  }, [niche]);

  if (loading) return <div className="text-slate-500 text-sm">Menganalisis tren pasar...</div>;

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <TrendingUp className="text-accent" /> Prediksi Tren Pasar
      </h3>
      <div className="grid gap-4">
        {trends.map(trend => (
          <div key={trend.id} className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-accent">{trend.niche}</h4>
              <span className="text-xs font-bold bg-accent/20 text-accent px-2 py-1 rounded">Score: {trend.forecastScore}</span>
            </div>
            <p className="text-sm text-slate-400 mb-2">{trend.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar size={14} /> {trend.seasonality}</span>
              <span className="flex items-center gap-1"><Zap size={14} /> {trend.recommendedAction}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
