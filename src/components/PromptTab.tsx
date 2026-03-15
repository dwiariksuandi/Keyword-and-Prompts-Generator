import React from 'react';
import { Download, Copy, ArrowLeft, Wand2, Sparkles } from 'lucide-react';
import { CategoryResult } from '../types';

interface PromptTabProps {
  results: CategoryResult[];
  selectedCategoryId: string | null;
  onBack: () => void;
  onGenerate: (id: string) => void | Promise<void>;
  onUpgrade: (id: string) => void | Promise<void>;
  promptsCount: number;
  setPromptsCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function PromptTab({ 
  results, 
  selectedCategoryId, 
  onBack, 
  onGenerate, 
  onUpgrade,
  promptsCount,
  setPromptsCount
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
    alert('Copied to clipboard!');
  };

  const handleCopyAll = (category: CategoryResult) => {
    navigator.clipboard.writeText(category.generatedPrompts.join('\n\n'));
    alert('All prompts copied to clipboard!');
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
    <div className="max-w-6xl mx-auto px-6 py-8 relative">
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120]/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4">
            <div className="relative w-16 h-16 mb-6">
              <div className={`absolute inset-0 border-4 rounded-full animate-spin ${isGeneratingAny ? 'border-[#00D8B6]/20 border-t-[#00D8B6]' : 'border-[#FF8A00]/20 border-t-[#FF8A00]'}`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {isGeneratingAny ? <Sparkles className="text-[#00D8B6]" size={24} /> : <Wand2 className="text-[#FF8A00]" size={24} />}
              </div>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isGeneratingAny ? 'text-[#00D8B6]' : 'text-[#FF8A00]'}`}>
              {isGeneratingAny ? 'Generating Prompts...' : 'Optimizing Prompts...'}
            </h3>
            <p className="text-slate-400 text-center text-sm">
              Please wait while we process your request. This may take a few moments depending on the number of prompts.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">Manage Prompts</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 shadow-sm focus-within:border-[#00D8B6] focus-within:ring-1 focus-within:ring-[#00D8B6] transition-all">
            <span className="text-slate-400 text-sm font-medium mr-3">Prompts per Category:</span>
            <input 
              type="number" 
              value={promptsCount}
              onChange={(e) => setPromptsCount(Number(e.target.value))}
              className="bg-transparent text-white w-16 outline-none text-sm font-semibold text-right"
              min="1"
              max="1500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {displayCategories.map(category => (
          <div key={category.id} className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#00D8B6] mb-2">{category.categoryName}</h2>
                <div className="flex flex-wrap gap-2">
                  {category.mainKeywords.map((kw, i) => (
                    <span key={i} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-md border border-slate-700">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {category.generatedPrompts.length === 0 ? (
                  <button 
                    onClick={() => onGenerate(category.id)}
                    disabled={category.isGeneratingPrompts}
                    className="bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    {category.isGeneratingPrompts ? 'Generating...' : 'Generate Prompts'}
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => onUpgrade(category.id)}
                      disabled={category.isUpgrading}
                      className="flex items-center gap-2 border border-[#FF8A00] text-[#FF8A00] hover:bg-[#FF8A00]/10 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                    >
                      <Wand2 size={16} />
                      <span>{category.isUpgrading ? 'Optimizing...' : 'Optimize Prompts'}</span>
                    </button>
                    <button 
                      onClick={() => handleDownload(category)}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-md border border-slate-700 transition-colors"
                    >
                      <Download size={16} />
                      <span>Download TXT</span>
                    </button>
                    <button 
                      onClick={() => handleCopyAll(category)}
                      className="flex items-center gap-2 bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      <Copy size={16} />
                      <span>Copy All</span>
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {category.generatedPrompts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  {category.isGeneratingPrompts 
                    ? 'Generating prompts, please wait...' 
                    : 'No prompts generated yet. Click "Generate Prompts" to create them.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {category.generatedPrompts.map((prompt, index) => (
                    <div key={index} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex gap-4 group hover:border-slate-600 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-mono text-sm border border-slate-700">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="text-slate-300 text-sm leading-relaxed">{prompt}</p>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleCopy(prompt)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-300 transition-colors border border-slate-700"
                          title="Copy Prompt"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
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
