import React, { useState } from 'react';
import { 
  FileText, 
  History, 
  Download, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Search, 
  FileSpreadsheet, 
  Loader2, 
  Sparkles, 
  Database, 
  Clock, 
  Layers, 
  Wand2 
} from 'lucide-react';
import { CategoryResult, HistoryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { NeuralMarketMap } from './NeuralMarketMap';

interface ResultsTabProps {
  results: CategoryResult[];
  history: HistoryItem[];
  keyword?: string;
  onClearHistory: () => void;
  onLoadHistory: (item: HistoryItem) => void;
  onGenerateMetadata: (categoryId: string) => void;
  onPolishMetadata: (categoryId: string) => void;
  onUpgrade: (categoryId: string) => void;
}

export default function ResultsTab({ 
  results, 
  history, 
  keyword = '',
  onClearHistory, 
  onLoadHistory, 
  onGenerateMetadata, 
  onPolishMetadata, 
  onUpgrade 
}: ResultsTabProps) {
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
    <div className="max-w-6xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-3">Neural Vault</h2>
          <p className="text-white/40 font-medium max-w-xl">Repository of synthesized prompts and market temporal logs.</p>
        </div>
        
        {categoriesWithPrompts.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadAll}
            className="flex items-center justify-center gap-3 bg-white text-black font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-[10px]"
          >
            <Download className="w-4 h-4" /> Export Protocol
          </motion.button>
        )}
      </div>

      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <NeuralMarketMap keyword={keyword} results={results} />
        </motion.div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Neural Prompts', value: totalPromptsGenerated, icon: FileText, color: 'text-white', id: 'prompts' },
          { label: 'Temporal Log', value: history.length, icon: Clock, color: 'text-white/60', id: 'log' },
          { label: 'Active Sectors', value: categoriesWithPrompts.length, icon: Layers, color: 'text-white/60', id: 'sectors' }
        ].map((stat, index) => (
          <motion.div 
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#0A0A0A] p-8 rounded-[2rem] border border-white/5 shadow-2xl group hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white group-hover:text-black transition-all duration-500">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
            <p className={`text-5xl font-black ${stat.color} tracking-tighter leading-none`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Generated Prompts List */}
      <div className="space-y-8">
        <AnimatePresence>
          {categoriesWithPrompts.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden group hover:border-white/10 transition-all"
            >
              <div 
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-8 cursor-pointer hover:bg-white/[0.02] transition-colors gap-8"
                onClick={() => toggleExpand(category.id)}
              >
                <div className="flex flex-wrap items-center gap-6">
                  <span className="text-2xl font-black text-white uppercase tracking-tight">{category.categoryName}</span>
                  <span className="bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border border-white/5">
                    {category.generatedPrompts.length} PROMPTS
                  </span>
                  {category.metadata && (
                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl flex items-center border border-emerald-500/20">
                      <Check className="w-3 h-3 mr-2" /> Metadata Valid
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                  {!category.metadata ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGenerateMetadata(category.id);
                      }}
                      disabled={category.isGeneratingMetadata}
                      className="flex-1 lg:flex-none flex items-center justify-center px-6 py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 border border-white/5"
                    >
                      {category.isGeneratingMetadata ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                      )}
                      {category.isGeneratingMetadata ? 'Synthesizing...' : 'Generate Metadata'}
                    </button>
                  ) : (
                    <div className="flex gap-2 w-full lg:w-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadCSV(category);
                        }}
                        className="flex-1 lg:flex-none flex items-center justify-center px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-500/20"
                      >
                        <Download className="w-4 h-4 mr-2" /> CSV
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPolishMetadata(category.id);
                        }}
                        disabled={category.isGeneratingMetadata}
                        className="flex-1 lg:flex-none flex items-center justify-center px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-500/20"
                      >
                        <Sparkles className="w-4 h-4 mr-2" /> Polish
                      </button>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpgrade(category.id);
                    }}
                    disabled={category.isUpgrading}
                    className="flex-1 lg:flex-none flex items-center justify-center px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 border border-amber-500/20"
                  >
                    {category.isUpgrading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4 mr-2" />
                    )}
                    {category.isUpgrading ? 'Optimizing...' : 'Optimize'}
                  </button>
                  
                  <div className="flex items-center gap-3 ml-auto lg:ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyAllPrompts(category);
                      }}
                      className="p-3 text-white/20 hover:text-white rounded-xl transition-all border border-transparent hover:border-white/10"
                      title="Copy All"
                    >
                      {copiedId === `all-${category.id}` ? (
                        <Check className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPrompts(category);
                      }}
                      className="p-3 text-white/20 hover:text-white rounded-xl transition-all border border-transparent hover:border-white/10"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <div className="p-3 text-white/10 group-hover:text-white transition-colors">
                      {expandedCategories.has(category.id) ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
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
                    className="border-t border-white/5 p-8 bg-white/[0.01]"
                  >
                    <div className="max-h-[500px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                      {category.generatedPrompts.slice(0, 1).map((prompt, idx) => (
                        <motion.div
                          key={`${category.id}-prompt-${idx}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="group/item relative bg-white/[0.02] rounded-2xl p-6 text-sm text-white/60 leading-relaxed cursor-pointer hover:bg-white/[0.04] border border-white/5 hover:border-white/20 transition-all duration-300"
                          onClick={() => handleCopyPrompt(prompt, `${category.id}-${idx}`)}
                        >
                          <p className="pr-12 font-medium text-base">{prompt}</p>
                          <div className="absolute top-6 right-6">
                            {copiedId === `${category.id}-${idx}` ? (
                              <Check className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Copy className="w-5 h-5 opacity-0 group-hover/item:opacity-100 transition-opacity text-white/20" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {category.generatedPrompts.length > 1 && (
                        <div className="mt-4 p-6 bg-accent/5 border border-accent/20 rounded-2xl flex flex-col items-center justify-center text-center">
                          <p className="text-accent font-bold mb-2">
                            +{category.generatedPrompts.length - 1} prompt lainnya disembunyikan.
                          </p>
                          <p className="text-xs text-white/50 mb-4 max-w-sm">
                            Unduh file TXT untuk melihat seluruh prompt yang dihasilkan.
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPrompts(category);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-accent text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                          >
                            <Download size={16} />
                            Unduh Semua Prompt (.txt)
                          </button>
                        </div>
                      )}
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
            className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-white/5"
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
              <Database className="w-12 h-12 text-white/20" />
            </div>
            <h3 className="text-3xl font-black text-white/80 mb-4 uppercase tracking-tighter">Vault Empty</h3>
            <p className="text-white/40 mb-8 font-medium max-w-md mx-auto">
              Initiate neural analysis in the <span className="text-white font-bold">RESEARCH</span> sector to populate this repository.
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Search History */}
      {history.length > 0 && (
        <div className="mt-32 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
              <History className="text-white w-8 h-8" /> Temporal <span className="text-white/40">Log</span>
            </h2>
            <button
              onClick={onClearHistory}
              className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/20 transition-colors hover:text-rose-500"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Purge History
            </button>
          </div>
          <div className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 shadow-2xl divide-y divide-white/5 overflow-hidden">
            {history.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-8 hover:bg-white/[0.02] cursor-pointer transition-all duration-500 group"
                onClick={() => onLoadHistory(item)}
              >
                <div className="space-y-3">
                  <p className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-white transition-colors">{item.query}</p>
                  <div className="flex items-center gap-6 text-[10px] text-white/30 font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      <Layers size={12} className="text-white/60" /> {item.categoryCount} SECTORS
                    </span>
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                      <Clock size={12} className="text-white/60" /> {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <Search className="w-6 h-6" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
