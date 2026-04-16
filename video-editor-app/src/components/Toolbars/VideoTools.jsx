import React, { useState } from 'react';
import { Scissors, Timer, RotateCcw, Volume2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAsset } from "../../store/projectSlice";
import IconButton from "../Common/IconButton";
import { API_URL } from '../../config';
const VideoTools = () => {
  const dispatch = useDispatch();
  const { assets, layers, selectedLayerId } = useSelector((state) => state.project);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🎯 Selected Video nikalne ka logic
  const getActiveVideo = () => {
    const layer = layers.find(l => l.id === selectedLayerId);
    return layer ? assets.find(a => a.id === layer.assetId) : null;
  };

  const handleAction = async (actionType, params = {}) => {
    const activeVideo = getActiveVideo();
    if (!activeVideo) return alert("Video select karo!");

    setIsProcessing(true);

    try {
      // 📢 Ab hum pura Cloudinary URL bhej rahe hain
      console.log("🚀 Sending to Backend:", {
        action: actionType,
        url: activeVideo.url, // 👈 Pura URL check karo console mein
        params: params
      });

      // VideoTools.jsx ke andar
      const response = await fetch(`${API_URL}/video/${actionType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: activeVideo.url, // 👈 'url' ki jagah 'videoUrl' karke dekho
          startTime: 0,
          duration: 5,
          ...params
        }),

      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();

      // ✅ Agar backend ne edit karke naya Cloudinary URL bheja hai
      if (data.url) {
        dispatch(updateAsset({
          id: activeVideo.id,
          updates: { url: data.url } // 👈 Purani video ki jagah Edited video ka URL!
        }));

        alert(`Operation ${actionType} Successful! ✨`);
        console.log("✅ New Edited URL:", data.url);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Editing fail ho gayi. Backend check karo!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-zinc-900 border border-white/10 rounded-xl relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
          <Loader2 className="animate-spin text-blue-500" size={24} />
        </div>
      )}

      <div className="flex gap-2 border-r border-zinc-800 pr-3">
        <IconButton
          icon={Scissors}
          onClick={() => handleAction('trim', { startTime: '00:00:00', duration: 10 })}
          tooltip="Trim 10s"
        />
        <IconButton
          icon={Timer}
          onClick={() => handleAction('speed', { speed: 2.0 })}
          tooltip="2x Fast"
        />
      </div>

      <div className="flex gap-2">
        <IconButton
          icon={RotateCcw}
          onClick={() => handleAction('rotate', { angle: 90 })}
          tooltip="Rotate 90°"
        />
        <IconButton
          icon={Volume2}
          onClick={() => handleAction('volume', { volume: 0.3 })}
          tooltip="Set Volume to 30%"
        />
      </div>
    </div>
  );
};

export default VideoTools;