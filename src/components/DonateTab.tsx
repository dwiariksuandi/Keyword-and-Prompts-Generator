import React from 'react';
import { Heart, Coffee, CreditCard, Gift, Star, ExternalLink, Lightbulb, Zap, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function DonateTab() {
  return (
    <div className="max-w-3xl mx-auto px-6 pb-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="w-24 h-24 mx-auto mb-8 rounded-3xl glass-panel flex items-center justify-center futuristic-glow bg-rose-500/10 border-rose-500/20"
        >
          <Heart className="w-12 h-12 text-rose-500" />
        </motion.div>
        <h1 className="text-5xl font-bold text-white mb-4 font-display tracking-tighter">Support the <span className="text-accent">Protocol</span></h1>
        <p className="text-slate-400 max-w-md mx-auto font-light text-lg">Help maintain the neural network and accelerate future intelligence modules.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-10 group hover:border-accent/30 transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-yellow-500/10 transition-all duration-700" />
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:border-yellow-500/50 transition-all duration-500">
              <Coffee className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display tracking-tight">Neural Fuel</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">One-time contribution</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-2xl transition-all shadow-xl shadow-yellow-500/20 uppercase tracking-widest text-xs"
          >
            <ExternalLink className="w-4 h-4 mr-3" />
            Buy Me a Coffee
          </motion.button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-10 group hover:border-accent/30 transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700" />
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/50 transition-all duration-500">
              <CreditCard className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display tracking-tight">Direct Link</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Secure PayPal Transfer</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs"
          >
            <ExternalLink className="w-4 h-4 mr-3" />
            Donate via PayPal
          </motion.button>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-10 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-all duration-500" />
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:border-accent/50 transition-all duration-500">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display tracking-tight">Alternative Support</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Non-monetary contributions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Star, label: 'GitHub Star', color: 'text-yellow-400', desc: 'Amplify visibility' },
            { icon: Globe, label: 'Share Protocol', color: 'text-rose-400', desc: 'Expand the network' },
            { icon: Lightbulb, label: 'Feedback', color: 'text-accent', desc: 'Evolve intelligence' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.03)' }}
              className="p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group/item"
            >
              <item.icon className={`w-6 h-6 ${item.color} mb-4 group-hover/item:scale-110 transition-transform`} />
              <h3 className="text-sm font-bold text-white mb-1">{item.label}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
