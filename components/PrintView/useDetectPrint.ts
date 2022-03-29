import { useState, useEffect } from "react";

function useDetectPrint() {
  const [isPrinting, toggleStatus] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const printMq = window.matchMedia && window.matchMedia("print");
    const mqEvent = (ev: MediaQueryListEvent) => toggleStatus(!!ev.matches);

    printMq.addEventListener("change", mqEvent);
    return () => printMq.removeEventListener("change", mqEvent);
  }, []);

  return isPrinting;
}

export default useDetectPrint;
