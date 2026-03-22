import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppLogic } from './hooks/useAppLogic';
import Settings from './components/Settings';
import TopTab from './components/TopTab';
import AnalysisTab from './components/AnalysisTab';
import ResultsTab from './components/ResultsTab';
import DonateTab from './components/DonateTab';
import PromptTab from './components/PromptTab';
import ChangelogTab from './components/ChangelogTab';
import GuideTab from './components/GuideTab';
import { MainLayout } from './components/MainLayout';
import LoginScreen from './components/LoginScreen';
import { ResultsTable } from './components/ResultsTable';

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
    sortedResults
  } = useAppLogic();

  if (!isSessionActive) {
    return (
      <LoginScreen
        tempApiKey={tempApiKey}
        setTempApiKey={setTempApiKey}
        isValidating={isValidating}
        validationError={validationError}
        handleStartSession={handleStartSession}
      />
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

              {results.length > 0 && (
                <ResultsTable 
                  results={sortedResults}
                  onToggleStar={handleToggleStar}
                  onViewPrompts={handleViewPrompts}
                />
              )}
            </>
          )}

          {activeTab === 'analysis' && (
            <AnalysisTab 
              results={results} 
              onToggleStar={handleToggleStar} 
              onGenerateAll={handleGenerateAllPrompts}
              isGeneratingAll={isAnalyzing}
            />
          )}
          
          {activeTab === 'results' && (
            <ResultsTab 
              results={results} 
              history={history} 
              onClearHistory={handleClearHistory} 
              onLoadHistory={handleLoadHistory} 
              onGenerateMetadata={handleGenerateMetadata}
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
              promptsCount={settings.promptCount}
              setPromptsCount={(count) => setSettings(s => ({ ...s, promptCount: typeof count === 'function' ? count(s.promptCount) : count }))}
              onShowToast={(msg) => setToast({ show: true, message: msg })}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </MainLayout>
  );
}
