import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentTime, setIsPlaying } from '../../store/projectSlice';

const Controls = () => {
  const dispatch = useDispatch();
  const { currentTime, isPlaying, duration } = useSelector((state) => state.project);

  const formatTime = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => dispatch(setIsPlaying(!isPlaying));
  const handleSkipForward = () => dispatch(updateCurrentTime(Math.min(duration, currentTime + 5)));
  const handleSkipBack = () => dispatch(updateCurrentTime(Math.max(0, currentTime - 5)));
  const handleReset = () => {
    dispatch(updateCurrentTime(0));
    dispatch(setIsPlaying(false));
  };

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    /* Yahan se 'absolute' aur 'top-6' hata diya gaya hai taaki ye layout mein fit ho jaye */
    <div className="w-full bg-zinc-900/90 border-t border-white/5 py-2 px-4 shadow-xl">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        
        {/* Left: Time display */}
        <div className="flex flex-col min-w-[85px]">
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Preview</span>
          <div className="text-xs font-mono text-white/90 leading-none mt-0.5">
            {formatTime(currentTime)} <span className="text-zinc-600">/</span> {formatTime(duration)}
          </div>
        </div>

        {/* Center: Main Controls */}
        <div className="flex items-center gap-2">
          <button onClick={handleSkipBack} className="p-1.5 text-zinc-400 hover:text-white transition">
            <SkipBack size={16} />
          </button>

          <button
            onClick={handlePlayPause}
            className="w-9 h-9 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>

          <button onClick={handleSkipForward} className="p-1.5 text-zinc-400 hover:text-white transition">
            <SkipForward size={16} />
          </button>

          <button onClick={handleReset} className="p-1.5 text-zinc-500 hover:text-zinc-300 ml-1">
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Right: Full Width Progress Bar */}
        <div className="flex-1 flex items-center h-full">
          <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Controls;