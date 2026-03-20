import React from 'react';
import { Download, Copy, ArrowLeft, Wand2, Sparkles, RefreshCw, Loader2, Globe, FileJson, FileSpreadsheet, Zap, Eye } from 'lucide-react';
import { CategoryResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PromptTabProps {
  results: CategoryResult[];
  selectedCategoryId: string | null;
  onBack: () => void;
  onGenerate: (id: string) => void | Promise<void>;
  onUpgrade: (id: string) => void | Promise<void>;
  onGenerateMetadata: (id: string) => void | Promise<void>;
  onPolishMetadata: (id: string) => void | Promise<void>;
  onVisualize: (prompt: string) => void | Promise<void>;
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Copied to clipboard');
  };

  const handleCopyAll = (category: CategoryResult) => {
    navigator.clipboard.writeText(category.generatedPrompts.join('\n\n'));
    onShowToast('All prompts copied');
  };

  const handleDownload = (category: CategoryResult) => {
    const content = `Category: ${category.categoryName}\nKeywords: ${category.mainKeywords.join(", ")}\nGenerated: ${new Date().toLocaleString()}\n\n${"-".repeat(50)}\n\n${category.generatedPrompts.join('\n\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category.categoryName.replace(/\s+/g, '_')}_prompts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <div className="glass-panel p-12 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4 font-display">No Categories Available</h2>
          <p className="text-slate-400 mb-8">Initiate keyword analysis to unlock the Prompt Studio.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="bg-accent text-slate-900 px-8 py-3 rounded-xl font-bold transition-all futuristic-glow"
          >
            Return to Top Tab
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel p-12 flex flex-col items-center max-w-sm w-full mx-4 text-center futuristic-glow"
            >
              <div className="relative w-24 h-24 mb-10">
                <div className={`absolute inset-0 border-4 rounded-full animate-spin ${isGeneratingAny ? 'border-accent/20 border-t-accent' : 'border-orange-500/20 border-t-orange-500'}`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isGeneratingAny ? <Sparkles className="text-accent animate-pulse" size={40} /> : <Wand2 className="text-orange-500 animate-pulse" size={40} />}
                </div>
              </div>
              <h3 className={`text-3xl font-bold mb-4 tracking-tight font-display ${isGeneratingAny ? 'text-accent' : 'text-orange-500'}`}>
                {isGeneratingAny ? 'Synthesizing' : 'Optimizing'}
              </h3>
              
              {progress && (
                <div className="w-full mb-6">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    <span>{progress.message}</span>
                    <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                      className={`h-full ${isGeneratingAny ? 'bg-accent' : 'bg-orange-500'}`}
                    />
                  </div>
                </div>
              )}

              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Our neural engine is {isGeneratingAny ? 'crafting high-fidelity prompts' : 'refining visual parameters'} for your niche.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 mb-10 sm:mb-12"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-3 sm:p-4 glass-panel text-slate-300 transition-all border border-white/10"
            title="Go Back"
          >
            <ArrowLeft size={20} sm:size={24} />
          </motion.button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
              Prompt <span className="text-accent">Studio</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500">Neural synthesis of high-conversion visual descriptors.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/20 transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              <FileSpreadsheet size={14} />
              Export CSV
            </button>
            <button 
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/20 transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              <FileJson size={14} />
              Export JSON
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 glass-panel p-2 sm:p-3 pl-4 sm:pl-6">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Density</span>
            <div className="flex items-center bg-slate-800/50 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-700/50">
              <input 
                type="number" 
                value={promptsCount || ''}
                onChange={(e) => setPromptsCount(Number(e.target.value))}
                onBlur={() => {
                  if (promptsCount < 1) setPromptsCount(1);
                  if (promptsCount > 1500) setPromptsCount(1500);
                }}
                className="bg-transparent text-white w-12 sm:w-14 outline-none text-xs sm:text-sm font-bold text-center font-mono"
                min="1"
                max="1500"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-12">
        <AnimatePresence>
          {displayCategories.map((category, catIdx) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: catIdx * 0.1 }}
              className="glass-panel overflow-hidden group"
            >
              <div className="p-6 sm:p-10 border-b border-white/5 bg-white/[0.02]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
                  <div className="space-y-4 sm:space-y-5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-accent tracking-tight font-display">{category.categoryName}</h2>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {category.mainKeywords.map((kw, i) => (
                        <span key={i} className="bg-slate-800/40 text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg border border-slate-700/30">
                          {kw}
                        </span>
                      ))}
                    </div>
                    {(category.buyerPersona || category.visualTrends || category.creativeAdvice) && (
                      <div className="flex flex-col gap-2 mt-4 p-4 bg-black/20 rounded-xl border border-white/5">
                        {category.buyerPersona && (
                          <div className="text-xs text-slate-400">
                            <span className="font-bold text-accent uppercase tracking-widest text-[9px] mr-2">Buyer Persona:</span>
                            {category.buyerPersona}
                          </div>
                        )}
                        {category.visualTrends && category.visualTrends.length > 0 && (
                          <div className="text-xs text-slate-400">
                            <span className="font-bold text-accent uppercase tracking-widest text-[9px] mr-2">Visual Trends:</span>
                            {category.visualTrends.join(', ')}
                          </div>
                        )}
                        {category.creativeAdvice && (
                          <div className="text-xs text-slate-400">
                            <span className="font-bold text-accent uppercase tracking-widest text-[9px] mr-2">Creative Advice:</span>
                            {category.creativeAdvice}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {category.generatedPrompts.length === 0 ? (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onGenerate(category.id)}
                        disabled={category.isGeneratingPrompts}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all disabled:opacity-50 futuristic-glow text-xs sm:text-sm"
                      >
                        <Sparkles size={18} sm:size={20} />
                        <span>Initiate Synthesis</span>
                      </motion.button>
                    ) : (
                      <>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onGenerate(category.id)}
                          disabled={category.isGeneratingPrompts}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-slate-800/50 hover:bg-slate-800 text-slate-200 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold border border-slate-700/50 transition-all disabled:opacity-50 text-xs sm:text-sm"
                        >
                          <RefreshCw size={16} sm:size={18} className={category.isGeneratingPrompts ? "animate-spin" : ""} />
                          <span>Regenerate</span>
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onUpgrade(category.id)}
                          disabled={category.isUpgrading}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold border border-orange-500/30 transition-all disabled:opacity-50 text-xs sm:text-sm"
                        >
                          <Wand2 size={16} sm:size={18} />
                          <span>DNA Upgrade</span>
                        </motion.button>
                        <div className="w-px h-8 sm:h-10 bg-slate-800 hidden sm:block mx-1 sm:mx-2" />
                        {(!category.metadata || category.metadata.length === 0) ? (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onGenerateMetadata(category.id)}
                            disabled={category.isGeneratingMetadata}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold border border-cyan-500/30 transition-all disabled:opacity-50 text-xs sm:text-sm"
                          >
                            <Sparkles size={16} sm:size={18} />
                            <span>Metadata</span>
                          </motion.button>
                        ) : (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onPolishMetadata(category.id)}
                            disabled={category.isGeneratingMetadata}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold border border-emerald-500/30 transition-all disabled:opacity-50 text-xs sm:text-sm"
                          >
                            <Zap size={16} sm:size={18} />
                            <span>Polish SEO</span>
                          </motion.button>
                        )}
                        <div className="w-px h-8 sm:h-10 bg-slate-800 hidden sm:block mx-1 sm:mx-2" />
                        <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownload(category)}
                          className="p-3 sm:p-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl sm:rounded-2xl border border-slate-700/50 transition-all"
                          title="Export TXT"
                        >
                          <Download size={18} sm:size={20} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopyAll(category)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-accent hover:bg-accent/90 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all futuristic-glow text-xs sm:text-sm"
                        >
                          <Copy size={18} sm:size={20} />
                          <span>Copy All</span>
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-10">
                {category.generatedPrompts.length === 0 ? (
                  <div className="text-center py-16 sm:py-24 bg-black/20 rounded-2xl sm:rounded-3xl border border-dashed border-slate-800/50">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-slate-700/30">
                      <Sparkles className="text-slate-600" size={32} sm:size={40} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-2 font-display">Awaiting Synthesis</h3>
                    <p className="text-slate-500 text-xs sm:text-sm font-light px-4">Execute the command above to generate unique visual descriptors.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {category.generatedPrompts.map((prompt, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-slate-900/40 border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 group/item hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-black/40 rounded-lg sm:rounded-xl flex items-center justify-center text-accent font-mono font-bold text-base sm:text-lg border border-white/5 group-hover/item:border-accent/20 transition-all">
                            {index + 1}
                          </div>
                          <div className="flex-grow pt-0 sm:pt-1">
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">{prompt}</p>
                          </div>
                          <div className="flex-shrink-0 flex justify-end gap-2">
                            <motion.button 
                              whileHover={{ scale: 1.1, backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onVisualize(prompt)}
                              className="p-2.5 sm:p-4 bg-black/40 rounded-xl sm:rounded-2xl text-cyan-400/60 transition-all border border-white/5 hover:border-cyan-500/30"
                              title="Visualize with Gemini"
                            >
                              <Eye size={16} sm:size={18} />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1, backgroundColor: 'var(--color-accent)', color: '#000' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCopy(prompt)}
                              className="p-2.5 sm:p-4 bg-black/40 rounded-xl sm:rounded-2xl text-slate-400 transition-all border border-white/5 hover:border-accent/30"
                              title="Copy Prompt"
                            >
                              <Copy size={16} sm:size={18} />
                            </motion.button>
                          </div>
                        </div>

                        {category.promptScores && category.promptScores[index] && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 pt-6 border-t border-white/5"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                              <div className="flex items-center gap-4">
                                <div className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                                  category.promptScores[index].score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]' :
                                  category.promptScores[index].score >= 60 ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_10px_rgba(45,212,191,0.2)]' :
                                  'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                }`}>
                                  Quality Index: {category.promptScores[index].score}%
                                </div>
                              </div>
                              <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                {[
                                  { label: 'Density', val: category.promptScores[index].density, color: 'bg-accent' },
                                  { label: 'Clarity', val: category.promptScores[index].clarity, color: 'bg-cyan-500' },
                                  { label: 'Specific', val: category.promptScores[index].specificity, color: 'bg-indigo-500' },
                                  { label: 'Adobe', val: category.promptScores[index].adherence, color: 'bg-purple-500' }
                                ].map((m, i) => (
                                  <div key={i} className="flex flex-col items-center sm:items-start">
                                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-2">{m.label}</span>
                                    <div className="w-full sm:w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
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
                            <div className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-4">
                              <p className="text-sm text-slate-300 italic leading-relaxed font-light">
                                <span className="text-accent font-bold not-italic mr-2 uppercase tracking-widest text-[10px]">Analysis:</span>
                                {category.promptScores[index].feedback}
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                {[
                                  { label: 'Keyword Vectors', text: category.promptScores[index].keywordFeedback },
                                  { label: 'Visual Clarity', text: category.promptScores[index].clarityFeedback },
                                  { label: 'Technical Specs', text: category.promptScores[index].specificityFeedback },
                                  { label: 'Compliance', text: category.promptScores[index].adherenceFeedback }
                                ].map((f, i) => f.text && (
                                  <div key={i} className="space-y-2">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{f.label}</span>
                                    <p className="text-xs text-slate-400 leading-relaxed font-light">{f.text}</p>
                                  </div>
                                ))}
                              </div>

                              {category.promptScores[index].groundingSources && category.promptScores[index].groundingSources!.length > 0 && (
                                <div className="pt-4 border-t border-white/5 space-y-2">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Market Validation Sources</span>
                                  <div className="flex flex-wrap gap-2">
                                    {category.promptScores[index].groundingSources!.map((source, i) => (
                                      <a 
                                        key={i} 
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-accent hover:text-white hover:underline transition-colors bg-accent/10 px-2 py-1 rounded border border-accent/20 flex items-center gap-1"
                                      >
                                        <Globe size={10} />
                                        {source.title.length > 40 ? source.title.substring(0, 40) + '...' : source.title}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
