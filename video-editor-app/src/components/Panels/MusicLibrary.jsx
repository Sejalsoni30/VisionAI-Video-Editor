import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addLayer } from '../../store/projectSlice'; // Path check kar lena apne hisab se
import { Play, Pause, Plus, Music } from 'lucide-react';

const MusicLibrary = () => {
  const [songs, setSongs] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [audio] = useState(new Audio());
  const dispatch = useDispatch();

  useEffect(() => {
    // 🌐 Backend se data fetch karna
    fetch('http://localhost:5000/video/music-library')
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(err => console.error("Error fetching music:", err));
  }, []);

  const togglePlay = (song) => {
    if (playingId === song.id) {
      audio.pause();
      setPlayingId(null);
    } else {
      audio.src = song.url;
      audio.play();
      setPlayingId(song.id);
    }
  };

  const handleAddMusic = (song) => {
    dispatch(addLayer({
      id: crypto.randomUUID(),
      assetId: song.id,
      name: song.name,
      url: song.url,
      type: 'audio', 
      startTime: 0,
      duration: 30 // seconds
    }));
  };

  return (
    <div className="h-full bg-[#18181b] flex flex-col">
      <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
        <Music size={16} className="text-blue-500" />
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Music Library</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {songs.map((song) => (
          <div key={song.id} className="group flex items-center justify-between p-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => togglePlay(song)}
                className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded-full text-white hover:bg-blue-600"
              >
                {playingId === song.id ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <div>
                <p className="text-sm text-zinc-200 truncate w-32 font-medium">{song.name}</p>
                <p className="text-[10px] text-zinc-500">{song.duration}</p>
              </div>
            </div>
            <button 
              onClick={() => handleAddMusic(song)}
              className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-all"
            >
              <Plus size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicLibrary;