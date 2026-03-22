import React from 'react';
import { Heart, Coffee, CreditCard, Gift, Star, ExternalLink, Lightbulb, Zap, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function DonateTab() {
  return (
    <div className="max-w-4xl mx-auto px-6 pb-32 space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 mx-auto mb-10 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl"
        >
          <Heart className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
          Support the <span className="text-white/40">Protocol</span>
        </h1>
        <p className="text-white/40 max-w-lg mx-auto font-bold text-lg uppercase tracking-tight">
          Fuel the neural network and accelerate the evolution of market intelligence.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A0A0A] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-white/20 transition-all duration-500 relative overflow-hidden"
        >
          <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">
              <Coffee className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Neural Fuel</h2>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">One-time contribution</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center bg-white text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-[10px] border border-white/10"
          >
            <ExternalLink className="w-4 h-4 mr-3" />
            Buy Me a Coffee
          </motion.button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0A0A0A] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-white/20 transition-all duration-500 relative overflow-hidden"
        >
          <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Direct Link</h2>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">Secure PayPal Transfer</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center bg-white text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-[10px] border border-white/10"
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
        className="bg-[#0A0A0A] p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group"
      >
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Alternative Support</h2>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">Non-monetary contributions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: Star, label: 'GitHub Star', desc: 'Amplify visibility' },
            { icon: Globe, label: 'Share Protocol', desc: 'Expand the network' },
            { icon: Lightbulb, label: 'Feedback', desc: 'Evolve intelligence' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.02)' }}
              className="p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all cursor-pointer group/item"
            >
              <item.icon className={`w-8 h-8 text-white mb-6 group-hover/item:scale-110 transition-transform`} />
              <h3 className="text-sm font-black text-white mb-2 uppercase tracking-tight">{item.label}</h3>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
