import React from 'react';
import { Video, Music, Image as ImageIcon, Plus, Trash2, LayoutGrid, Cloud } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addLayer, deleteAsset } from '../../store/projectSlice';

const AssetLibrary = () => {
  const assets = useSelector((state) => state.project.assets) || [];
  const dispatch = useDispatch();

  const handleAddToTimeline = (asset) => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      assetId: asset.id,
      name: asset.name,
      type: asset.type,
      url: asset.url,
      startTime: 0,
      duration: 5,
    };
    dispatch(addLayer(newLayer));
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e] w-full border-r border-white/5 selection:bg-blue-500/30">
      
      {/* 🏷️ Header Section */}
      <div className="p-5 border-b border-white/[0.03] flex items-center justify-between bg-gradient-to-b from-white/[0.01] to-transparent">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
          <LayoutGrid size={12} className="text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          Media Library
        </h3>
        <span className="text-[9px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 shadow-inner">
          {assets.length}
        </span>
      </div>

      {/* 📦 Assets Display Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {assets.length === 0 ? (
          // ✅ Center alignment fixed here
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[220px] aspect-square border-2 border-dashed border-white/[0.03] rounded-[3rem] flex flex-col items-center justify-center group hover:border-blue-500/10 transition-all duration-700">
              <div className="w-16 h-16 bg-white/[0.01] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                 <Video size={24} className="text-zinc-800 group-hover:text-blue-500/40" />
              </div>
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Storage Empty</p>
              <p className="text-[9px] text-zinc-800 mt-2 text-center px-4 leading-relaxed">
                Drag & drop or upload media to start
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {assets.map((asset) => (
              <div 
                key={asset.id} 
                className="group relative bg-[#121214]/40 border border-white/[0.03] rounded-2xl p-3 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/5 shadow-inner flex-shrink-0">
                    {asset.type === 'video' ? <Video size={18} className="text-blue-500" /> : 
                     asset.type === 'audio' ? <Music size={18} className="text-emerald-500" /> : 
                     <ImageIcon size={18} className="text-purple-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-zinc-400 truncate group-hover:text-white transition-colors italic">
                      {asset.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-600 bg-black/60 px-1.5 py-0.5 rounded border border-white/5">
                        {asset.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-300">
                  <button 
                    onClick={() => handleAddToTimeline(asset)}
                    className="p-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white shadow-xl shadow-blue-600/20 transform translate-y-2 group-hover:translate-y-0 transition-all"
                  >
                    <Plus size={18} />
                  </button>
                  <button 
                    onClick={() => dispatch(deleteAsset(asset.id))}
                    className="p-2.5 bg-red-600/10 hover:bg-red-600 rounded-xl text-red-500 hover:text-white transform translate-y-2 group-hover:translate-y-0 transition-all delay-75"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ☁️ Footer Meta */}
      <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-center gap-2">
        <Cloud size={10} className="text-zinc-700" />
        <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.2em]">
          VisionAI Cloud Sync
        </p>
      </div>
    </div>
  );
};

export default AssetLibrary;