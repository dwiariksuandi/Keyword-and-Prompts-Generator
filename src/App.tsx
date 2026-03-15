import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { analyzeKeyword, generatePrompts, validateApiKey, handleGeminiError } from './services/gemini';
import { CategoryResult, AppSettings, HistoryItem } from './types';
import Settings from './components/Settings';
import TopTab from './components/TopTab';
import AnalysisTab from './components/AnalysisTab';
import ResultsTab from './components/ResultsTab';
import DonateTab from './components/DonateTab';
import PromptTab from './components/PromptTab';
import { ResultRow } from './components/ResultRow';

type Tab = "top" | "analysis" | "results" | "settings" | "donate" | "prompt";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("top");
  const [selectedPromptCategoryId, setSelectedPromptCategoryId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [contentType, setContentType] = useState('Photo');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    model: 'gemini-3.1-pro-preview',
    templateId: 'midjourney',
    promptCount: 100,
    language: 'en',
    includeNegative: false,
    autoSave: true
  });
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keyValidationMessage, setKeyValidationMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [prefsSaved, setPrefsSaved] = useState(false);
  const [prefsValidationMessage, setPrefsValidationMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Filters and Sort
  const [promptsCount, setPromptsCount] = useState(100);
  const [sortBy, setSortBy] = useState("opportunity");
  const [filterCompetition, setFilterCompetition] = useState("all");

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    const savedPrefs = localStorage.getItem('app_preferences');
    
    setSettings(s => {
      const newSettings = { ...s };
      if (savedKey) newSettings.apiKey = savedKey;
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          Object.assign(newSettings, parsed);
          if (parsed.promptCount) {
            setPromptsCount(parsed.promptCount);
          }
        } catch (e) {
          console.error("Failed to parse saved preferences");
        }
      }
      return newSettings;
    });
  }, []);

  const handleSaveApiKey = async () => {
    if (settings.apiKey.trim()) {
      setIsSavingKey(true);
      setKeyValidationMessage(null);
      
      const validationResult = await validateApiKey(settings.apiKey);
      setIsSavingKey(false);

      if (validationResult.isValid) {
        localStorage.setItem('gemini_api_key', settings.apiKey);
        setApiKeySaved(true);
        setKeyValidationMessage({ type: 'success', text: 'API Key is valid and saved!' });
        setTimeout(() => {
          setApiKeySaved(false);
          setKeyValidationMessage(null);
        }, 3000);
      } else {
        setKeyValidationMessage({ type: 'error', text: validationResult.error || 'Invalid API Key. Please check and try again.' });
        setTimeout(() => setKeyValidationMessage(null), 5000);
      }
    }
  };

  const handleSavePreferences = () => {
    const prefsToSave = {
      model: settings.model,
      templateId: settings.templateId,
      promptCount: settings.promptCount,
      language: settings.language,
      includeNegative: settings.includeNegative,
      autoSave: settings.autoSave
    };
    
    localStorage.setItem('app_preferences', JSON.stringify(prefsToSave));
    setPrefsSaved(true);
    setPrefsValidationMessage({ type: 'success', text: 'Preferences saved successfully!' });
    
    setTimeout(() => {
      setPrefsSaved(false);
      setPrefsValidationMessage(null);
    }, 3000);
  };

  const handleAnalyze = async () => {
    if (!keyword.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeKeyword(keyword, contentType, settings);
      const formattedResults: CategoryResult[] = data.map((item: any) => ({
        id: Math.random().toString(36).substring(7),
        categoryName: item.categoryName,
        contentType: contentType,
        mainKeywords: item.mainKeywords,
        volumeLevel: item.volumeLevel,
        volumeNumber: item.volumeNumber,
        competition: item.competition,
        competitionScore: item.competitionScore,
        trend: item.trend,
        trendPercent: item.trendPercent,
        difficultyScore: item.difficultyScore,
        opportunityScore: item.opportunityScore,
        creativeAdvice: item.creativeAdvice,
        generatedPrompts: [],
        isGeneratingPrompts: false,
        isUpgrading: false,
        isStarred: false,
      }));
      setResults(formattedResults);
      
      setHistory(prev => [{
        id: Date.now().toString(),
        query: keyword,
        contentType: contentType,
        timestamp: new Date().toISOString(),
        categoryCount: formattedResults.length,
        promptCount: 0
      }, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(handleGeminiError(error));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePrompts = async (id: string) => {
    const result = results.find(r => r.id === id);
    if (!result) return;

    setResults(prev => prev.map(r => r.id === id ? { ...r, isGeneratingPrompts: true } : r));
    
    try {
      const actualCountToGenerate = Math.min(promptsCount, 1500); 
      const prompts = await generatePrompts(keyword, result.categoryName, actualCountToGenerate, settings, result.contentType);
      
      let finalPrompts = [...prompts];
      if (finalPrompts.length < promptsCount) {
          while(finalPrompts.length < promptsCount) {
              finalPrompts = [...finalPrompts, ...prompts];
          }
          finalPrompts = finalPrompts.slice(0, promptsCount);
      }

      setResults(prev => prev.map(r => r.id === id ? { 
        ...r, 
        generatedPrompts: finalPrompts,
        isGeneratingPrompts: false 
      } : r));
    } catch (error) {
      console.error("Prompt generation failed:", error);
      alert(handleGeminiError(error));
      setResults(prev => prev.map(r => r.id === id ? { ...r, isGeneratingPrompts: false } : r));
    }
  };

  const upgradePrompt = (originalPrompt: string): string => {
    const qualityEnhancers = [
      "masterpiece quality, ", "award-winning composition, ", "editorial excellence, ",
      "museum-quality, ", "professional-grade, ", "critically acclaimed, "
    ];
    const technicalEnhancers = [
      "sharp focus, intricate details, ", "8K UHD resolution, crystal clarity, ",
      "hyper-realistic textures, ", "stunning visual fidelity, ", "meticulous craftsmanship, "
    ];
    
    const randomQuality = qualityEnhancers[Math.floor(Math.random() * qualityEnhancers.length)];
    const randomTechnical = technicalEnhancers[Math.floor(Math.random() * technicalEnhancers.length)];

    return `${randomQuality}${originalPrompt}, ${randomTechnical}octane render, ray tracing`;
  };

  const handleUpgradePrompts = async (categoryId: string) => {
    setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isUpgrading: true } : c));
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    
    setResults(prev => prev.map(c => {
      if (c.id === categoryId && c.generatedPrompts.length > 0) {
        const upgradedPrompts = c.generatedPrompts.map(prompt => upgradePrompt(prompt));
        return { ...c, generatedPrompts: upgradedPrompts, isUpgrading: false };
      }
      return c;
    }));
  };

  const handleToggleStar = (id: string) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, isStarred: !r.isStarred } : r));
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

  const handleCopyAllPrompts = (category: CategoryResult) => {
    navigator.clipboard.writeText(category.generatedPrompts.join('\n\n'));
    alert('Copied to clipboard!');
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setKeyword(item.query);
    setContentType(item.contentType || 'Photo');
    setActiveTab("top");
  };

  const handleViewPrompts = (id: string) => {
    setSelectedPromptCategoryId(id);
    setActiveTab("prompt");
  };

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "opportunity": return b.opportunityScore - a.opportunityScore;
      case "volume": return b.volumeNumber - a.volumeNumber;
      case "trend": return b.trendPercent - a.trendPercent;
      case "difficulty": return a.difficultyScore - b.difficultyScore;
      default: return 0;
    }
  }).filter(c => filterCompetition === "all" || c.competition === filterCompetition);

  return (
    <div className="min-h-screen bg-[#0B1121] text-slate-300 font-sans selection:bg-cyan-500/30">
      <nav className="flex items-center justify-center p-6">
        <div className="flex items-center space-x-1 bg-[#1E293B]/50 rounded-full p-1 border border-slate-800">
          <div className="p-2 bg-slate-800 rounded-full text-[#00D8B6] mr-2">
            <Sparkles size={16} />
          </div>
          <button onClick={() => setActiveTab('top')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'top' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>TOP</button>
          <button onClick={() => setActiveTab('analysis')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>ANALYSIS</button>
          <button onClick={() => setActiveTab('results')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'results' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>RESULTS</button>
          <button onClick={() => { setActiveTab('prompt'); setSelectedPromptCategoryId(null); }} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'prompt' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>PROMPT</button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>SETTINGS</button>
          <button onClick={() => setActiveTab('donate')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'donate' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>DONATE</button>
        </div>
      </nav>

      <main>
        {activeTab === 'settings' && (
          <Settings 
            settings={settings} 
            setSettings={setSettings} 
            onSaveApiKey={handleSaveApiKey} 
            apiKeySaved={apiKeySaved} 
            isSavingKey={isSavingKey}
            keyValidationMessage={keyValidationMessage}
            onSavePreferences={handleSavePreferences}
            prefsSaved={prefsSaved}
            prefsValidationMessage={prefsValidationMessage}
          />
        )}

        {activeTab === 'top' && (
          <>
            <TopTab 
              keyword={keyword}
              setKeyword={setKeyword}
              contentType={contentType}
              setContentType={setContentType}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              results={results}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterCompetition={filterCompetition}
              setFilterCompetition={setFilterCompetition}
            />

            {results.length > 0 && (
              <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs text-slate-400 uppercase border-b border-slate-800 bg-[#111827]">
                        <tr>
                          <th className="px-6 py-4 font-medium">Category</th>
                          <th className="px-6 py-4 font-medium">Main Keywords</th>
                          <th className="px-6 py-4 font-medium">Volume</th>
                          <th className="px-6 py-4 font-medium">Competition</th>
                          <th className="px-6 py-4 font-medium">Trend</th>
                          <th className="px-6 py-4 font-medium">Opportunity</th>
                          <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {sortedResults.map((result) => (
                          <ResultRow 
                            key={result.id} 
                            result={result} 
                            onToggleStar={handleToggleStar}
                            onViewPrompts={handleViewPrompts}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'analysis' && (
          <AnalysisTab 
            results={results} 
            onToggleStar={handleToggleStar} 
          />
        )}
        
        {activeTab === 'results' && (
          <ResultsTab 
            results={results} 
            history={history} 
            onClearHistory={handleClearHistory} 
            onLoadHistory={handleLoadHistory} 
          />
        )}
        
        {activeTab === 'donate' && (
          <DonateTab />
        )}

        {activeTab === 'prompt' && (
          <PromptTab 
            results={results} 
            selectedCategoryId={selectedPromptCategoryId} 
            onBack={() => setActiveTab('top')} 
            onGenerate={handleGeneratePrompts}
            onUpgrade={handleUpgradePrompts}
            promptsCount={promptsCount}
            setPromptsCount={setPromptsCount}
          />
        )}
      </main>
    </div>
  );
}
