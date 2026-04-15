import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // ✅ useSelector add kiya
import { Heading1, Heading2, TextCursorInput } from 'lucide-react';
import { addLayer, updateLayerContent, updateLayerPosition } from '../../store/projectSlice';
const TextPanel = () => {
  const dispatch = useDispatch();

  // 1. Redux se selection aur saari layers nikal rahe hain
  const { layers, selectedLayerId } = useSelector((state) => state.project);

  // 2. Selected layer dhoondo aur check karo ki kya wo 'text' type hai
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  const handleAddText = (styleType) => {
    const newText = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: styleType === 'h1' ? 'MAIN TITLE' : styleType === 'h2' ? 'SUBTITLE' : 'Body Text...',
      trackId: 'track-3',
      startTime: 0,
      duration: 5,
      style: {
        fontSize: styleType === 'h1' ? 48 : styleType === 'h2' ? 32 : 18,
        fontWeight: styleType === 'body' ? 'normal' : 'bold',
        color: '#ffffff',
        textAlign: 'center'
      }
    };

    dispatch(addLayer(newText));
  };

  return (
    <div className="p-4 flex flex-col gap-4 bg-zinc-900/50 h-full overflow-y-auto custom-scrollbar">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">
        Typography
      </h3>

      {/* --- Main Title Card --- */}
      <div
        onClick={() => handleAddText('h1')}
        className="group bg-zinc-900 border border-zinc-800 p-4 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
            <Heading1 size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-200">Main Title</h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tight">Large bold heading</p>
          </div>
        </div>
      </div>

      {/* --- Subtitle Card --- */}
      <div
        onClick={() => handleAddText('h2')}
        className="group bg-zinc-900 border border-zinc-800 p-4 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
            <Heading2 size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">Subtitle</h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tight">Medium weight text</p>
          </div>
        </div>
      </div>

      {/* --- Body Text Card --- */}
      <div
        onClick={() => handleAddText('body')}
        className="group bg-zinc-900 border border-zinc-800 p-4 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
            <TextCursorInput size={20} />
          </div>
          <div>
            <h4 className="text-sm text-zinc-400">Body Text</h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tight">Standard paragraph</p>
          </div>
        </div>
      </div>

      {/* --- 🔥 DYNAMIC EDIT SECTION: Jab Text select ho tabhi dikhega --- */}
      {/* --- 🔥 DYNAMIC EDIT SECTION: Text Selection aur Movement Controls --- */}
      {selectedLayer && selectedLayer.type === 'text' && (
        <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl animate-in fade-in slide-in-from-bottom-2">
          {/* 1. Text Content Input */}
          <label className="text-[10px] font-black uppercase text-blue-400 mb-2 block tracking-widest">
            Editing Content
          </label>
          <input
            type="text"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500 transition-all shadow-inner mb-6"
            value={selectedLayer.content}
            autoFocus
            onChange={(e) => dispatch(updateLayerContent({
              id: selectedLayer.id,
              content: e.target.value
            }))}
            placeholder="Type your name here..."
          />

          {/* 2. Movement Controls (X and Y Sliders) */}
          <div className="space-y-4 border-t border-zinc-800 pt-4">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Position & Movement</p>

            {/* Horizontal Movement (X) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Horizontal (X)</label>
                <span className="text-[10px] font-mono text-blue-500">{selectedLayer.style?.x || 0}px</span>
              </div>
              <input
                type="range"
                min="-500"
                max="500"
                step="1"
                value={selectedLayer.style?.x || 0}
                onChange={(e) => dispatch(updateLayerPosition({
                  id: selectedLayer.id,
                  x: parseInt(e.target.value),
                  y: selectedLayer.style?.y || 0
                }))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Vertical Movement (Y) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Vertical (Y)</label>
                <span className="text-[10px] font-mono text-blue-500">{selectedLayer.style?.y || 0}px</span>
              </div>
              <input
                type="range"
                min="-500"
                max="500"
                step="1"
                value={selectedLayer.style?.y || 0}
                onChange={(e) => dispatch(updateLayerPosition({
                  id: selectedLayer.id,
                  x: selectedLayer.style?.x || 0,
                  y: parseInt(e.target.value)
                }))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <p className="text-[9px] text-zinc-500 mt-4 italic">
            Live sync: Move sliders to shift "{selectedLayer.content}" on screen.
          </p>
        </div>
      )}

    </div>
  );
};

export default TextPanel;