import * as React from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    // Don't show if already running as standalone (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Don't show if user already dismissed in this session
    const dismissed = sessionStorage.getItem('pwa_install_dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after a short delay to avoid immediate popup feel
      setTimeout(() => setShowBanner(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa_install_dismissed', '1');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 md:hidden animate-fade-in">
      <div className="bg-slate-900/98 border border-brand/30 rounded-2xl shadow-2xl shadow-black/60 p-4 flex items-center gap-3 backdrop-blur-xl">
        {/* App Icon */}
        <div className="shrink-0 w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
          <img src="/icon-192.png" alt="E-Aspri" className="w-10 h-10 rounded-xl object-cover" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold text-slate-100 leading-tight">
            Pasang di Layar Utama
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">
            Buka E-Aspri seperti aplikasi — tanpa browser
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X size={14} />
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand text-white text-[11px] font-bold hover:bg-brand/90 active:scale-95 transition-all shadow-lg shadow-brand/30"
          >
            <Download size={12} />
            Pasang
          </button>
        </div>
      </div>
    </div>
  );
};
