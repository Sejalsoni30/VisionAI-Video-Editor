import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="app-main-wrapper font-inter">
        <Routes>
          {/* Main Dashboard - Projects List */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Dashboard />} />
          {/* Main Editing Interface */}
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;