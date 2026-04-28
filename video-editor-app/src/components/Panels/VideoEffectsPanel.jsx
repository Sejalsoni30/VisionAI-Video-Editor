import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wand2, Sun, Moon, Contrast, Droplets } from 'lucide-react';
import { updateLayerStyle } from '../../store/projectSlice';

const VideoEffectsPanel = () => {
  const dispatch = useDispatch();
  const { layers, selectedLayerId } = useSelector((state) => state.project);
  const selectedLayer = layers.find(l => l.id === selectedLayerId);
  const [activeFilter, setActiveFilter] = useState('none');

  const filters = [
    { id: 'none', name: 'Original', icon: <Wand2 />, filter: 'none' },
    { id: 'grayscale', name: 'B & W', icon: <Moon />, filter: 'grayscale(100%)' },
    { id: 'sepia', name: 'Vintage', icon: <Droplets />, filter: 'sepia(80%)' },
    { id: 'brightness', name: 'Bright', icon: <Sun />, filter: 'brightness(150%)' },
    { id: 'invert', name: 'Negative', icon: <Contrast />, filter: 'invert(100%)' },
    { id: 'blur', name: 'Blur', icon: <Wand2 />, filter: 'blur(2px)' },
    { id: 'contrast', name: 'High Contrast', icon: <Contrast />, filter: 'contrast(200%)' },
    { id: 'saturate', name: 'Vivid', icon: <Sun />, filter: 'saturate(200%)' },
    { id: 'hue-rotate', name: 'Color Shift', icon: <Wand2 />, filter: 'hue-rotate(90deg)' },
    { id: 'opacity', name: 'Fade', icon: <Droplets />, filter: 'opacity(0.5)' },
    { id: 'drop-shadow', name: 'Glow', icon: <Sun />, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' },
    { id: 'cinematic', name: 'Cinematic', icon: <Wand2 />, filter: 'contrast(120%) brightness(110%) saturate(110%)' },
  ];

  const applyFilter = (filterValue, filterId) => {
    if (!selectedLayer || !['video', 'image'].includes(selectedLayer.type)) {
      alert('Select a video or image layer first to apply a filter.');
      return;
    }

    dispatch(updateLayerStyle({
      id: selectedLayer.id,
      updates: { filter: filterValue }
    }));
    setActiveFilter(filterId);
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e]">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Media Filters</h3>
        <p className="text-[9px] text-zinc-400 mt-2">Apply effects to the selected image or video layer.</p>
      </div>
      
      <div className="p-4 grid grid-cols-3 gap-3">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => applyFilter(f.filter, f.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${activeFilter === f.id ? 'bg-blue-500/15 border border-blue-500/30 text-white' : 'bg-zinc-900/50 border border-white/5 text-zinc-400 hover:border-blue-500/50 hover:bg-blue-500/5'}`}
          >
            <div className={`mb-2 ${activeFilter === f.id ? 'text-blue-400' : 'text-zinc-500 group-hover:text-blue-500'}`}>
              {f.icon}
            </div>
            <span className="text-[10px] font-medium">
              {f.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoEffectsPanel;