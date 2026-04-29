import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wand2, Sun, Moon, Contrast, Droplets } from 'lucide-react';
import { updateLayerStyle } from '../../store/projectSlice';

const ImageAdjustPanel = () => {
  const dispatch = useDispatch();
  const { layers, selectedLayerId } = useSelector((state) => state.project);
  const selectedLayer = layers.find(l => l.id === selectedLayerId);
  const [activeFilter, setActiveFilter] = useState('none');

  const adjustments = [
    { id: 'none', name: 'Original', icon: <Wand2 />, filter: 'none' },
    { id: 'grayscale', name: 'Monochrome', icon: <Moon />, filter: 'grayscale(100%)' },
    { id: 'sepia', name: 'Warm Tone', icon: <Sun />, filter: 'sepia(80%)' },
    { id: 'brightness', name: 'Brighten', icon: <Sun />, filter: 'brightness(130%)' },
    { id: 'contrast', name: 'Contrast', icon: <Contrast />, filter: 'contrast(140%)' },
    { id: 'saturate', name: 'Vibrant', icon: <Droplets />, filter: 'saturate(170%)' },
    { id: 'blur', name: 'Soft Blur', icon: <Wand2 />, filter: 'blur(2px)' },
  ];

  const applyAdjustment = (filterValue, filterId) => {
    if (!selectedLayer || selectedLayer.type !== 'image') {
      alert('Select an image layer first to apply image adjustments.');
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
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Image Adjust</h3>
        <p className="text-[9px] text-zinc-400 mt-2">Quick image tuning for selected image layers.</p>
      </div>

      <div className="p-4 grid grid-cols-3 gap-3">
        {adjustments.map((item) => (
          <button
            key={item.id}
            onClick={() => applyAdjustment(item.filter, item.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${activeFilter === item.id ? 'bg-blue-500/15 border border-blue-500/30 text-white' : 'bg-zinc-900/50 border border-white/5 text-zinc-400 hover:border-blue-500/50 hover:bg-blue-500/5'}`}
          >
            <div className={`mb-2 ${activeFilter === item.id ? 'text-blue-400' : 'text-zinc-500'}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-medium text-center">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageAdjustPanel;
