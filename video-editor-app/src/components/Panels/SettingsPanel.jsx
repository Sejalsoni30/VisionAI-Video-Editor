import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateLayerStyle } from '../../store/projectSlice';
import { Settings2, Sparkles, RotateCcw, SlidersHorizontal } from 'lucide-react';

const filterOptions = [
  { id: 'none', label: 'None', value: 'none' },
  { id: 'grayscale', label: 'B&W', value: 'grayscale(100%)' },
  { id: 'sepia', label: 'Sepia', value: 'sepia(80%)' },
  { id: 'invert', label: 'Invert', value: 'invert(100%)' },
  { id: 'cinematic', label: 'Cinematic', value: 'contrast(120%) brightness(110%) saturate(110%)' },
];

const SettingsPanel = () => {
  const dispatch = useDispatch();
  const selectedLayerId = useSelector((state) => state.project.selectedLayerId);
  const selectedLayer = useSelector((state) => state.project.layers.find(l => l.id === selectedLayerId));

  const applyQuickEffect = (value) => {
    if (!selectedLayer || !['video', 'image'].includes(selectedLayer.type)) return;
    dispatch(updateLayerStyle({ id: selectedLayer.id, updates: { filter: value } }));
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e] text-white">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-3xl bg-blue-500/10 flex items-center justify-center">
            <Settings2 size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Workspace Settings</h3>
            <p className="text-[11px] text-zinc-300 mt-1">Actual control panel for exporting and layer effects.</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        <div className="rounded-3xl border border-white/5 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Selected Layer</p>
              <p className="text-sm font-semibold mt-1 text-white">{selectedLayer ? selectedLayer.name || selectedLayer.type : 'None selected'}</p>
            </div>
            <div className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] uppercase text-blue-300">{selectedLayer?.type || 'No layer'}</div>
          </div>
          <div className="text-[10px] text-zinc-400">
            {selectedLayer
              ? `Current filter: ${selectedLayer.style?.filter || 'none'}`
              : 'Select an image or video layer to apply quick settings.'}
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal size={16} className="text-blue-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Quick Effects</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => applyQuickEffect(option.value)}
                disabled={!selectedLayer || !['video', 'image'].includes(selectedLayer?.type)}
                className="rounded-2xl border border-white/10 bg-zinc-950/80 px-3 py-2 text-[11px] text-zinc-200 transition hover:border-blue-500/30 hover:bg-blue-500/10 disabled:opacity-40"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-amber-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Export Controls</span>
          </div>
          <div className="space-y-2 text-[11px] text-zinc-300">
            <p>Use Export button in the top bar to generate a stable MP4, MP3 or PNG snapshot.</p>
            <p>Every export now creates a fresh temporary file and streams a single safe output.</p>
            <p className="text-[10px] text-zinc-500">This avoids duplicate export crashes after the first run.</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 text-[10px] text-zinc-500">
        <div className="flex items-center gap-2">
          <RotateCcw size={14} />
          <span>Actual effects preview & last settings are now available.</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
