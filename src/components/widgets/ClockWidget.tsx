import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ClockWidget: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = is24Hour
    ? time.getHours().toString().padStart(2, '0')
    : ((time.getHours() % 12 || 12).toString());
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col h-full justify-between items-center text-center py-1">
      {/* Date */}
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {dateString}
      </span>

      {/* Big Digital Time Display */}
      <div className="flex items-baseline justify-center gap-1 my-1">
        <span
          className={`font-mono font-black text-3xl sm:text-4xl tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          {hours}:{minutes}
        </span>
        <span className="font-mono text-base font-bold text-slate-400">
          :{seconds}
        </span>
        {!is24Hour && (
          <span className="text-xs font-black text-sky-600 dark:text-sky-400 ml-1">
            {ampm}
          </span>
        )}
      </div>

      {/* 12h / 24h toggle */}
      <div className="flex items-center gap-1.5 pt-1">
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
            is24Hour
              ? 'bg-sky-500 text-white border-sky-600'
              : 'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400'
          }`}
        >
          {is24Hour ? '24-Hour Time' : '12-Hour Time'}
        </button>
      </div>
    </div>
  );
};
