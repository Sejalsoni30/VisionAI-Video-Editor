import React from 'react';
import { Music, PlayCircle } from 'lucide-react';

const AudioPanel = () => {
  const tracks = [
    { id: 1, name: 'Vlog Cinematic', duration: '2:30' },
    { id: 2, name: 'Lo-fi Beats', duration: '4:15' },
    { id: 3, name: 'Happy Upbeat', duration: '1:50' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e]">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Music Library</h3>
      </div>
      <div className="p-2 space-y-1">
        {tracks.map(track => (
          <div key={track.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl cursor-pointer group">
            <div className="flex items-center gap-3">
              <Music size={14} className="text-zinc-600 group-hover:text-blue-500" />
              <span className="text-[11px] text-zinc-400 group-hover:text-white">{track.name}</span>
            </div>
            <span className="text-[9px] text-zinc-600">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioPanel;