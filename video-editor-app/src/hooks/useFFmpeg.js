import { useState, useEffect, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const useFFmpeg = () => {
  const [ready, setReady] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;

    // FFmpeg log messages handle karne ke liye
    ffmpeg.on('log', ({ message }) => {
      console.log("FFmpeg Log:", message);
    });

    // Core files load karna
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  return { 
    ffmpeg: ffmpegRef.current, 
    ready 
  };
};