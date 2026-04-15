import React from 'react';
import { Wand2, Sun, Moon, Contrast, Droplets } from 'lucide-react';

const VideoEffectsPanel = () => {
  const filters = [
    { id: 'none', name: 'Original', icon: <Wand2 />, filter: 'none' },
    { id: 'grayscale', name: 'B & W', icon: <Moon />, filter: 'grayscale(100%)' },
    { id: 'sepia', name: 'Vintage', icon: <Droplets />, filter: 'sepia(80%)' },
    { id: 'brightness', name: 'Bright', icon: <Sun />, filter: 'brightness(150%)' },
    { id: 'invert', name: 'Negative', icon: <Contrast />, filter: 'invert(100%)' },
  ];

  const applyFilter = (filterValue) => {
    const video = document.getElementById('main-video-player');
    if (video) {
      video.style.filter = filterValue;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e]">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Video Filters</h3>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-3">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => applyFilter(f.filter)}
            className="flex flex-col items-center justify-center p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
          >
            <div className="text-zinc-500 group-hover:text-blue-500 mb-2">
              {f.icon}
            </div>
            <span className="text-[10px] font-medium text-zinc-400 group-hover:text-white">
              {f.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoEffectsPanel;