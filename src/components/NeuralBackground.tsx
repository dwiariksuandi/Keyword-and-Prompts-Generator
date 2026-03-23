import React from 'react';
import { motion } from 'motion/react';

export const NeuralBackground: React.FC = () => {
  const [particles] = React.useState(() => {
    return [...Array(20)].map(() => ({
      initialOpacity: Math.random() * 0.3,
      initialX: Math.random() * 100 + '%',
      initialY: Math.random() * 100 + '%',
      animateY: (Math.random() * 100 - 50) + '%',
      duration: Math.random() * 10 + 10,
    }));
  });

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
      {/* Deep Background */}
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Atmospheric Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      
      {/* Neural Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: p.initialOpacity,
            x: p.initialX,
            y: p.initialY
          }}
          animate={{
            y: [null, p.animateY],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-accent/20 rounded-full"
        />
      ))}
    </div>
  );
};
