import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export function LoadingScreen({ onComplete, minDuration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(onComplete, 500);
      }, minDuration - 500);
    }
  }, [progress, minDuration, onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 animate-pulse">COLBASOFT</h1>
            <p className="text-primary-200 text-lg">Sistema Logístico Textil</p>
          </div>

          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-primary-200 text-sm mb-8">
            <span>Cargando componentes...</span>
            <span>{Math.min(Math.round(progress), 100)}%</span>
          </div>

          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-white/50 text-sm">© 2024 COLBASOFT - Eje Cafetero</p>
      </div>
    </div>
  );
}
