import React, { useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 modal-animate">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 shadow-2xl shadow-black/80 backdrop-blur-xl text-zinc-100 text-xs font-medium max-w-sm">
        <div className="w-6 h-6 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <p className="flex-1 leading-snug">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
