// src/components/ServiceAreaMap.tsx
"use client";

import { useEffect, useRef } from "react";
const locations = [
  { name: "Ocala", lat: 29.1872, lng: -82.1401 },
  { name: "Belleview", lat: 29.0553, lng: -82.0623 },
  { name: "The Villages", lat: 28.927, lng: -81.9728 },
];

export default function ServiceAreaMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any;

    async function initMap() {
      if (!mapRef.current) return;

      const L = (await import("leaflet")).default;

      // FIX marker icon paths for Next.js
      const DefaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      L.Marker.prototype.options.icon = DefaultIcon;

      map = L.map(mapRef.current, {
        center: [29.05, -82.05],
        zoom: 9,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      locations.forEach((loc) => {
        L.marker([loc.lat, loc.lng]).addTo(map).bindPopup(loc.name);
      });
    }

    initMap();

    return () => {
      if (map) map.remove();
    };
  }, []);

  return (
    <section
      aria-labelledby="service-area-map"
      className="mt-12 mb-12 max-w-4xl mx-auto space-y-4"
    >
      <h2
        id="service-area-map"
        className="text-2xl md:text-3xl font-semibold text-center"
      >
        Our Service Area
      </h2>

      <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
        We provide on-site and remote support across Ocala, Belleview, The
        Villages, and nearby Central Florida communities.
      </p>

      <div
        ref={mapRef}
        className="w-full aspect-[16/9] rounded-lg overflow-hidden
                   border border-gray-300 dark:border-gray-700 shadow-md"
      />

      <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
        Map data © OpenStreetMap contributors
      </p>
    </section>
  );
}

export { ServiceAreaMap };
