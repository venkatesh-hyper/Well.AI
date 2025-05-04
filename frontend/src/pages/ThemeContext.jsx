import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Load saved preference from localStorage (if any)
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("darkMode", darkMode);
    // Toggle class on <html> element for global styling
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
