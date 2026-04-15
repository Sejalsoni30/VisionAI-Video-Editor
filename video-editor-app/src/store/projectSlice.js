import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projectName: "Untitled Project",
  assets: [],           // Uploaded files {id, name, type, url}
  layers: [],           // Timeline tracks {id, assetId, startTime, duration, type}
  currentTime: 0,
  selectedLayerId: null,
  isExporting: false,
  zoomLevel: 10,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // --- 1. Media Assets ---
    addAsset: (state, action) => {
      state.assets.push(action.payload);
    },

    // ♻️ REPLACEMENT LOGIC: Overlap text/box ko rokne ke liye
    updateAsset: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.assets.findIndex(a => a.id === id);

      if (index !== -1) {
        // Naya asset add karne ki bajaye purane ko overwrite karo
        state.assets[index] = { ...state.assets[index], ...updates };

        // Sabhi layers ko refresh signal bhejo jo is asset ko use kar rahi hain
        state.layers = state.layers.map(layer =>
          layer.assetId === id ? { ...layer, lastUpdated: Date.now() } : layer
        );
      }
    },

    deleteAsset: (state, action) => {
      state.assets = state.assets.filter(asset => asset.id !== action.payload);
      state.layers = state.layers.filter(layer => layer.assetId !== action.payload);
      if (state.selectedLayerId === action.payload) state.selectedLayerId = null;
    },

    // --- 2. Timeline Layers ---
    addLayer: (state, action) => {
      state.layers.push(action.payload);
    },

    // 🛡️ COLLISION PREVENTION: Clips ko ek doosre ke upar collapse hone se rokna
    updateLayerPosition: (state, action) => {
      const { id, x, y } = action.payload;
      const layer = state.layers.find(l => l.id === id);
      if (layer) {
        // Agar style object nahi hai toh bana do
        if (!layer.style) layer.style = { fontSize: 32, color: '#ffffff' };

        // Position update karo
        layer.style.x = x;
        layer.style.y = y;
      }
    },

    // projectSlice.js ke andar
    updateLayerContent: (state, action) => {
      const { id, content } = action.payload;
      const layer = state.layers.find(l => l.id === id);
      if (layer) {
        layer.content = content; // Isse naam change hoga
      }
    },

    setSelectedLayer: (state, action) => {
      state.selectedLayerId = action.payload;
    },

    deleteLayer: (state, action) => {
      state.layers = state.layers.filter(l => l.id !== action.payload);
      if (state.selectedLayerId === action.payload) state.selectedLayerId = null;
    },

    // --- 3. Playback & UI State ---
    updateCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setZoomLevel: (state, action) => {
      state.zoomLevel = action.payload;
    },
    setProjectName: (state, action) => {
      state.projectName = action.payload;
    },
    // store/projectSlice.js
    addTrack: (state, action) => {
      // 1. Pehle ek naya track object bana lo
      const newTrack = {
        id: `track-${(state.tracks?.length || 0) + 1}`,
        type: action.payload?.type || 'audio',
        name: action.payload?.name || 'New Track'
      };

      // 2. 🔥 Sabse safe tarika: Naye array se state replace karo
      // Isse 'undefined' wala error kabhi nahi aayega
      state.tracks = state.tracks ? [...state.tracks, newTrack] : [newTrack];

      console.log("✅ Track added safely!");
    },
    updateLayerTime: (state, action) => {
      const { id, newStartTime } = action.payload;
      const movingLayer = state.layers.find(l => l.id === id);

      if (movingLayer) {
        const duration = movingLayer.duration || 5;
        const newEndTime = newStartTime + duration;

        // Collision check: Kya doosri clip se takkar ho rahi hai?
        const collision = state.layers.find(l =>
          l.id !== id &&
          l.trackId === movingLayer.trackId && // Sirf usi track par collision check karein
          ((newStartTime >= l.startTime && newStartTime < (l.startTime + l.duration)) ||
            (newEndTime > l.startTime && newEndTime <= (l.startTime + l.duration)) ||
            (newStartTime <= l.startTime && newEndTime >= (l.startTime + l.duration)))
        );

        if (collision) {
          console.log("🚫 Collision detected! Snapping.");
          if (newStartTime < collision.startTime) {
            movingLayer.startTime = Math.max(0, collision.startTime - duration);
          } else {
            movingLayer.startTime = collision.startTime + collision.duration;
          }
        } else {
          movingLayer.startTime = Math.max(0, newStartTime);
        }
      }
    },
    // ✅ Propagates selection to all components
    selectAsset: (state, action) => {
      const id = action.payload;
      console.log(`🧠 Selection received in store for ID: ${id}`);
      state.selectedLayerId = id;
      
      // If assets array is used in tandem with layers
      if (state.assets && Array.isArray(state.assets)) {
          state.assets = state.assets.map(a => ({ ...a, selected: a.id === id }));
      }
      
      // Important to maintain layers array sync if not derived from tracks
      if (state.layers && Array.isArray(state.layers)) {
          state.layers = state.layers.map(l => ({ ...l, selected: l.id === id }));
      }
    },
    removeTrack: (state, action) => {
      // 1. Us track ko array se bahar nikalo
      state.tracks = state.tracks.filter(t => t.id !== action.payload);

      // 2. 💡 Pro Logic: Us track ke andar jitni clips (layers) thi, unhe bhi delete kar do
      state.layers = state.layers.filter(l => l.trackId !== action.payload);
    }
  }

});

export const {
  updateLayerTime,
  updateLayerContent,
  addAsset,
  updateAsset,
  deleteAsset,
  addLayer,
  updateLayerPosition,
  setSelectedLayer,
  deleteLayer,
  updateCurrentTime,
  setZoomLevel,
  setProjectName,
  addTrack,
  selectAsset,
  removeTrack // Add Track action export kiya
} = projectSlice.actions;

export default projectSlice.reducer;