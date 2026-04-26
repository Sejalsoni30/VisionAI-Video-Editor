import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, RotateCcw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentTime, setIsPlaying } from '../../store/projectSlice';

const Controls = () => {
  const dispatch = useDispatch();
  
  // 1. Redux State
  const { currentTime, isPlaying, duration } = useSelector((state) => state.project);

  // 🕒 Professional Time Format (00:00:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  // 🕹️ Control Handlers (Redux Based)
  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleSkipForward = () => {
    dispatch(updateCurrentTime(currentTime + 5));
  };

  const handleSkipBack = () => {
    // Agar 0 se piche jaye toh 0 par hi ruke
    dispatch(updateCurrentTime(Math.max(0, currentTime - 5)));
  };

  const handleReset = () => {
    dispatch(updateCurrentTime(0));
    dispatch(setIsPlaying(false));
  };

  return (
    <div className="absolute top-4 right-4 w-48 h-20 bg-[#0c0c0e]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-3 shadow-2xl z-50">
      
      {/* ⏱️ Time Display */}
      <div className="flex items-center justify-center mb-2">
        <span className="text-sm font-mono text-blue-500 font-bold tracking-tighter bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">
          {formatTime(currentTime)}
        </span>
      </div>

      {/* 🕹️ Controls Row */}
      <div className="flex items-center justify-center gap-2">
        
        {/* Reset / Skip Back */}
        <RotateCcw 
            size={16} 
            className="text-zinc-600 cursor-pointer hover:text-white transition-all active:scale-90"
            onClick={handleReset}
            title="Reset Playhead"
        />
        
        {/* Play/Pause Main Node */}
        <button 
          onClick={handlePlayPause}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-90 transition-all shadow-2xl"
        >
          {isPlaying ? (
            <Pause size={20} fill="black" strokeWidth={0} />
          ) : (
            <Play size={20} fill="black" className="ml-0.5" strokeWidth={0} />
          )}
        </button>

        {/* Skip Forward */}
        <SkipForward 
            size={16} 
            className="text-zinc-400 cursor-pointer hover:text-blue-500 transition-all active:scale-90"
            onClick={handleSkipForward}
        />
      </div>

      {/* 🔊 Volume Bar */}
      <div className="mt-2 flex items-center justify-center">
        <div className="w-20 h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-600/40 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            style={{ width: '75%' }} // Static volume for UI look
          ></div>
        </div>
      </div>

    </div>
  );
};

export default Controls;