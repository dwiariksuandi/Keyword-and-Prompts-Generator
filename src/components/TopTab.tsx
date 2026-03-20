import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Filter, ArrowUpDown, TrendingUp, BarChart2, Target, Zap, Upload, Image as ImageIcon, Film, X, Link as LinkIcon, Loader2, Cpu, Globe, Activity, Database, Terminal, Palette, Layers, Box, ChevronDown, ChevronUp, Type } from 'lucide-react';
import { CategoryResult, AppSettings, ReferenceFile, AestheticAnalysis } from '../types';
import { fetchTrendingKeywords } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import TrendForecast from './TrendForecast';
import CompetitorGapAnalysis from './CompetitorGapAnalysis';
import FormField from './FormField';
import LoadingIndicator from './LoadingIndicator';

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
  onSelectTrend?: (niche: string) => void;
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
  settings, onSelectTrend
}: TopTabProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [realtimeSuggestions, setRealtimeSuggestions] = useState<{ keyword: string; relevanceScore: number }[]>([]);
  const [isAestheticExpanded, setIsAestheticExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (keyword.trim().length > 2) {
        const results = await fetchTrendingKeywords(keyword, settings, contentType);
        setRealtimeSuggestions(results);
      } else {
        setRealtimeSuggestions([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [keyword, settings, contentType]);

  useEffect(() => {
    const allSuggestions = [
      ...suggestionKeywords.map(s => ({ keyword: s, relevanceScore: 5 })),
      ...realtimeSuggestions
    ];
    const filtered = allSuggestions.filter(s => s.keyword.toLowerCase().includes(keyword.toLowerCase()));
    setFilteredSuggestions(filtered.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10));
  }, [keyword, realtimeSuggestions]);

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

  useEffect(() => {
    if (keyword.trim().length > 0) {
      const parts = keyword.split(',').map(p => p.trim().toLowerCase());
      const lastPart = parts[parts.length - 1];
      
      if (lastPart) {
        const filtered = suggestionKeywords
          .filter(k => k.toLowerCase().includes(lastPart) && !parts.includes(k.toLowerCase()))
          .sort((a, b) => {
            const aStarts = a.toLowerCase().startsWith(lastPart);
            const bStarts = b.toLowerCase().startsWith(lastPart);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return a.localeCompare(b);
          })
          .slice(0, 8);
        setFilteredSuggestions(filtered);
        setShowSuggestions(isFocused && filtered.length > 0);
      } else {
        setFilteredSuggestions(trendingKeywords);
        setShowSuggestions(isFocused);
      }
    } else {
      setFilteredSuggestions(trendingKeywords);
      setShowSuggestions(isFocused);
    }
  }, [keyword, isFocused]);

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

        {/* Main Input Area */}
        <div className="p-6 sm:p-10 space-y-8 sm:space-y-10 relative">
          <FormField
            label="Primary Concept / Keywords"
            icon={<Type size={14} />}
            description="Describe your creative concept or enter neural keywords to generate prompts."
            error={!keyword.trim() && !referenceFile && !referenceUrl.trim() ? "Please provide a keyword, reference file, or URL to begin analysis." : undefined}
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
              <TrendForecast niche={keyword} settings={settings} onSelect={onSelectTrend || setKeyword} />
              <CompetitorGapAnalysis niche={keyword} onSelect={onSelectTrend || setKeyword} />
              
              <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-4 glass-panel rounded-[2.5rem] shadow-2xl z-50 max-h-80 overflow-y-auto custom-scrollbar border-white/10 backdrop-blur-2xl"
                  >
                    {!keyword.trim() && (
                      <div className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 border-b border-white/5 bg-white/5">
                        <TrendingUp size={14} className="text-accent" /> Trending Neural Patterns
                      </div>
                    )}
                    {filteredSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        className="w-full text-left px-8 py-5 text-sm text-slate-300 hover:bg-white/5 hover:text-accent transition-all border-b border-white/5 last:border-0 flex items-center justify-between group"
                        onClick={() => {
                          const parts = keyword.split(',');
                          parts.pop(); // Remove the partial last part
                          const newKeyword = [...parts, suggestion.keyword].map(p => p.trim()).filter(Boolean).join(', ');
                          setKeyword(newKeyword + ', ');
                          setIsFocused(false);
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-accent/30 group-hover:bg-accent/5 transition-all">
                            <Search size={14} className="text-slate-600 group-hover:text-accent transition-colors" />
                          </div>
                          {suggestion.keyword}
                        </div>
                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-500 group-hover:text-accent">Score: {suggestion.relevanceScore}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Keyword Suggestions Chips */}
            {keyword.trim().length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestionKeywords
                  .filter(k => {
                    const lowerK = k.toLowerCase();
                    const parts = keyword.split(',').map(p => p.trim().toLowerCase());
                    const lastPart = parts[parts.length - 1];
                    
                    if (!lastPart) return false;
                    
                    // Match if the suggestion includes the last typed part, 
                    // and the suggestion isn't already in the list of parts
                    return lowerK.includes(lastPart) && !parts.includes(lowerK);
                  })
                  .slice(0, 6)
                  .map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const parts = keyword.split(',');
                        parts.pop(); // Remove the partial last part
                        const newKeyword = [...parts, suggestion].map(p => p.trim()).filter(Boolean).join(', ');
                        setKeyword(newKeyword + ', ');
                      }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-slate-300 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles size={12} className="text-accent" />
                      {suggestion}
                    </button>
                  ))}
              </div>
            )}
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
                              setIsAestheticExpanded(true);
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
                        setIsAestheticExpanded(true);
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
              disabled={isAnalyzing || (!keyword.trim() && !referenceFile && !referenceUrl.trim())}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-[0.3em] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 shadow-xl"
            >
              {isAnalyzing ? (
                <LoadingIndicator size="sm" />
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
              disabled={isAnalyzing || (!keyword.trim() && !referenceFile && !referenceUrl.trim())}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-10 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-[0.3em] transition-all disabled:opacity-50 disabled:cursor-not-allowed futuristic-glow hover:bg-slate-200 shadow-2xl shadow-white/10"
            >
              {isAnalyzing ? (
                <>
                  <LoadingIndicator size="sm" />
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
          <motion.div 
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-accent/20 rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.05)]">
              {/* Header / Toggle */}
              <div 
                className="p-6 sm:p-8 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsAestheticExpanded(!isAestheticExpanded)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                    <Terminal size={24} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">Aesthetic DNA Decoded</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-[0.2em] mt-1">
                      {aestheticAnalysis.detectedContentType || 'Analysis Complete'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setAestheticAnalysis(null); }} 
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                    title="Dismiss Analysis"
                  >
                    <X size={18} />
                  </button>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="p-2 text-slate-400">
                    {isAestheticExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              <AnimatePresence>
                {isAestheticExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {/* Artistic Style */}
                        <div className="space-y-3 lg:col-span-2">
                          <div className="flex items-center gap-2">
                            <Palette size={14} className="text-accent" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Artistic Style</span>
                          </div>
                          <p className="text-sm text-slate-200 font-light leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                            {aestheticAnalysis.artisticStyle}
                          </p>
                        </div>

                        {/* Lighting */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Zap size={14} className="text-amber-400" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Lighting</span>
                          </div>
                          <p className="text-sm text-slate-200 font-light leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                            {aestheticAnalysis.lighting}
                          </p>
                        </div>

                        {/* Mood */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Activity size={14} className="text-rose-400" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Mood</span>
                          </div>
                          <p className="text-sm text-slate-200 font-light leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                            {aestheticAnalysis.mood}
                          </p>
                        </div>

                        {/* Composition */}
                        <div className="space-y-3 lg:col-span-2">
                          <div className="flex items-center gap-2">
                            <Layers size={14} className="text-emerald-400" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Composition</span>
                          </div>
                          <p className="text-sm text-slate-200 font-light leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                            {aestheticAnalysis.composition}
                          </p>
                        </div>

                        {/* Chromatic Profile */}
                        <div className="space-y-3 lg:col-span-2">
                          <div className="flex items-center gap-2">
                            <Box size={14} className="text-indigo-400" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Chromatic Profile</span>
                          </div>
                          <div className="flex flex-wrap gap-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                            {aestheticAnalysis.colorPalette.map((color, i) => (
                              <span key={i} className="px-3 py-1.5 bg-black/40 rounded-xl text-[10px] text-slate-300 border border-white/10 font-mono uppercase tracking-wider">
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Strategic Neural Insights */}
                        <div className="space-y-3 lg:col-span-4">
                          <div className="flex items-center gap-2">
                            <Target size={14} className="text-accent" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Strategic Neural Insights (Click to Add)</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {aestheticAnalysis.suggestions.map((suggestion, i) => (
                              <motion.button 
                                key={i} 
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,255,255,0.08)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setKeyword(prev => prev ? `${prev}, ${suggestion}` : suggestion)}
                                className="text-left p-4 rounded-2xl border border-white/10 hover:border-accent/40 transition-all flex items-start gap-3 group bg-white/5"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0 shadow-[0_0_8px_rgba(0,255,255,0.5)] group-hover:scale-150 transition-transform" />
                                <span className="text-xs text-slate-300 group-hover:text-white font-light leading-relaxed">{suggestion}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Market Gaps */}
                        {aestheticAnalysis.marketGaps && aestheticAnalysis.marketGaps.length > 0 && (
                          <div className="space-y-3 lg:col-span-4">
                            <div className="flex items-center gap-2">
                              <TrendingUp size={14} className="text-emerald-400" />
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Market Gaps & Opportunities</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {aestheticAnalysis.marketGaps.map((gap, i) => (
                                <div 
                                  key={i} 
                                  className="text-left p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3 group"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                  <span className="text-xs text-slate-300 font-light leading-relaxed">{gap}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Grounding Sources */}
                        {aestheticAnalysis.groundingSources && aestheticAnalysis.groundingSources.length > 0 && (
                          <div className="space-y-3 lg:col-span-4 mt-4">
                            <div className="flex items-center gap-2">
                              <Globe size={14} className="text-emerald-400" />
                              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Real-Time Sources</span>
                            </div>
                            <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                              <ul className="space-y-2">
                                {aestheticAnalysis.groundingSources.map((source, idx) => (
                                  <li key={idx} className="text-xs text-slate-300 font-light truncate">
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors underline decoration-emerald-500/30 underline-offset-4">
                                      {source.title || source.uri}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
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
