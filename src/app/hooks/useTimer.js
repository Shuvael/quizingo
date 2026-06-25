"use client";
import { useState, useRef, useCallback } from "react";

export function useTimer(standardWert = 20) {
  const [timer, setTimer] = useState(standardWert);
  const intervalRef = useRef(null);

  const starten = useCallback((startWert) => {
    const wert = startWert ?? standardWert;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimer(wert);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [standardWert]);

  const stoppen = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return { timer, starten, stoppen };
}