import { useEffect, useState } from 'react';

const useTheme = (): [string, () => void] => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storeTheme = window.localStorage.getItem('theme');
    const root = document.documentElement;
    if (storeTheme) {
      setTheme(storeTheme);
      root.className = storeTheme;
    } else {
      root.className = 'light';
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const value = prevTheme === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('theme', value);
      const root = document.documentElement;
      root.className = value;
      return value;
    });
  };

  return [theme, toggleTheme];
};

export default useTheme;
