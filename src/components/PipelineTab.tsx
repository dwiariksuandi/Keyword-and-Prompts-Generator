import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Play, CheckCircle2, Loader2, Settings, Layers, Database, Sparkles, Target } from 'lucide-react';
import { CategoryResult, AppSettings, AgentTask } from '../types';
import { NeuralPipeline } from './NeuralPipeline';

interface PipelineTabProps {
  results: CategoryResult[];
  settings: AppSettings;
  onRunPipeline: (steps: string[]) => void;
  isPipelineRunning: boolean;
  tasks: AgentTask[];
}

const PIPELINE_STEPS = [
  { id: 'analyze', label: 'Market Research', icon: Database, description: 'Niche Discovery & Trend Analysis' },
  { id: 'intel', label: 'Competitor Intelligence', icon: Target, description: 'Strategy Deconstruction' },
  { id: 'generate', label: 'Prompt Generation', icon: Sparkles, description: 'Mass Prompt Production' },
  { id: 'score', label: 'Quality Scoring', icon: Zap, description: 'Prompt Quality Assessment' },
  { id: 'metadata', label: 'Adobe Stock Metadata', icon: Layers, description: 'Title & Keyword Optimization' },
];

export default function PipelineTab({ results, settings, onRunPipeline, isPipelineRunning, tasks }: PipelineTabProps) {
  const [selectedSteps, setSelectedSteps] = useState<string[]>(PIPELINE_STEPS.map(s => s.id));

  const toggleStep = (stepId: string) => {
    setSelectedSteps(prev => 
      prev.includes(stepId) ? prev.filter(s => s !== stepId) : [...prev, stepId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pb-32 pt-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
          Automation <span className="text-white/40">Pipeline</span>
        </h1>
        <p className="text-white/40 max-w-lg mx-auto font-bold text-lg uppercase tracking-tight">
          Define and execute complex asset generation workflows.
        </p>
      </div>

      <NeuralPipeline tasks={tasks} isRunning={isPipelineRunning} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0A0A0A] rounded-[3rem] p-12 border border-white/5 shadow-2xl"
      >
        <div className="flex items-center gap-6 mb-12">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Workflow Configuration</h2>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">Neural Sequence Control</p>
          </div>
        </div>

        <div className="space-y-4">
          {PIPELINE_STEPS.map((step, index) => (
            <motion.div 
              key={step.id}
              whileHover={{ scale: 1.01 }}
              className={`flex items-center justify-between p-8 rounded-[2rem] border transition-all duration-500 ${
                selectedSteps.includes(step.id) 
                  ? 'bg-white/[0.02] border-white/20 shadow-xl' 
                  : 'bg-transparent border-white/5 opacity-30'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-xl transition-all duration-500 ${selectedSteps.includes(step.id) ? 'bg-white text-black' : 'bg-white/5 text-white/40'}`}>
                  <step.icon size={24} />
                </div>
                <div>
                  <span className="text-lg font-black text-white tracking-tight uppercase block">{step.label}</span>
                  <span className="text-[10px] text-white/20 uppercase tracking-widest font-black mt-1 block">{step.description}</span>
                </div>
              </div>
              <button 
                onClick={() => toggleStep(step.id)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                  selectedSteps.includes(step.id) ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10'
                }`}
              >
                {selectedSteps.includes(step.id) ? 'Enabled' : 'Disabled'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRunPipeline(selectedSteps)}
            disabled={isPipelineRunning || selectedSteps.length === 0}
            className="flex items-center gap-4 bg-white text-black font-black px-12 py-5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5 border border-white/10 uppercase tracking-widest text-[10px]"
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
