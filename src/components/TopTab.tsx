import React, { useState, useRef } from 'react';
import { Search, Sparkles, Filter, ArrowUpDown, TrendingUp, BarChart2, Target, Zap, Upload, Image as ImageIcon, Film, X, Link as LinkIcon, Loader2, Cpu, Globe, Activity, Database, Palette, Layers, Box, Type, UserCircle } from 'lucide-react';
import { CategoryResult, AppSettings, ReferenceFile, AestheticAnalysis } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { AestheticAnalysisResult } from './AestheticAnalysisResult';
import FormField from './FormField';

interface TopTabProps {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  contentType: string;
  setContentType: React.Dispatch<React.SetStateAction<string>>;
  onAnalyze: () => void;
  onQuickGenerate: () => void;
  isAnalyzing: boolean;
  results: CategoryResult[];
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  filterCompetition: string;
  setFilterCompetition: React.Dispatch<React.SetStateAction<string>>;
  referenceFile: ReferenceFile | null;
  setReferenceFile: React.Dispatch<React.SetStateAction<ReferenceFile | null>>;
  referenceUrl: string;
  setReferenceUrl: React.Dispatch<React.SetStateAction<string>>;
  onAnalyzeAesthetic: () => void;
  isAnalyzingAesthetic: boolean;
  aestheticAnalysis: AestheticAnalysis | null;
  setAestheticAnalysis: React.Dispatch<React.SetStateAction<AestheticAnalysis | null>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const suggestionKeywords = [
  // Business & Corporate
  "corporate teamwork", "business meeting", "leadership concept", "modern office", 
  "startup culture", "financial growth", "data analysis", "project management",
  "entrepreneurship", "business strategy", "team collaboration",
  
  // Technology & Future
  "artificial intelligence", "cybersecurity", "virtual reality", "smart home", 
  "digital transformation", "metaverse concept", "cloud computing", "blockchain technology",
  "machine learning", "robotics", "5G network", "internet of things",
  "data privacy", "coding and programming", "future technology",
  
  // Lifestyle & People
  "family lifestyle", "healthy eating", "mental health awareness", "remote work", 
  "digital nomad", "fitness and wellness", "diversity and inclusion", "senior lifestyle",
  "yoga practice", "meditation", "work life balance", "student life",
  "active lifestyle", "casual portrait", "friends having fun",
  
  // Environment & Sustainability
  "sustainable energy", "climate change", "eco-friendly", "green technology", 
  "nature conservation", "recycling concept", "solar panels", "wind turbines",
  "zero waste", "organic farming", "electric vehicles", "environmental protection",
  
  // Abstract & Backgrounds
  "abstract background", "watercolor texture", "neon lights", "minimalist background", 
  "geometric shapes", "bokeh effect", "dark moody background", "seamless pattern",
  "gradient background", "paper texture", "liquid marble", "holographic background",
  
  // Industry & Professions
  "healthcare professional", "construction site", "e-learning", "logistics and delivery", 
  "agriculture", "manufacturing", "customer service", "culinary arts",
  "medical research", "real estate", "warehouse operations",
  
  // Trending Visual Styles & Concepts
  "3d render", "flat lay", "top view", "copy space", "isolated on white",
  "vintage style", "cyberpunk", "vaporwave", "double exposure", "minimalism",
  "generative ai", "cinematic lighting", "macro photography"
];

const trendingKeywords = [
  "artificial intelligence", "sustainable energy", "mental health awareness", 
  "abstract background", "diversity and inclusion", "remote work",
  "3d render", "cybersecurity"
];

export default function TopTab({
  keyword, setKeyword, contentType, setContentType, onAnalyze, onQuickGenerate, isAnalyzing, results,
  sortBy, setSortBy, filterCompetition, setFilterCompetition,
  referenceFile, setReferenceFile,
  referenceUrl, setReferenceUrl,
  onAnalyzeAesthetic, isAnalyzingAesthetic, aestheticAnalysis, setAestheticAnalysis,
  settings, setSettings
}: TopTabProps) {
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = React.useMemo(() => {
    if ((keyword || '').trim().length > 0) {
      const lowerKeyword = keyword.toLowerCase();
      return suggestionKeywords
        .filter(k => k.toLowerCase().includes(lowerKeyword))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(lowerKeyword);
          const bStarts = b.toLowerCase().startsWith(lowerKeyword);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localeCompare(b);
        })
        .slice(0, 8);
    }
    return trendingKeywords;
  }, [keyword]);

  const showSuggestions = isFocused && ((keyword || '').trim().length === 0 || filteredSuggestions.length > 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setReferenceFile({
        data: base64String,
        mimeType: file.type,
        name: file.name,
        previewUrl: URL.createObjectURL(file)
      });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    if (referenceFile?.previewUrl) {
      URL.revokeObjectURL(referenceFile.previewUrl);
    }
    setReferenceFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-32 relative">
      <div className="text-center mt-20 mb-16 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-accent/5 border border-accent/20 text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-8"
        >
          <Cpu size={14} className="animate-pulse" /> Market Intelligence Engine
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4 tracking-tighter leading-tight max-w-4xl mx-auto"
        >
          Analyze Trends, Dominate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">Market</span>.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed"
        >
          Powered by <span className="text-white font-medium">Gemini 3.1 Pro</span> for high-precision microstock data synthesis and neural prompt engineering.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-[3rem] shadow-2xl max-w-4xl mx-auto overflow-hidden futuristic-glow relative border-white/10"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-40" />
        
        {/* Header/Content Type Selection */}
        <div className="px-6 py-6 sm:px-10 sm:py-8 border-b border-white/5 bg-white/5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-3 shrink-0">
              <Globe size={14} className="text-accent" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Content Sector</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { id: 'Photo', label: 'PHOTO', icon: ImageIcon },
                { id: 'Illustration', label: 'ILLUSTRATION', icon: Palette },
                { id: 'Vector', label: 'VECTOR', icon: Layers },
                { id: 'Background', label: 'BACKGROUND', icon: Globe },
                { id: 'Video', label: 'VIDEO', icon: Film },
                { id: '3D Render', label: '3D RENDER', icon: Box },
                { id: 'AI Art & Creativity', label: 'AI CREATIVE', icon: Cpu },
              ].map(type => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setContentType(type.id)}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-bold tracking-[0.1em] sm:tracking-[0.15em] transition-all duration-300 border ${
                    contentType === type.id 
                      ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <type.icon size={12} className={contentType === type.id ? 'text-black' : 'text-accent'} />
                  {type.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Intent Targeting Options */}
        <div className="px-6 py-4 sm:px-10 border-b border-white/5 bg-black/20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3 shrink-0">
              <Target size={14} className="text-accent" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Precision Targeting</span>
            </div>
            <div className="flex flex-wrap gap-4 flex-1 items-center">
              <select 
                value={settings.intent?.targetPlatform || 'Adobe Stock'}
                onChange={(e) => setSettings(s => ({ ...s, intent: { ...s.intent, targetPlatform: e.target.value, primaryGoal: s.intent?.primaryGoal || 'Portfolio Building', timeCommitment: s.intent?.timeCommitment || 'Part-time' } }))}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-accent/40 transition-colors"
              >
                <option value="Adobe Stock">Adobe Stock</option>
                <option value="Shutterstock">Shutterstock</option>
                <option value="Freepik">Freepik</option>
                <option value="Getty Images">Getty Images</option>
                <option value="General Microstock">General Microstock</option>
              </select>

              <select 
                value={settings.intent?.primaryGoal || 'Portfolio Building'}
                onChange={(e) => setSettings(s => ({ ...s, intent: { ...s.intent, primaryGoal: e.target.value, targetPlatform: s.intent?.targetPlatform || 'Adobe Stock', timeCommitment: s.intent?.timeCommitment || 'Part-time' } }))}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-accent/40 transition-colors"
              >
                <option value="Portfolio Building">Portfolio Building (Long-term)</option>
                <option value="Quick Passive Income">Quick Passive Income (Trends)</option>
                <option value="Style Experimentation">Style Experimentation</option>
              </select>

              <select 
                value={settings.intent?.timeCommitment || 'Part-time'}
                onChange={(e) => setSettings(s => ({ ...s, intent: { ...s.intent, timeCommitment: e.target.value, targetPlatform: s.intent?.targetPlatform || 'Adobe Stock', primaryGoal: s.intent?.primaryGoal || 'Portfolio Building' } }))}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-accent/40 transition-colors"
              >
                <option value="Limited">Limited Time (&lt; 5 hrs/week)</option>
                <option value="Part-time">Part-time (5-20 hrs/week)</option>
                <option value="Full-time">Full-time (20+ hrs/week)</option>
              </select>

              {settings.creatorProfile?.aestheticDNA && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium ml-auto" title="Aesthetic DNA Active">
                  <UserCircle size={14} />
                  <span className="hidden sm:inline">DNA Active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Input Area */}
        <div className="p-6 sm:p-10 space-y-8 sm:space-y-10 relative">
          <FormField
            label="Primary Concept / Keywords"
            icon={<Type size={14} />}
            description="Describe your creative concept or enter neural keywords to generate prompts."
            error={!(keyword || '').trim() && !referenceFile && !(referenceUrl || '').trim() ? "Please provide a keyword, reference file, or URL to begin analysis." : undefined}
          >
            <div className="relative group mt-2">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-blue-500/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <textarea 
                className="relative w-full h-40 sm:h-48 bg-black/40 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 text-white placeholder-slate-600 resize-none outline-none focus:border-accent/40 focus:ring-0 transition-all font-light text-lg sm:text-xl leading-relaxed shadow-inner"
                placeholder="Describe your creative concept or enter neural keywords..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              />
              
              <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-4 glass-panel rounded-[2.5rem] shadow-2xl z-50 max-h-80 overflow-y-auto custom-scrollbar border-white/10 backdrop-blur-2xl"
                  >
                    {!(keyword || '').trim() && (
                      <div className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 border-b border-white/5 bg-white/5">
                        <TrendingUp size={14} className="text-accent" /> Trending Neural Patterns
                      </div>
                    )}
                    {filteredSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        className="w-full text-left px-8 py-5 text-sm text-slate-300 hover:bg-white/5 hover:text-accent transition-all border-b border-white/5 last:border-0 flex items-center gap-5 group"
                        onClick={() => {
                          setKeyword(suggestion);
                          setIsFocused(false);
                        }}
                      >
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-accent/30 group-hover:bg-accent/5 transition-all">
                          <Search size={14} className="text-slate-600 group-hover:text-accent transition-colors" />
                        </div>
                        <span className="font-light tracking-wide">{suggestion}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FormField>

          {/* Reference Tools Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            {/* File Upload */}
            <FormField
              label="Visual DNA Analysis"
              icon={<Activity size={14} />}
              description="Upload an image or video to extract aesthetic properties."
            >
              <div className="mt-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
                
                {!referenceFile ? (
                  <motion.button 
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-14 sm:h-16 flex items-center justify-center gap-4 text-[9px] font-bold text-slate-400 hover:text-white hover:border-white/30 transition-all bg-white/5 border border-dashed border-white/10 rounded-2xl px-6 uppercase tracking-[0.2em]"
                  >
                    <Upload size={18} className="text-accent" />
                    <span>Upload Reference Asset</span>
                  </motion.button>
                ) : (
                  <div className="space-y-3">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative bg-white/5 border border-accent/30 rounded-2xl p-3 sm:p-4 flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center border border-white/10 shrink-0 shadow-lg">
                        {referenceFile.mimeType.startsWith('image/') ? (
                          <img src={referenceFile.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Film size={24} className="text-slate-500" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-bold text-white truncate">{referenceFile.name}</span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                          {referenceFile.mimeType.split('/')[1]} • Neural Ready
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {referenceFile.mimeType.startsWith('image/') && (
                          <motion.button 
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,255,255,0.1)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              onAnalyzeAesthetic();
                            }}
                            disabled={isAnalyzingAesthetic}
                            className="p-2 text-accent hover:bg-accent/10 rounded-xl transition-all border border-transparent hover:border-accent/30"
                            title="Analyze Aesthetic"
                          >
                            {isAnalyzingAesthetic ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                          </motion.button>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,0,0,0.1)' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { removeFile(); setAestheticAnalysis(null); }}
                          className="p-2 text-slate-500 hover:text-rose-400 rounded-xl transition-all border border-transparent hover:border-rose-400/30"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </FormField>

            {/* URL Reference */}
            <FormField
              label="Market Source Protocol"
              icon={<Database size={14} />}
              description="Provide a URL to analyze visual trends and extract keywords."
            >
              <div className="relative group mt-2">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <LinkIcon size={16} className="text-slate-500 group-focus-within:text-accent transition-colors" />
                </div>
                <input 
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="Inject research URL for context..."
                  className="w-full h-14 sm:h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-20 py-3 text-sm text-white outline-none focus:border-accent/40 focus:ring-0 transition-all placeholder:text-slate-600 font-light tracking-wide shadow-inner"
                />
                {referenceUrl && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <motion.button 
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,255,255,0.1)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        onAnalyzeAesthetic();
                      }}
                      disabled={isAnalyzingAesthetic}
                      className="p-2 text-accent hover:bg-accent/10 rounded-xl transition-all border border-transparent hover:border-accent/30"
                      title="Analyze URL Aesthetic"
                    >
                      {isAnalyzingAesthetic ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,0,0,0.1)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { setReferenceUrl(''); setAestheticAnalysis(null); }}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-xl transition-all border border-transparent hover:border-rose-400/30"
                    >
                      <X size={16} />
                    </motion.button>
                  </div>
                )}
              </div>
            </FormField>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4">
            <motion.button 
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={onQuickGenerate}
              disabled={isAnalyzing || (!(keyword || '').trim() && !referenceFile && !(referenceUrl || '').trim())}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-[0.3em] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 shadow-xl"
            >
              {isAnalyzing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Zap size={16} className="text-accent" />
                  <span>Quick Synthesis</span>
                </>
              )}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={onAnalyze}
              disabled={isAnalyzing || (!(keyword || '').trim() && !referenceFile && !(referenceUrl || '').trim())}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-10 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-[0.3em] transition-all disabled:opacity-50 disabled:cursor-not-allowed futuristic-glow hover:bg-slate-200 shadow-2xl shadow-white/10"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Neural Data...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Initialize Deep Analysis</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Dedicated Aesthetic Analysis Section */}
      <AnimatePresence>
        {aestheticAnalysis && (
          <AestheticAnalysisResult 
            aestheticAnalysis={aestheticAnalysis}
            setAestheticAnalysis={setAestheticAnalysis}
            setKeyword={setKeyword}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mt-16 glass-panel rounded-[2.5rem] p-8 shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-4 text-white font-bold px-4 text-[10px] tracking-[0.3em] uppercase shrink-0">
              <Filter size={18} className="text-accent" />
              <span>Refine Intelligence Output</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto overflow-x-auto pb-4 sm:pb-0 hide-scrollbar">
              {/* Sort By */}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-2 shrink-0">
                 <div className="flex items-center px-5 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-r border-white/10 mr-3">
                   <ArrowUpDown size={14} className="mr-3" /> Sort Protocol
                 </div>
                 <div className="flex items-center gap-2">
                   {[
                     { id: 'opportunity', label: 'OPPORTUNITY', icon: Zap },
                     { id: 'volume', label: 'VOLUME', icon: BarChart2 },
                     { id: 'trend', label: 'TREND', icon: TrendingUp },
                     { id: 'difficulty', label: 'DIFFICULTY', icon: Target }
                   ].map(sort => (
                     <motion.button 
                      key={sort.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSortBy(sort.id)}
                      className={`flex items-center whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all duration-500 border ${
                        sortBy === sort.id 
                          ? 'bg-white text-black border-white shadow-lg' 
                          : 'text-slate-500 border-transparent hover:text-white hover:bg-white/5'
                      }`}
                     >
                       <sort.icon size={14} className={`mr-2.5 ${sortBy === sort.id ? 'text-black' : 'text-slate-500'}`} />
                       {sort.label}
                     </motion.button>
                   ))}
                 </div>
              </div>

              {/* Filter by Competition */}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-2 shrink-0">
                 <div className="flex items-center px-5 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-r border-white/10 mr-3">
                   Competition
                 </div>
                 <div className="flex items-center gap-2">
                   {[
                     { id: 'all', label: 'ALL' },
                     { id: 'Low', label: 'LOW' },
                     { id: 'Medium', label: 'MED' },
                     { id: 'High', label: 'HIGH' }
                   ].map(filter => (
                     <motion.button 
                      key={filter.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilterCompetition(filter.id)}
                      className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all duration-500 border ${
                        filterCompetition === filter.id 
                          ? 'bg-white text-black border-white shadow-lg' 
                          : 'text-slate-500 border-transparent hover:text-white hover:bg-white/5'
                      }`}
                     >
                       {filter.label}
                     </motion.button>
                   ))}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
