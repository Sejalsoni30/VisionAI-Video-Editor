import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heading1, Heading2, TextCursorInput, Move, Type as TypeIcon } from 'lucide-react';
import { addLayer, updateLayerContent, updateLayerStyle } from '../../store/projectSlice';

const TextPanel = () => {
  const dispatch = useDispatch();
  const { layers, selectedLayerId } = useSelector((state) => state.project);
  const selectedLayer = layers?.find(l => l.id === selectedLayerId);

  // Safety check - don't render if no layers or selected layer
  if (!layers || !selectedLayer) {
    return (
      <div className="p-5 flex flex-col gap-4 bg-[#08080a] h-full overflow-y-auto custom-scrollbar">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">
          Neural Typography
        </h3>
        <div className="mt-10 flex flex-col items-center justify-center opacity-20 text-center space-y-2">
          <TypeIcon size={40} className="text-zinc-600" />
          <p className="text-[10px] font-bold uppercase tracking-widest">Select Text to Edit</p>
        </div>
      </div>
    );
  }

  const handleAddText = (styleType) => {
    const newTextId = `text-${Date.now()}`;
    const newText = {
      id: newTextId,
      type: 'text',
      content: styleType === 'h1' ? 'MAIN TITLE' : styleType === 'h2' ? 'SUBTITLE' : 'Body Text...',
      trackId: 'track-3',
      startTime: 0,
      duration: 5,
      style: {
        x: 0,
        y: 0,
        fontSize: styleType === 'h1' ? 60 : styleType === 'h2' ? 40 : 20,
        fontWeight: styleType === 'body' ? '400' : '900',
        color: '#ffffff',
        scale: 1,
        rotation: 0
      }
    };

    dispatch(addLayer(newText));
  };

  return (
    <div className="p-5 flex flex-col gap-4 bg-[#08080a] h-full overflow-y-auto custom-scrollbar">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">
        Neural Typography
      </h3>

      {/* --- Add Text Presets --- */}
      <div className="grid grid-cols-1 gap-3">
        {[
          { type: 'h1', icon: Heading1, label: 'Headline', desc: 'Bold & Impactful' },
          { type: 'h2', icon: Heading2, label: 'Subtitle', desc: 'Supporting Text' },
          { type: 'body', icon: TextCursorInput, label: 'Paragraph', desc: 'Standard Body' }
        ].map((item) => (
          <div
            key={item.type}
            onClick={() => handleAddText(item.type)}
            className="group bg-zinc-900/40 border border-white/5 p-4 rounded-2xl cursor-pointer hover:border-blue-500/40 hover:bg-blue-500/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:text-blue-500 transition-colors">
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">{item.label}</h4>
                <p className="text-[9px] text-zinc-600 uppercase tracking-tighter">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- 🔥 DYNAMIC EDIT SECTION --- */}
      {selectedLayer && selectedLayer.type === 'text' ? (
        <div className="mt-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
          
          {/* 1. Content Input */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-blue-500 tracking-widest flex items-center gap-2">
              <TypeIcon size={10} /> Text Content
            </label>
            <textarea
              className="w-full bg-black border border-white/5 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all min-h-[80px] resize-none"
              value={selectedLayer?.content || ''}
              onChange={(e) => dispatch(updateLayerContent({
                id: selectedLayer.id,
                content: e.target.value
              }))}
            />
          </div>

          {/* 3. Color Picker */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-blue-500 tracking-widest flex items-center gap-2">
              <TypeIcon size={10} /> Text Color
            </label>
            <div className="flex gap-2">
              {['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'].map(color => (
                <button
                  key={color}
                  onClick={() => dispatch(updateLayerStyle({
                    id: selectedLayer.id,
                    updates: { color: color }
                  }))}
                  className={`w-8 h-8 rounded-full border-2 ${selectedLayer?.style?.color === color ? 'border-blue-500' : 'border-white/20'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* 2. Style & Position Sliders */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
              <Move size={10} /> Transform Node
            </div>

            {/* Font Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-500">Size</span>
                <span className="text-blue-500 font-mono">{selectedLayer?.style?.fontSize || 20}px</span>
              </div>
              <input
                type="range" min="10" max="200"
                value={selectedLayer?.style?.fontSize || 20}
                onChange={(e) => dispatch(updateLayerStyle({
                  id: selectedLayer.id,
                  updates: { fontSize: parseInt(e.target.value) }
                }))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* X Position */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-500">X Position</span>
                <span className="text-blue-500 font-mono">{selectedLayer?.style?.x || 0}px</span>
              </div>
              <input
                type="range" min="-1000" max="1000"
                value={selectedLayer?.style?.x || 0}
                onChange={(e) => dispatch(updateLayerStyle({
                  id: selectedLayer.id,
                  updates: { x: parseInt(e.target.value) }
                }))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Y Position */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-500">Y Position</span>
                <span className="text-blue-500 font-mono">{selectedLayer?.style?.y || 0}px</span>
              </div>
              <input
                type="range" min="-1000" max="1000"
                value={selectedLayer?.style?.y || 0}
                onChange={(e) => dispatch(updateLayerStyle({
                  id: selectedLayer.id,
                  updates: { y: parseInt(e.target.value) }
                }))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center opacity-20 text-center space-y-2">
          <TypeIcon size={40} className="text-zinc-600" />
          <p className="text-[10px] font-bold uppercase tracking-widest">Select Text to Edit</p>
        </div>
      )}
    </div>
  );
};

export default TextPanel;