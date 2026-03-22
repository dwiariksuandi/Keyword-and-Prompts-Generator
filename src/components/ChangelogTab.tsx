import React, { useState } from 'react';
import { History, Star, Zap, ShieldCheck, Milestone, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ChangelogTab() {
  const [isExpanded, setIsExpanded] = useState(false);
  const versions = [
    {
      version: "v1.3.0",
      date: "March 2026",
      title: "Aesthetic Analysis & Granular Feedback",
      icon: <Zap className="w-5 h-5 text-white" />,
      changes: [
        "Introduced 'Aesthetic DNA Analysis' for AI Art & Creativity, extracting style, mood, and color palette from references.",
        "Enhanced prompt scoring with granular feedback on Keyword Usage, Clarity, Specificity, and Adobe Stock Compliance.",
        "Added 'Variation Level' setting (Low, Medium, High) to control prompt diversity and avoid 'Similar Content' rejections.",
        "Optimized Video content generation with specific cinematic camera movements and technical specifications (fps, resolution).",
        "Improved prompt generation logic to ensure higher variety in compositions and camera angles across all categories."
      ]
    },
    {
      version: "v1.2.2",
      date: "March 2026",
      title: "Deep Keyword Research & Real Data Simulation",
      icon: <Star className="w-5 h-5 text-white/60" />,
      changes: [
        "Overhauled the Keyword Research engine to simulate real-world Adobe Stock/Shutterstock search data.",
        "Volume and Competition metrics are now highly realistic, focusing on actual market demand and existing asset counts.",
        "AI is now strictly instructed to find 'Blue Ocean' niches (High Volume, Low Competition) and avoid generic categories.",
        "Increased the number of long-tail keywords generated per niche (now 5-7 exact-match keywords)."
      ]
    },
    {
      version: "v1.2.1",
      date: "March 2026",
      title: "Adobe Stock Optimization",
      icon: <Star className="w-5 h-5 text-white/60" />,
      changes: [
        "Strictly enforced Prompt Templates to ensure AI follows the selected structure.",
        "Optimized all built-in templates specifically for Adobe Stock (added 'no text', 'commercial photography', etc.).",
        "Ensured AI Model selection is strictly applied to all generation and optimization processes."
      ]
    },
    {
      version: "v1.2.0",
      date: "March 2026",
      title: "Optimization & Auto-Save",
      icon: <Zap className="w-5 h-5 text-white/60" />,
      changes: [
        "Added Auto-save History & Results feature to persist data across sessions.",
        "Synchronized Default Prompt Count settings with the Prompt generation tab.",
        "Improved Negative Prompts logic to apply during the Optimize/Upgrade process.",
        "Enhanced UI for the API Key login screen with Indonesian instructions and clear warnings."
      ]
    },
    {
      version: "v1.1.0",
      date: "March 2026",
      title: "UI/UX Enhancements",
      icon: <Star className="w-5 h-5 text-white/60" />,
      changes: [
        "Added Indonesian language support for prompts.",
        "Redesigned the initial login screen with glassmorphism and gradient effects.",
        "Added direct links to Google AI Studio for easier API Key retrieval."
      ]
    },
    {
      version: "v1.0.0",
      date: "Initial Release",
      title: "Core Features Launch",
      icon: <ShieldCheck className="w-5 h-5 text-white/60" />,
      changes: [
        "Keyword analysis for microstock platforms (Adobe Stock, Freepik, etc.).",
        "AI-powered prompt generation tailored for specific content types (Photo, Vector, 3D).",
        "Prompt optimization and upgrade feature.",
        "Download and copy prompts functionality.",
        "Customizable prompt templates and settings."
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-16"
    >
      <div className="flex items-center gap-6 mb-16">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-4 bg-white/5 border border-white/10 rounded-2xl"
        >
          <Milestone className="w-8 h-8 text-white" />
        </motion.div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">System <span className="text-white/40">Evolution</span></h1>
          <p className="text-white/40 font-medium">Tracking the neural development and feature deployments.</p>
        </div>
      </div>

      <div className="space-y-16 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent">
        {/* Current Version */}
        <VersionCard v={versions[0]} index={0} />

        {/* Previous Versions Toggle */}
        <div className="relative flex justify-center z-20">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white/40 uppercase tracking-[0.2em] hover:text-white hover:border-white/20 transition-all"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} />
                Hide Previous Versions
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                Show Previous Versions ({versions.length - 1})
              </>
            )}
          </motion.button>
        </div>

        {/* Previous Versions */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-16 overflow-hidden"
            >
              {versions.slice(1).map((v, index) => (
                <VersionCard key={v.version} v={v} index={index + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface VersionCardProps {
  v: any;
  index: number;
  key?: string | number;
}

function VersionCard({ v, index }: VersionCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl border border-white/10 bg-[#0A0A0A] text-white shadow-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
        {v.icon}
      </div>
      
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] group-hover:border-white/20 transition-all duration-500 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white font-mono">{v.version}</span>
              <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                Stable
              </span>
            </div>
            <h3 className="text-sm font-black text-white/40 uppercase tracking-tight">{v.title}</h3>
          </div>
          <time className="text-[10px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/10 h-fit">
            {v.date}
          </time>
        </div>
        <ul className="space-y-5">
          {v.changes.map((change: string, i: number) => (
            <li key={`change-${v.version}-${i}`} className="text-white/40 text-sm flex items-start gap-4 group/item">
              <div className="w-1.5 h-1.5 rounded-full bg-white/10 mt-1.5 group-hover/item:bg-white transition-all duration-500" />
              <span className="leading-relaxed font-medium group-hover/item:text-white/60 transition-colors">{change}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
