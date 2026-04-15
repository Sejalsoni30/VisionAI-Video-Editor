import React, { useState } from 'react';
import { Palette, Maximize2, Layers, Wand2, Crop, Loader2, Plus, Sparkles, MoveDiagonal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAsset } from "../../store/projectSlice";
import IconButton from '../Common/IconButton';

const ImageTools = () => {
  const dispatch = useDispatch();
  const { assets, layers, selectedLayerId } = useSelector((state) => state.project);
  const [isProcessing, setIsProcessing] = useState(false);

  const getActiveAsset = () => {
    const layer = layers.find(l => l.id === selectedLayerId);
    return layer ? assets.find(a => a.id === layer.assetId) : null;
  };

  const handleAction = async (actionType, params = {}) => {
    const activeAsset = getActiveAsset();
    if (!activeAsset) return; // Silent return if nothing selected

    setIsProcessing(true);

    // 🔥 DYNAMIC FILE LOGIC: Always targets the actual file name
    let currentFile = activeAsset.name; 
    if (activeAsset.url && activeAsset.url.includes('http://localhost:5000')) {
        currentFile = activeAsset.url.split('/').pop();
    }

    try {
      console.log(`🚀 Executing ${actionType} on: ${currentFile}`);

      const response = await fetch(`http://localhost:5000/video/${actionType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: currentFile,
          ...params
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        dispatch(updateAsset({
          id: activeAsset.id,
          updates: { url: data.url }
        }));
      } else {
        console.error("Backend Error:", data.error);
      }
    } catch (err) {
      console.error("❌ Network Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-1.5 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl relative transition-all duration-500">
      
      {/* 🌀 Cinematic Loader */}
      {isProcessing && (
        <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]"></div>
          <Loader2 className="animate-spin text-blue-500" size={20} />
        </div>
      )}

      {/* --- Section 1: Geometry --- */}
      <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl">
        <IconButton 
          icon={Crop} 
          tooltip="Smart Crop" 
          onClick={() => handleAction('resize', { size: '800x600' })}
          className="hover:bg-amber-500/20 hover:text-amber-500 transition-colors"
        />
        <IconButton 
          icon={Layers} 
          tooltip="Rotate 90°" 
          onClick={() => handleAction('rotate', { angle: 90 })}
          className="hover:bg-indigo-500/20 hover:text-indigo-500 transition-colors"
        />
      </div>

      {/* --- Section 2: AI Filters --- */}
      <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl">
        <IconButton 
          icon={Wand2} 
          tooltip="Grayscale B&W" 
          onClick={() => handleAction('filter', { filterType: 'grayscale' })}
          className="hover:bg-blue-500/20 hover:text-blue-500"
        />
        <IconButton 
          icon={Sparkles} 
          tooltip="Vintage Aesthetic" 
          onClick={() => handleAction('filter', { filterType: 'vintage' })}
          className="hover:bg-purple-500/20 hover:text-purple-500"
        />
      </div>

      {/* --- Section 3: Smart Actions --- */}
      <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl">
        <IconButton 
          icon={Plus} 
          tooltip="Merge Timeline" 
          onClick={() => {
            const videoNames = layers.map(l => {
              const asset = assets.find(a => a.id === l.assetId);
              return asset?.url?.includes('http') ? asset.url.split('/').pop() : asset?.name;
            }).filter(Boolean);
            if(videoNames.length >= 2) handleAction('merge', { videoUrls: videoNames });
          }}
          className="text-emerald-500 hover:bg-emerald-500/20"
        />
        <IconButton 
          icon={MoveDiagonal} 
          tooltip="Fit to 1080p" 
          onClick={() => handleAction('resize', { size: '1920x1080' })}
          className="hover:bg-rose-500/20 hover:text-rose-500"
        />
      </div>

      {/* --- Status Indicator --- */}
      <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${selectedLayerId ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`}></div>
        <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
          {selectedLayerId ? 'Asset Ready' : 'No Selection'}
        </span>
      </div>
    </div>
  );
};

export default ImageTools;