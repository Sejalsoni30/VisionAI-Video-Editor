import React from 'react';
import { motion } from 'framer-motion'; // 👈 Ye line missing thi, ise add karo
import { Video, Music, Image as ImageIcon, Plus, Trash2, LayoutGrid, Cloud, ExternalLink } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addLayer, deleteAsset, addAsset } from '../../store/projectSlice'; // addAsset import kiya
import { API_URL, GOOGLE_API_KEY } from '../../config';

const AssetLibrary = () => {
  const assets = useSelector((state) => state.project.assets) || [];
  const dispatch = useDispatch();

  // 🚀 GOOGLE DRIVE PICKER LOGIC
  const openDrivePicker = () => {
    const token = localStorage.getItem('googleDriveToken');

    if (!token) {
      alert("Google Drive token missing. Please sign in again with Google.");
      return;
    }

    // 💡 Google API loaded hai ya nahi check karo
    if (!(window.google && window.google.picker)) {
      alert("Google Picker is not loaded yet. Please refresh the page and try again.");
      return;
    }

    if (!GOOGLE_API_KEY) {
      alert("Google API key is not configured. Please add VITE_GOOGLE_API_KEY to your .env file and restart the app.");
      return;
    }

    try {
      // 1. View Setup (Sirf Files dikhane ke liye)
      const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);
      view.setMimeTypes("video/mp4,video/x-matroska,video/quicktime,image/png,image/jpeg,image/gif,audio/mpeg,audio/wav,audio/mp3");
      // ❌ Yahan setSelectableMimeTypes hata diya hai kyunki wo error de raha tha

      // 2. Picker Builder
      const picker = new window.google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(token) // 👈 Ye user ki drive access karega
        .setDeveloperKey(GOOGLE_API_KEY)
        .setOrigin(window.location.origin)
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const doc = data.docs[0];

            // 🧠 Smart Type Detection
            let fileType = 'image'; // Default
            if (doc.mimeType.includes('video')) fileType = 'video';
            if (doc.mimeType.includes('audio')) fileType = 'audio';

            const assetUrl = `${API_URL}/api/video/stream/${doc.id}?token=${token}`;
            const newAsset = {
              id: doc.id,
              name: doc.name,
              type: fileType, // 👈 'video', 'audio', ya 'image'
              url: assetUrl,
              embedUrl: doc.embedUrl,
              thumbnail: doc.thumbnails?.[0]?.url || '',
              duration: fileType === 'image' ? 5 : 0, // Images ko default 5 sec duration do
              source: 'google-drive'
            };

            dispatch(addAsset(newAsset));
            console.log(`✅ ${fileType} added:`, doc.name);
          }
        })
        .build();

      picker.setVisible(true);
    } catch (error) {
      console.error("Google Picker failed:", error);
      alert("Google Picker could not start. Check your API key, OAuth token, and app origin in the Google Cloud console.");
    }
  };

  const { currentTime } = useSelector((state) => state.project);
  // Component ke andar...
  // AssetLibrary.jsx ke andar, return se pehle

  const getDirectDriveLink = (url) => {
    if (!url) return "";
    // Google Drive URL se File ID nikalne ka logic
    const fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];

    if (fileId) {
      // Ye format direct image display karne ke liye best hai
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return url;
  };

  const handleAddToTimeline = (asset) => {
    if (!asset) return;

    // 🧠 Smart Track Assignment
    let targetTrack = 'track-1'; // Default Video Track
    if (asset.type === 'audio') targetTrack = 'track-3'; // Maan lo Track 3 audio ke liye hai
    if (asset.type === 'image') targetTrack = 'track-2'; // Track 2 images ke liye

    const defaultDuration = asset.duration > 0
      ? asset.duration
      : asset.type === 'video'
        ? 10
        : 5;

    const newLayer = {
      id: `layer-${Date.now()}`,
      assetId: asset.id,
      trackId: targetTrack, // 👈 Sahi track mein bhejo
      name: asset.name,
      type: asset.type, // 'video', 'image', ya 'audio'
      startTime: currentTime || 0,
      duration: defaultDuration,
      url: asset.url
    };

    dispatch(addLayer(newLayer));
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e] w-full border-r border-white/5 selection:bg-blue-500/30">

      {/* 🏷️ Header Section */}
      <div className="p-5 border-b border-white/[0.03] flex items-center justify-between bg-gradient-to-b from-white/[0.01] to-transparent">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
          <LayoutGrid size={12} className="text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          Neural Library
        </h3>
        <span className="text-[9px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 shadow-inner">
          {assets.length}
        </span>
      </div>

      {/* ☁️ Cloud Sync Button (Replaces Laptop Upload) */}
      <div className="px-4 py-6 border-b border-white/[0.02] bg-white/[0.01] text-center">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "rgba(37, 99, 235, 0.1)" }}
          whileTap={{ scale: 0.98 }}
          onClick={openDrivePicker}
          className="w-full py-4 border-2 border-dashed border-blue-500/30 rounded-2xl flex flex-col items-center gap-2 transition-all group"
        >
          <div className="p-2 bg-blue-500/20 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all text-blue-500">
            <ExternalLink size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-blue-400">
            Import from Drive
          </span>
        </motion.button>
      </div>

      {/* 📦 Assets Display Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {assets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <Cloud size={40} className="mb-4 text-zinc-700" />
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Storage Offline</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {assets.map((asset) => (
              <div key={asset.id} className="group relative bg-[#121214]/40 border border-white/[0.03] rounded-2xl p-3 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                    {asset.type === 'video' ? <Video size={18} className="text-blue-500" /> :
                      asset.type === 'audio' ? <Music size={18} className="text-emerald-500" /> :
                        <ImageIcon size={18} className="text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-zinc-400 truncate italic">{asset.name}</p>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-600 bg-black/60 px-1.5 py-0.5 rounded border border-white/5">
                      {asset.type} • Cloud
                    </span>
                  </div>
                </div>

                {/* Action Overlay */}
                <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-300">

                  {/* ✅ Plus Button: 'asset' (small a) use karo aur event propagation roko */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToTimeline(asset); // 👈 Yahan 'Asset' nahi 'asset' hoga
                    }}
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <Plus size={20} className="text-white" />
                  </button>

                  {/* ✅ Delete Button: 'asset.id' check karo */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(deleteAsset(asset.id));
                    }}
                    className="w-10 h-10 bg-red-600/10 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-center gap-2">
        <Cloud size={10} className="text-blue-500/50" />
        <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.2em]">Drive Node Active</p>
      </div>
    </div>
  );
};

export default AssetLibrary;