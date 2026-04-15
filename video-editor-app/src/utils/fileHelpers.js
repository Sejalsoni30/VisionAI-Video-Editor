/**
 * File size ko readable format mein badalta hai (e.g., 1.2 MB)
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check karta hai ki uploaded file allow hai ya nahi
 */
export const isValidMedia = (file) => {
  const validTypes = ['video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'audio/mpeg', 'audio/wav'];
  return validTypes.includes(file.type);
};

/**
 * File ko Data URL mein badalta hai (Preview ke liye)
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};