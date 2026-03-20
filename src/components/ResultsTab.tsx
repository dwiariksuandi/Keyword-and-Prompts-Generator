import React, { useState } from 'react';
import { FileText, History, Lightbulb, Download, Copy, Check, ChevronDown, ChevronUp, Trash2, Search, FileSpreadsheet, Loader2, Sparkles, Database, Clock, Layers, Wand2 } from 'lucide-react';
import { CategoryResult, HistoryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ResultsTabProps {
  results: CategoryResult[];
  history: HistoryItem[];
  onClearHistory: () => void;
  onLoadHistory: (item: HistoryItem) => void;
  onGenerateMetadata: (categoryId: string) => void;
  onPolishMetadata: (categoryId: string) => void;
  onUpgrade: (categoryId: string) => void;
}

export default function ResultsTab({ results, history, onClearHistory, onLoadHistory, onGenerateMetadata, onPolishMetadata, onUpgrade }: ResultsTabProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categoriesWithPrompts = results.filter(c => c.generatedPrompts.length > 0);
  const totalPromptsGenerated = categoriesWithPrompts.reduce((sum, c) => sum + c.generatedPrompts.length, 0);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCopyAllPrompts = (category: CategoryResult) => {
    navigator.clipboard.writeText(category.generatedPrompts.join('\n\n'));
    setCopiedId(`all-${category.id}`);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDownloadPrompts = (category: CategoryResult) => {
    const content = `Category: ${category.categoryName}\nKeywords: ${category.mainKeywords.join(", ")}\nGenerated: ${new Date().toLocaleString()}\n\n${"-".repeat(50)}\n\n${category.generatedPrompts.join('\n\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category.categoryName.replace(/\s+/g, '_')}_prompts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    if (categoriesWithPrompts.length === 0) return;
    
    let content = `Keyword Research Results\nGenerated: ${new Date().toLocaleString()}\nTotal Categories: ${categoriesWithPrompts.length}\nTotal Prompts: ${totalPromptsGenerated}\n\n${"=".repeat(60)}\n\n`;
    
    categoriesWithPrompts.forEach(category => {
      content += `\n${"=".repeat(60)}\nCATEGORY: ${category.categoryName}\nKeywords: ${category.mainKeywords.join(", ")}\nSearch Volume: ${category.volumeLevel} (${category.volumeNumber.toLocaleString()})\nCompetition: ${category.competition}\nOpportunity Score: ${category.opportunityScore}/100\n${"=".repeat(60)}\n\n`;
      content += category.generatedPrompts.join('\n\n');
      content += '\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyword_research_all_prompts_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = (category: CategoryResult) => {
    if (!category.metadata) return;

    let csvContent = "Filename,Title,Keywords,Category,Releases\n";
    
    category.metadata.forEach((meta, index) => {
      const filename = `image_${index + 1}.jpg`;
      const title = `"${meta.title.replace(/"/g, '""')}"`;
      const keywords = `"${meta.keywords.join(',').replace(/"/g, '""')}"`;
      const categoryId = ""; 
      const releases = "";
      
      csvContent += `${filename},${title},${keywords},${categoryId},${releases}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category.categoryName.replace(/\s+/g, '_')}_metadata.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-32 space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-12 sm:mt-16 space-y-2"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tighter font-display">
          Generated <span className="text-accent">Assets</span>
        </h1>
        <p className="text-slate-400 font-light text-base sm:text-lg">Repository of synthesized prompts and market temporal logs.</p>
      </motion.div>
      
      {/* Results Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {[
          { label: 'Neural Prompts', value: totalPromptsGenerated, icon: FileText, color: 'accent' },
          { label: 'Temporal Log', value: history.length, icon: Clock, color: 'purple' },
          { label: 'Active Sectors', value: categoriesWithPrompts.length, icon: Layers, color: 'emerald' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 sm:p-8 group relative overflow-hidden hover:border-accent/30 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-all duration-700" />
            <div className="flex items-center gap-4 sm:gap-5 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-500">
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 group-hover:text-accent transition-colors" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{stat.label}</span>
            </div>
            <p className="text-4xl sm:text-5xl font-bold text-white font-mono tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Download All Button */}
      {categoriesWithPrompts.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadAll}
            className="flex items-center bg-accent hover:bg-accent/90 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-accent/20 border border-accent/20 uppercase tracking-widest text-xs"
          >
            <Download className="w-5 h-5 mr-3" />
            Export Protocol
          </motion.button>
        </motion.div>
      )}
      
      {/* Generated Prompts List */}
      <div className="space-y-6 sm:space-y-8">
        <AnimatePresence>
          {categoriesWithPrompts.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel overflow-hidden group hover:border-accent/30 transition-all duration-500"
            >
              <div 
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 sm:p-8 cursor-pointer hover:bg-white/5 transition-colors gap-6 sm:gap-8"
                onClick={() => toggleExpand(category.id)}
              >
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <span className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight group-hover:text-accent transition-colors">{category.categoryName}</span>
                  <span className="bg-white/5 text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl border border-white/10">
                    {category.generatedPrompts.length} PROMPTS
                  </span>
                  {category.metadata && (
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl flex items-center border border-emerald-500/20">
                      <Check className="w-3 h-3 mr-2" /> Metadata Valid
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
                  {!category.metadata ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onGenerateMetadata(category.id);
                      }}
                      disabled={category.isGeneratingMetadata}
                      className="flex-1 lg:flex-none flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 border border-accent/20"
                    >
                      {category.isGeneratingMetadata ? (
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin" />
                      ) : (
                        <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                      )}
                      {category.isGeneratingMetadata ? 'Synthesizing...' : 'Generate Metadata'}
                    </motion.button>
                  ) : (
                    <div className="flex gap-2 w-full lg:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadCSV(category);
                        }}
                        className="flex-1 lg:flex-none flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all border border-emerald-500/20"
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                        CSV
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPolishMetadata(category.id);
                        }}
                        disabled={category.isGeneratingMetadata}
                        className="flex-1 lg:flex-none flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all border border-cyan-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                        Polish
                      </motion.button>
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpgrade(category.id);
                    }}
                    disabled={category.isUpgrading}
                    className="flex-1 lg:flex-none flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 border border-orange-500/20"
                  >
                    {category.isUpgrading ? (
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    )}
                    {category.isUpgrading ? 'Optimizing...' : 'Optimize'}
                  </motion.button>
                  <div className="w-px h-8 sm:h-10 bg-white/10 mx-1 sm:mx-2 hidden lg:block"></div>
                  <div className="flex items-center gap-2 sm:gap-3 ml-auto lg:ml-0">
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyAllPrompts(category);
                      }}
                      className="p-2 sm:p-3 text-slate-500 hover:text-white rounded-xl sm:rounded-2xl transition-all border border-transparent hover:border-white/10"
                      title="Copy All"
                    >
                      {copiedId === `all-${category.id}` ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPrompts(category);
                      }}
                      className="p-2 sm:p-3 text-slate-500 hover:text-white rounded-xl sm:rounded-2xl transition-all border border-transparent hover:border-white/10"
                      title="Download"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                    <div className="p-2 sm:p-3 text-slate-500 group-hover:text-accent transition-colors">
                      {expandedCategories.has(category.id) ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <AnimatePresence>
                {expandedCategories.has(category.id) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 p-8 bg-black/40"
                  >
                    <div className="max-h-[500px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                      {category.generatedPrompts.map((prompt, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="group/item relative bg-white/5 rounded-2xl p-6 text-sm text-slate-300 leading-relaxed cursor-pointer hover:bg-white/10 border border-white/5 hover:border-accent/30 transition-all duration-300"
                          onClick={() => handleCopyPrompt(prompt, `${category.id}-${idx}`)}
                        >
                          <p className="pr-12 font-light text-base">{prompt}</p>
                          <div className="absolute top-6 right-6">
                            {copiedId === `${category.id}-${idx}` ? (
                              <Check className="w-5 h-5 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            ) : (
                              <Copy className="w-5 h-5 opacity-0 group-hover/item:opacity-100 transition-opacity text-slate-500" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {categoriesWithPrompts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 glass-panel bg-white/5"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10"
            >
              <Database className="w-12 h-12 text-slate-700" />
            </motion.div>
            <h3 className="text-3xl font-bold text-white mb-4 font-display tracking-tight">Vault <span className="text-slate-600">Empty</span></h3>
            <p className="text-slate-400 mb-8 font-light max-w-md mx-auto">
              Initiate neural analysis in the <span className="text-accent font-medium">TOP</span> sector to populate this repository.
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Search History */}
      {history.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 space-y-10"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white font-display flex items-center gap-4 tracking-tight">
              <History className="text-accent w-8 h-8" /> Temporal <span className="text-accent">Log</span>
            </h2>
            <motion.button
              whileHover={{ scale: 1.05, color: '#fb7185' }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearHistory}
              className="flex items-center text-xs font-bold uppercase tracking-[0.2em] text-slate-600 transition-colors hover:text-rose-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Purge History
            </motion.button>
          </div>
          <div className="glass-panel divide-y divide-white/5 overflow-hidden">
            {history.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-8 hover:bg-white/5 cursor-pointer transition-all duration-500 group"
                onClick={() => onLoadHistory(item)}
              >
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-white group-hover:text-accent transition-colors font-display tracking-tight">{item.query}</p>
                  <div className="flex items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      <Layers size={12} className="text-accent" /> {item.categoryCount} SECTORS
                    </span>
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      <Clock size={12} className="text-purple-400" /> {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-500"
                >
                  <Search className="w-6 h-6 text-slate-600 group-hover:text-accent transition-colors" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
