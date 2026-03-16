import React from 'react';
import { Download, Copy, ArrowLeft, Wand2, Sparkles, RefreshCw } from 'lucide-react';
import { CategoryResult } from '../types';

interface PromptTabProps {
  results: CategoryResult[];
  selectedCategoryId: string | null;
  onBack: () => void;
  onGenerate: (id: string) => void | Promise<void>;
  onUpgrade: (id: string) => void | Promise<void>;
  promptsCount: number;
  setPromptsCount: React.Dispatch<React.SetStateAction<number>>;
  onShowToast: (message: string) => void;
}

export default function PromptTab({ 
  results, 
  selectedCategoryId, 
  onBack, 
  onGenerate, 
  onUpgrade,
  promptsCount,
  setPromptsCount,
  onShowToast
}: PromptTabProps) {
  const selectedCategory = results.find(r => r.id === selectedCategoryId);
  
  // If no specific category is selected, or we want to show all categories that have prompts
  const displayCategories = selectedCategory 
    ? [selectedCategory] 
    : results;

  const isGeneratingAny = displayCategories.some(c => c.isGeneratingPrompts);
  const isUpgradingAny = displayCategories.some(c => c.isUpgrading);
  const isProcessing = isGeneratingAny || isUpgradingAny;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Berhasil disalin ke clipboard!');
  };

  const handleCopyAll = (category: CategoryResult) => {
    navigator.clipboard.writeText(category.generatedPrompts.join('\n\n'));
    onShowToast('Semua prompt berhasil disalin!');
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

  if (displayCategories.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-12">
          <h2 className="text-xl font-medium text-slate-300 mb-2">No Categories Available</h2>
          <p className="text-slate-500 mb-6">Go back to the Top tab and analyze a keyword first.</p>
          <button 
            onClick={onBack}
            className="bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 px-6 py-2 rounded-md font-medium transition-colors"
          >
            Go to Top Tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 relative">
      {isProcessing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-md">
          <div className="bg-[#111827] border border-slate-800 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,216,182,0.1)] flex flex-col items-center max-w-sm w-full mx-4 text-center">
            <div className="relative w-20 h-20 mb-8">
              <div className={`absolute inset-0 border-4 rounded-full animate-spin ${isGeneratingAny ? 'border-[#00D8B6]/20 border-t-[#00D8B6]' : 'border-[#FF8A00]/20 border-t-[#FF8A00]'}`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {isGeneratingAny ? <Sparkles className="text-[#00D8B6] animate-pulse" size={32} /> : <Wand2 className="text-[#FF8A00] animate-pulse" size={32} />}
              </div>
            </div>
            <h3 className={`text-2xl font-black mb-3 tracking-tight ${isGeneratingAny ? 'text-[#00D8B6]' : 'text-[#FF8A00]'}`}>
              {isGeneratingAny ? 'Crafting Prompts' : 'Optimizing Style'}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our AI is meticulously {isGeneratingAny ? 'generating unique prompts' : 'refining the visual language'} for your selected niche. This won't take long.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack}
            className="p-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-2xl text-slate-300 transition-all active:scale-90"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Prompt Studio</h1>
            <p className="text-slate-500 text-sm">Generate and manage high-converting prompts</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#111827] border border-slate-800 rounded-2xl p-2 pl-5 shadow-lg">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Prompts per category</span>
          <div className="flex items-center bg-slate-800/50 rounded-xl px-3 py-2 border border-slate-700">
            <input 
              type="number" 
              value={promptsCount || ''}
              onChange={(e) => setPromptsCount(Number(e.target.value))}
              onBlur={() => {
                if (promptsCount < 1) setPromptsCount(1);
                if (promptsCount > 1500) setPromptsCount(1500);
              }}
              className="bg-transparent text-white w-12 outline-none text-sm font-bold text-center"
              min="1"
              max="1500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {displayCategories.map(category => (
          <div key={category.id} className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-900/30">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-[#00D8B6] tracking-tight">{category.categoryName}</h2>
                  <div className="flex flex-wrap gap-2">
                    {category.mainKeywords.map((kw, i) => (
                      <span key={i} className="bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-slate-700/50">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {category.generatedPrompts.length === 0 ? (
                    <button 
                      onClick={() => onGenerate(category.id)}
                      disabled={category.isGeneratingPrompts}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-[0_4px_15px_rgba(0,216,182,0.2)]"
                    >
                      <Sparkles size={18} />
                      <span>Generate Prompts</span>
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => onGenerate(category.id)}
                        disabled={category.isGeneratingPrompts}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-xl font-bold border border-slate-700 transition-all disabled:opacity-50"
                      >
                        <RefreshCw size={16} className={category.isGeneratingPrompts ? "animate-spin" : ""} />
                        <span>Regenerate</span>
                      </button>
                      <button 
                        onClick={() => onUpgrade(category.id)}
                        disabled={category.isUpgrading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FF8A00]/10 hover:bg-[#FF8A00]/20 text-[#FF8A00] px-4 py-3 rounded-xl font-bold border border-[#FF8A00]/30 transition-all disabled:opacity-50"
                      >
                        <Wand2 size={16} />
                        <span>Optimize</span>
                      </button>
                      <div className="w-px h-8 bg-slate-800 hidden sm:block mx-1" />
                      <button 
                        onClick={() => handleDownload(category)}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all"
                        title="Download TXT"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => handleCopyAll(category)}
                        className="flex items-center gap-2 bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(0,216,182,0.2)]"
                      >
                        <Copy size={18} />
                        <span>Copy All</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              {category.generatedPrompts.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="text-slate-600" size={32} />
                  </div>
                  <h3 className="text-slate-300 font-bold mb-1">No Prompts Yet</h3>
                  <p className="text-slate-500 text-sm">Click the button above to generate unique prompts for this niche.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {category.generatedPrompts.map((prompt, index) => (
                    <div key={index} className="bg-slate-800/20 border border-slate-800/50 rounded-2xl p-5 flex flex-col gap-4 group hover:border-[#00D8B6]/30 hover:bg-slate-800/40 transition-all">
                      <div className="flex gap-5">
                        <div className="flex-shrink-0 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-[#00D8B6] font-black text-sm border border-slate-800 group-hover:border-[#00D8B6]/20 transition-all">
                          {index + 1}
                        </div>
                        <div className="flex-grow pt-1">
                          <p className="text-slate-300 text-sm leading-relaxed font-medium">{prompt}</p>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleCopy(prompt)}
                            className="p-3 bg-slate-900 hover:bg-[#00D8B6] hover:text-slate-900 rounded-xl text-slate-400 transition-all border border-slate-800"
                            title="Copy Prompt"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>

                      {category.promptScores && category.promptScores[index] && (
                        <div className="mt-2 pt-4 border-t border-slate-800/50">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                category.promptScores[index].score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                category.promptScores[index].score >= 60 ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                Quality Score: {category.promptScores[index].score}%
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] text-slate-500 uppercase font-bold mb-1">Density</span>
                                <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#00D8B6]" style={{ width: `${category.promptScores[index].density}%` }} />
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] text-slate-500 uppercase font-bold mb-1">Clarity</span>
                                <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-500" style={{ width: `${category.promptScores[index].clarity}%` }} />
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] text-slate-500 uppercase font-bold mb-1">Specific</span>
                                <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500" style={{ width: `${category.promptScores[index].specificity}%` }} />
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] text-slate-500 uppercase font-bold mb-1">Adobe</span>
                                <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-purple-500" style={{ width: `${category.promptScores[index].adherence}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50 space-y-3">
                            <p className="text-[11px] text-slate-300 italic leading-relaxed">
                              <span className="text-[#00D8B6] font-bold not-italic mr-1">Summary:</span>
                              {category.promptScores[index].feedback}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                              {category.promptScores[index].keywordFeedback && (
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Keyword Usage</span>
                                  <p className="text-[10px] text-slate-400 leading-relaxed">{category.promptScores[index].keywordFeedback}</p>
                                </div>
                              )}
                              {category.promptScores[index].clarityFeedback && (
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Clarity & Subject</span>
                                  <p className="text-[10px] text-slate-400 leading-relaxed">{category.promptScores[index].clarityFeedback}</p>
                                </div>
                              )}
                              {category.promptScores[index].specificityFeedback && (
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Technical Specificity</span>
                                  <p className="text-[10px] text-slate-400 leading-relaxed">{category.promptScores[index].specificityFeedback}</p>
                                </div>
                              )}
                              {category.promptScores[index].adherenceFeedback && (
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Adobe Stock Compliance</span>
                                  <p className="text-[10px] text-slate-400 leading-relaxed">{category.promptScores[index].adherenceFeedback}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
