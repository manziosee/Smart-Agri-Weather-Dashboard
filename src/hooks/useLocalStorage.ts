"use client";
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch {}
  }, [key]);

  function set(val: T) {
    setValue(val);
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }

  return [value, set] as const;
}
