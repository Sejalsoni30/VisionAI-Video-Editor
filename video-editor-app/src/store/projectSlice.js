import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projectName: "VisionAI Project",
  assets: [],
  layers: [],
  tracks: [
    { id: 'track-1', name: 'Video Track 1', type: 'video', visible: true, locked: false },
    { id: 'track-2', name: 'Image Track 1', type: 'image', visible: true, locked: false },
    { id: 'track-3', name: 'Audio Track 1', type: 'audio', visible: true, locked: false }
  ],
  currentTime: 0,
  duration: 60,
  isPlaying: false,
  isProcessing: false, 
  selectedLayerId: null,
  zoomLevel: 10,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // --- 1. Playback & System ---
    setIsPlaying: (state, action) => { state.isPlaying = action.payload; },
    updateCurrentTime: (state, action) => { state.currentTime = action.payload; },
    setDuration: (state, action) => { state.duration = action.payload; },
    setIsProcessing: (state, action) => { state.isProcessing = action.payload; },

    // --- 2. Neural Style & Content Engine ---
    updateLayerStyle: (state, action) => {
      const { id, updates } = action.payload;
      const layer = state.layers.find(l => l.id === id);
      if (layer) {
        layer.style = { ...layer.style, ...updates };
      }
    },

    // ✨ TEXT CONTENT UPDATE (Ye missing tha!)
    updateLayerContent: (state, action) => {
      const { id, content } = action.payload;
      const layer = state.layers.find(l => l.id === id);
      if (layer) {
        layer.content = content;
      }
    },

    // --- 3. Asset Management ---
    addAsset: (state, action) => {
      if (!state.assets.find(a => a.id === action.payload.id)) {
        state.assets.push(action.payload);
      }
    },

    updateAsset: (state, action) => {
      const { id, updates } = action.payload;
      const asset = state.assets.find(a => a.id === id);
      if (asset) {
        Object.assign(asset, updates);
        console.log("✅ Redux Asset Updated");
      }
    },

    deleteAsset: (state, action) => {
      state.assets = state.assets.filter(a => a.id !== action.payload);
      state.layers = state.layers.filter(l => l.assetId !== action.payload);
    },

    // --- 4. Layer & Timeline Management ---
    addLayer: (state, action) => {
      const durationFallback = action.payload.duration > 0
        ? action.payload.duration
        : action.payload.type === 'video'
          ? 10
          : 5;

      const layerData = {
        ...action.payload,
        duration: durationFallback,
        style: action.payload.style || {
          x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, volume: 100
        }
      };
      state.layers.push(layerData);
    },

    updateLayerTime: (state, action) => {
      const { id, newStartTime, newDuration } = action.payload;
      const layer = state.layers.find(l => l.id === id);
      if (layer) {
        if (newStartTime !== undefined) layer.startTime = Math.max(0, newStartTime);
        if (newDuration !== undefined) layer.duration = newDuration;
      }
    },

    setSelectedLayer: (state, action) => {
      state.selectedLayerId = action.payload;
    },

    deleteLayer: (state, action) => {
      state.layers = state.layers.filter(l => l.id !== action.payload);
      if (state.selectedLayerId === action.payload) state.selectedLayerId = null;
    },

    // --- 5. Dynamic Track Engine ---
    addTrack: (state, action) => {
      const newTrack = {
        id: `track-${state.tracks.length + 1}`,
        name: action.payload.name || `New Track ${state.tracks.length + 1}`,
        type: action.payload.type || 'video',
        visible: true,
        locked: false
      };
      state.tracks.push(newTrack);
    },

    removeTrack: (state, action) => {
      state.tracks = state.tracks.filter(t => t.id !== action.payload);
      state.layers = state.layers.filter(l => l.trackId !== action.payload);
    },

    toggleTrackStatus: (state, action) => {
      const { id, property } = action.payload;
      const track = state.tracks.find(t => t.id === id);
      if (track) track[property] = !track[property];
    },

    // --- 6. Global Settings ---
    setZoomLevel: (state, action) => { state.zoomLevel = action.payload; },
    setProjectName: (state, action) => { state.projectName = action.payload; }
  }
});

// ✅ EXPORTS (Named properly for TextPanel to find them)
export const {
  setIsPlaying,
  updateCurrentTime,
  setDuration,
  setIsProcessing,
  updateLayerStyle,
  updateLayerContent, // 👈 Now exported with logic!
  addAsset,
  updateAsset,
  deleteAsset,
  addLayer,
  updateLayerTime,
  setSelectedLayer,
  deleteLayer,
  addTrack,
  removeTrack,
  toggleTrackStatus,
  setZoomLevel,
  setProjectName
} = projectSlice.actions;

export default projectSlice.reducer;