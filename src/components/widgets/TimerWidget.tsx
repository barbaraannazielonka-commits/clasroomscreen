import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Hourglass, Timer as TimerIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext';

interface TimerWidgetProps {
  initialMinutes?: number;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ initialMinutes = 15 }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  // Sync initialMinutes if changed from task trigger
  useEffect(() => {
    if (initialMinutes && !isRunning) {
      const secs = initialMinutes * 60;
      setTotalSeconds(secs);
      setRemainingSeconds(secs);
    }
  }, [initialMinutes, isRunning]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Play gentle acoustic chime using Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {}
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'countdown') {
          setRemainingSeconds((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              playChime();
              try {
                confetti({
                  particleCount: 70,
                  spread: 60,
                  origin: { y: 0.6 },
                });
              } catch {}
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const handleTogglePlay = () => {
    if (mode === 'countdown' && remainingSeconds === 0) {
      setRemainingSeconds(totalSeconds);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'countdown') {
      setRemainingSeconds(totalSeconds);
    } else {
      setStopwatchSeconds(0);
    }
  };

  const setPresetMinutes = (mins: number) => {
    setIsRunning(false);
    const secs = mins * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
  };

  const addTime = (secsToAdd: number) => {
    setRemainingSeconds((prev) => {
      const next = Math.max(0, prev + secsToAdd);
      setTotalSeconds((t) => Math.max(next, t));
      return next;
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const percentLeft =
    totalSeconds > 0 ? Math.round((remainingSeconds / totalSeconds) * 100) : 0;

  return (
    <div className="flex flex-col h-full justify-between items-center text-center">
      {/* Mode Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl text-xs font-bold w-full">
        <button
          onClick={() => {
            setMode('countdown');
            setIsRunning(false);
          }}
          className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
            mode === 'countdown'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Hourglass className="w-3 h-3" />
          <span>Timer</span>
        </button>
        <button
          onClick={() => {
            setMode('stopwatch');
            setIsRunning(false);
          }}
          className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
            mode === 'stopwatch'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <TimerIcon className="w-3 h-3" />
          <span>Stopwatch</span>
        </button>
      </div>

      {/* Big Digital Display */}
      <div className="py-2 flex flex-col items-center">
        <span
          className={`font-mono font-black text-4xl sm:text-5xl tracking-tight transition-colors ${
            remainingSeconds === 0 && mode === 'countdown'
              ? 'text-rose-500 animate-pulse'
              : isLight
              ? 'text-slate-900'
              : 'text-white'
          }`}
        >
          {mode === 'countdown' ? formatTime(remainingSeconds) : formatTime(stopwatchSeconds)}
        </span>

        {/* Progress bar in countdown mode */}
        {mode === 'countdown' && (
          <div className="w-48 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                percentLeft < 20 ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${percentLeft}%` }}
            />
          </div>
        )}
      </div>

      {/* Presets in countdown mode */}
      {mode === 'countdown' && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {[1, 3, 5, 10, 15, 20].map((mins) => (
            <button
              key={mins}
              onClick={() => setPresetMinutes(mins)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all border ${
                totalSeconds === mins * 60
                  ? 'bg-amber-500 text-white border-amber-600'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
              }`}
            >
              {mins}m
            </button>
          ))}
          <button
            onClick={() => addTime(60)}
            className="px-1.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400"
            title="Add 1 minute"
          >
            +1m
          </button>
        </div>
      )}

      {/* Control Actions: Play / Pause / Reset */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={handleReset}
          className={`p-2.5 rounded-2xl border transition-all ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
          }`}
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleTogglePlay}
          className={`px-5 py-2.5 rounded-2xl text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition-all ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          onClick={playChime}
          className={`p-2.5 rounded-2xl border transition-all ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
          }`}
          title="Test chime sound"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
