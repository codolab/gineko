import * as React from "react";
import {
  createContext,
  useState,
  useLayoutEffect,
  useContext,
  useCallback,
} from "react";
import { useMutationObserver } from "hooks";

const SettingsContext = createContext();
SettingsContext.displayName = "SettingsContext";

const html =
  document.documentElement || document.getElementsByTagName("html")[0];

function checkDarkMode() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return true;
  }
  return false;
}

function applyMode(darkModeOn) {
  if (darkModeOn) {
    html.dataset.ginekoTheme = "dark";
  } else {
    html.dataset.ginekoTheme = "light";
  }
}

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

export default function SettingsContextController({ children }) {
  const [theme, setTheme] = useState(html.dataset.colorMode || "light");

  const mutationCallback = useCallback((mutationsList) => {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes") {
        const newTheme = html.dataset.colorMode || "light";
        setTheme(newTheme);
      }
    }
  }, [setTheme]);

  useMutationObserver({ current: html }, mutationCallback, {
    attributes: true,
  });

  useLayoutEffect(() => {
    function handleDarkMode(e) {
      const darkModeOn = e.matches;
      applyMode(darkModeOn);
    }

    switch (theme) {
      case "light":
        darkModeMediaQuery.removeListener(handleDarkMode);
        html.dataset.ginekoTheme = "light";
        break;
      case "dark":
        darkModeMediaQuery.removeListener(handleDarkMode);
        html.dataset.ginekoTheme = "dark";
        break;
      case "auto":
        applyMode(checkDarkMode());
        darkModeMediaQuery.addListener(handleDarkMode);
        break;
      default:
        break;
    }

    return () => {
      darkModeMediaQuery.addListener(handleDarkMode);
    };
  }, [theme]);

  return (
    <SettingsContext.Provider value={null}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
