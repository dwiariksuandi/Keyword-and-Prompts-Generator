import React from 'react';
import Settings from './Settings';
import TopTab from './TopTab';
import AnalysisTab from './AnalysisTab';
import ResultsTab from './ResultsTab';
import DonateTab from './DonateTab';
import ChangelogTab from './ChangelogTab';
import GuideTab from './GuideTab';
import PromptTab from './PromptTab';

interface TabRendererProps {
  activeTab: string;
  [key: string]: any;
}

export const TabRenderer: React.FC<TabRendererProps> = (props) => {
  switch (props.activeTab) {
    case 'settings': return <Settings {...props} />;
    case 'top': return <TopTab {...props} />;
    case 'analysis': return <AnalysisTab {...props} />;
    case 'results': return <ResultsTab {...props} />;
    case 'donate': return <DonateTab />;
    case 'changelog': return <ChangelogTab />;
    case 'guide': return <GuideTab />;
    case 'prompt': return <PromptTab {...props} />;
    default: return null;
  }
};
