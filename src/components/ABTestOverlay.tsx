import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, X, CheckCircle2, AlertCircle, Activity, Settings as SettingsIcon, Database, Zap, PlayCircle, Loader2 } from 'lucide-react';
import { abTestingService } from '../services/abTesting';
import { healthCheckService } from '../services/healthCheckService';
import { ABTestLog } from '../types';

export const ABTestOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<ABTestLog[]>([]);
  const [activeTests, setActiveTests] = useState<Record<string, string>>({});
  const [isRunningHealthCheck, setIsRunningHealthCheck] = useState(false);

  const runHealthCheck = async () => {
    setIsRunningHealthCheck(true);
    const trackInteraction = (testId: string, event: string, metadata?: any) => {
      const variant = activeTests[testId] || 'A';
      abTestingService.trackEvent(testId, variant as any, event, metadata);
    };
    await healthCheckService.runSuite(trackInteraction);
    setIsRunningHealthCheck(false);
  };

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setLogs(abTestingService.getLogs().reverse());
        setActiveTests(abTestingService.getAssignments());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border transition-all ${
          isOpen ? 'bg-white text-black border-white' : 'bg-black/80 text-accent border-accent/30 backdrop-blur-xl'
        }`}
      >
        {isOpen ? <X size={20} /> : <Bug size={20} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-accent" />
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Neural Debug & A/B Testing</span>
              </div>
              <button 
                onClick={() => abTestingService.clearLogs()}
                className="text-[8px] font-bold text-slate-500 hover:text-white uppercase tracking-widest"
              >
                Clear Logs
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Active Tests */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  <SettingsIcon size={12} /> Active A/B Assignments
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(activeTests).map(([testId, variant]) => (
                    <div key={testId} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[10px] font-medium text-slate-300">{testId}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            abTestingService.setVariant(testId, 'A');
                            setActiveTests(prev => ({ ...prev, [testId]: 'A' }));
                          }}
                          className={`px-2 py-1 rounded text-[8px] font-bold transition-all ${variant === 'A' ? 'bg-accent text-black' : 'bg-white/5 text-slate-500'}`}
                        >
                          A
                        </button>
                        <button 
                          onClick={() => {
                            abTestingService.setVariant(testId, 'B');
                            setActiveTests(prev => ({ ...prev, [testId]: 'B' }));
                          }}
                          className={`px-2 py-1 rounded text-[8px] font-bold transition-all ${variant === 'B' ? 'bg-accent text-black' : 'bg-white/5 text-slate-500'}`}
                        >
                          B
                        </button>
                      </div>
                    </div>
                  ))}
                  {Object.keys(activeTests).length === 0 && (
                    <div className="text-[10px] text-slate-600 italic">No active tests detected.</div>
                  )}
                </div>
              </div>

              {/* Interaction Logs */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  <Database size={12} /> Interaction Stream (Button Checks)
                </div>
                <div className="space-y-2">
                  {logs.map((log, i) => (
                    <motion.div 
                      key={`log-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3"
                    >
                      <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                        log.event.includes('error') ? 'bg-rose-500' : 'bg-emerald-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold text-white truncate">{log.event}</span>
                          <span className="text-[8px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-400">Variant {log.variant}</span>
                          <span className="text-[8px] font-medium text-slate-500 truncate">{log.testId}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-[10px] text-slate-600 italic">Waiting for interactions...</div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent/5 border-t border-accent/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[8px] font-bold text-accent uppercase tracking-widest">
                <Zap size={10} /> Neural Health Check: 100% Operational
              </div>
              <button
                onClick={runHealthCheck}
                disabled={isRunningHealthCheck}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent text-black rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-accent/80 transition-all disabled:opacity-50"
              >
                {isRunningHealthCheck ? <Loader2 size={10} className="animate-spin" /> : <PlayCircle size={10} />}
                {isRunningHealthCheck ? 'Running...' : 'Run Suite'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
