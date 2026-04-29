const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const multer = require('multer');

// Temp storage setup
const upload = multer({ dest: 'uploads/' });
const uploadMemory = multer({ storage: multer.memoryStorage() });

// --- 🎬 1. STREAMING & ASSETS ---
// Path: /api/video/stream/:fileId
router.get('/stream/:fileId', videoController.streamVideo);

// Path: /api/video/upload-to-drive
router.post('/upload-to-drive', upload.single('file'), videoController.uploadToDrive);

// Path: /api/video/upload-temp
router.post('/upload-temp', uploadMemory.single('file'), videoController.uploadTempFile);

// Path: /api/video/music-library
router.get('/music-library', videoController.getMusicLibrary);


// --- ✂️ 2. EDITING ACTIONS ---
router.post('/trim', videoController.trimVideo);
router.post('/speed', videoController.changeSpeed);
router.post('/volume', videoController.adjustAudio); 
router.post('/rotate', videoController.rotateVideo);
router.post('/flip', videoController.flipVideo);
router.post('/filter', videoController.applyFilter);
router.post('/add-text', videoController.addText);
router.post('/merge', videoController.mergeVideos);

// --- 📤 3. PROJECT MANAGEMENT ---
router.post('/export', videoController.exportProject);

module.exports = router;