import React, { useState, useEffect } from 'react';
import { Sparkles, Key, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { analyzeKeyword, generateAllPromptsBatch, optimizePrompts, validateApiKey, handleGeminiError } from './services/gemini';
import { CategoryResult, AppSettings, HistoryItem } from './types';
import Settings from './components/Settings';
import TopTab from './components/TopTab';
import AnalysisTab from './components/AnalysisTab';
import ResultsTab from './components/ResultsTab';
import DonateTab from './components/DonateTab';
import PromptTab from './components/PromptTab';
import ChangelogTab from './components/ChangelogTab';
import { ResultRow } from './components/ResultRow';

type Tab = "top" | "analysis" | "results" | "settings" | "donate" | "prompt" | "changelog";

export default function App() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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
    templateId: {
      'Photo': 'nanobanana-photo',
      'Illustration': 'nanobanana-illustration',
      'Vector': 'nanobanana-vector',
      'Background': 'nanobanana-background',
      'Video': 'veo-video',
      '3D Render': 'nanobanana-3d'
    },
    promptCount: 100,
    language: 'en',
    includeNegative: false,
    autoSave: true
  });

  const [prefsSaved, setPrefsSaved] = useState(false);
  const [prefsValidationMessage, setPrefsValidationMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Filters and Sort
  const [sortBy, setSortBy] = useState("opportunity");
  const [filterCompetition, setFilterCompetition] = useState("all");

  useEffect(() => {
    const savedPrefs = localStorage.getItem('app_preferences');
    
    setSettings(s => {
      const newSettings = { ...s, apiKey: '' }; // Always reset API key on load
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          Object.assign(newSettings, parsed);
          
          // Migrate old string templateId to Record
          if (typeof newSettings.templateId === 'string') {
            const oldId = newSettings.templateId;
            // Map old generic IDs to specific new ones if needed, or just use defaults
            newSettings.templateId = {
              'Photo': oldId === 'midjourney' ? 'midjourney-photo' : oldId === 'dalle' ? 'dalle-photo' : oldId === 'stable' ? 'stable-photo' : 'nanobanana-photo',
              'Illustration': oldId === 'midjourney' ? 'midjourney-niji' : oldId === 'dalle' ? 'dalle-illustration' : 'nanobanana-illustration',
              'Vector': oldId === 'midjourney' ? 'midjourney-vector' : 'nanobanana-vector',
              'Background': oldId === 'midjourney' ? 'midjourney-background' : oldId === 'dalle' ? 'dalle-background' : oldId === 'stable' ? 'stable-photo' : 'nanobanana-background',
              'Video': 'veo-video',
              '3D Render': oldId === 'midjourney' ? 'midjourney-3d' : oldId === 'dalle' ? 'dalle-3d' : 'nanobanana-3d'
            };
          } else if (newSettings.templateId) {
            // Also migrate existing objects that might have old IDs
            const t = newSettings.templateId as Record<string, string>;
            if (t['Photo'] === 'midjourney') t['Photo'] = 'midjourney-photo';
            if (t['Illustration'] === 'midjourney') t['Illustration'] = 'midjourney-niji';
            if (t['Vector'] === 'midjourney') t['Vector'] = 'midjourney-vector';
            if (t['Background'] === 'midjourney') t['Background'] = 'midjourney-background';
            if (t['Video'] === 'midjourney') t['Video'] = 'veo-video';
            if (t['3D Render'] === 'midjourney') t['3D Render'] = 'midjourney-3d';
            
            if (t['Photo'] === 'dalle') t['Photo'] = 'dalle-photo';
            if (t['Illustration'] === 'dalle') t['Illustration'] = 'dalle-illustration';
            if (t['Background'] === 'dalle') t['Background'] = 'dalle-background';
            if (t['3D Render'] === 'dalle') t['3D Render'] = 'dalle-3d';
            
            if (t['Photo'] === 'stable') t['Photo'] = 'stable-photo';
            if (t['Background'] === 'stable') t['Background'] = 'stable-photo';
            
            if (t['Photo'] === 'stock') t['Photo'] = 'stock-photo';
            if (t['Photo'] === 'nanobanana') t['Photo'] = 'nanobanana-photo';
          }
        } catch (e) {
          console.error("Failed to parse saved preferences");
        }
      }
      return newSettings;
    });

    // Load saved history and results
    try {
      const savedHistory = localStorage.getItem('app_history');
      const savedResults = localStorage.getItem('app_results');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedResults) setResults(JSON.parse(savedResults));
    } catch (e) {
      console.error("Failed to load saved history/results");
    }
  }, []);

  // Auto-save history and results when they change, if autoSave is enabled
  useEffect(() => {
    if (settings.autoSave) {
      localStorage.setItem('app_history', JSON.stringify(history));
      localStorage.setItem('app_results', JSON.stringify(results));
    } else {
      localStorage.removeItem('app_history');
      localStorage.removeItem('app_results');
    }
  }, [history, results, settings.autoSave]);

  const handleStartSession = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!tempApiKey.trim()) return;
    
    setIsValidating(true);
    setValidationError(null);
    
    const validationResult = await validateApiKey(tempApiKey);
    setIsValidating(false);

    if (validationResult.isValid) {
      setSettings(prev => ({ ...prev, apiKey: tempApiKey }));
      setIsSessionActive(true);
    } else {
      setValidationError(validationResult.error || 'Invalid API Key. Please check and try again.');
    }
  };

  const handleEndSession = () => {
    setSettings(prev => ({ ...prev, apiKey: '' }));
    setTempApiKey('');
    setIsSessionActive(false);
    setActiveTab('top');
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
      const actualCountToGenerate = Math.min(settings.promptCount, 1500); 
      const prompts = await generatePrompts(keyword, result.categoryName, actualCountToGenerate, settings, result.contentType);

      setResults(prev => prev.map(r => r.id === id ? { 
        ...r, 
        generatedPrompts: prompts,
        isGeneratingPrompts: false 
      } : r));
    } catch (error) {
      console.error("Prompt generation failed:", error);
      alert(handleGeminiError(error));
      setResults(prev => prev.map(r => r.id === id ? { ...r, isGeneratingPrompts: false } : r));
    }
  };

  const handleUpgradePrompts = async (categoryId: string) => {
    const category = results.find(c => c.id === categoryId);
    if (!category || category.generatedPrompts.length === 0) return;

    setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isUpgrading: true } : c));
    
    try {
      const optimizedPrompts = await optimizePrompts(category.generatedPrompts, settings, category.contentType);
      
      setResults(prev => prev.map(c => {
        if (c.id === categoryId) {
          return { ...c, generatedPrompts: optimizedPrompts, isUpgrading: false };
        }
        return c;
      }));
    } catch (error) {
      console.error("Prompt optimization failed:", error);
      alert(handleGeminiError(error));
      setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isUpgrading: false } : c));
    }
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

  if (!isSessionActive) {
    return (
      <div className="min-h-screen bg-[#0B1121] flex items-center justify-center p-4 selection:bg-cyan-500/30 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D8B6]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-md w-full bg-[#111827]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00D8B6]/20 to-cyan-500/20 border border-[#00D8B6]/30 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(0,216,182,0.15)]">
            <Sparkles className="w-8 h-8 text-[#00D8B6]" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3 tracking-tight">Microstock Analyzer</h1>
          <p className="text-slate-400 text-center mb-8 text-sm leading-relaxed">
            Masukkan <strong>Gemini API Key</strong> Anda untuk memulai sesi. Demi keamanan, API Key tidak akan disimpan dan otomatis terhapus saat aplikasi dimuat ulang.
          </p>
          
          <form onSubmit={handleStartSession} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">API Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#0B1121] border border-slate-700 rounded-xl text-white pl-11 pr-4 py-3.5 outline-none focus:border-[#00D8B6] focus:ring-1 focus:ring-[#00D8B6] transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="text-xs text-slate-500 ml-1 mt-2 space-y-1">
                <p>
                  Belum punya? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[#00D8B6] hover:underline">Dapatkan di Google AI Studio</a>.
                </p>
                <p className="text-amber-500/80 font-medium">
                  Penting: Buat API Key di "New Project" agar kuota fresh.
                </p>
              </div>
            </div>
            
            {validationError && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{validationError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!tempApiKey.trim() || isValidating}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00D8B6] to-cyan-500 hover:from-[#00c2a3] hover:to-cyan-600 text-slate-900 font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,216,182,0.2)] hover:shadow-[0_0_25px_rgba(0,216,182,0.3)]"
            >
              {isValidating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Memvalidasi API Key...</>
              ) : (
                <>Mulai Sesi <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

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
          <button onClick={() => setActiveTab('changelog')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'changelog' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>CHANGELOG</button>
          <button onClick={() => setActiveTab('donate')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'donate' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>DONATE</button>
        </div>
      </nav>

      <main>
        {activeTab === 'settings' && (
          <Settings 
            settings={settings} 
            setSettings={setSettings} 
            onEndSession={handleEndSession}
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

        {activeTab === 'changelog' && (
          <ChangelogTab />
        )}

        {activeTab === 'prompt' && (
          <PromptTab 
            results={results} 
            selectedCategoryId={selectedPromptCategoryId} 
            onBack={() => setActiveTab('top')} 
            onGenerate={handleGeneratePrompts}
            onUpgrade={handleUpgradePrompts}
            promptsCount={settings.promptCount}
            setPromptsCount={(count) => setSettings(s => ({ ...s, promptCount: typeof count === 'function' ? count(s.promptCount) : count }))}
          />
        )}
      </main>
    </div>
  );
}
