import React from 'react';
import { Key, Eye, EyeOff, Save, Check, Loader2, AlertCircle } from 'lucide-react';
import { AppSettings, PromptTemplate } from '../types';
import { promptTemplates } from '../services/gemini';

interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onSaveApiKey: () => void | Promise<void>;
  apiKeySaved: boolean;
  isSavingKey?: boolean;
  keyValidationMessage?: { type: 'success' | 'error', text: string } | null;
  onSavePreferences?: () => void;
  prefsSaved?: boolean;
  prefsValidationMessage?: { type: 'success' | 'error', text: string } | null;
}

export default function Settings({ 
  settings, 
  setSettings, 
  onSaveApiKey, 
  apiKeySaved, 
  isSavingKey, 
  keyValidationMessage,
  onSavePreferences,
  prefsSaved,
  prefsValidationMessage
}: SettingsProps) {
  const [showApiKey, setShowApiKey] = React.useState(false);

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Configure your API keys and preferences</p>
      </div>

      <div className="space-y-6">
        {/* API Key Section */}
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#00D8B6]/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-[#00D8B6]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">API Key</h2>
              <p className="text-sm text-slate-400">Enter your Google Gemini API key</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder="Enter your API key..."
                className="w-full bg-[#0B1121] border border-slate-800 rounded-lg text-white px-4 py-3 pr-12 outline-none focus:border-[#00D8B6]"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={onSaveApiKey}
              disabled={!settings.apiKey.trim() || isSavingKey}
              className="w-full flex items-center justify-center gap-2 bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSavingKey ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Validating...</>
              ) : apiKeySaved ? (
                <><Check className="w-5 h-5" /> Saved!</>
              ) : (
                <><Save className="w-5 h-5" /> Save API Key</>
              )}
            </button>

            {keyValidationMessage && (
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                keyValidationMessage.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {keyValidationMessage.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <p>{keyValidationMessage.text}</p>
              </div>
            )}
          </div>
        </div>

        {/* Model Selection */}
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">AI Model</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", desc: "Best for complex tasks" },
              { id: "gemini-3-flash-preview", name: "Gemini 3 Flash", desc: "Fast and efficient" },
            ].map((model) => (
              <button
                key={model.id}
                onClick={() => setSettings({ ...settings, model: model.id })}
                className={`p-4 rounded-lg border text-left transition-all ${
                  settings.model === model.id
                    ? "border-[#00D8B6] bg-[#00D8B6]/10"
                    : "border-slate-800 bg-[#0B1121] hover:border-slate-700"
                }`}
              >
                <p className="font-medium text-white">{model.name}</p>
                <p className="text-xs text-slate-400">{model.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Template */}
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Prompt Template</h2>
          <div className="space-y-3">
            {promptTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSettings({ ...settings, templateId: template.id })}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  settings.templateId === template.id
                    ? "border-[#00D8B6] bg-[#00D8B6]/10"
                    : "border-slate-800 bg-[#0B1121] hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{template.name}</p>
                  {settings.templateId === template.id && (
                    <Check className="w-4 h-4 text-[#00D8B6]" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Output Options */}
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Output Options</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Default Prompt Count</label>
              <input
                type="number"
                value={settings.promptCount}
                onChange={(e) => setSettings({ ...settings, promptCount: Number(e.target.value) })}
                className="w-full bg-[#0B1121] border border-slate-800 rounded-lg text-white px-4 py-3 outline-none focus:border-[#00D8B6]"
                min="1"
                max="1500"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Language</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "en", name: "English" },
                  { id: "id", name: "Indonesian" },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSettings({ ...settings, language: lang.id })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      settings.language === lang.id
                        ? "border-[#00D8B6] bg-[#00D8B6]/10 text-[#00D8B6]"
                        : "border-slate-800 bg-[#0B1121] text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Auto-save Results</h3>
                  <p className="text-xs text-slate-400">Save generated prompts automatically</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.autoSave ? "bg-[#00D8B6]" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      settings.autoSave ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Include Negative Prompts</h3>
                  <p className="text-xs text-slate-400">Add negative prompts for SD/SDXL</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, includeNegative: !settings.includeNegative })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.includeNegative ? "bg-[#00D8B6]" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      settings.includeNegative ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Preferences Button */}
        <div className="pt-4">
          <button
            onClick={onSavePreferences}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {prefsSaved ? (
              <><Check className="w-5 h-5 text-[#00D8B6]" /> Saved!</>
            ) : (
              <><Save className="w-5 h-5" /> Save Preferences</>
            )}
          </button>

          {prefsValidationMessage && (
            <div className={`mt-4 flex items-center gap-2 p-3 rounded-lg text-sm ${
              prefsValidationMessage.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {prefsValidationMessage.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <p>{prefsValidationMessage.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
