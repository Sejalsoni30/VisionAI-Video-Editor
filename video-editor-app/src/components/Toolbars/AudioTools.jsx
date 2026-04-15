import React from 'react';
import { Volume2, Mic, Activity, Wind, Music2 } from 'lucide-react';
import IconButton from '../Common/IconButton';

const AudioTools = () => {
  return (
    <div className="flex items-center gap-2 p-2 bg-zinc-900/50 rounded-xl border border-zinc-800">
      <div className="flex items-center gap-1 px-2 border-r border-zinc-800">
        <IconButton icon={Mic} tooltip="Record Voiceover" />
        <IconButton icon={Music2} tooltip="Add Background Music" />
      </div>
      
      <div className="flex items-center gap-1 px-2 border-r border-zinc-800">
        <IconButton icon={Wind} tooltip="Noise Reduction" />
        <IconButton icon={Activity} tooltip="Equalizer" />
      </div>

      <div className="flex items-center gap-1 px-2">
        <IconButton icon={Volume2} tooltip="Volume Fade In/Out" />
      </div>
    </div>
  );
};

export default AudioTools;