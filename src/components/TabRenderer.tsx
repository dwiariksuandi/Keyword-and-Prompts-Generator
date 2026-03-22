import React from 'react';
import { Tab } from '../types';
import TopTab from './TopTab';
import IntelligenceTab from './IntelligenceTab';
import TrendForecastTab from './TrendForecastTab';
import PipelineTab from './PipelineTab';
import AnalysisTab from './AnalysisTab';
import PromptTab from './PromptTab';
import PromptWizard from './PromptWizard';
import SalesTrackerTab from './SalesTrackerTab';
import Settings from './Settings';
import DonateTab from './DonateTab';
import ChangelogTab from './ChangelogTab';
import GuideTab from './GuideTab';

interface TabRendererProps {
  activeTab: Tab;
  logic: any; // We'll pass the whole logic object for now, or specific parts
}

export const TabRenderer: React.FC<TabRendererProps> = ({ activeTab, logic }) => {
  switch (activeTab) {
    case "top":
      return (
        <TopTab 
          keyword={logic.keyword}
          setKeyword={logic.setKeyword}
          contentType={logic.contentType}
          setContentType={logic.setContentType}
          referenceFile={logic.referenceFile}
          setReferenceFile={logic.setReferenceFile}
          referenceUrl={logic.referenceUrl}
          setReferenceUrl={logic.setReferenceUrl}
          isAnalyzing={logic.isAnalyzing}
          onAnalyze={logic.handleAnalyze}
          onQuickGenerate={logic.handleQuickGenerate}
          results={logic.results}
          sortBy={logic.sortBy}
          setSortBy={logic.setSortBy}
          filterCompetition={logic.filterCompetition}
          setFilterCompetition={logic.setFilterCompetition}
          onAnalyzeAesthetic={logic.handleAnalyzeAesthetic}
          isAnalyzingAesthetic={logic.isAnalyzingAesthetic}
          aestheticAnalysis={logic.aestheticAnalysis}
          setAestheticAnalysis={logic.setAestheticAnalysis}
          settings={logic.settings}
          onSelectTrend={logic.handleTrendToPrompts}
        />
      );
    case "intelligence":
      return (
        <IntelligenceTab 
          results={logic.results}
          onAnalyzeCompetitor={logic.handleAnalyzeCompetitor}
          isAnalyzing={logic.isAnalyzing}
          onSelectTrend={logic.handleTrendToPrompts}
          isMonitoring={logic.isMonitoring}
          onToggleMonitor={logic.handleToggleMonitor}
        />
      );
    case "forecast":
      return (
        <TrendForecastTab 
          forecasts={logic.forecasts}
          isRefreshing={logic.isForecasting}
          onRefresh={logic.handleGenerateForecast}
          onSelectNiche={logic.handleTrendToPrompts}
        />
      );
    case "pipeline":
      return (
        <PipelineTab 
          results={logic.results}
          settings={logic.settings}
          onRunPipeline={logic.handleRunPipeline}
          isPipelineRunning={logic.isPipelineRunning}
        />
      );
    case "analysis":
      return (
        <AnalysisTab 
          results={logic.results}
          sortBy={logic.sortBy}
          setSortBy={logic.setSortBy}
          filterCompetition={logic.filterCompetition}
          setFilterCompetition={logic.setFilterCompetition}
          onViewPrompts={logic.handleViewPrompts}
          onGeneratePrompts={logic.handleGeneratePrompts}
          onGenerateAllPrompts={logic.handleGenerateAllPrompts}
          isAnalyzing={logic.isAnalyzing}
          onToggleStar={logic.handleToggleStar}
          onPredictSales={logic.handlePredictSales}
          onAnalyzeCompetitor={logic.handleAnalyzeCompetitor}
        />
      );
    case "prompt":
      return (
        <PromptTab 
          results={logic.results}
          selectedCategoryId={logic.selectedPromptCategoryId}
          onBack={() => logic.setSelectedPromptCategoryId(null)}
          onGenerate={logic.handleGeneratePrompts}
          onUpgrade={logic.handleUpgradePrompts}
          onGenerateMetadata={logic.handleGenerateMetadata}
          onPolishMetadata={logic.handlePolishMetadata}
          onVisualize={logic.handleVisualizePrompt}
          promptsCount={logic.settings.promptCount}
          setPromptsCount={(count: any) => logic.setSettings((s: any) => ({ ...s, promptCount: typeof count === 'function' ? count(s.promptCount) : count }))}
          onShowToast={(msg: string) => logic.setToast({ show: true, message: msg })}
          progress={logic.progress}
        />
      );
    case "wizard":
      return (
        <PromptWizard 
          keyword={logic.keyword}
          setKeyword={logic.setKeyword}
          contentType={logic.contentType}
          setContentType={logic.setContentType}
          onGenerate={logic.handleAnalyze}
          isGenerating={logic.isAnalyzing}
          settings={logic.settings}
        />
      );
    case "sales":
      return (
        <SalesTrackerTab 
          salesRecords={logic.salesRecords}
          onParseCSV={logic.handleParseSalesCSV}
          isParsing={logic.isParsingSales}
        />
      );
    case "settings":
      return (
        <Settings 
          settings={logic.settings}
          setSettings={logic.setSettings}
          onSavePreferences={logic.handleSavePreferences}
          prefsSaved={logic.prefsSaved}
          prefsValidationMessage={logic.prefsValidationMessage}
        />
      );
    case "donate":
      return <DonateTab key="donate" />;
    case "changelog":
      return <ChangelogTab key="changelog" />;
    case "guide":
      return <GuideTab key="guide" />;
    default:
      return null;
  }
};
