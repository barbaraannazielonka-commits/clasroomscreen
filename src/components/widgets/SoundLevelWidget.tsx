import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Mic, MicOff, AlertCircle, Bell, Sliders } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SoundLevelWidget: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isListening, setIsListening] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(25); // 0 to 100
  const [maxThreshold, setMaxThreshold] = useState(70);
  const [sensitivity, setSensitivity] = useState(2.0);
  const [alarmActive, setAlarmActive] = useState(false);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playBuzzer = () => {
    if (!soundAlertsEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {}
  };

  const startListening = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      microphoneStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100 * sensitivity));

        setVolumeLevel(normalized);

        if (normalized >= maxThreshold) {
          setAlarmActive(true);
          playBuzzer();
          if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current);
          alarmTimeoutRef.current = setTimeout(() => {
            setAlarmActive(false);
          }, 1500);
        }

        animationFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (err: any) {
      console.warn('Microphone access issue:', err);
      setMicError('Microphone permission required. Running in visual demo mode.');
      // Demo simulation
      setIsListening(true);
      const interval = setInterval(() => {
        const sim = Math.floor(20 + Math.random() * 45);
        setVolumeLevel(sim);
      }, 300);
      return () => clearInterval(interval);
    }
  };

  const stopListening = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    setIsListening(false);
    setVolumeLevel(0);
    setAlarmActive(false);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const getMeterColor = () => {
    if (volumeLevel >= maxThreshold) return 'bg-rose-500';
    if (volumeLevel >= maxThreshold * 0.75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="flex flex-col h-full justify-between gap-2 text-center">
      {/* Visual Volume Gauge */}
      <div className="relative py-1">
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-green-500" />
            <span>Volume: {volumeLevel}%</span>
          </span>
          <span className="text-[10px] text-slate-400">Limit: {maxThreshold}%</span>
        </div>

        {/* Progress gauge with threshold marker */}
        <div className="relative w-full h-5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-100 ${getMeterColor()}`}
            style={{ width: `${Math.min(100, volumeLevel)}%` }}
          />
          {/* Threshold indicator line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-rose-600 shadow-sm"
            style={{ left: `${maxThreshold}%` }}
            title={`Threshold: ${maxThreshold}%`}
          />
        </div>

        {alarmActive && (
          <div className="mt-1 flex items-center justify-center gap-1 text-[11px] font-black text-rose-500 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>TOO LOUD! SHH!</span>
          </div>
        )}
      </div>

      {micError && (
        <p className="text-[10px] text-amber-500 bg-amber-500/10 p-1 rounded">
          {micError}
        </p>
      )}

      {/* Threshold & Sensitivity Sliders */}
      <div className="space-y-1.5 py-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Max Limit:</span>
          <input
            type="range"
            min={30}
            max={95}
            value={maxThreshold}
            onChange={(e) => setMaxThreshold(Number(e.target.value))}
            className="w-28 accent-rose-500"
          />
          <span className="font-mono text-xs w-7 text-right">{maxThreshold}%</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Sensitivity:</span>
          <input
            type="range"
            min={1}
            max={5}
            step={0.5}
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-28 accent-sky-500"
          />
          <span className="font-mono text-xs w-7 text-right">{sensitivity}x</span>
        </div>
      </div>

      {/* Mic toggle and Alert Bell */}
      <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-200 dark:border-white/10">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-white shadow-md ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" /> Stop Mic
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" /> Start Meter
            </>
          )}
        </button>

        <button
          onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
          className={`p-2 rounded-xl border transition-all ${
            soundAlertsEnabled
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
              : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-400'
          }`}
          title={soundAlertsEnabled ? 'Alarm bell on limit' : 'Muted'}
        >
          <Bell className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
