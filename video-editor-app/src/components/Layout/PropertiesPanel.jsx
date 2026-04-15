import React, { useState, useEffect } from 'react'; // 1. useEffect add kiya
import Slider from '../Common/Slider';
import { Settings2, RotateCcw } from 'lucide-react';

const PropertiesPanel = ({ selectedAsset }) => {
  const [opacity, setOpacity] = useState(100);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);

  // --- LOGIC: Video ko real-time update karne ke liye ---
  useEffect(() => {
    // Humne PreviewCanvas mein video ko id="main-video-player" diya tha
    const video = document.getElementById('main-video-player');
    
    if (video) {
      // Direct CSS styles apply karna
      video.style.opacity = opacity / 100;
      video.style.transform = `scale(${scale / 100}) rotate(${rotation}deg)`;
    }
  }, [opacity, scale, rotation]); // Jab bhi inme se koi badlega, video update hogi

  // Reset Function (RotateCcw button ke liye)
  const handleReset = () => {
    setOpacity(100);
    setScale(100);
    setRotation(0);
  };

  return (
    <aside className="w-72 h-full bg-zinc-900/50 border-l border-zinc-800 p-5 overflow-y-auto custom-scrollbar">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Settings2 size={16} className="text-blue-500" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Properties</h2>
        </div>
        <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-500 font-mono">
          {selectedAsset ? `ID: ${selectedAsset.id}` : 'No Selection'}
        </span>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Transform</label>
            <button 
              onClick={handleReset} // 2. Reset function connect kiya
              className="text-zinc-600 hover:text-blue-500 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <Slider 
            label="Opacity" 
            value={opacity} 
            onChange={setOpacity} 
            unit="%" 
          />

          <Slider 
            label="Scale" 
            min={10} 
            max={200} 
            value={scale} 
            onChange={setScale} 
            unit="%" 
          />

          <Slider 
            label="Rotation" 
            min={0} 
            max={360} 
            value={rotation} 
            onChange={setRotation} 
            unit="°" 
          />
        </div>

        {/* Position Group */}
        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
          <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Position (px)</label>
          <div className="grid grid-cols-2 gap-3">
            <InputControl label="X Position" value="0" />
            <InputControl label="Y Position" value="0" />
          </div>
        </div>

        {/* Media Info Section */}
        <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 mt-10">
          <p className="text-[10px] text-blue-500 font-bold uppercase mb-2">Media Info</p>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-500">Format</span>
              <span className="text-zinc-300">MP4 / H.264</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const InputControl = ({ label, value }) => (
  <div className="group bg-zinc-800/30 p-2.5 rounded-xl border border-zinc-800 hover:border-blue-500/50 transition-all">
    <div className="text-[9px] text-zinc-500 mb-1 font-bold uppercase tracking-tighter">{label}</div>
    <input 
      type="number" 
      defaultValue={value}
      className="bg-transparent text-sm w-full outline-none text-zinc-200 font-mono"
    />
  </div>
);

export default PropertiesPanel;