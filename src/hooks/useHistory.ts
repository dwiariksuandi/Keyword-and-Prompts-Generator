import { useAppStore } from '../store/useAppStore';
import { useUIStore } from '../store/useUIStore';
import { CategoryResult, HistoryItem } from '../types';

export const useHistory = () => {
  const {
    results, setResults,
    history, setHistory,
    sortBy,
    filterCompetition
  } = useAppStore();

  const { setToast } = useUIStore();

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
    setToast({ show: true, message: 'Berhasil disalin ke clipboard!' });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    // Logic to update keyword, contentType, activeTab should be in App.tsx or a central orchestrator
    return item;
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

  return {
    results,
    history,
    sortedResults,
    handleToggleStar,
    handleDownloadPrompts,
    handleCopyAllPrompts,
    handleClearHistory,
    handleLoadHistory
  };
};
