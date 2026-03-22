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
  progress?: { current: number, total: number, message: string } | null;
  onSelectTrend?: (niche: string) => void;
}

export default function PromptWizard({ 
  keyword, 
  setKeyword, 
  contentType, 
  setContentType, 
  onGenerate, 
  isGenerating, 
  settings,
  progress,
  onSelectTrend
}: PromptWizardProps) {
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

  const handleFormulaGenerate = async () => {
    let finalPrompt = '';
    if (contentType === 'Video') {
      finalPrompt = await generateVeoPrompt(
        formulaData.cinematography,
        formulaData.subject,
        formulaData.action,
        formulaData.context,
        formulaData.style,
        settings
      );
    } else {
      finalPrompt = await generateNanoBananaPrompt(
        formulaData.subject,
        formulaData.action,
        formulaData.context,
        formulaData.cinematography, // Using cinematography as composition for image
        formulaData.style,
        settings
      );
    }
    onGenerate(finalPrompt);
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (keyword?.trim()?.length > 2) {
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
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="space-y-12">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {steps.map((s) => (
            <div key={s.id} className={`flex items-center ${s.id < steps.length ? 'flex-1' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 border ${step >= s.id ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 text-white/20 border-white/10'}`}>
                {step > s.id ? <CheckCircle2 size={24} /> : s.id}
              </div>
              {s.id < steps.length && (
                <div className={`flex-1 h-px mx-6 transition-all duration-500 ${step > s.id ? 'bg-white' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{steps[step - 1].title}</h2>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{steps[step - 1].description}</p>
        </div>
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0A0A0A] p-12 rounded-[3rem] border border-white/5 shadow-2xl"
      >
        {step === 1 && (
          <div className="space-y-10">
            <div className="flex gap-4">
              <button
                onClick={() => setMode('freeform')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${mode === 'freeform' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10'}`}
              >
                Freeform
              </button>
              <button
                onClick={() => setMode('formula')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${mode === 'formula' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10'}`}
              >
                Formula Builder
              </button>
            </div>

            {mode === 'freeform' ? (
              <div className="space-y-6">
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">What niche are you targeting?</label>
                <textarea 
                  className="w-full h-48 bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 text-white placeholder-white/10 outline-none focus:border-white/30 transition-all font-medium leading-relaxed"
                  placeholder="e.g., sustainable architecture, futuristic office..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <TrendForecast niche={keyword} settings={settings} onSelect={onSelectTrend || setKeyword} />
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {suggestions.map((s, i) => (
                      <button
                        key={`suggestion-${s.keyword}-${i}`}
                        onClick={() => setKeyword(prev => prev ? `${prev}, ${s.keyword}` : s.keyword)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-white/40 hover:text-white transition-all border border-white/10 flex items-center gap-3 font-black uppercase tracking-tight"
                      >
                        {s.keyword}
                        <span className="text-[9px] text-white/20">({s.relevanceScore})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'cinematography', placeholder: 'Cinematography (e.g., Wide shot, Dolly)' },
                  { id: 'subject', placeholder: 'Subject' },
                  { id: 'action', placeholder: 'Action' },
                  { id: 'context', placeholder: 'Context (Location/Environment)' },
                  { id: 'style', placeholder: 'Style & Ambiance' }
                ].map((field) => (
                  <input 
                    key={field.id}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-white text-sm placeholder-white/10 outline-none focus:border-white/30 transition-all font-medium" 
                    placeholder={field.placeholder} 
                    value={(formulaData as any)[field.id]} 
                    onChange={(e) => setFormulaData({...formulaData, [field.id]: e.target.value})} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Select Content Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['Photo', 'Illustration', 'Vector', 'Video', '3D Render', 'AI Creative'].map(type => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`p-6 rounded-[2rem] border transition-all duration-500 font-black uppercase tracking-widest text-[10px] ${contentType === type ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10">
            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Niche</span>
                <span className="text-sm text-white font-black uppercase tracking-tight">{keyword || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Platform</span>
                <span className="text-sm text-white font-black uppercase tracking-tight">{contentType}</span>
              </div>
            </div>
            <VisualQA assetUrl="https://picsum.photos/seed/vibrant/1920/1080" />
            
            {progress && (
              <div className="w-full space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                  <span>{progress.message}</span>
                  <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                    className="h-full bg-white"
                  />
                </div>
              </div>
            )}

            <button
              onClick={mode === 'freeform' ? () => onGenerate(keyword) : handleFormulaGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-4 bg-white text-black font-black py-6 rounded-[2rem] transition-all shadow-xl shadow-white/5 border border-white/10 uppercase tracking-widest text-[10px]"
            >
              <Sparkles size={20} />
              {isGenerating ? 'Generating...' : 'Generate Prompts'}
            </button>
          </div>
        )}
      </motion.div>

      <div className="flex justify-between max-w-2xl mx-auto">
        <button 
          onClick={prevStep} 
          disabled={step === 1} 
          className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20 transition-all border border-white/10"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextStep} 
          disabled={step === steps.length} 
          className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20 transition-all border border-white/10"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
