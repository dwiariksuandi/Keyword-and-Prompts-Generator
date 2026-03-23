import React from 'react';
import { Sparkles, Key, ArrowRight, Loader2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppLogic } from './hooks/useAppLogic';
import Settings from './components/Settings';
import TopTab from './components/TopTab';
import AnalysisTab from './components/AnalysisTab';
import ResultsTab from './components/ResultsTab';
import DonateTab from './components/DonateTab';
import PromptTab from './components/PromptTab';
import ChangelogTab from './components/ChangelogTab';
import GuideTab from './components/GuideTab';
import IntelligenceTab from './components/IntelligenceTab';
import PipelineTab from './components/PipelineTab';
import TrendForecastTab from './components/TrendForecastTab';
import SalesTrackerTab from './components/SalesTrackerTab';
import { TopTabResults } from './components/TopTabResults';
import { MainLayout } from './components/MainLayout';

export default function App() {
  const {
    isSessionActive,
    tempApiKey,
    setTempApiKey,
    isValidating,
    validationError,
    activeTab,
    setActiveTab,
    setSelectedPromptCategoryId,
    selectedPromptCategoryId,
    keyword,
    setKeyword,
    contentType,
    setContentType,
    referenceFile,
    setReferenceFile,
    referenceUrl,
    setReferenceUrl,
    isAnalyzing,
    isAnalyzingAesthetic,
    aestheticAnalysis,
    setAestheticAnalysis,
    results,
    setResults,
    history,
    settings,
    setSettings,
    prefsSaved,
    prefsValidationMessage,
    sortBy,
    setSortBy,
    filterCompetition,
    setFilterCompetition,
    errorModal,
    setErrorModal,
    toast,
    setToast,
    handleAnalyzeAesthetic,
    handleStartSession,
    handleEndSession,
    handleSavePreferences,
    handleAnalyze,
    handleQuickGenerate,
    handleGeneratePrompts,
    handleUpgradePrompts,
    handleGenerateMetadata,
    handleGenerateAllPrompts,
    handleToggleStar,
    handleClearHistory,
    handleLoadHistory,
    handleViewPrompts,
    handlePolishMetadata,
    handleVisualizePrompt,
    handleRatePrompt,
    handleAnalyzeCompetitor,
    handlePredictSales,
    isAnalyzingCompetitor,
    handleToggleMonitor,
    isMonitoring,
    handleRefreshForecasts,
    isRefreshingForecasts,
    forecasts,
    handleParseSalesCSV,
    isParsingSalesCSV,
    salesRecords,
    handleRunPipeline,
    isPipelineRunning,
    pipelineTasks,
    progress,
    sortedResults
  } = useAppLogic();

  if (!isSessionActive) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-cyan-500/30 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-panel rounded-[2rem] p-10 shadow-2xl relative z-10 overflow-hidden scanline"
        >
          <div className="relative mb-10 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-3xl flex items-center justify-center mb-6 mx-auto futuristic-glow"
            >
              <Sparkles className="w-10 h-10 text-cyan-400" />
            </motion.div>
            
            <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
              MICROSTOCK<span className="text-cyan-400">.</span>AI
            </h1>
            <p className="text-slate-400 text-sm font-light leading-relaxed max-w-[280px] mx-auto">
              Advanced market intelligence for elite stock contributors.
            </p>
          </div>
          
          <form onSubmit={handleStartSession} className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Access Protocol</label>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] text-cyan-500/70 hover:text-cyan-400 transition-colors uppercase tracking-wider">Get Key</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Enter Gemini API Key"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl text-white pl-11 pr-12 py-4 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-slate-600 font-mono text-sm"
                />
                {tempApiKey && (
                  <button
                    type="button"
                    onClick={() => setTempApiKey('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {validationError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{validationError}</p>
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={!tempApiKey.trim() || isValidating}
              className="w-full group relative flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                {isValidating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> INITIALIZING...</>
                ) : (
                  <>AUTHORIZE ACCESS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </button>
            
            <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest">
              Secure Environment • v1.3.0
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      setSelectedPromptCategoryId={setSelectedPromptCategoryId}
      errorModal={errorModal}
      setErrorModal={setErrorModal}
      toast={toast}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'settings' && (
            <Settings 
              settings={settings} 
              setSettings={setSettings} 
              results={results}
              setResults={setResults}
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
                onQuickGenerate={handleQuickGenerate}
                onAnalyzeAesthetic={handleAnalyzeAesthetic}
                isAnalyzing={isAnalyzing}
                isAnalyzingAesthetic={isAnalyzingAesthetic}
                aestheticAnalysis={aestheticAnalysis}
                setAestheticAnalysis={setAestheticAnalysis}
                results={results}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filterCompetition={filterCompetition}
                setFilterCompetition={setFilterCompetition}
                referenceFile={referenceFile}
                setReferenceFile={setReferenceFile}
                referenceUrl={referenceUrl}
                setReferenceUrl={setReferenceUrl}
                settings={settings}
                setSettings={setSettings}
              />

              <TopTabResults 
                results={sortedResults}
                onToggleStar={handleToggleStar}
                onViewPrompts={handleViewPrompts}
              />
            </>
          )}

          {activeTab === 'analysis' && (
            <AnalysisTab 
              results={results} 
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterCompetition={filterCompetition}
              setFilterCompetition={setFilterCompetition}
              onViewPrompts={handleViewPrompts}
              onGeneratePrompts={handleGeneratePrompts}
              onGenerateAllPrompts={handleGenerateAllPrompts}
              isAnalyzing={isAnalyzing}
              onToggleStar={handleToggleStar}
              onPredictSales={handlePredictSales}
              onAnalyzeCompetitor={handleAnalyzeCompetitor}
              onGenerateMetadata={handleGenerateMetadata}
            />
          )}
          
          {activeTab === 'results' && (
            <ResultsTab 
              results={results} 
              history={history} 
              keyword={keyword}
              onClearHistory={handleClearHistory} 
              onLoadHistory={handleLoadHistory} 
              onGenerateMetadata={handleGenerateMetadata}
              onPolishMetadata={handlePolishMetadata}
              onUpgrade={handleUpgradePrompts}
            />
          )}

          {activeTab === 'intelligence' && (
            <IntelligenceTab 
              results={results}
              onAnalyzeCompetitor={handleAnalyzeCompetitor}
              isAnalyzing={isAnalyzingCompetitor}
              onSelectTrend={(niche) => {
                setKeyword(niche);
                setActiveTab('top');
              }}
              isMonitoring={isMonitoring}
              onToggleMonitor={handleToggleMonitor}
            />
          )}

          {activeTab === 'pipeline' && (
            <PipelineTab 
              onRunPipeline={handleRunPipeline}
              isPipelineRunning={isPipelineRunning}
              tasks={pipelineTasks}
            />
          )}

          {activeTab === 'visual' && (
            <TrendForecastTab 
              forecasts={forecasts}
              onRefresh={handleRefreshForecasts}
              isRefreshing={isRefreshingForecasts}
              onSelectNiche={(niche) => {
                setKeyword(niche);
                setActiveTab('top');
              }}
            />
          )}

          {activeTab === 'sales' && (
            <SalesTrackerTab 
              salesRecords={salesRecords}
              onParseCSV={handleParseSalesCSV}
              isParsing={isParsingSalesCSV}
            />
          )}
          
          {activeTab === 'donate' && (
            <DonateTab />
          )}

          {activeTab === 'changelog' && (
            <ChangelogTab />
          )}

          {activeTab === 'guide' && (
            <GuideTab />
          )}

          {activeTab === 'prompt' && (
            <PromptTab 
              results={results} 
              selectedCategoryId={selectedPromptCategoryId} 
              onBack={() => setActiveTab('top')} 
              onGenerate={handleGeneratePrompts}
              onUpgrade={handleUpgradePrompts}
              onGenerateMetadata={handleGenerateMetadata}
              onPolishMetadata={handlePolishMetadata}
              onVisualize={handleVisualizePrompt}
              onRatePrompt={handleRatePrompt}
              promptsCount={settings.promptCount}
              setPromptsCount={(count) => setSettings(s => ({ ...s, promptCount: typeof count === 'function' ? count(s.promptCount) : count }))}
              onShowToast={(msg) => setToast({ show: true, message: msg })}
              progress={progress}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </MainLayout>
  );
}
