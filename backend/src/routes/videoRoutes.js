const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const videoController = require('../controllers/videoController');

// 📁 Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// ✅ Advanced Multer Setup
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 100 * 1024 * 1024 // 100MB
    },
    fileFilter: (req, file, cb) => {
        // Sirf zaroori files allow karo
        const filetypes = /mp4|mov|avi|mkv|png|jpg|jpeg|mp3|wav/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports video/image/audio formats!"));
    }
});

// 🛠️ Error Handling Middleware (Special for Multer)
// Isse Connection Reset nahi hoga, balki proper 400 error aayega
const handleUpload = (req, res, next) => {
    const uploadSingle = upload.single('video');

    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: "File too large! Max limit is 100MB." });
            }
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

// 📤 1. Cloudinary Upload Route (Updated with error handler)
router.post('/upload', handleUpload, videoController.uploadVideo);

// 💾 2. Firebase Export Route
router.post('/export', videoController.exportProject);

// ✂️ 3. Editing Routes
router.post('/trim', videoController.trimVideo);
router.post('/speed', videoController.changeSpeed);
router.post('/volume', videoController.adjustVolume);
router.post('/rotate', videoController.rotateVideo);
router.post('/split', videoController.splitVideo);
router.post('/resize', videoController.resizeVideo);
router.post('/filter', videoController.applyFilter);
router.post('/add-text', videoController.addText);

// 🎵 4. Library & Merge
router.get('/music-library', videoController.getMusicLibrary);
router.post('/merge', videoController.mergeVideos);

module.exports = router;