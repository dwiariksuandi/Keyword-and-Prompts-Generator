import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, ArrowUpDown, TrendingUp, BarChart2, Target, Zap } from 'lucide-react';
import { CategoryResult, AppSettings } from '../types';

interface TopTabProps {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  contentType: string;
  setContentType: React.Dispatch<React.SetStateAction<string>>;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  results: CategoryResult[];
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  filterCompetition: string;
  setFilterCompetition: React.Dispatch<React.SetStateAction<string>>;
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
  keyword, setKeyword, contentType, setContentType, onAnalyze, isAnalyzing, results,
  sortBy, setSortBy, filterCompetition, setFilterCompetition
}: TopTabProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

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

      <div className="relative bg-[#111827] border border-slate-800 rounded-xl p-4 mb-8 shadow-2xl max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-4 border-b border-slate-800 pb-4">
          <span className="text-slate-400 text-sm font-medium">Content Type:</span>
          <div className="flex flex-wrap gap-2">
            {['Photo', 'Illustration', 'Vector', 'Background', 'Video', '3D Render'].map(type => (
              <button
                key={type}
                onClick={() => setContentType(type)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  contentType === type 
                    ? 'bg-[#00D8B6] text-slate-900' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <textarea 
          className="w-full h-24 bg-transparent text-white placeholder-slate-500 resize-none outline-none"
          placeholder="Enter your keyword here..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#111827] border border-slate-800 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
            {!keyword.trim() && (
              <div className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/50">
                <Sparkles size={14} className="text-[#00D8B6]" /> Trending Searches
              </div>
            )}
            {filteredSuggestions.map((suggestion, i) => (
              <button
                key={i}
                className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800/50 last:border-0 flex items-center gap-3"
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

        <div className="absolute bottom-4 right-4">
          <button 
            onClick={onAnalyze}
            disabled={isAnalyzing || !keyword.trim()}
            className="flex items-center space-x-2 bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Search size={18} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
          </button>
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
