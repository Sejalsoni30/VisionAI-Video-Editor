import React, { useState } from 'react';
import { ChevronDown, Share2, Download, Play, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_URL } from '../../config';

const Navbar = () => {
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // 🔥 Loading state

  const { layers, assets } = useSelector((state) => state.project);

  const handleBlur = () => {
    setIsEditing(false);
    if (projectName.trim() === '') setProjectName('Untitled Project');
  };

  const handleExport = async (format = 'mp4') => {
    if (layers.length === 0) {
      alert("Timeline khali hai! Clips toh add karo. 🎬");
      return;
    }

    setIsExporting(true);
    try {
      const token = localStorage.getItem('googleDriveToken');
      const filename = `${projectName.replace(/\s+/g, '_')}_export.${format}`;

      // Upload any blob-based assets to server temp storage first
      const blobUrls = Array.from(new Set([
        ...assets.filter(a => a.url?.startsWith('blob:')).map(a => a.url),
        ...layers.filter(l => l.url?.startsWith('blob:')).map(l => l.url)
      ]));

      const urlToTempPath = {};
      for (const blobUrl of blobUrls) {
        const blobResponse = await fetch(blobUrl);
        const blobData = await blobResponse.blob();
        const formData = new FormData();
        const asset = assets.find(a => a.url === blobUrl) || layers.find(l => l.url === blobUrl);
        const extension = asset?.type === 'audio' ? 'mp3' : asset?.type === 'image' ? 'png' : 'mp4';
        const filenameForUpload = `${asset?.id || 'blob_asset'}.${extension}`;
        formData.append('file', blobData, filenameForUpload);

        const uploadResponse = await fetch(`${API_URL}/api/video/upload-temp`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Blob upload failed');
        }

        const uploadData = await uploadResponse.json();
        urlToTempPath[blobUrl] = uploadData.tempPath;
      }

      const exportAssets = assets.map((asset) => ({
        ...asset,
        url: asset.url.startsWith('blob:') ? urlToTempPath[asset.url] || asset.url : asset.url,
      }));

      const exportLayers = layers.map((layer) => ({
        ...layer,
        url: layer.url?.startsWith('blob:') ? urlToTempPath[layer.url] || layer.url : layer.url,
      }));

      const response = await fetch(`${API_URL}/api/video/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          filename,
          layers: exportLayers,
          assets: exportAssets,
          token,
          exportType: format
        })
      });

      if (!response.ok) throw new Error("Rendering failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`🚀 ${format.toUpperCase()} Exported Successfully!`);
    } catch (error) {
      console.error("Export Error:", error);
      alert("Backend error! FFmpeg check karo Render par.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Play size={18} fill="white" />
          </div>
          <span className="font-bold text-lg text-white">VisionAI Editor</span>
        </div>

        <div className="flex items-center gap-2 group">
          {isEditing ? (
            <input
              autoFocus
              className="bg-zinc-800 border border-blue-500 outline-none px-2 py-0.5 rounded text-sm text-white"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            />
          ) : (
            <div onClick={() => setIsEditing(true)} className="cursor-pointer hover:bg-zinc-800 px-2 py-0.5 rounded flex items-center gap-2">
              <span className="text-sm text-zinc-400">{projectName}</span>
              <ChevronDown size={14} className="text-zinc-600" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Export Button with Dropdown */}
        <div className="relative group">
          <button 
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isExporting ? 'Processing...' : 'Export'}
          </button>

          {/* Dropdown Options */}
          {!isExporting && (
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-40">
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                <button onClick={() => handleExport('mp4')} className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-blue-600 hover:text-white transition-colors">
                  Video (.mp4)
                </button>
                <button onClick={() => handleExport('mp3')} className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-blue-600 hover:text-white border-t border-zinc-700">
                  Audio (.mp3)
                </button>
                <button onClick={() => handleExport('png')} className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-blue-600 hover:text-white border-t border-zinc-700">
                  Snapshot (.png)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;