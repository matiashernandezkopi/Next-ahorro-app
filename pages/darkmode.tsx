"use client"

import * as React from "react"

export function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(true);

  React.useEffect(() => {
    // Recupera el estado del modo oscuro desde localStorage
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);

    // Aplica la clase "dark" al html según el estado del modo oscuro
    if (savedMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  React.useEffect(() => {
    // Guarda el estado del modo oscuro en localStorage
    localStorage.setItem('darkMode', String(isDarkMode));

    // Agrega o quita la clase "dark" al html según el estado del modo oscuro
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
    </button>
  )
}
