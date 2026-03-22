import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileUp, Sparkles, Loader2 } from 'lucide-react';
import { CategoryResult, AppSettings } from '../types';
import { transformToJSONL } from '../services/fineTuningService';
import { validatePromptAI } from '../services/aiValidationService';
import DataQualityDashboard from './DataQualityDashboard';

interface FineTuningSectionProps {
  results: CategoryResult[];
  settings: AppSettings;
  setResults: React.Dispatch<React.SetStateAction<CategoryResult[]>>;
}

export default function FineTuningSection({ results, settings, setResults }: FineTuningSectionProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isValidatingAI, setIsValidatingAI] = useState(false);

  const handleRunAIValidation = async () => {
    setIsValidatingAI(true);
    
    const updatedResults = [...results];
    
    for (let i = 0; i < updatedResults.length; i++) {
      const category = { ...updatedResults[i] };
      if (category.promptScores) {
        const newScores = [...category.promptScores];
        for (let j = 0; j < newScores.length; j++) {
          const score = { ...newScores[j] };
          if (!score.aiValidation) {
            const validation = await validatePromptAI(score.optimizedPrompt || score.prompt, settings.apiKey);
            score.aiValidation = validation;
            newScores[j] = score;
          }
        }
        category.promptScores = newScores;
      }
      updatedResults[i] = category;
    }
    
    setResults(updatedResults);
    setIsValidatingAI(false);
  };

  const handleExportFineTuningData = async () => {
    setIsExporting(true);
    try {
      const data = transformToJSONL(results);
      const response = await fetch('/api/finetuning/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      if (!response.ok) throw new Error('Failed to export data');
      alert('Data exported successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45 }}
      className="glass-panel p-8 mb-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
          <FileUp className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-display">Fine-Tuning Pipeline</h2>
          <p className="text-sm text-slate-500 font-light">Export high-rated prompts for model training.</p>
        </div>
      </div>
      
      <DataQualityDashboard results={results} />

      <div className="grid grid-cols-2 gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRunAIValidation}
          disabled={isValidatingAI}
          className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all border border-white/10 disabled:opacity-50"
        >
          {isValidatingAI ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          {isValidatingAI ? 'Validating...' : 'Run AI Validation'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportFineTuningData}
          disabled={isExporting}
          className="flex items-center justify-center gap-3 bg-accent/10 hover:bg-accent/20 text-accent font-bold py-4 rounded-2xl transition-all border border-accent/20 disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="animate-spin" /> : <FileUp size={20} />}
          {isExporting ? 'Exporting...' : 'Export (JSONL)'}
        </motion.button>
      </div>
    </motion.div>
  );
}
