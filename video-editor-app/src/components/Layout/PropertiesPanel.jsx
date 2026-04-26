import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateLayerStyle } from '../../store/projectSlice'; // Hum naya generic reducer use karenge
import Slider from '../Common/Slider';
import { 
  Settings2, RotateCcw, Move, 
  Maximize, Sun, Volume2, 
  Layers, Type, Video, ImageIcon, Music 
} from 'lucide-react';

const PropertiesPanel = () => {
  const dispatch = useDispatch();
  
  // 1. Redux se selection nikalna
  const selectedLayerId = useSelector((state) => state.project.selectedLayerId);
  const selectedLayer = useSelector((state) => 
    state.project.layers.find(l => l.id === selectedLayerId)
  );

  if (!selectedLayer) {
    return (
      <aside className="w-80 h-full bg-[#0c0c0e] border-l border-white/5 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center mb-4">
          <Layers className="text-zinc-700" size={24} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">No Layer Selected</h3>
        <p className="text-[9px] text-zinc-800 mt-2 leading-relaxed">Select a clip from the timeline to adjust its properties.</p>
      </aside>
    );
  }

  // 2. Central update function
  const handleUpdate = (prop, value) => {
    dispatch(updateLayerStyle({
      id: selectedLayerId,
      updates: { [prop]: value }
    }));
  };

  const handleReset = () => {
    const defaults = {
      opacity: 1, scale: 1, rotation: 0, x: 0, y: 0, volume: 100
    };
    dispatch(updateLayerStyle({ id: selectedLayerId, updates: defaults }));
  };

  return (
    <aside className="w-80 h-full bg-[#0c0c0e] border-l border-white/5 flex flex-col shadow-2xl relative z-20">
      
      {/* --- Header --- */}
      <div className="p-6 border-b border-white/[0.03] flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Settings2 size={16} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Properties</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">
                {selectedLayer.type} Engine Active
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleReset} 
          className="p-2 hover:bg-white/5 rounded-full text-zinc-600 hover:text-white transition-all"
          title="Reset to Default"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
        
        {/* --- Section 1: Visual Transform (Sirf Video/Image ke liye) --- */}
        {(selectedLayer.type === 'video' || selectedLayer.type === 'image') && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Maximize size={12} className="text-zinc-500" />
              <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Transform</label>
            </div>
            
            <Slider 
              label="Opacity" 
              value={(selectedLayer.style?.opacity ?? 1) * 100} 
              onChange={(val) => handleUpdate('opacity', val / 100)} 
              unit="%" 
            />

            <Slider 
              label="Scale" 
              min={10} max={300} 
              value={(selectedLayer.style?.scale ?? 1) * 100} 
              onChange={(val) => handleUpdate('scale', val / 100)} 
              unit="%" 
            />

            <Slider 
              label="Rotation" 
              min={-180} max={180} 
              value={selectedLayer.style?.rotation || 0} 
              onChange={(val) => handleUpdate('rotation', val)} 
              unit="°" 
            />
          </div>
        )}

        {/* --- Section 2: Audio Control (Sirf Audio ke liye) --- */}
        {selectedLayer.type === 'audio' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 size={12} className="text-emerald-500" />
              <label className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Audio Levels</label>
            </div>
            
            <Slider 
              label="Master Volume" 
              min={0} max={100} 
              value={selectedLayer.style?.volume ?? 100} 
              onChange={(val) => handleUpdate('volume', val)} 
              unit="%" 
            />
          </div>
        )}

        {/* --- Section 3: Absolute Position --- */}
        {(selectedLayer.type !== 'audio') && (
          <div className="space-y-6 pt-6 border-t border-white/[0.03]">
            <div className="flex items-center gap-2 mb-2">
              <Move size={12} className="text-zinc-500" />
              <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Positioning</label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <InputControl 
                label="Offset X" 
                value={selectedLayer.style?.x || 0} 
                onChange={(val) => handleUpdate('x', val)} 
              />
              <InputControl 
                label="Offset Y" 
                value={selectedLayer.style?.y || 0} 
                onChange={(val) => handleUpdate('y', val)} 
              />
            </div>
          </div>
        )}

      </div>

      {/* --- Footer Status --- */}
      <div className="p-4 bg-black/40 border-t border-white/[0.03]">
        <div className="flex items-center justify-between opacity-40">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Layer ID:</span>
          <span className="text-[8px] font-mono text-zinc-500 truncate w-32 text-right">{selectedLayer.id}</span>
        </div>
      </div>
    </aside>
  );
};

// 💎 Professional Sub-Component for X/Y Inputs
const InputControl = ({ label, value, onChange }) => (
  <div className="group bg-zinc-950 border border-white/[0.03] p-3 rounded-2xl hover:border-blue-500/30 transition-all shadow-inner">
    <div className="text-[8px] text-zinc-600 mb-1.5 font-black uppercase tracking-widest">{label}</div>
    <div className="flex items-center gap-2">
      <input 
        type="number" 
        value={Math.round(value)}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="bg-transparent text-xs w-full outline-none text-zinc-300 font-mono"
      />
      <span className="text-[9px] text-zinc-800 font-bold">PX</span>
    </div>
  </div>
);

export default PropertiesPanel;