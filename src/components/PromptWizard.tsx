import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Sparkles, Target, Zap, CheckCircle2 } from 'lucide-react';
import { AppSettings } from '../types';
import { fetchTrendingKeywords, generateVeoPrompt, generateNanoBananaPrompt } from '../services/gemini';
import TrendForecast from './TrendForecast';
import VisualQA from './VisualQA';

interface PromptWizardProps {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  contentType: string;
  setContentType: React.Dispatch<React.SetStateAction<string>>;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  settings: AppSettings;
}

export default function PromptWizard({ keyword, setKeyword, contentType, setContentType, onGenerate, isGenerating, settings }: PromptWizardProps) {
  const [step, setStep] = useState(1);
  const [suggestions, setSuggestions] = useState<{ keyword: string; relevanceScore: number }[]>([]);
  const [mode, setMode] = useState<'freeform' | 'formula'>('freeform');
  const [formulaData, setFormulaData] = useState({
    cinematography: '',
    subject: '',
    action: '',
    context: '',
    style: ''
  });

  const handleFormulaGenerate = () => {
    let finalPrompt = '';
    if (contentType === 'Video') {
      finalPrompt = generateVeoPrompt(
        formulaData.cinematography,
        formulaData.subject,
        formulaData.action,
        formulaData.context,
        formulaData.style
      );
    } else {
      finalPrompt = generateNanoBananaPrompt(
        formulaData.subject,
        formulaData.action,
        formulaData.context,
        formulaData.cinematography, // Using cinematography as composition for image
        formulaData.style
      );
    }
    onGenerate(finalPrompt);
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (keyword.trim().length > 2) {
        const results = await fetchTrendingKeywords(keyword, settings, contentType);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [keyword, settings]);

  const steps = [
    { id: 1, title: 'Input Niche', description: 'Define your creative concept' },
    { id: 2, title: 'Target Platform', description: 'Select content type' },
    { id: 3, title: 'Confirm', description: 'Review and generate' },
  ];

  const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          {steps.map((s) => (
            <div key={s.id} className={`flex items-center ${s.id < steps.length ? 'flex-1' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.id ? 'bg-accent text-black' : 'bg-white/5 text-slate-500'}`}>
                {step > s.id ? <CheckCircle2 size={20} /> : s.id}
              </div>
              {s.id < steps.length && (
                <div className={`flex-1 h-0.5 mx-4 ${step > s.id ? 'bg-accent' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white font-display">{steps[step - 1].title}</h2>
          <p className="text-slate-400 text-sm">{steps[step - 1].description}</p>
        </div>
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="glass-panel p-8 rounded-3xl border border-white/10"
      >
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={() => setMode('freeform')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${mode === 'freeform' ? 'bg-accent text-black' : 'bg-white/5 text-slate-500'}`}
              >
                Freeform
              </button>
              <button
                onClick={() => setMode('formula')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${mode === 'formula' ? 'bg-accent text-black' : 'bg-white/5 text-slate-500'}`}
              >
                Formula Builder
              </button>
            </div>

            {mode === 'freeform' ? (
              <>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">What niche are you targeting?</label>
                <textarea 
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-6 text-white placeholder-slate-600 outline-none focus:border-accent/40"
                  placeholder="e.g., sustainable architecture, futuristic office..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <TrendForecast niche={keyword} />
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setKeyword(prev => prev ? `${prev}, ${s.keyword}` : s.keyword)}
                        className="px-3 py-1 bg-white/5 hover:bg-accent/20 rounded-full text-xs text-slate-300 hover:text-accent transition-all border border-white/5 flex items-center gap-2"
                      >
                        {s.keyword}
                        <span className="text-[9px] text-slate-500">({s.relevanceScore})</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm" placeholder="Cinematography (e.g., Wide shot, Dolly)" value={formulaData.cinematography} onChange={(e) => setFormulaData({...formulaData, cinematography: e.target.value})} />
                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm" placeholder="Subject" value={formulaData.subject} onChange={(e) => setFormulaData({...formulaData, subject: e.target.value})} />
                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm" placeholder="Action" value={formulaData.action} onChange={(e) => setFormulaData({...formulaData, action: e.target.value})} />
                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm" placeholder="Context (Location/Environment)" value={formulaData.context} onChange={(e) => setFormulaData({...formulaData, context: e.target.value})} />
                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm" placeholder="Style & Ambiance" value={formulaData.style} onChange={(e) => setFormulaData({...formulaData, style: e.target.value})} />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Select Content Type</label>
            <div className="grid grid-cols-2 gap-4">
              {['Photo', 'Illustration', 'Vector', 'Video', '3D Render', 'AI Creative'].map(type => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`p-4 rounded-2xl border transition-all ${contentType === type ? 'bg-accent/10 border-accent text-accent' : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <p className="text-sm text-slate-400 mb-1">Niche: <span className="text-white font-bold">{keyword || 'Not set'}</span></p>
              <p className="text-sm text-slate-400">Platform: <span className="text-white font-bold">{contentType}</span></p>
            </div>
            <VisualQA assetUrl="https://picsum.photos/seed/vibrant/1920/1080" />
            <button
              onClick={mode === 'freeform' ? () => onGenerate(keyword) : handleFormulaGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-black font-bold py-4 rounded-2xl transition-all"
            >
              <Sparkles size={18} />
              {isGenerating ? 'Generating...' : 'Generate Prompts'}
            </button>
          </div>
        )}
      </motion.div>

      <div className="flex justify-between mt-8">
        <button onClick={prevStep} disabled={step === 1} className="px-6 py-3 text-slate-500 hover:text-white disabled:opacity-50">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextStep} disabled={step === steps.length} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
