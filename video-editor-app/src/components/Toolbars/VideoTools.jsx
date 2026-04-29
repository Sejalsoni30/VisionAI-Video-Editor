import React, { useState } from 'react';
import { 
  Scissors, Timer, RotateCcw, Volume2, 
  Loader2, Zap, PlayCircle, FastForward, 
  Wind, Film, Layers 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { updateAsset, setIsProcessing } from "../../store/projectSlice";
import IconButton from "../Common/IconButton";
import { API_URL } from '../../config';

const VideoTools = () => {
  const dispatch = useDispatch();
  const { assets, layers, selectedLayerId } = useSelector((state) => state.project);
  const [isProcessingLocal, setIsProcessingLocal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // 🎯 Selected Video nikalne ka logic
  const getActiveVideo = () => {
    const layer = layers.find(l => l.id === selectedLayerId);
    return layer ? assets.find(a => a.id === layer.assetId) : null;
  };

  const uploadBlobTemp = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, `merged_${Date.now()}.mp4`);

    const uploadResponse = await fetch(`${API_URL}/api/video/upload-temp`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) throw new Error('Blob upload failed for merge');
    const uploadData = await uploadResponse.json();
    return uploadData.tempPath;
  };

  const activeVideo = getActiveVideo();

  const handleMerge = async () => {
    const token = localStorage.getItem('googleDriveToken');
    if (!token) return alert("Security Token Missing. Please Re-login.");

    const videoUrls = layers
      .filter(layer => layer.type === 'video')
      .map(layer => assets.find(a => a.id === layer.assetId)?.url)
      .filter(Boolean);

    if (videoUrls.length < 2) {
      return alert('Select at least two video layers for merge.');
    }

    setIsProcessingLocal(true);
    dispatch(setIsProcessing(true));
    setStatusMsg('Neural merge in progress...');

    try {
      const uploadPromises = videoUrls.map(async (url) => {
        if (url.startsWith('blob:')) {
          return await uploadBlobTemp(url);
        }
        return url;
      });

      const resolvedUrls = await Promise.all(uploadPromises);

      const response = await fetch(`${API_URL}/api/video/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrls: resolvedUrls, token }),
      });

      if (!response.ok) throw new Error(`Merge Engine Error: ${response.status}`);

      const blob = await response.blob();
      const mergedUrl = URL.createObjectURL(blob);

      if (activeVideo) {
        dispatch(updateAsset({
          id: activeVideo.id,
          updates: { url: mergedUrl, lastAction: 'merge' }
        }));
      }

      console.log('✅ Videos merged successfully');
    } catch (err) {
      console.error('❌ Merge Failure:', err);
    } finally {
      setIsProcessingLocal(false);
      dispatch(setIsProcessing(false));
      setStatusMsg('');
    }
  };

  const handleAction = async (actionType, params = {}) => {
    const activeVideo = getActiveVideo();
    const token = localStorage.getItem('googleDriveToken');

    if (!activeVideo) return;
    if (!token) return alert("Security Token Missing. Please Re-login.");

    setIsProcessingLocal(true);
    dispatch(setIsProcessing(true));
    setStatusMsg(`Neural ${actionType} in progress...`);

    try {
      const response = await fetch(`${API_URL}/api/video/${actionType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: activeVideo.id,
          token: token,
          ...params,
        }),
      });

      if (!response.ok) throw new Error(`Engine Error: ${response.status}`);

      const blob = await response.blob();
      const editedVideoUrl = URL.createObjectURL(blob);

      dispatch(updateAsset({
        id: activeVideo.id,
        updates: { url: editedVideoUrl, lastAction: actionType } 
      }));

      console.log("✅ Stream Processed Successfully");
      
    } catch (err) {
      console.error("❌ Neural Failure:", err);
    } finally {
      setIsProcessingLocal(false);
      dispatch(setIsProcessing(false));
      setStatusMsg('');
    }
  };

  return (
    <motion.div 
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`flex items-center gap-2 p-1.5 bg-[#0c0c0e]/80 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-2xl relative transition-all ${!selectedLayerId ? 'opacity-50 grayscale' : 'opacity-100'}`}
    >
      
      {/* 🌀 Cinematic Neural Processing Loader */}
      <AnimatePresence>
        {isProcessingLocal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-600/10 backdrop-blur-[4px] rounded-2xl flex items-center justify-center z-50 overflow-hidden"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <Loader2 className="animate-spin text-blue-500" size={28} />
                <Zap className="absolute inset-0 m-auto text-white animate-pulse" size={12} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400 animate-pulse">
                {statusMsg}
              </span>
            </div>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Section 1: Temporal Tools (Time) --- */}
      <div className="flex items-center gap-1.5 px-2 border-r border-white/5">
        <IconButton
          icon={Scissors}
          onClick={() => handleAction('trim', { startTime: 0, duration: 10 })}
          tooltip="Trim 10s"
          size={16}
          className="text-rose-500 hover:bg-rose-500/10"
        />
        <IconButton
          icon={Timer}
          onClick={() => handleAction('speed', { speed: 2.0 })}
          tooltip="Fast Forward 2x"
          size={16}
          className="text-amber-500 hover:bg-amber-500/10"
        />
        <IconButton
          icon={Wind}
          onClick={() => handleAction('speed', { speed: 0.5 })}
          tooltip="Slow Motion 0.5x"
          size={16}
          className="text-cyan-400 hover:bg-cyan-400/10"
        />
      </div>

      {/* --- Section 2: Geometry & Audio --- */}
      <div className="flex items-center gap-1.5 px-2 border-r border-white/5">
        <IconButton
          icon={RotateCcw}
          onClick={() => handleAction('rotate')}
          tooltip="Clockwise 90°"
          className="text-indigo-400 hover:bg-indigo-400/10"
        />
        <IconButton
          icon={Volume2}
          onClick={() => handleAction('volume', { volume: 0.5 })}
          tooltip="Set Gain 50%"
          className="text-emerald-500 hover:bg-emerald-500/10"
        />
      </div>

      {/* --- Section 3: Smart AI Lab --- */}
      <div className="flex items-center gap-1.5 px-2">
        <IconButton
          icon={Film}
          onClick={() => handleAction('filter', { filterType: 'cinematic' })}
          tooltip="AI Cinematic LUT"
          className="text-purple-500 hover:bg-purple-500/10 animate-pulse"
        />
        <IconButton
          icon={Layers}
          onClick={handleMerge}
          tooltip="Merge Videos"
          className="text-emerald-400 hover:bg-emerald-400/10"
        />
      </div>

      {/* --- Processor Info --- */}
      <div className="ml-2 pl-4 border-l border-white/5 hidden md:flex flex-col items-start">
        <div className="flex items-center gap-2">
          <PlayCircle size={10} className="text-zinc-600" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
            Node Ready
          </span>
        </div>
        <span className="text-[7px] font-bold text-zinc-800 uppercase mt-0.5">Bitstream 64-bit</span>
      </div>

    </motion.div>
  );
};

export default VideoTools;