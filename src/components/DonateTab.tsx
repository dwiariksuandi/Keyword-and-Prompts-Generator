import React from 'react';
import { Heart, Coffee, CreditCard, Gift, Star, ExternalLink, Lightbulb } from 'lucide-react';

export default function DonateTab() {
  return (
    <div className="max-w-2xl mx-auto px-6 pb-20">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Support This Project</h1>
        <p className="text-slate-400">Help keep this tool free and continuously improving</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-6 transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Coffee className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Buy Me a Coffee</h2>
              <p className="text-sm text-slate-400">Support with a one-time donation</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium py-3 rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4 mr-2" />
            Donate via Buy Me a Coffee
          </button>
        </div>
        
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-6 transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">PayPal</h2>
              <p className="text-sm text-slate-400">Send a donation via PayPal</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center bg-[#0070ba] hover:bg-[#005ea6] text-white font-medium py-3 rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4 mr-2" />
            Donate via PayPal
          </button>
        </div>
        
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <Gift className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Other Ways to Help</h2>
              <p className="text-sm text-slate-400">Non-monetary support options</p>
            </div>
          </div>
          <ul className="text-sm text-slate-300 space-y-3 mt-4">
            <li className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Star the project on GitHub</span>
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer">
              <Heart className="w-5 h-5 text-rose-400" />
              <span>Share with friends and colleagues</span>
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer">
              <Lightbulb className="w-5 h-5 text-teal-400" />
              <span>Submit feature suggestions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
