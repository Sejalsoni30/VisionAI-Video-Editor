import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useProject } from '../../hooks/useProject';

const Controls = () => {
  const { currentTime, setTime } = useProject();
  const [isPlaying, setIsPlaying] = useState(false);

  // Play/Pause toggle function
  const handlePlayPause = () => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-zinc-400">00:00:05</span>
      </div>

      <div className="flex items-center gap-6">
        <SkipBack size={20} className="text-zinc-400 cursor-pointer hover:text-white" />
        <button 
          onClick={handlePlayPause}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
        </button>
        <SkipForward size={20} className="text-zinc-400 cursor-pointer hover:text-white" />
      </div>

      <div className="flex items-center gap-3">
        <Volume2 size={18} className="text-zinc-400" />
        <div className="w-24 h-1 bg-zinc-800 rounded-full">
          <div className="w-1/2 h-full bg-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Controls;