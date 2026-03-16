import React, { useState } from 'react';
import { FileText, History, Lightbulb, Download, Copy, Check, ChevronDown, ChevronUp, Trash2, Search, FileSpreadsheet, Loader2 } from 'lucide-react';
import { CategoryResult, HistoryItem } from '../types';

interface ResultsTabProps {
  results: CategoryResult[];
  history: HistoryItem[];
  onClearHistory: () => void;
  onLoadHistory: (item: HistoryItem) => void;
  onGenerateMetadata: (categoryId: string) => void;
}

export default function ResultsTab({ results, history, onClearHistory, onLoadHistory, onGenerateMetadata }: ResultsTabProps) {
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

    // Adobe Stock CSV format: Filename, Title, Keywords, Category, Releases
    let csvContent = "Filename,Title,Keywords,Category,Releases\n";
    
    category.metadata.forEach((meta, index) => {
      const filename = `image_${index + 1}.jpg`;
      // Escape quotes in title
      const title = `"${meta.title.replace(/"/g, '""')}"`;
      // Join keywords and escape quotes
      const keywords = `"${meta.keywords.join(',').replace(/"/g, '""')}"`;
      // Default category (e.g., 1 for Animals, 2 for Buildings... we can leave blank or use a default)
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
    <div className="max-w-6xl mx-auto px-6 pb-20 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Generated Results</h1>
        <p className="text-slate-400">View and manage all your generated prompts</p>
      </div>
      
      {/* Results Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-sm text-slate-400">Total Prompts</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalPromptsGenerated}</p>
        </div>
        
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <History className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-slate-400">Search History</span>
          </div>
          <p className="text-3xl font-bold text-white">{history.length}</p>
        </div>
        
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-slate-400">Categories with Prompts</span>
          </div>
          <p className="text-3xl font-bold text-white">{categoriesWithPrompts.length}</p>
        </div>
      </div>
      
      {/* Download All Button */}
      {categoriesWithPrompts.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleDownloadAll}
            className="flex items-center bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All Prompts
          </button>
        </div>
      )}
      
      {/* Generated Prompts List */}
      <div className="space-y-4">
        {categoriesWithPrompts.map((category) => (
          <div 
            key={category.id}
            className="bg-[#111827] rounded-xl border border-slate-800 overflow-hidden"
          >
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
              onClick={() => toggleExpand(category.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-[#00D8B6] font-medium">{category.categoryName}</span>
                <span className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-full">
                  {category.generatedPrompts.length} prompts
                </span>
                {category.metadata && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Metadata Ready
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!category.metadata ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateMetadata(category.id);
                    }}
                    disabled={category.isGeneratingMetadata}
                    className="flex items-center px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {category.isGeneratingMetadata ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                    )}
                    {category.isGeneratingMetadata ? 'Generating...' : 'Generate Metadata'}
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadCSV(category);
                    }}
                    className="flex items-center px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </button>
                )}
                <div className="w-px h-6 bg-slate-700 mx-1"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyAllPrompts(category);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Copy All"
                >
                  {copiedId === `all-${category.id}` ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPrompts(category);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                {expandedCategories.has(category.id) ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>
            
            {expandedCategories.has(category.id) && (
              <div className="border-t border-slate-800 p-4">
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {category.generatedPrompts.map((prompt, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300 leading-relaxed cursor-pointer hover:bg-slate-800 border border-slate-700/50 transition-colors"
                      onClick={() => handleCopyPrompt(prompt, `${category.id}-${idx}`)}
                    >
                      <p className="pr-8">{prompt}</p>
                      <div className="absolute top-3 right-3">
                        {copiedId === `${category.id}-${idx}` ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {categoriesWithPrompts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#111827] flex items-center justify-center border border-slate-800">
              <FileText className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No prompts generated yet</h3>
            <p className="text-slate-400 mb-4">
              Go to the TOP tab and generate some prompts
            </p>
          </div>
        )}
      </div>
      
      {/* Search History */}
      {history.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Search History</h2>
            <button
              onClick={onClearHistory}
              className="flex items-center text-sm text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </button>
          </div>
          <div className="bg-[#111827] rounded-xl border border-slate-800 divide-y divide-slate-800">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 hover:bg-slate-800/50 cursor-pointer transition-colors"
                onClick={() => onLoadHistory(item)}
              >
                <div>
                  <p className="text-white font-medium">{item.query}</p>
                  <p className="text-sm text-slate-400">
                    {item.categoryCount} categories | {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <Search className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
