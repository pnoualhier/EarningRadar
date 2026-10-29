import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 border border-red-200">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">
        Erreur de chargement du calendrier
      </h3>
      <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Réessayer la connexion</span>
      </button>
    </div>
  );
};
