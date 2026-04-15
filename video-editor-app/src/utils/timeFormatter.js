/**
 * Seconds ko HH:MM:SS:FF (Frames) ya HH:MM:SS format mein badalta hai
 * @param {number} seconds - Total duration in seconds
 * @param {boolean} includeFrames - Kya frames bhi dikhane hain?
 */
export const formatTime = (seconds, includeFrames = true) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours().toString().padStart(2, '0');
  const mm = date.getUTCMinutes().toString().padStart(2, '0');
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  
  if (!includeFrames) {
    return `${hh}:${mm}:${ss}`;
  }

  // Maan lete hain editor 30 FPS par chal raha hai
  const frames = Math.floor((seconds % 1) * 30).toString().padStart(2, '0');
  
  return `${hh}:${mm}:${ss}:${frames}`;
};

/**
 * Seconds ko "2m 15s" jaise short format mein badalta hai
 */
export const formatShortTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};