import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Film, Image as ImageIcon, Search, Trash2, PlayCircle } from 'lucide-react';
import { selectLayerAction } from '../../store/projectSlice'; 

const AssetsPanel = () => {
  const dispatch = useDispatch();
  
  // Timeline tracks se layers nikalna
  const layers = useSelector((state) => state.project.tracks?.flatMap(track => track.layers) || []);
  const selectedLayerId = useSelector((state) => state.project.selectedLayerId);

  const handleSelectAsset = (id) => {
    dispatch(selectLayerAction({ id: id, x: 0, y: 0 }));
  };

  useEffect(() => {
    if (layers.length > 0 && !selectedLayerId) {
      handleSelectAsset(layers[0].id);
    }
  }, [layers, selectedLayerId]);

  return (
    // 🚩 'w-full' ensure karta hai ki koi side black space na bache
    <div className="flex flex-col h-full bg-[#0c0c0e] w-full border-r border-white/5">
      
      {/* Search & Header */}
      <div className="p-5 border-b border-white/[0.03] bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Project Media</h3>
          <span className="text-[9px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 font-mono">
            {layers.length} Items
          </span>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search in project..." 
            className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-[11px] outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-zinc-700"
          />
        </div>
      </div>

      {/* Assets List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-[#0c0c0e]">
        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/[0.02] rounded-[2rem] mx-2 mt-4">
            <div className="w-12 h-12 bg-white/[0.02] rounded-full flex items-center justify-center mb-3">
               <Film size={20} className="text-zinc-700" />
            </div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No Media Yet</p>
            <p className="text-[9px] text-zinc-800 mt-1">Upload files to start</p>
          </div>
        ) : (
          layers.map((layer) => (
            <div 
              key={layer.id} 
              onClick={() => handleSelectAsset(layer.id)}
              className={`group relative overflow-hidden rounded-2xl p-2.5 transition-all duration-300 cursor-pointer ${
                layer.id === selectedLayerId 
                ? 'bg-blue-600/10 border border-blue-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' 
                : 'bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.04] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                {/* Thumbnail Preview */}
                <div className="relative w-14 h-14 bg-black rounded-xl flex items-center justify-center border border-white/5 overflow-hidden flex-shrink-0 shadow-lg">
                  {layer.type === 'video' ? (
                    <>
                      <video 
                        src={layer.url} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                        muted 
                        onMouseOver={e => e.target.play()} 
                        onMouseOut={e => {e.target.pause(); e.target.currentTime = 0;}}
                      />
                      <PlayCircle size={14} className="absolute text-white/50 group-hover:scale-125 transition-transform pointer-events-none" />
                    </>
                  ) : (
                    <ImageIcon size={20} className="text-zinc-600" />
                  )}
                </div>

                {/* Metadata */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-semibold truncate ${
                    layer.id === selectedLayerId ? 'text-blue-400' : 'text-zinc-300 group-hover:text-white'
                  }`}>
                    {layer.name || "Untitled Asset"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] px-1.5 py-0.5 bg-black/40 text-zinc-500 rounded font-bold uppercase tracking-tighter border border-white/5">
                      {layer.type}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-mono">
                      {(layer.duration || 0).toFixed(1)}s
                    </span>
                  </div>
                </div>

                {/* Selection Glow */}
                {layer.id === selectedLayerId && (
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-black/20 border-t border-white/5">
         <div className="flex items-center justify-between px-2">
            <p className="text-[9px] text-zinc-600 font-medium italic">VisionAI Media Engine v2</p>
            <div className="flex gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AssetsPanel;