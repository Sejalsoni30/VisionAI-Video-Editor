require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const cors = require('cors');

// Example:
// const apiBaseUrl = import.meta.env.VITE_API_URL;
// Ab fetch/axios mein is variable ko use karo
// 📢 Routes Import
const videoRoutes = require('./src/routes/videoRoutes');

// 🔑 Firebase Admin Initialization
try {
    // 💡 Render ke liye Environment Variable check karega, local ke liye JSON file
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
        : require('./firebase-key.json');

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            // ✅ URL ekdum sahi hai!
            databaseURL: "https://video-editor-app-843fa-default-rtdb.firebaseio.com/" 
        });
        console.log(`🔥 Firebase Realtime DB: Connected Successfully!`);
    }
} catch (error) {
    console.error("❌ Firebase Init Error:", error.message);
}

const app = express();
const allowedOrigins = [
  "https://vision-ai-video-editor.vercel.app",
  "https://vision-ai-video-editor-git-main-sejalsoni30s-projects.vercel.app",
  "http://localhost:5173"
];
// ✅ CORS Configuration: Isse browser connection reset nahi karega
app.use(cors({
  origin: function (origin, callback) {
    // Allow if origin is in list or matches vercel.app
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Payload Limits: Badi videos ke liye zaroori
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// 📁 Ensure Folders: Local processing ke liye
const dirs = ['uploads', 'temp', 'public/music'].map(d => path.join(__dirname, d));
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Manual Header fix jo pehle work kar raha tha
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// 🌐 Static Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/temp', express.static(path.join(__dirname, 'temp')));
app.use('/music', express.static(path.join(__dirname, 'public/music')));

// 📢 Routes Integration
app.use('/video', videoRoutes);

app.get('/', (req, res) => res.json({ 
    message: "VisionAI: Cloud Edition is Running! 🚀",
    database: "Firebase Firestore Connected 🔥" 
}));


// ✅ Server Timeout Fix
const PORT = process.env.PORT || 5000;

// ✅ Server Timeout Fix & Deployment Friendly Logs
const server = app.listen(PORT, () => {
    // Agar hum Render par hain, toh localhost nahi dikhayenge
    const mode = process.env.NODE_ENV === 'production' ? 'Production' : 'Development';
    
    console.log(`🚀 Server running in ${mode} mode on port: ${PORT}`);
    console.log(`📂 Storage folders and API routes are ready!`);
    
    if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Local Link: http://localhost:${PORT}`);
    }
});

// 10 minutes timeout
server.timeout = 600000;