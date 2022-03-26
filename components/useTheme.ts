import { useEffect, useState } from "react";

const isDarkPreferred = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
const getSavedTheme = () => localStorage.getItem("theme");

export default function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const initial =
      getSavedTheme() !== null ? getSavedTheme() === "dark" : isDarkPreferred();
    setIsDark(initial);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  return {
    isDark,
    toggleTheme,
  };
}
