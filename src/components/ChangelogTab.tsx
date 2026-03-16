import React from 'react';
import { History, Star, Zap, ShieldCheck } from 'lucide-react';

export default function ChangelogTab() {
  const versions = [
    {
      version: "v1.3.0",
      date: "March 2026",
      title: "Aesthetic Analysis & Granular Feedback",
      icon: <Zap className="w-5 h-5 text-[#00D8B6]" />,
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
      icon: <Star className="w-5 h-5 text-[#FF8A00]" />,
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
      icon: <Star className="w-5 h-5 text-[#FF8A00]" />,
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
      icon: <Zap className="w-5 h-5 text-[#00D8B6]" />,
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
      icon: <Star className="w-5 h-5 text-[#FF8A00]" />,
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
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-800 rounded-lg">
          <History className="w-6 h-6 text-[#00D8B6]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Version Log</h1>
          <p className="text-slate-400">Track updates, improvements, and new features.</p>
        </div>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
        {versions.map((v, index) => (
          <div key={v.version} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0B1120] bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {v.icon}
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl bg-[#111827] border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  {v.version}
                  <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{v.title}</span>
                </h3>
                <time className="text-xs font-medium text-[#00D8B6]">{v.date}</time>
              </div>
              <ul className="space-y-2 mt-4">
                {v.changes.map((change, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-slate-600 mt-1">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
