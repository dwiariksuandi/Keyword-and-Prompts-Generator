import React from 'react';
import { Copy, Wand2, Eye, Star, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { CategoryResult, PromptOptimizationRequest } from '../types';

interface PromptCardProps {
  category: CategoryResult;
  prompt: string;
  index: number;
  onCopy: (text: string) => void;
  onVisualize: (prompt: string) => void | Promise<void>;
  onRatePrompt: (categoryId: string, promptIndex: number, rating: number) => void;
  onOptimizeClick: (catId: string, index: number, prompt: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  category,
  prompt,
  index,
  onCopy,
  onVisualize,
  onRatePrompt,
  onOptimizeClick
}) => {
  const scoreData = category.promptScores?.[index];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group shadow-2xl"
    >
      <div className="flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="flex-grow pt-1">
          <p className="text-white/80 text-base sm:text-lg leading-relaxed font-medium">{prompt}</p>
          
          {scoreData?.optimizedPrompt && (
            <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-2">Optimized Version</span>
              <p className="text-blue-100/80 text-sm leading-relaxed">{scoreData.optimizedPrompt}</p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRatePrompt(category.id, index, star)}
                  className={`p-1 transition-all ${
                    (scoreData?.rating || 0) >= star 
                      ? 'text-yellow-400' 
                      : 'text-white/10 hover:text-white/30'
                  }`}
                >
                  <Star size={14} fill={(scoreData?.rating || 0) >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <div className="w-px h-4 bg-white/5" />
            <button
              onClick={() => onOptimizeClick(category.id, index, prompt)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
            >
              <Wand2 size={12} />
              Optimize
            </button>
          </div>
        </div>
        <div className="flex-shrink-0 flex justify-end gap-3">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onVisualize(prompt)}
            className="p-4 bg-black/40 rounded-2xl text-white/20 transition-all border border-white/5 hover:border-blue-500/30"
            title="Visualize with Gemini"
          >
            <Eye size={20} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onCopy(prompt)}
            className="p-4 bg-black/40 rounded-2xl text-white/20 transition-all border border-white/5 hover:border-white/30"
            title="Copy Prompt"
          >
            <Copy size={20} />
          </motion.button>
        </div>
      </div>

      {scoreData && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-8 border-t border-white/5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-white/10 text-white border-white/20">
                Quality Index: {scoreData.score}%
              </div>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-6 w-full sm:w-auto">
              {[
                { label: 'Density', val: scoreData.density, color: 'bg-white' },
                { label: 'Clarity', val: scoreData.clarity, color: 'bg-white/60' },
                { label: 'Specific', val: scoreData.specificity, color: 'bg-white/40' },
                { label: 'Adobe', val: scoreData.adherence, color: 'bg-white/20' }
              ].map((m, i) => (
                <div key={`${category.id}-metric-${index}-${i}`} className="flex flex-col items-center sm:items-start">
                  <span className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-2">{m.label}</span>
                  <div className="w-full sm:w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.val}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className={`h-full ${m.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-black/40 rounded-[2rem] p-8 border border-white/5 space-y-6">
            <p className="text-sm text-white/60 italic leading-relaxed font-medium">
              <span className="text-white font-black not-italic mr-3 uppercase tracking-widest text-[9px]">Analysis:</span>
              {scoreData.feedback}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
              {[
                { label: 'Keyword Vectors', text: scoreData.keywordFeedback },
                { label: 'Visual Clarity', text: scoreData.clarityFeedback },
                { label: 'Technical Specs', text: scoreData.specificityFeedback },
                { label: 'Compliance', text: scoreData.adherenceFeedback }
              ].map((f, i) => f.text && (
                <div key={`${category.id}-feedback-${index}-${i}`} className="space-y-2">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{f.label}</span>
                  <p className="text-xs text-white/40 leading-relaxed font-medium">{f.text}</p>
                </div>
              ))}
            </div>

            {scoreData.groundingSources && scoreData.groundingSources.length > 0 && (
              <div className="pt-6 border-t border-white/5 space-y-3">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Market Validation Sources</span>
                <div className="flex flex-wrap gap-2">
                  {scoreData.groundingSources.map((source, i) => (
                    <a 
                      key={`${category.id}-source-${index}-${i}`} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-white/60 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2"
                    >
                      <Globe size={12} />
                      {source.title ? (source.title.length > 40 ? source.title.substring(0, 40) + '...' : source.title) : source.uri}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
