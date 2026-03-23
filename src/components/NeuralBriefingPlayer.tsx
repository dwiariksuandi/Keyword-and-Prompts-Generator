import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, X, Loader2, Sparkles } from 'lucide-react';

interface NeuralBriefingPlayerProps {
  audioBase64: string | null;
  isGenerating: boolean;
  onClose: () => void;
}

export const NeuralBriefingPlayer: React.FC<NeuralBriefingPlayerProps> = ({ 
  audioBase64, 
  isGenerating, 
  onClose 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [visualizerDurations] = React.useState(() => {
    return [...Array(20)].map(() => 0.5 + Math.random());
  });

  useEffect(() => {
    if (audioBase64) {
      const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
      audioRef.current = audio;
      
      audio.addEventListener('timeupdate', () => {
        setProgress((audio.currentTime / audio.duration) * 100);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [audioBase64]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!isGenerating && !audioBase64) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-24 right-6 z-50 w-80 bg-[#151619] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Neural Briefing</h4>
              <p className="text-[10px] text-emerald-400 font-mono">AI Market Intelligence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/30" />
          </button>
        </div>

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-xs text-white/40 font-medium animate-pulse">Synthesizing Neural Voice...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              
              <div className="flex-1">
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] font-mono text-white/30">0:00</span>
                  <Volume2 className="w-3 h-3 text-white/30" />
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-white/60 leading-relaxed italic">
              "Listen to the AI's strategic summary of this market analysis."
            </p>
          </div>
        )}
      </div>
      
      {/* Visualizer effect */}
      <div className="h-1 w-full flex gap-0.5 items-end px-4 pb-1 opacity-20">
        {visualizerDurations.map((duration, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-emerald-500"
            animate={{ 
              height: isPlaying ? [2, 8, 4, 12, 2] : 2 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: duration,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
