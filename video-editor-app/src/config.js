// src/config.js

// 1. Raw URL uthao (.env se ya default localhost)
// Dhyaan rakho: Vercel settings mein VITE_API_URL ki value "https://visionai-video-editor.onrender.com/api" honi chahiye
const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 2. Sirf aakhiri slash (/) hatao agar galti se lag gaya ho, baaki kuch nahi chhedna
export const API_URL = rawApiUrl.replace(/\/+$/, "");

// 3. Google API Key (Picker/Drive ke liye)
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";