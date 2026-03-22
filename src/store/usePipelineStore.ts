import { create } from 'zustand';
import { AgentTask } from '../types';

interface PipelineState {
  isPipelineRunning: boolean;
  pipelineTasks: AgentTask[];

  // Actions
  setIsPipelineRunning: (running: boolean) => void;
  setPipelineTasks: (tasks: AgentTask[] | ((prev: AgentTask[]) => AgentTask[])) => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
  isPipelineRunning: false,
  pipelineTasks: [],

  setIsPipelineRunning: (running) => set({ isPipelineRunning: running }),
  setPipelineTasks: (tasks) => set((state) => ({ pipelineTasks: typeof tasks === 'function' ? tasks(state.pipelineTasks) : tasks })),
}));
