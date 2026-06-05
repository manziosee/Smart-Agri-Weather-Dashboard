"use client";
import { useEffect } from "react";

interface Coords {
  lat: number;
  lon: number;
  name: string;
}

export function useAutoLocation(onLocation: (c: Coords) => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("fp_location_set")) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name: "My Location",
          });
          localStorage.setItem("fp_location_set", "1");
        },
        () => {
          fetch("/api/ip-lookup")
            .then((r) => r.json())
            .then((d) => {
              if (d.lat && d.lon) {
                onLocation({ lat: d.lat, lon: d.lon, name: d.city ?? "My Region" });
                localStorage.setItem("fp_location_set", "1");
              }
            })
            .catch(() => {});
        }
      );
    }
  }, [onLocation]);
}
