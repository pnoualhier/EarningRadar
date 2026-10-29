import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
      <h3 className="text-base font-semibold text-slate-800">
        Chargement du calendrier financier...
      </h3>
      <p className="text-xs text-slate-500 mt-1">
        Vérification et synchronisation des publications de résultats.
      </p>
    </div>
  );
};
