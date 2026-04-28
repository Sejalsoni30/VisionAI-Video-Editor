import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, RotateCcw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentTime, setIsPlaying } from '../../store/projectSlice';

const Controls = () => {
  const dispatch = useDispatch();
  const { currentTime, isPlaying, duration } = useSelector((state) => state.project);

  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const parts = [mins, secs].map((value) => value.toString().padStart(2, '0'));
    return hrs > 0 ? `${hrs.toString().padStart(2, '0')}:${parts.join(':')}` : `00:${parts.join(':')}`;
  };

  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleSkipForward = () => {
    dispatch(updateCurrentTime(currentTime + 5));
  };

  const handleSkipBack = () => {
    dispatch(updateCurrentTime(Math.max(0, currentTime - 5)));
  };

  const handleReset = () => {
    dispatch(updateCurrentTime(0));
    dispatch(setIsPlaying(false));
  };

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[24rem] bg-[#111827]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] z-50">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">Preview</div>
          <div className="text-sm font-semibold text-white">{formatTime(currentTime)} / {formatTime(duration)}</div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center justify-center w-10 h-10 rounded-3xl border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 transition"
          title="Reset playhead"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mb-3">
        <button
          onClick={handleSkipBack}
          className="w-11 h-11 rounded-3xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition"
          title="Rewind 5s"
        >
          <SkipBack size={18} />
        </button>

        <button
          onClick={handlePlayPause}
          className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-[0_20px_40px_-20px_rgba(255,255,255,0.8)] transition hover:scale-[1.05] active:scale-95"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={handleSkipForward}
          className="w-11 h-11 rounded-3xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition"
          title="Forward 5s"
        >
          <SkipForward size={18} />
        </button>
      </div>

      <div className="rounded-full bg-white/10 overflow-hidden border border-white/10 h-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.45)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Controls;