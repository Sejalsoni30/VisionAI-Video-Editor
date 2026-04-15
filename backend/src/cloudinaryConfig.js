const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,      // 👈 Check karo ye spelling sahi hai?
  api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log("Cloudinary Config Check:", process.env.CLOUDINARY_API_KEY ? "Key Found ✅" : "Key Missing ❌");
module.exports = cloudinary;