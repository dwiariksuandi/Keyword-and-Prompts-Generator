import React from 'react';

interface RefineButtonProps {
  onClick: () => void;
  isRefining: boolean;
}

export default function RefineButton({ onClick, isRefining }: RefineButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("RefineButton clicked");
        onClick();
      }}
      className="bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest pointer-events-auto relative z-[100] cursor-pointer flex items-center justify-center hover:bg-white/90 transition-all border border-white/10 shadow-lg shadow-white/5 active:scale-95"
    >
      {isRefining ? 'Refining...' : 'Refine'}
    </button>
  );
}
