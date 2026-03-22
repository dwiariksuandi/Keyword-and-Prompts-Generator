import React, { useState } from 'react';
import { Key, Save, Check, AlertCircle, Cpu, Settings as SettingsIcon, Layout, Sliders, Database, Globe, Zap, TrendingUp, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { AppSettings, PromptTemplate } from '../types';
import { promptTemplates } from '../services/promptUtils';
import { motion, AnimatePresence } from 'motion/react';
import { useApiStore } from '../store/useApiStore';
import { GoogleGenAI } from '@google/genai';

interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onSavePreferences?: () => void;
  prefsSaved?: boolean;
  prefsValidationMessage?: { type: 'success' | 'error', text: string } | null;
}

const CONTENT_TYPES = ['Photo', 'Illustration', 'Vector', 'Background', 'Video', '3D Render'];

export default function Settings({ 
  settings, 
  setSettings, 
  onSavePreferences,
  prefsSaved,
  prefsValidationMessage
}: SettingsProps) {
  const { apiKey, setApiKey, clearApiKey } = useApiStore();
  const [manualApiKey, setManualApiKey] = useState(apiKey);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleValidateAndSave = async () => {
    setIsValidating(true);
    setValidationError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: manualApiKey });
      await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'ping',
      });
      setApiKey(manualApiKey);
      if (onSavePreferences) onSavePreferences();
    } catch (error) {
      setValidationError('Kunci API tidak valid. Silakan periksa kembali.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleReset = () => {
    setManualApiKey('');
    clearApiKey();
    setValidationError(null);
  };

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
      className="max-w-4xl mx-auto py-16 px-6 space-y-16"
    >
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 mb-4 shadow-2xl"
        >
          <SettingsIcon className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
          System <span className="text-white/40">Configuration</span>
        </h1>
        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Manage your neural parameters and API integration.</p>
      </div>

      <div className="space-y-12">
        {/* API Key Configuration */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A0A0A] p-12 rounded-[3rem] border border-white/5 shadow-2xl"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
              <Key className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">API Configuration</h2>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">Manual Gemini API Key Management</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block">Gemini API Key</label>
            <input
              type="password"
              value={manualApiKey}
              onChange={(e) => setManualApiKey(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] text-white px-8 py-5 outline-none focus:border-white/30 transition-all font-mono text-sm"
              placeholder="AIza..."
            />
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleReset}
                className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-[10px] transition-all"
              >
                Reset
              </button>
              <button
                onClick={handleValidateAndSave}
                disabled={isValidating}
                className="px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isValidating ? 'Validasi...' : 'Submit'}
              </button>
            </div>
            {validationError && (
              <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {validationError}
              </p>
            )}
            <p className="text-[10px] text-white/20 font-medium">
              * Kunci disimpan secara lokal di browser Anda. Gunakan dengan hati-hati.
            </p>
          </div>
        </motion.div>

        {/* Model Selection */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0A0A0A] p-12 rounded-[3rem] border border-white/5 shadow-2xl"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Core Engine</h2>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">Primary Synthesis LLM</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", desc: "Maximum Reasoning" },
              { id: "gemini-3-flash-preview", name: "Gemini 3 Flash", desc: "Next-Gen Flash" },
              { id: "gemini-3.1-flash-lite-preview", name: "Gemini Flash Lite", desc: "High Velocity" },
            ].map((model) => (
              <motion.button
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSettings({ ...settings, model: model.id })}
                className={`p-8 rounded-[2rem] border text-left transition-all duration-500 ${
                  settings.model === model.id
                    ? "border-white bg-white text-black shadow-xl"
                    : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-black uppercase tracking-tight text-lg">{model.name}</p>
                  {settings.model === model.id && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${settings.model === model.id ? 'text-black/40' : 'text-white/20'}`}>{model.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Prompt Template */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0A0A0A] p-12 rounded-[3rem] border border-white/5 shadow-2xl"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
              <Layout className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Synthesis Blueprints</h2>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">Prompt Template Configuration</p>
            </div>
          </div>
          
          <div className="flex overflow-x-auto pb-6 mb-10 gap-4 scrollbar-hide">
            {CONTENT_TYPES.map(type => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveContentTypeTab(type)}
                className={`whitespace-nowrap px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                  activeContentTypeTab === type
                    ? 'bg-white text-black border-white shadow-xl'
                    : 'bg-white/5 text-white/40 hover:text-white border-white/10'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {promptTemplates
              .filter(template => template.contentTypes.includes(activeContentTypeTab))
              .map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ x: 5 }}
                onClick={() => handleTemplateChange(template.id)}
                className={`w-full p-8 rounded-[2rem] border text-left transition-all duration-500 ${
                  currentTemplateIds[activeContentTypeTab] === template.id
                    ? "border-white bg-white text-black shadow-xl"
                    : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-black uppercase tracking-tight text-lg">{template.name}</p>
                  {currentTemplateIds[activeContentTypeTab] === template.id && (
                    <Check className="w-6 h-6 text-black" />
                  )}
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest leading-relaxed ${currentTemplateIds[activeContentTypeTab] === template.id ? 'text-black/40' : 'text-white/20'}`}>{template.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Output Options */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0A0A0A] p-12 rounded-[3rem] border border-white/5 shadow-2xl"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
              <Sliders className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Output Parameters</h2>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">Fine-tune Generation Behavior</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block">Default Synthesis Density</label>
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
                  className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] text-white px-8 py-5 outline-none focus:border-white/30 transition-all font-black text-lg uppercase tracking-tighter"
                  min="1"
                  max="1500"
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase tracking-widest">Prompts</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block flex items-center gap-3">
                  <Globe size={14} /> Language Protocol
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "en", name: "English" },
                    { id: "id", name: "Indonesian" },
                  ].map((lang) => (
                    <motion.button
                      key={lang.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSettings({ ...settings, language: lang.id })}
                      className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                        settings.language === lang.id
                          ? "bg-white text-black border-white shadow-xl"
                          : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {lang.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block flex items-center gap-3">
                  <Cpu size={14} /> Entropy Level
                </label>
                <div className="grid grid-cols-3 gap-4">
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
                      className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                        settings.variationLevel === level.id
                          ? "bg-white text-black border-white shadow-xl"
                          : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {level.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
                    <Database size={20} className="text-white/40" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-widest">Neural Cache</h3>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Auto-save synthesis logs locally</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                  className={`w-16 h-8 rounded-full transition-all relative p-1.5 duration-500 ${
                    settings.autoSave ? "bg-white" : "bg-white/5 border border-white/10"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.autoSave ? 32 : 0 }}
                    className={`w-5 h-5 rounded-full shadow-2xl transition-colors duration-500 ${settings.autoSave ? 'bg-black' : 'bg-white/20'}`}
                  />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
                      <AlertCircle size={20} className="text-white/40" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-widest">Negative Vectors</h3>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Include exclusion parameters for SDXL</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, includeNegative: !settings.includeNegative })}
                    className={`w-16 h-8 rounded-full transition-all relative p-1.5 duration-500 ${
                      settings.includeNegative ? "bg-white" : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.includeNegative ? 32 : 0 }}
                      className={`w-5 h-5 rounded-full shadow-2xl transition-colors duration-500 ${settings.includeNegative ? 'bg-black' : 'bg-white/20'}`}
                    />
                  </button>
                </div>
                
                <AnimatePresence>
                  {settings.includeNegative && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-20 space-y-4"
                    >
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest">
                        Custom Negative Prompt (Adobe Stock Guidelines)
                      </label>
                      <textarea
                        value={settings.customNegativePrompt || ''}
                        onChange={(e) => setSettings({ ...settings, customNegativePrompt: e.target.value })}
                        className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 text-sm text-white placeholder-white/10 focus:outline-none focus:border-white/30 transition-all font-medium leading-relaxed resize-none"
                        placeholder="--no text, watermark, deformed..."
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Preferences Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSavePreferences}
            className={`w-full flex items-center justify-center gap-4 font-black py-6 rounded-[2rem] transition-all duration-700 uppercase tracking-widest text-[10px] border shadow-2xl ${
              prefsSaved 
                ? "bg-white text-black border-white shadow-white/5" 
                : "bg-white text-black border-white shadow-white/10"
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
                className={`flex items-center gap-6 p-8 rounded-[2rem] text-sm border shadow-2xl transition-all duration-500 ${
                  prefsValidationMessage.type === 'success' 
                    ? 'bg-white/[0.02] text-white border-white/10' 
                    : 'bg-white/[0.02] text-white border-white/10'
                }`}
              >
                {prefsValidationMessage.type === 'success' ? (
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                )}
                <p className="font-black uppercase tracking-tight text-lg">{prefsValidationMessage.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
