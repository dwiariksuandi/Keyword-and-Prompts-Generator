import React, { useState } from 'react';
import { Key, Save, Check, AlertCircle, LogOut, Cpu, Settings as SettingsIcon, Layout, Sliders, Database, Globe } from 'lucide-react';
import { AppSettings, PromptTemplate } from '../types';
import { promptTemplates } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onEndSession: () => void;
  onSavePreferences?: () => void;
  prefsSaved?: boolean;
  prefsValidationMessage?: { type: 'success' | 'error', text: string } | null;
}

const CONTENT_TYPES = ['Photo', 'Illustration', 'Vector', 'Background', 'Video', '3D Render'];

export default function Settings({ 
  settings, 
  setSettings, 
  onEndSession,
  onSavePreferences,
  prefsSaved,
  prefsValidationMessage
}: SettingsProps) {
  const [activeContentTypeTab, setActiveContentTypeTab] = useState('Photo');

  const defaultTemplates: Record<string, string> = {
    'Photo': 'nanobanana-photo',
    'Illustration': 'nanobanana-illustration',
    'Vector': 'nanobanana-vector',
    'Background': 'nanobanana-background',
    'Video': 'veo-video',
    '3D Render': 'nanobanana-3d'
  };

  const currentTemplateIds = typeof settings.templateId === 'string' 
    ? { 
        'Photo': settings.templateId, 
        'Illustration': settings.templateId, 
        'Vector': settings.templateId, 
        'Background': settings.templateId, 
        'Video': settings.templateId, 
        '3D Render': settings.templateId 
      } 
    : { ...defaultTemplates, ...(settings.templateId || {}) };

  const handleTemplateChange = (templateId: string) => {
    setSettings({
      ...settings,
      templateId: {
        ...currentTemplateIds,
        [activeContentTypeTab]: templateId
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-6"
    >
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6 futuristic-glow"
        >
          <SettingsIcon className="w-8 h-8 text-accent" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight font-display">System <span className="text-accent">Configuration</span></h1>
        <p className="text-slate-400 font-light">Manage your neural parameters and API integration.</p>
      </div>

      <div className="space-y-8">
        {/* API Key Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Key className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Neural Link</h2>
              <p className="text-sm text-slate-500 font-light">Active session authentication status.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium tracking-wide">Secure Connection Established</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEndSession}
              className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-4 rounded-2xl transition-all border border-red-500/20"
            >
              <LogOut size={20} />
              Terminate Session
            </motion.button>
            
            <div className="p-4 bg-slate-900/40 rounded-xl border border-white/5">
              <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                <strong className="text-slate-400 uppercase tracking-widest mr-2">Quota Protocol:</strong> 
                Gemini API limits are tied to your Google Cloud Project. Creating new keys within the same project will not reset quotas. For fresh allocation, initialize a new project in Google AI Studio.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Model Selection */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Cpu className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Core Engine</h2>
              <p className="text-sm text-slate-500 font-light">Select the primary LLM for synthesis.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", desc: "High Velocity (Default)" },
              { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", desc: "Maximum Reasoning" },
              { id: "gemini-2.0-flash", name: "Gemini 2 Flash", desc: "Legacy Flash" },
              { id: "gemini-3-flash-preview", name: "Gemini 3 Flash", desc: "Next-Gen Flash" },
            ].map((model) => (
              <motion.button
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSettings({ ...settings, model: model.id })}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                  settings.model === model.id
                    ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(0,216,182,0.1)]"
                    : "border-white/5 bg-black/20 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-bold tracking-tight ${settings.model === model.id ? 'text-accent' : 'text-white'}`}>{model.name}</p>
                  {settings.model === model.id && <div className="w-2 h-2 rounded-full bg-accent futuristic-glow" />}
                </div>
                <p className="text-xs text-slate-500 font-light">{model.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Prompt Template */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Layout className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Synthesis Blueprints</h2>
              <p className="text-sm text-slate-500 font-light">Configure prompt templates for specific outputs.</p>
            </div>
          </div>
          
          <div className="flex overflow-x-auto pb-4 mb-6 gap-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {CONTENT_TYPES.map(type => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveContentTypeTab(type)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeContentTypeTab === type
                    ? 'bg-accent text-slate-900 futuristic-glow'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>

          <div className="space-y-3">
            {promptTemplates
              .filter(template => template.contentTypes.includes(activeContentTypeTab))
              .map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ x: 5 }}
                onClick={() => handleTemplateChange(template.id)}
                className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 ${
                  currentTemplateIds[activeContentTypeTab] === template.id
                    ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(0,216,182,0.1)]"
                    : "border-white/5 bg-black/20 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-bold tracking-tight ${currentTemplateIds[activeContentTypeTab] === template.id ? 'text-accent' : 'text-white'}`}>{template.name}</p>
                  {currentTemplateIds[activeContentTypeTab] === template.id && (
                    <Check className="w-5 h-5 text-accent" />
                  )}
                </div>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{template.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Output Options */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Sliders className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Output Parameters</h2>
              <p className="text-sm text-slate-500 font-light">Fine-tune the generation behavior.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Default Synthesis Density</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.promptCount || ''}
                  onChange={(e) => setSettings({ ...settings, promptCount: Number(e.target.value) })}
                  onBlur={() => {
                    let val = settings.promptCount;
                    if (val < 1) val = 1;
                    if (val > 1500) val = 1500;
                    setSettings({ ...settings, promptCount: val });
                  }}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl text-white px-6 py-4 outline-none focus:border-accent transition-all font-mono"
                  min="1"
                  max="1500"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Prompts</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                  <Globe size={12} /> Language Protocol
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "en", name: "English" },
                    { id: "id", name: "Indonesian" },
                  ].map((lang) => (
                    <motion.button
                      key={lang.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSettings({ ...settings, language: lang.id })}
                      className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                        settings.language === lang.id
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-white/5 bg-black/20 text-slate-500 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {lang.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                  <Cpu size={12} /> Entropy Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "Low", name: "Low" },
                    { id: "Medium", name: "Mid" },
                    { id: "High", name: "High" },
                  ].map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSettings({ ...settings, variationLevel: level.id as any })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        settings.variationLevel === level.id
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-white/5 bg-black/20 text-slate-500 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {level.name}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                    <span className="text-accent/80 font-bold mr-1">Low:</span> Fokus, literal, dan dapat diprediksi.
                  </p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                    <span className="text-accent/80 font-bold mr-1">Mid:</span> Keseimbangan antara akurasi dan kreativitas.
                  </p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                    <span className="text-accent/80 font-bold mr-1">High:</span> Kreativitas maksimal dan eksplorasi ide unik.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                    <Database size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Neural Cache</h3>
                    <p className="text-xs text-slate-500 font-light">Auto-save synthesis logs locally.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                  className={`w-14 h-7 rounded-full transition-all relative p-1 ${
                    settings.autoSave ? "bg-accent" : "bg-slate-800"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.autoSave ? 28 : 0 }}
                    className="w-5 h-5 rounded-full bg-white shadow-lg"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                    <AlertCircle size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Negative Vectors</h3>
                    <p className="text-xs text-slate-500 font-light">Include exclusion parameters for SDXL.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, includeNegative: !settings.includeNegative })}
                  className={`w-14 h-7 rounded-full transition-all relative p-1 ${
                    settings.includeNegative ? "bg-accent" : "bg-slate-800"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.includeNegative ? 28 : 0 }}
                    className="w-5 h-5 rounded-full bg-white shadow-lg"
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Preferences Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSavePreferences}
            className={`w-full flex items-center justify-center gap-3 font-bold py-5 rounded-2xl transition-all duration-500 ${
              prefsSaved 
                ? "bg-emerald-500 text-slate-900 shadow-[0_0_30px_rgba(16,185,129,0.3)]" 
                : "bg-accent text-slate-900 futuristic-glow"
            }`}
          >
            {prefsSaved ? (
              <><Check className="w-6 h-6" /> Configuration Synchronized</>
            ) : (
              <><Save className="w-6 h-6" /> Commit Preferences</>
            )}
          </motion.button>

          <AnimatePresence>
            {prefsValidationMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-6 flex items-center gap-4 p-5 rounded-2xl text-sm border ${
                  prefsValidationMessage.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}
              >
                {prefsValidationMessage.type === 'success' ? (
                  <Check className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <p className="font-medium">{prefsValidationMessage.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
