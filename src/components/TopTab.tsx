import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Filter, ArrowUpDown, TrendingUp, BarChart2, Target, Zap, Upload, Image as ImageIcon, Film, X, Link as LinkIcon, Loader2 } from 'lucide-react';
import { CategoryResult, AppSettings, ReferenceFile } from '../types';

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
  referenceUrl, setReferenceUrl
}: TopTabProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const lowerKeyword = keyword.toLowerCase();
      const filtered = suggestionKeywords
        .filter(k => k.toLowerCase().includes(lowerKeyword))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(lowerKeyword);
          const bStarts = b.toLowerCase().startsWith(lowerKeyword);
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
  }, [keyword, isFocused]);

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="text-center mt-10 mb-8">
        <h1 className="text-2xl text-slate-200 font-medium mb-2">
          Get trend analysis, keywords, and creative ideas for your <span className="font-bold text-white">Adobe Stock</span> content.
        </h1>
        <p className="text-[#00D8B6] text-sm">Using: Google Gemini</p>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl max-w-3xl mx-auto overflow-hidden">
        {/* Header/Content Type Selection */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider shrink-0">Content Type</span>
            <div className="flex flex-wrap gap-2">
              {['Photo', 'Illustration', 'Vector', 'Background', 'Video', '3D Render', 'AI Art & Creativity'].map(type => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    contentType === type 
                      ? 'bg-[#00D8B6] text-slate-900 shadow-[0_0_15px_rgba(0,216,182,0.3)]' 
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Input Area */}
        <div className="p-6 space-y-4 relative">
          <div className="relative">
            <textarea 
              className="w-full h-32 bg-slate-800/20 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 resize-none outline-none focus:border-[#00D8B6]/50 transition-all"
              placeholder="Enter your keyword or topic for research..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto backdrop-blur-md">
                {!keyword.trim() && (
                  <div className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800/50 bg-slate-900/50">
                    <Sparkles size={12} className="text-[#00D8B6]" /> Trending Searches
                  </div>
                )}
                {filteredSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-[#00D8B6]/10 hover:text-white transition-colors border-b border-slate-800/50 last:border-0 flex items-center gap-3"
                    onClick={() => {
                      setKeyword(suggestion);
                      setIsFocused(false);
                      setShowSuggestions(false);
                    }}
                  >
                    <Search size={14} className="text-slate-500" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reference Tools Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Visual Reference</label>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
              />
              
              {!referenceFile ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-[#00D8B6] hover:border-[#00D8B6]/50 transition-all bg-slate-800/30 border border-dashed border-slate-700 rounded-xl px-4 py-3"
                >
                  <Upload size={16} />
                  <span>Upload Image or Video</span>
                </button>
              ) : (
                <div className="relative bg-slate-800/50 border border-[#00D8B6]/30 rounded-xl p-2 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-700 shrink-0">
                    {referenceFile.mimeType.startsWith('image/') ? (
                      <img src={referenceFile.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Film size={24} className="text-slate-500" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-slate-200 truncate">{referenceFile.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{referenceFile.mimeType.split('/')[1]} • Ready</span>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* URL Reference */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Link Reference</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={16} className="text-slate-500" />
                </div>
                <input 
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="Paste research URL here..."
                  className="w-full bg-slate-800/30 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#00D8B6]/50 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
            <button 
              onClick={onQuickGenerate}
              disabled={isAnalyzing || (!keyword.trim() && !referenceFile && !referenceUrl.trim())}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 active:scale-95"
            >
              {isAnalyzing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Zap size={18} className="text-yellow-400" />
                  <span>Quick Prompts</span>
                </>
              )}
            </button>
            <button 
              onClick={onAnalyze}
              disabled={isAnalyzing || (!keyword.trim() && !referenceFile && !referenceUrl.trim())}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,216,182,0.2)] active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles size={18} className="animate-pulse" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Start Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-300 font-medium px-2">
            <Filter size={18} className="text-[#00D8B6]" />
            <span>Refine Results</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {/* Sort By */}
            <div className="flex items-center bg-slate-800/40 border border-slate-700/50 rounded-lg p-1 shrink-0">
               <div className="flex items-center px-3 text-slate-400 text-sm font-medium border-r border-slate-700/50 mr-1">
                 <ArrowUpDown size={14} className="mr-1.5" /> Sort
               </div>
               <div className="flex items-center gap-1">
                 {[
                   { id: 'opportunity', label: 'Opportunity', icon: Zap },
                   { id: 'volume', label: 'Volume', icon: BarChart2 },
                   { id: 'trend', label: 'Trend', icon: TrendingUp },
                   { id: 'difficulty', label: 'Difficulty', icon: Target }
                 ].map(sort => (
                   <button 
                    key={sort.id}
                    onClick={() => setSortBy(sort.id)}
                    className={`flex items-center whitespace-nowrap px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      sortBy === sort.id 
                        ? 'bg-[#00D8B6]/10 text-[#00D8B6] shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                   >
                     <sort.icon size={14} className={`mr-1.5 ${sortBy === sort.id ? 'text-[#00D8B6]' : 'text-slate-500'}`} />
                     {sort.label}
                   </button>
                 ))}
               </div>
            </div>

            {/* Filter by Competition */}
            <div className="flex items-center bg-slate-800/40 border border-slate-700/50 rounded-lg p-1 shrink-0">
               <div className="flex items-center px-3 text-slate-400 text-sm font-medium border-r border-slate-700/50 mr-1">
                 Competition
               </div>
               <div className="flex items-center gap-1">
                 {[
                   { id: 'all', label: 'All Levels' },
                   { id: 'Low', label: 'Low' },
                   { id: 'Medium', label: 'Medium' },
                   { id: 'High', label: 'High' }
                 ].map(filter => (
                   <button 
                    key={filter.id}
                    onClick={() => setFilterCompetition(filter.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      filterCompetition === filter.id 
                        ? 'bg-slate-700 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                   >
                     {filter.label}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
