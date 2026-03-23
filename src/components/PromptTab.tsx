import React from 'react';
import { ArrowLeft, Wand2, Sparkles, FileJson, FileSpreadsheet } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { CategoryResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryCard } from './CategoryCard';

interface PromptTabProps {
  results: CategoryResult[];
  selectedCategoryId: string | null;
  onBack: () => void;
  onGenerate: (id: string) => void | Promise<void>;
  onUpgrade: (id: string) => void | Promise<void>;
  onGenerateMetadata: (id: string) => void | Promise<void>;
  onPolishMetadata: (id: string) => void | Promise<void>;
  onVisualize: (prompt: string) => void | Promise<void>;
  onRatePrompt: (categoryId: string, promptIndex: number, rating: number) => void;
  promptsCount: number;
  setPromptsCount: React.Dispatch<React.SetStateAction<number>>;
  onShowToast: (message: string) => void;
  progress: { current: number, total: number, message: string } | null;
}

export default function PromptTab({ 
  results, 
  selectedCategoryId, 
  onBack, 
  onGenerate, 
  onUpgrade,
  onGenerateMetadata,
  onPolishMetadata,
  onVisualize,
  onRatePrompt,
  promptsCount,
  setPromptsCount,
  onShowToast,
  progress
}: PromptTabProps) {
  const selectedCategory = results.find(r => r.id === selectedCategoryId);
  
  const displayCategories = selectedCategory 
    ? [selectedCategory] 
    : results;

  const isGeneratingAny = displayCategories.some(c => c.isGeneratingPrompts);
  const isUpgradingAny = displayCategories.some(c => c.isUpgrading);
  const isProcessing = isGeneratingAny || isUpgradingAny;

  const handleExportJSON = () => {
    const exportData = results.filter(r => r.generatedPrompts.length > 0).map(r => ({
      category: r.categoryName,
      contentType: r.contentType,
      prompts: r.generatedPrompts.map((p, i) => ({
        prompt: p,
        score: r.promptScores?.[i]?.score,
        metadata: r.metadata?.[i] || null
      }))
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adobe_stock_vault_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Vault exported to JSON');
  };

  const handleExportCSV = () => {
    let csvContent = "Category,Prompt,Title,Keywords\n";
    
    results.forEach(r => {
      if (r.generatedPrompts.length > 0) {
        r.generatedPrompts.forEach((p, i) => {
          const meta = r.metadata?.[i];
          const title = meta?.title ? `"${meta.title.replace(/"/g, '""')}"` : '""';
          const keywords = meta?.keywords ? `"${meta.keywords.join(', ').replace(/"/g, '""')}"` : '""';
          const prompt = `"${p.replace(/"/g, '""')}"`;
          const category = `"${r.categoryName.replace(/"/g, '""')}"`;
          
          csvContent += `${category},${prompt},${title},${keywords}\n`;
        });
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adobe_stock_vault_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Vault exported to CSV');
  };

  if (displayCategories.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-6 py-20 text-center"
      >
        <div className="bg-[#0A0A0A] p-12 max-w-lg mx-auto rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">No Categories Available</h2>
          <p className="text-white/40 mb-8 font-medium">Initiate keyword analysis to unlock the Prompt Studio.</p>
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-white/5"
          >
            Return to Research
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative">
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0A0A0A] p-12 flex flex-col items-center max-w-sm w-full mx-4 text-center rounded-[3rem] border border-white/10 shadow-2xl"
            >
              <div className="relative w-24 h-24 mb-10">
                <div className="absolute inset-0 border-2 rounded-full animate-spin border-white/10 border-t-white"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isGeneratingAny ? <Sparkles className="text-white animate-pulse" size={40} /> : <Wand2 className="text-white animate-pulse" size={40} />}
                </div>
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase text-white">
                {isGeneratingAny ? 'Synthesizing' : 'Optimizing'}
              </h3>
              
              {progress && (
                <ProgressBar 
                  current={progress.current} 
                  total={progress.total} 
                  message={progress.message} 
                />
              )}

              <p className="text-white/40 text-sm leading-relaxed font-medium">
                Our neural engine is {isGeneratingAny ? 'crafting high-fidelity prompts' : 'refining visual parameters'} for your niche.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16"
      >
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-4 bg-white/5 text-white rounded-2xl transition-all border border-white/5"
            title="Go Back"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Prompt <span className="text-white/40">Studio</span>
            </h1>
            <p className="text-white/40 font-medium">Neural synthesis of high-conversion visual descriptors.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <FileSpreadsheet size={14} />
              CSV
            </button>
            <button 
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <FileJson size={14} />
              JSON
            </button>
          </div>

          <div className="flex items-center gap-6 bg-white/5 p-2 pl-6 rounded-2xl border border-white/5">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Density</span>
            <div className="flex items-center bg-black/40 rounded-xl px-4 py-2 border border-white/5">
              <input 
                type="number" 
                value={promptsCount || ''}
                onChange={(e) => setPromptsCount(Number(e.target.value))}
                onBlur={() => {
                  if (promptsCount < 1) setPromptsCount(1);
                  if (promptsCount > 1500) setPromptsCount(1500);
                }}
                className="bg-transparent text-white w-14 outline-none text-sm font-black text-center font-mono"
                min="1"
                max="1500"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-16">
        <AnimatePresence>
          {displayCategories.map((category, catIdx) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <CategoryCard
                category={category}
                onGenerate={onGenerate}
                onUpgrade={onUpgrade}
                onGenerateMetadata={onGenerateMetadata}
                onPolishMetadata={onPolishMetadata}
                onVisualize={onVisualize}
                onRatePrompt={onRatePrompt}
                onShowToast={onShowToast}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
