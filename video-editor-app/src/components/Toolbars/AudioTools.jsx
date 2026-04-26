import React from 'react';
import { Volume2, Mic, Activity, Wind, Music2, VolumeX, Radio } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateLayerStyle } from '../../store/projectSlice';
import IconButton from '../Common/IconButton';

const AudioTools = () => {
  const dispatch = useDispatch();
  
  // 1. Redux se selected layer ka data nikalna
  const { selectedLayerId, isPlaying, layers } = useSelector((state) => state.project);
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  // 2. Volume Change logic
  const handleVolumeChange = (e) => {
    const value = parseInt(e.target.value);
    dispatch(updateLayerStyle({
      id: selectedLayerId,
      updates: { volume: value }
    }));
  };

  // Agar audio layer selected nahi hai toh tools ko thoda fade rakho
  const isAudio = selectedLayer?.type === 'audio';

  return (
    <div className={`flex items-center gap-3 p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 transition-all ${!isAudio ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
      
      {/* --- Section 1: Capture & Import --- */}
      <div className="flex items-center gap-1 px-2 border-r border-white/10">
        <IconButton icon={Mic} tooltip="Record Voiceover" className="hover:text-red-500" />
        <IconButton icon={Music2} tooltip="Library Music" className="hover:text-emerald-500" />
      </div>
      
      {/* --- Section 2: AI Enhancements --- */}
      <div className="flex items-center gap-1 px-2 border-r border-white/10">
        <IconButton icon={Wind} tooltip="Clean Noise" className="hover:text-blue-400" />
        <IconButton icon={Activity} tooltip="Voice EQ" className="hover:text-purple-400" />
      </div>

      {/* --- Section 3: Master Volume Slider --- */}
      <div className="flex items-center gap-3 px-3 min-w-[180px]">
        {selectedLayer?.style?.volume === 0 ? (
          <VolumeX size={16} className="text-zinc-600" />
        ) : (
          <Volume2 size={16} className="text-emerald-500" />
        )}
        
        <div className="flex-1 relative flex items-center group">
          <input
            type="range"
            min="0"
            max="100"
            value={selectedLayer?.style?.volume ?? 100}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-emerald-500 transition-all group-hover:h-1.5"
          />
          {/* Level Indicator Tooltip */}
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {selectedLayer?.style?.volume ?? 100}%
          </span>
        </div>
      </div>

      {/* --- Status Signal --- */}
      <div className="flex items-center gap-2 px-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10 h-8">
        <Radio size={12} className={isPlaying ? "text-emerald-500 animate-pulse" : "text-zinc-600"} />
        <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-tighter">Live Monitor</span>
      </div>
    </div>
  );
};

export default AudioTools;