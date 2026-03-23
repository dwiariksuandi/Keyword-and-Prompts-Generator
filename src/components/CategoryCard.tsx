import React from 'react';
import { Download, Copy, Wand2, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { CategoryResult } from '../types';
import { motion } from 'motion/react';
import { PromptCard } from './PromptCard';

interface CategoryCardProps {
  category: CategoryResult;
  onGenerate: (id: string) => void | Promise<void>;
  onUpgrade: (id: string) => void | Promise<void>;
  onGenerateMetadata: (id: string) => void | Promise<void>;
  onPolishMetadata: (id: string) => void | Promise<void>;
  onVisualize: (prompt: string) => void | Promise<void>;
  onRatePrompt: (categoryId: string, promptIndex: number, rating: number) => void;
  onShowToast: (message: string) => void;
}

export function CategoryCard({
  category,
  onGenerate,
  onUpgrade,
  onGenerateMetadata,
  onPolishMetadata,
  onVisualize,
  onRatePrompt,
  onShowToast
}: CategoryCardProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Copied to clipboard');
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(category.generatedPrompts.join('\n\n'));
    onShowToast('All prompts copied');
  };

  const handleDownload = () => {
    const content = `Category: ${category.categoryName}\nKeywords: ${category.mainKeywords.join(", ")}\nGenerated: ${new Date().toLocaleString()}\n\n${"-".repeat(50)}\n\n${category.generatedPrompts.join('\n\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category.categoryName.replace(/\s+/g, '_')}_prompts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0A0A0A] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden group hover:border-white/10 transition-all"
    >
      <div className="p-8 sm:p-12 border-b border-white/5 bg-white/[0.01]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{category.categoryName}</h2>
            <div className="flex flex-wrap gap-3">
              {category.mainKeywords.map((kw, i) => (
                <span key={`${category.id}-kw-${i}`} className="bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border border-white/5">
                  {kw}
                </span>
              ))}
            </div>
            {(category.buyerPersona || category.visualTrends || category.creativeAdvice) && (
              <div className="flex flex-col gap-3 mt-6 p-6 bg-black/40 rounded-2xl border border-white/5">
                {category.buyerPersona && (
                  <div className="text-xs text-white/40 font-medium">
                    <span className="font-black text-white uppercase tracking-widest text-[9px] mr-3">Buyer Persona:</span>
                    {category.buyerPersona}
                  </div>
                )}
                {category.visualTrends && category.visualTrends.length > 0 && (
                  <div className="text-xs text-white/40 font-medium">
                    <span className="font-black text-white uppercase tracking-widest text-[9px] mr-3">Visual Trends:</span>
                    {category.visualTrends.join(', ')}
                  </div>
                )}
                {category.creativeAdvice && (
                  <div className="text-xs text-white/40 font-medium">
                    <span className="font-black text-white uppercase tracking-widest text-[9px] mr-3">Creative Advice:</span>
                    {category.creativeAdvice}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {category.generatedPrompts.length === 0 ? (
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onGenerate(category.id)}
                disabled={category.isGeneratingPrompts}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black transition-all disabled:opacity-50 shadow-xl shadow-white/5 text-[10px] uppercase tracking-widest"
              >
                <Sparkles size={18} />
                <span>Initiate Synthesis</span>
              </motion.button>
            ) : (
              <>
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onGenerate(category.id)}
                  disabled={category.isGeneratingPrompts}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-6 py-4 rounded-2xl font-black border border-white/5 transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
                >
                  <RefreshCw size={16} className={category.isGeneratingPrompts ? "animate-spin" : ""} />
                  <span>Regenerate</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onUpgrade(category.id)}
                  disabled={category.isUpgrading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-6 py-4 rounded-2xl font-black border border-white/10 transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
                >
                  <Wand2 size={16} />
                  <span>Optimize All</span>
                </motion.button>
                <div className="w-px h-10 bg-white/5 hidden sm:block mx-2" />
                {(!category.metadata || category.metadata.length === 0) ? (
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onGenerateMetadata(category.id)}
                    disabled={category.isGeneratingMetadata}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-6 py-4 rounded-2xl font-black border border-white/10 transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
                  >
                    <Sparkles size={16} />
                    <span>Metadata</span>
                  </motion.button>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPolishMetadata(category.id)}
                    disabled={category.isGeneratingMetadata}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-black border border-white/20 transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
                  >
                    <Zap size={16} />
                    <span>Polish SEO</span>
                  </motion.button>
                )}
                <div className="w-px h-10 bg-white/5 hidden sm:block mx-2" />
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  className="p-4 bg-white/5 text-white/40 hover:text-white rounded-2xl border border-white/5 transition-all"
                  title="Export TXT"
                >
                  <Download size={20} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyAll}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-white/5 text-[10px] uppercase tracking-widest"
                >
                  <Copy size={18} />
                  <span>Copy All</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-8 sm:p-12">
        {category.generatedPrompts.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Sparkles className="text-white/20" size={40} />
            </div>
            <h3 className="text-xl font-black text-white/60 mb-2 uppercase tracking-tighter">Awaiting Synthesis</h3>
            <p className="text-white/30 text-sm font-medium px-4">Execute the command above to generate unique visual descriptors.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {category.generatedPrompts.map((prompt, index) => (
              <PromptCard
                key={`${category.id}-prompt-${index}`}
                category={category}
                prompt={prompt}
                index={index}
                onCopy={handleCopy}
                onVisualize={onVisualize}
                onRatePrompt={onRatePrompt}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
