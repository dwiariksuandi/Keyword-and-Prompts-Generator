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
      className="bg-accent text-black px-4 py-2 rounded-lg text-sm font-bold pointer-events-auto relative z-[100] cursor-pointer flex items-center justify-center hover:bg-accent/90 transition-colors"
    >
      {isRefining ? 'Refining...' : 'Refine'}
    </button>
  );
}
