import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Play, CheckCircle2, Loader2, Settings, Layers, Database, Sparkles } from 'lucide-react';
import { CategoryResult, AppSettings } from '../types';

interface PipelineTabProps {
  results: CategoryResult[];
  settings: AppSettings;
  onRunPipeline: (steps: string[]) => void;
  isPipelineRunning: boolean;
}

const PIPELINE_STEPS = [
  { id: 'analyze', label: 'Analyze Market', icon: Database },
  { id: 'generate', label: 'Generate Prompts', icon: Sparkles },
  { id: 'score', label: 'Score Prompts', icon: Zap },
  { id: 'metadata', label: 'Generate Metadata', icon: Layers },
];

export default function PipelineTab({ results, settings, onRunPipeline, isPipelineRunning }: PipelineTabProps) {
  const [selectedSteps, setSelectedSteps] = useState<string[]>(PIPELINE_STEPS.map(s => s.id));

  const toggleStep = (stepId: string) => {
    setSelectedSteps(prev => 
      prev.includes(stepId) ? prev.filter(s => s !== stepId) : [...prev, stepId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pb-32 pt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[2rem] p-10 border border-white/10"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white font-display tracking-tight">Automation Pipeline</h2>
            <p className="text-slate-400 font-light">Define and execute complex asset generation workflows.</p>
          </div>
        </div>

        <div className="space-y-6">
          {PIPELINE_STEPS.map((step, index) => (
            <motion.div 
              key={step.id}
              whileHover={{ scale: 1.01 }}
              className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${
                selectedSteps.includes(step.id) 
                  ? 'bg-white/5 border-accent/30 shadow-[0_0_20px_rgba(0,216,182,0.05)]' 
                  : 'bg-black/20 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${selectedSteps.includes(step.id) ? 'bg-accent/10 text-accent' : 'bg-white/5 text-slate-500'}`}>
                  <step.icon size={20} />
                </div>
                <span className="font-bold text-white tracking-wide">{step.label}</span>
              </div>
              <button 
                onClick={() => toggleStep(step.id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedSteps.includes(step.id) ? 'bg-accent text-black' : 'bg-white/10 text-slate-400'
                }`}
              >
                {selectedSteps.includes(step.id) ? 'Enabled' : 'Disabled'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRunPipeline(selectedSteps)}
            disabled={isPipelineRunning || selectedSteps.length === 0}
            className="flex items-center gap-3 bg-accent hover:bg-accent/90 text-slate-900 font-bold px-10 py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-accent/20 border border-accent/20 uppercase tracking-widest text-xs"
          >
            {isPipelineRunning ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Executing Pipeline...</>
            ) : (
              <><Play className="w-5 h-5" /> Run Pipeline</>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
