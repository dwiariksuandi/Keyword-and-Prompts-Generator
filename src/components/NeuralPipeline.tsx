import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import { AgentTask } from '../services/gemini';

interface NeuralPipelineProps {
  tasks: AgentTask[];
  isRunning: boolean;
}

export const NeuralPipeline: React.FC<NeuralPipelineProps> = ({ tasks, isRunning }) => {
  if (!isRunning && tasks.every(t => t.status === 'pending')) return null;

  return (
    <div className="bg-[#151619] border border-white/10 rounded-xl p-6 mb-8 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 animate-pulse" />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-500">Neural Synthesis Pipeline</h3>
          <p className="text-xs text-white/40 mt-1 font-mono">Agentic Orchestration in Progress</p>
        </div>
        {isRunning && (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-tighter">Active Thinking</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start gap-4 p-3 rounded-lg border transition-all duration-300 ${
              task.status === 'running' 
                ? 'bg-white/5 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                : 'bg-transparent border-transparent'
            }`}
          >
            <div className="mt-0.5">
              {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {task.status === 'running' && <Loader2 className="w-4 h-4 text-white animate-spin" />}
              {task.status === 'pending' && <Circle className="w-4 h-4 text-white/20" />}
              {task.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-mono uppercase tracking-wider ${
                  task.status === 'completed' ? 'text-emerald-500' : 
                  task.status === 'running' ? 'text-white' : 'text-white/40'
                }`}>
                  {task.name}
                </span>
                <span className="text-[10px] font-mono text-white/30">{task.progress}%</span>
              </div>
              
              <p className={`text-[11px] truncate ${
                task.status === 'running' ? 'text-white/70' : 'text-white/30'
              }`}>
                {task.message}
              </p>

              {task.status === 'running' && (
                <div className="mt-2 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Background Grid Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>
    </div>
  );
};
