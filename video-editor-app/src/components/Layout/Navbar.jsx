import React, { useState } from 'react';
import { ChevronDown, Share2, Download, Play } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_URL } from '../../config';
const Navbar = () => {
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isEditing, setIsEditing] = useState(false);

  // Redux se layers le rahe hain
  const { layers, assets, selectedLayerId } = useSelector((state) => state.project);

  const handleNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (projectName.trim() === '') {
      setProjectName('Untitled Project');
    }
  };

  // 🔥 EXPORT FUNCTION: Download the selected media file with edited source
  const handleExport = async () => {
    if (!projectName || projectName.trim() === "") {
      alert("Please name your masterpiece first! ✍️");
      return;
    }

    if (layers.length === 0) {
      alert("Timeline is empty! Add some clips to export.");
      return;
    }

    // Loading state shuru karo (Redux use karke)
    // dispatch(setIsProcessing(true)); 

    try {
      const token = localStorage.getItem('googleDriveToken');
      const filename = `${projectName.replace(/\s+/g, '_')}_export.mp4`;

      const response = await fetch(`${API_URL}/api/video/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          layers,  // Sending whole timeline
          assets,  // Sending all asset sources
          token
        })
      });

      if (!response.ok) throw new Error('Neural Rendering Failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      alert("🎬 Mission Accomplished! Video exported to your System.");
    } catch (error) {
      console.error("Export Error:", error);
      alert("❌ Export Crashed! Check if backend is running FFmpeg.");
    } finally {
      // dispatch(setIsProcessing(false));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Project link copied to clipboard! 🔗");
  };

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Play size={18} fill="white" className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg">
            VisionAI <span className="text-blue-500 font-medium text-sm ml-1 uppercase">Editor</span>
          </span>
        </div>

        <div className="h-6 w-[1px] bg-zinc-800 mx-2"></div>

        {/* Project Name Input Area */}
        <div className="flex items-center gap-2 group">
          {isEditing ? (
            <input
              autoFocus
              className="bg-zinc-800 border border-blue-500 outline-none px-2 py-0.5 rounded text-sm text-white font-medium min-w-[150px]"
              value={projectName}
              onChange={handleNameChange}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="cursor-pointer hover:bg-zinc-800 px-2 py-0.5 rounded transition-colors group flex items-center gap-2"
            >
              <span className="text-sm text-zinc-400 font-medium group-hover:text-zinc-200">
                {projectName}
              </span>
              <ChevronDown size={14} className="text-zinc-600 group-hover:text-zinc-400" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <Share2 size={16} />
          Share
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-600/20 active:scale-95 group"
        >
          <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
          Export
        </button>
      </div>
    </header>
  );
};

export default Navbar;