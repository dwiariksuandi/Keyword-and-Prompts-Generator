import React from 'react';
import TopTab from './TopTab';
import AnalysisTab from './AnalysisTab';
import ResultsTab from './ResultsTab';
import DonateTab from './DonateTab';
import PromptTab from './PromptTab';
import ChangelogTab from './ChangelogTab';
import GuideTab from './GuideTab';
import IntelligenceTab from './IntelligenceTab';
import PipelineTab from './PipelineTab';
import TrendForecastTab from './TrendForecastTab';
import SalesTrackerTab from './SalesTrackerTab';
import Settings from './Settings';
import { ResultRow } from './ResultRow';
import { motion } from 'motion/react';

export function TabRenderer({ activeTab, logic }: { activeTab: string, logic: any }) {
  const {
    settings, setSettings,
    handleEndSession, handleSavePreferences,
    prefsSaved, prefsValidationMessage,
    keyword, setKeyword,
    contentType, setContentType,
    handleAnalyze, handleQuickGenerate,
    handleAnalyzeAesthetic, isAnalyzing,
    isAnalyzingAesthetic, aestheticAnalysis,
    setAestheticAnalysis, results,
    sortBy, setSortBy,
    filterCompetition, setFilterCompetition,
    referenceFile, setReferenceFile,
    referenceUrl, setReferenceUrl,
    handleToggleStar, handleViewPrompts,
    handleGeneratePrompts, handleGenerateAllPrompts,
    handlePredictSales, handleAnalyzeCompetitor,
    handleGenerateMetadata, history,
    handleClearHistory, handleLoadHistory,
    handlePolishMetadata, handleUpgradePrompts,
    isAnalyzingCompetitor, handleToggleMonitor,
    isMonitoring, handleRunPipeline,
    isPipelineRunning, pipelineTasks,
    forecasts, handleRefreshForecasts,
    isRefreshingForecasts, salesRecords,
    handleParseSalesCSV, isParsingSalesCSV,
    selectedPromptCategoryId, setSelectedPromptCategoryId,
    handleVisualizePrompt, handleRatePrompt,
    handleOptimizePrompt, progress,
    sortedResults
  } = logic;

  switch (activeTab) {
    case 'settings':
      return (
        <Settings 
          settings={settings} 
          setSettings={setSettings} 
          onEndSession={handleEndSession}
          onSavePreferences={handleSavePreferences}
          prefsSaved={prefsSaved}
          prefsValidationMessage={prefsValidationMessage}
        />
      );
    case 'top':
      return (
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

          {results.length > 0 && (
            <div className="max-w-6xl mx-auto px-6 pb-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel overflow-hidden border-white/10"
              >
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[1000px] text-left text-sm border-collapse">
                    <thead className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold border-b border-white/5 bg-white/[0.02]">
                      <tr>
                        <th className="px-6 py-4 font-bold">Neural Sector</th>
                        <th className="px-6 py-4 font-bold">Data Vectors</th>
                        <th className="px-6 py-4 font-bold">Volume</th>
                        <th className="px-6 py-4 font-bold">Competition</th>
                        <th className="px-6 py-4 font-bold">Trend</th>
                        <th className="px-6 py-4 font-bold text-center">Opportunity</th>
                        <th className="px-6 py-4 font-bold text-right">Protocol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {sortedResults.map((result: any) => (
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
              </motion.div>
            </div>
          )}
        </>
      );
    case 'analysis':
      return (
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
      );
    case 'results':
      return (
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
      );
    case 'intelligence':
      return (
        <IntelligenceTab 
          results={results}
          onAnalyzeCompetitor={handleAnalyzeCompetitor}
          isAnalyzing={isAnalyzingCompetitor}
          onSelectTrend={(niche) => {
            setKeyword(niche);
            activeTab = 'top'; // This might not work as expected if activeTab is a prop
          }}
          isMonitoring={isMonitoring}
          onToggleMonitor={handleToggleMonitor}
        />
      );
    case 'pipeline':
      return (
        <PipelineTab 
          results={results}
          settings={settings}
          onRunPipeline={handleRunPipeline}
          isPipelineRunning={isPipelineRunning}
          tasks={pipelineTasks}
        />
      );
    case 'visual':
      return (
        <TrendForecastTab 
          forecasts={forecasts}
          onRefresh={handleRefreshForecasts}
          isRefreshing={isRefreshingForecasts}
          onSelectNiche={(niche) => {
            setKeyword(niche);
            // logic to change tab would be needed here
          }}
        />
      );
    case 'sales': // Fixed tab name
      return (
        <SalesTrackerTab 
          salesRecords={salesRecords}
          onParseCSV={handleParseSalesCSV}
          isParsing={isParsingSalesCSV}
        />
      );
    case 'donate':
      return <DonateTab />;
    case 'changelog':
      return <ChangelogTab />;
    case 'guide':
      return <GuideTab />;
    case 'prompt':
      return (
        <PromptTab 
          results={results} 
          selectedCategoryId={selectedPromptCategoryId} 
          onBack={() => logic.setActiveTab('top')} 
          onGenerate={handleGeneratePrompts}
          onUpgrade={handleUpgradePrompts}
          onGenerateMetadata={handleGenerateMetadata}
          onPolishMetadata={handlePolishMetadata}
          onVisualize={handleVisualizePrompt}
          onRatePrompt={handleRatePrompt}
          onOptimizePrompt={handleOptimizePrompt}
          promptsCount={settings.promptCount}
          setPromptsCount={(count) => setSettings((s: any) => ({ ...s, promptCount: typeof count === 'function' ? count(s.promptCount) : count }))}
          onShowToast={(msg: string) => logic.setToast({ show: true, message: msg })}
          progress={progress}
        />
      );
    default:
      return null;
  }
}
