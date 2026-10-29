import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const standalone =
      (typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(display-mode: standalone)').matches
        : false) ||
      (typeof window !== 'undefined' &&
        (window.navigator as unknown as { standalone?: boolean }).standalone === true);
    setIsInstalled(standalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforePrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforePrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (!deferredPrompt && !isIOS) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition shadow-sm"
        title="Installer Earnings Radar sur votre écran d'accueil"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Installer l’application</span>
      </button>

      {/* iOS Safari instructions modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full text-slate-100 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-amber-400 mb-3">Installer sur iPhone / iPad</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Pour ajouter Earnings Radar sur votre écran d'accueil sans passer par l'App Store :
            </p>
            <ol className="text-xs text-slate-300 space-y-2 mb-5 list-decimal list-inside">
              <li>
                Appuyez sur l'icône <strong className="text-white">Partager</strong>{' '}
                <Share2 className="w-3.5 h-3.5 inline text-amber-400" /> dans Safari.
              </li>
              <li>
                Faites défiler puis choisissez{' '}
                <strong className="text-white">Sur l'écran d'accueil</strong>{' '}
                <PlusSquare className="w-3.5 h-3.5 inline text-amber-400" />.
              </li>
              <li>Confirmez en cliquant sur « Ajouter ».</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-white transition"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};
