import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  htmlFor,
  error,
  description,
  icon,
  children,
  className = ''
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between ml-2 sm:ml-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-accent">{icon}</div>}
          <label 
            htmlFor={htmlFor} 
            className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]"
          >
            {label}
          </label>
        </div>
      </div>
      
      {description && (
        <p className="text-xs text-slate-400 ml-2 sm:ml-4 font-light">
          {description}
        </p>
      )}

      <div className="relative">
        {children}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-2 text-rose-400 text-xs ml-2 sm:ml-4 mt-2"
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
