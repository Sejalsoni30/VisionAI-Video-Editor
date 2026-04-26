import React, { useState } from 'react';
import { 
  Palette, Maximize2, Layers, Wand2, Crop, 
  Loader2, Plus, Sparkles, MoveDiagonal, 
  RefreshCcw, Flame 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { updateAsset, setIsProcessing } from "../../store/projectSlice";
import IconButton from '../Common/IconButton';
import { API_URL } from '../../config';

const ImageTools = () => {
  const dispatch = useDispatch();
  const { assets, layers, selectedLayerId } = useSelector((state) => state.project);
  const [isProcessingLocal, setIsProcessingLocal] = useState(false);

  // 🎯 Helper: Get currently active asset
  const getActiveAsset = () => {
    if (!selectedLayerId) return null;
    const layer = layers.find(l => l.id === selectedLayerId);
    return layer ? assets.find(a => a.id === layer.assetId) : null;
  };

  const activeAsset = getActiveAsset();

  const handleAction = async (actionType, params = {}) => {
    if (!activeAsset && actionType !== 'merge') return;

    setIsProcessingLocal(true);
    dispatch(setIsProcessing(true));
    try {
      const token = localStorage.getItem('googleDriveToken');
      if (!token) throw new Error("Security Token Missing. Please Re-login.");

      const response = await fetch(`${API_URL}/api/video/${actionType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: activeAsset.id,
          token: token,
          ...params
        }),
      });

      if (!response.ok) throw new Error(`Engine Error: ${response.status}`);

      const blob = await response.blob();
      const editedUrl = URL.createObjectURL(blob);

      dispatch(updateAsset({
        id: activeAsset.id,
        updates: { url: editedUrl, lastAction: actionType }
      }));

      console.log("✅ Stream Processed Successfully");
    } catch (err) {
      console.error("❌ Action Error:", err.message);
      // alert ki jagah console ya toast use karna professional hai
    } finally {
      setIsProcessingLocal(false);
      dispatch(setIsProcessing(false));
    }
  };

  // Common button class for consistency
  const btnClass = "hover:scale-110 active:scale-95 transition-all duration-200";

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`flex items-center gap-4 p-2 bg-[#0c0c0e]/90 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-40 ${!selectedLayerId ? 'opacity-50' : 'opacity-100'}`}
    >
      {/* 🌀 Cinematic Neural Loader */}
      <AnimatePresence>
        {isProcessingLocal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-600/10 backdrop-blur-[3px] rounded-2xl flex items-center justify-center z-50"
          >
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-blue-400" size={24} />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400 animate-pulse">Processing</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Section 1: Geometry & Layout --- */}
      <div className="flex items-center gap-1.5 px-2 border-r border-white/5">
        <IconButton
          icon={Crop}
          tooltip="Smart Social Crop"
          disabled={!activeAsset || isProcessingLocal}
          onClick={() => handleAction('resize', { size: '1080x1350' })}
          className={`${btnClass} text-amber-500 hover:bg-amber-500/10`}
        />
        <IconButton
          icon={RefreshCcw}
          tooltip="Flip Horizontal"
          disabled={!activeAsset || isProcessingLocal}
          onClick={() => handleAction('flip', { direction: 'horizontal' })}
          className={`${btnClass} text-indigo-400 hover:bg-indigo-400/10`}
        />
      </div>

      {/* --- Section 2: AI Enhancements --- */}
      <div className="flex items-center gap-1.5 px-2 border-r border-white/5">
        <IconButton
          icon={Wand2}
          tooltip="AI Auto-Enhance"
          disabled={!activeAsset || isProcessingLocal}
          onClick={() => handleAction('filter', { filterType: 'auto' })}
          className={`${btnClass} text-blue-400 hover:bg-blue-400/10`}
        />
        <IconButton
          icon={Sparkles}
          tooltip="Neural Style Transfer"
          disabled={!activeAsset || isProcessingLocal}
          onClick={() => handleAction('filter', { filterType: 'cinematic' })}
          className={`${btnClass} text-purple-400 hover:bg-purple-400/10`}
        />
      </div>

      {/* --- Section 3: Power Tools --- */}
      <div className="flex items-center gap-1.5 px-2">
        <IconButton
          icon={Flame}
          tooltip="HDR Upscale"
          disabled={!activeAsset || isProcessingLocal}
          onClick={() => handleAction('resize', { size: '3840x2160' })}
          className={`${btnClass} text-rose-500 hover:bg-rose-500/10`}
        />
        <IconButton
          icon={Plus}
          tooltip="Neural Merge"
          disabled={layers.length < 2 || isProcessingLocal}
          onClick={() => {
            const videoUrls = layers
              .map(l => assets.find(a => a.id === l.assetId)?.url)
              .filter(Boolean);
            handleAction('merge', { videoUrls });
          }}
          className={`${btnClass} text-emerald-400 hover:bg-emerald-400/10`}
        />
      </div>

      {/* --- Node Status Badge --- */}
      <div className="ml-2 pl-4 border-l border-white/5 flex flex-col items-start">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${selectedLayerId ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-zinc-700'}`}></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
            {selectedLayerId ? 'Asset Linked' : 'Offline'}
          </span>
        </div>
        <span className="text-[7px] font-bold text-zinc-700 uppercase mt-0.5">Neural Engine 3.0</span>
      </div>
    </motion.div>
  );
};

export default ImageTools;