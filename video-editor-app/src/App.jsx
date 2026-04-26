import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login';
import TermsPage from './components/Auth/TermsPage';

function App() {
  return (
    <Router>
      <div className="app-main-wrapper font-inter bg-[#020203]">
        <Routes>
          {/* 1. Default Page: Ab seedha Register khulega (या Login) */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/login" element={<Login />} />

          {/* 2. Success Redirect: '/dashboard' ka rasta ab official hai */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 3. Baki functionality */}
          <Route path="/projects" element={<Dashboard />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* 4. 404 Protection: Agar koi galat URL dale toh dashboard par bhej do */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;