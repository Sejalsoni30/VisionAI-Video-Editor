// src/config.js
// export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// frontend/src/config.js
const rawApiUrl = import.meta.env.VITE_API_URL;
const normalizedApiUrl = rawApiUrl
  ? rawApiUrl.replace(/\/+$/g, '').replace(/\/api$/i, '')
  : "http://localhost:5000";

export const API_URL = normalizedApiUrl;
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";