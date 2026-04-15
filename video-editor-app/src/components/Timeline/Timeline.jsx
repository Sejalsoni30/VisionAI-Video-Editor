import React, { useRef } from 'react';
import { Clock, Plus, ZoomIn, ZoomOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
// ✅ addTrack ko yahan import karna zaroori hai
import { setZoomLevel, updateCurrentTime, addTrack } from '../../store/projectSlice'; 
import Track from './Track';

const Timeline = () => {
  const dispatch = useDispatch();
  const timelineRef = useRef(null);
  
  // ✅ tracks ko bhi selector mein add kiya
  const { layers, zoomLevel, currentTime, tracks } = useSelector((state) => state.project);

  const handleZoom = (type) => {
    const newZoom = type === 'in' ? Math.min(zoomLevel + 5, 100) : Math.max(zoomLevel - 5, 5);
    dispatch(setZoomLevel(newZoom));
  };

  const handleTimelineClick = (e) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
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
      type: 'audio', 
      name: `Audio Track ${tracks ? tracks.length + 1 : 1}` 
    }));
    console.log("➕ New track added!");
  };

  return (
    <div className="h-full flex flex-col bg-[#0c0c0e] select-none overflow-hidden border-t border-white/5">
      
      {/* 1. Header Area: Stats & Controls */}
      <div className="h-12 border-b border-zinc-800/50 flex items-center justify-between px-6 bg-zinc-900/40 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest font-bold">
            <Clock size={14} className="text-zinc-500" />
            <span className="text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              {formatTime(currentTime)}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800"></div>
          
          {/* ✅ Add Track Button yahan theek se place kiya hai */}
          <button 
            onClick={handleAddTrack}
            className="text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-[10px] uppercase font-bold tracking-tighter"
          >
            <Plus size={16} className="text-blue-500"/> Add Track
          </button>
        </div>
        
        {/* Zoom Engine */}
        <div className="flex items-center gap-4 bg-zinc-950/80 px-4 py-1.5 rounded-xl border border-white/5">
          <button onClick={() => handleZoom('out')} className="text-zinc-500 hover:text-blue-400 transition-colors">
            <ZoomOut size={16}/>
          </button>
          <div className="w-24 h-1 bg-zinc-800 rounded-full relative overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(zoomLevel / 100) * 100}%` }}
            ></div>
          </div>
          <button onClick={() => handleZoom('in')} className="text-zinc-500 hover:text-blue-400 transition-colors">
            <ZoomIn size={16}/>
          </button>
        </div>
      </div>

      {/* 2. Tracks & Playhead Area */}
      <div 
        ref={timelineRef}
        className="flex-1 overflow-x-auto overflow-y-auto relative custom-scrollbar bg-[linear-gradient(to_right,#18181b_1px,transparent_1px)] bg-[size:40px_100%]"
        style={{ cursor: 'crosshair' }}
      >
        <div 
          onClick={handleTimelineClick}
          className="min-w-full h-full relative"
        >
          {/* 🔥 Seekbar (Red Line) */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none transition-all duration-75 ease-out"
            style={{ left: `${currentTime * zoomLevel}px` }}
          >
            <div className="w-3 h-3 bg-red-500 rotate-45 -ml-[5px] -mt-1.5 shadow-[0_0_10px_rgba(239,68,68,0.8)] border border-white/20"></div>
          </div>

          {/* Dynamic Content */}
          <div className="min-w-full inline-block pt-2">
            
            {/* ✅ Agar tracks dynamic hain toh loop chalao, warna ye default tracks */}
            {tracks && tracks.length > 0 ? (
                tracks.map(track => (
                    <Track 
                        key={track.id}
                        type={track.type} 
                        label={track.name} 
                        layers={layers.filter(l => l.trackId === track.id || (track.id === 'track-1' && l.type === 'video'))} 
                        zoomLevel={zoomLevel}
                    />
                ))
            ) : (
                <>
                    <Track type="video" label="Main Video" layers={layers.filter(l => l.type === 'video' || !l.type)} zoomLevel={zoomLevel} />
                    <Track type="audio" label="Audio/SFX" layers={layers.filter(l => l.type === 'audio')} zoomLevel={zoomLevel} />
                    <Track type="text" label="Subtitles" layers={layers.filter(l => l.type === 'text')} zoomLevel={zoomLevel} />
                </>
            )}
             {/* 🚀 Dynamic Tracks Rendering */}
          <div className="min-w-full inline-block">
            {tracks && tracks.map((track) => (
              <div key={track.id} className="flex group border-b border-zinc-800/30 h-20 transition-colors hover:bg-white/[0.01]">
                
                {/* 🏷️ Left Label Panel (Exactly 160px as per screenshot) */}
                <div className="w-40 min-w-[160px] bg-[#0c0c0e] p-4 flex items-center justify-between border-r border-zinc-800/50 sticky left-0 z-30 shadow-2xl">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {track.name}
                  </span>

                  {/* Remove Track Button (Only on hover, except main video) */}
                  {track.id !== 'track-1' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); dispatch(removeTrack(track.id)); }}
                      className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-all p-1 bg-zinc-800/50 rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {/* 🎞️ Right Timeline Content (Where clips appear) */}
                <div 
                  className="flex-1 relative bg-transparent" 
                  onClick={handleTimelineClick}
                >
                  <Track
                    key={track.id}
                    type={track.type}
                    layers={layers.filter(l => 
                      l.trackId === track.id || 
                      (!l.trackId && track.type === 'video' && l.type === 'video') ||
                      (!l.trackId && track.type === 'audio' && l.type === 'audio')
                    )}
                    zoomLevel={zoomLevel}
                  />
                </div>
              </div>
            ))}

            {/* End of Timeline Indicator */}
            <div className="h-20 opacity-10 flex items-center justify-center text-[10px] text-zinc-500 uppercase tracking-[0.5em] font-black italic">
              End of Timeline
            </div>
          </div>

            <div className="h-20 opacity-20 flex items-center justify-center text-[10px] text-zinc-500 uppercase tracking-widest italic">
              End of Timeline
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;