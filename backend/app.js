require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const cors = require('cors');

// 📢 Routes Import
const videoRoutes = require('./src/routes/videoRoutes');

// 🔑 Firebase Admin Initialization
try {
    const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT;
    let serviceAccount;

    if (rawKey) {
        const cleanKey = rawKey.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim(); 
        serviceAccount = JSON.parse(cleanKey);
        
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
    } else {
        serviceAccount = require('./firebase-key.json');
    }

    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
            // ✅ RTDB URL yahan se hata di gayi hai
        });
        console.log(`🔥 Firebase Firestore: Initialized Successfully!`);
    }
} catch (error) {
    console.error("❌ Firebase Init Error:", error.message);
}

// 🚩 YE CHANGE HAI: Initialize ke BAAD db declare karna hai
const db = admin.firestore(); 

const app = express();

// ... (Baki saara CORS aur Middleware wala code jo tumne likha tha, wo same rahega)
// Bas yaad se app.use('/video', videoRoutes) ke upar ye db export kar dena agar controller mein use karna hai

const allowedOrigins = [
  "https://vision-ai-video-editor.vercel.app",
  "https://vision-ai-video-editor-git-main-sejalsoni30s-projects.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
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

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const dirs = ['uploads', 'temp', 'public/music'].map(d => path.join(__dirname, d));
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/temp', express.static(path.join(__dirname, 'temp')));
app.use('/music', express.static(path.join(__dirname, 'public/music')));

app.use('/video', videoRoutes);

app.get('/', (req, res) => res.json({
  message: "VisionAI: Cloud Edition is Running! 🚀",
  database: "Firebase Firestore Active 🔥"
}));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  const mode = process.env.NODE_ENV === 'production' ? 'Production' : 'Development';
  console.log(`🚀 Server running in ${mode} mode on port: ${PORT}`);
});

server.timeout = 600000;

// Exporting DB to use in videoController
module.exports = { db };