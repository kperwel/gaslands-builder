import { useState, useEffect, useLayoutEffect } from "react";

function useDetectPrint() {
  const [isPrinting, toggleStatus] = useState(false);

  const print = () => {
    toggleStatus(true);
    setTimeout(window.print, 10);
  }

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const printMq = window.matchMedia && window.matchMedia("print");
    
    const mqEvent = (ev: MediaQueryListEvent) => toggleStatus(!!ev.matches);
    printMq.addEventListener("change", mqEvent);
    return () => {
      printMq.removeEventListener("change", mqEvent);
    };
  }, []);

  return [ isPrinting, print ] as const;
}

export default useDetectPrint;
