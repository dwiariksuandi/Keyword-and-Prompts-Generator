import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAppLogic } from '../hooks/useAppLogic';
import PipelineTab from './PipelineTab';
import Settings from './Settings';
import PromptWizard from './PromptWizard';
import TopTab from './TopTab';
import AnalysisTab from './AnalysisTab';
import ResultsTab from './ResultsTab';
import PromptTab from './PromptTab';
import GuideTab from './GuideTab';
import DonateTab from './DonateTab';
import ChangelogTab from './ChangelogTab';

export const TabRouter = () => {
  const store = useAppStore();
  const logic = useAppLogic();

  switch (store.activeTab) {
    case 'pipeline':
      return (
        <PipelineTab 
          results={store.results}
          settings={store.settings}
          onRunPipeline={logic.handleRunPipeline}
          isPipelineRunning={store.isPipelineRunning}
        />
      );
    case 'settings':
      return (
        <Settings 
          settings={store.settings} 
          setSettings={store.setSettings} 
          onEndSession={logic.handleEndSession}
          onSavePreferences={logic.handleSavePreferences}
          prefsSaved={store.prefsSaved}
          prefsValidationMessage={store.prefsValidationMessage}
        />
      );
    case 'wizard':
      return (
        <PromptWizard 
          keyword={store.keyword}
          setKeyword={store.setKeyword}
          contentType={store.contentType}
          setContentType={store.setContentType}
          onGenerate={(prompt) => logic.handleAnalyze(prompt)}
          isGenerating={store.isAnalyzing}
          settings={store.settings}
        />
      );
    case 'top':
      return (
        <TopTab 
          keyword={store.keyword}
          setKeyword={store.setKeyword}
          contentType={store.contentType}
          setContentType={store.setContentType}
          onAnalyze={logic.handleAnalyze}
          onQuickGenerate={logic.handleQuickGenerate}
          onAnalyzeAesthetic={logic.handleAnalyzeAesthetic}
          isAnalyzing={store.isAnalyzing}
          isAnalyzingAesthetic={store.isAnalyzingAesthetic}
          aestheticAnalysis={store.aestheticAnalysis}
          setAestheticAnalysis={store.setAestheticAnalysis}
          results={store.results}
          sortBy={store.sortBy}
          setSortBy={store.setSortBy}
          filterCompetition={store.filterCompetition}
          setFilterCompetition={store.setFilterCompetition}
          referenceFile={store.referenceFile}
          setReferenceFile={store.setReferenceFile}
          referenceUrl={store.referenceUrl}
          setReferenceUrl={store.setReferenceUrl}
          settings={store.settings}
        />
      );
    case 'analysis':
      return (
        <AnalysisTab 
          results={store.results} 
          onToggleStar={logic.handleToggleStar}
          onGenerateAll={logic.handleGenerateAllPrompts}
          isGeneratingAll={store.isPipelineRunning}
        />
      );
    case 'results':
      return (
        <ResultsTab 
          results={store.results}
          history={store.history}
          onLoadHistory={logic.handleLoadHistory}
          onClearHistory={logic.handleClearHistory}
          onGenerateMetadata={logic.handleGenerateMetadata}
          onUpgrade={logic.handleUpgradePrompts}
        />
      );
    case 'prompt':
      return (
        <PromptTab 
          results={store.results}
          selectedCategoryId={store.selectedPromptCategoryId}
          onBack={() => store.setActiveTab('top')}
          onGenerate={logic.handleGeneratePrompts}
          onUpgrade={logic.handleUpgradePrompts}
          promptsCount={store.promptsCount}
          setPromptsCount={store.setPromptsCount}
          onShowToast={(message) => store.setToast({ show: true, message })}
        />
      );
    case 'guide':
      return <GuideTab />;
    case 'donate':
      return <DonateTab />;
    case 'changelog':
      return <ChangelogTab />;
    default:
      return null;
  }
};
