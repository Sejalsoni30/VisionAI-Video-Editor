import React, { useRef } from 'react';
import { 
  Clock, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  Trash2, 
  Video, 
  Music, 
  Image as ImageIcon 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setZoomLevel, updateCurrentTime, addTrack, removeTrack } from '../../store/projectSlice';
import Track from './Track';

const Timeline = () => {
  const dispatch = useDispatch();
  const timelineRef = useRef(null);

  const { layers, zoomLevel, currentTime, tracks } = useSelector((state) => state.project);

  const handleZoom = (type) => {
    const newZoom = type === 'in' ? Math.min(zoomLevel + 5, 100) : Math.max(zoomLevel - 5, 5);
    dispatch(setZoomLevel(newZoom));
  };

  const handleTimelineClick = (e) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      // 160px subtract kar rahe hain kyunki wahan labels hain
      const x = e.clientX - rect.left + timelineRef.current.scrollLeft - 160;
      const newTime = Math.max(0, x / zoomLevel);
      dispatch(updateCurrentTime(newTime));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTrack = () => {
    dispatch(addTrack({
      type: 'video', 
      name: `New Track ${tracks.length + 1}`
    }));
  };

  return (
    <div className="h-full flex flex-col bg-[#0c0c0e] select-none overflow-hidden border-t border-white/5">

      {/* 1. Header Area: Stats & Controls */}
      <div className="h-12 border-b border-zinc-800/50 flex items-center justify-between px-6 bg-zinc-900/40 backdrop-blur-md z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest font-bold">
            <Clock size={14} className="text-zinc-500" />
            <span className="text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              {formatTime(currentTime)}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800"></div>

          <button
            onClick={handleAddTrack}
            className="text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-[10px] uppercase font-bold tracking-tighter"
          >
            <Plus size={16} className="text-blue-500" /> Add Track
          </button>
        </div>

        {/* Zoom Engine */}
        <div className="flex items-center gap-4 bg-zinc-950/80 px-4 py-1.5 rounded-xl border border-white/5">
          <button onClick={() => handleZoom('out')} className="text-zinc-500 hover:text-blue-400 transition-colors">
            <ZoomOut size={16} />
          </button>
          <div className="w-24 h-1 bg-zinc-800 rounded-full relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(zoomLevel / 100) * 100}%` }}
            ></div>
          </div>
          <button onClick={() => handleZoom('in')} className="text-zinc-500 hover:text-blue-400 transition-colors">
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* 2. Tracks & Playhead Area */}
      <div
        ref={timelineRef}
        className="flex-1 overflow-x-auto overflow-y-auto relative custom-scrollbar bg-[#0c0c0e]"
      >
        <div className="min-w-fit h-full relative">
          
          {/* 🔥 Seekbar (Red Line) - Offset by 160px */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-50 pointer-events-none transition-all duration-75 ease-out"
            style={{ left: `${160 + (currentTime * zoomLevel)}px` }}
          >
            <div className="w-3 h-3 bg-red-500 rotate-45 -ml-[5px] -mt-1.5 shadow-[0_0_10px_rgba(239,68,68,0.8)] border border-white/20"></div>
          </div>

          {/* Rendering Tracks */}
          <div className="pt-2">
            {tracks && tracks.map((track) => (
              <div key={track.id} className="flex group border-b border-zinc-800/30 h-20 transition-colors hover:bg-white/[0.01]">

                {/* 🏷️ Label Panel (Sticky Left) */}
                <div className="w-40 min-w-[160px] bg-[#0c0c0e] p-4 flex items-center justify-between border-r border-zinc-800/50 sticky left-0 z-30">
                  <div className="flex items-center gap-3 truncate">
                    {track.type === 'video' && <Video size={14} className="text-blue-500" />}
                    {track.type === 'audio' && <Music size={14} className="text-emerald-500" />}
                    {track.type === 'image' && <ImageIcon size={14} className="text-amber-500" />}
                    
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest truncate">
                      {track.name}
                    </span>
                  </div>

                  {/* Remove Track Button */}
                  {track.id !== 'track-1' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); dispatch(removeTrack(track.id)); }}
                      className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-all p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {/* 🎞️ Content Area (Layers) */}
                <div 
                  className="flex-1 relative min-w-[2000px]" 
                  onClick={handleTimelineClick}
                >
                  <Track
                    type={track.type}
                    layers={layers.filter(l => l.trackId === track.id)}
                    zoomLevel={zoomLevel}
                  />
                </div>
              </div>
            ))}

            {/* End of Timeline Indicator */}
            <div className="h-24 flex items-center justify-center text-[10px] text-zinc-700 uppercase tracking-[0.5em] font-black italic">
              End of Timeline
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;