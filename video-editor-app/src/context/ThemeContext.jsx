import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Context Create Karo
const ThemeContext = createContext();

// 2. Provider Component Banaiye
export const ThemeProvider = ({ children }) => {
  // LocalStorage se purani theme check karein, default 'dark' rakhein
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Jab bhi darkMode change ho, use document par apply karein aur localStorage mein save karein
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Custom Hook banaiye taaki use karna easy ho
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};