import React, { useRef, useEffect, useState } from "react";
import { MaptilerLayer, MapStyle, Language } from '@maptiler/leaflet-maptilersdk';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  MapPin,
} from 'lucide-react';
import Error from "./Error";
import { useErrors } from "../context/ErrorContext";

const maptiler_key = import.meta.env.VITE_MAPTILER_API_KEY;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map({ locations }) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const mapTilerLayerRef = useRef(null);
    const markersRef = useRef([]);
    const markerZIndex = 1000;
    const [mapError, setMapError] = useState(false);
    const { addError } = useErrors();

    useEffect(() => {
        if (mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current).setView([20, 0], 1.5);

        if (mapTilerLayerRef.current) {
            mapTilerLayerRef.current.remove();
        }

        let mtLayer;
        try {
            mtLayer = new MaptilerLayer({
                apiKey: maptiler_key,
                maxZoom: 19,
                language: Language.ENGLISH,
            }).addTo(map);
        } catch (err) {
            addError("Error while trying to load the map. Please try again later.");
            setMapError(true);
            return;
        }

        mapTilerLayerRef.current = mtLayer;

        const handleTileError = () => {
            addError("Error while trying to load the map. Please try again later.");
            setMapError(true);
        };

        map.on('tileerror', handleTileError);

        mapInstanceRef.current = map;

        return () => {
            map.off('tileerror', handleTileError);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        try {
            if (locations && Array.isArray(locations)) {
                locations.forEach(loc => {
                    if (
                        loc.lat != null &&
                        loc.lng != null &&
                        loc.lat >= -90 &&
                        loc.lat <= 90 &&
                        loc.lng >= -180 &&
                        loc.lng <= 180
                    ) {
                        const marker = L.marker([loc.lat, loc.lng],
                            {
                                pane: "markerPane",
                                zIndexOffset: markerZIndex
                            }
                        )
                            .addTo(map)
                            .bindPopup(`${loc.name}, ${loc.country}`);
                        markersRef.current.push(marker);
                    }
                });
            }

        } catch(err) {
            addError("Couldn't place the location marker. Please try again later.")
        }
        
    }, [locations]);

    return (
        <>
            <section className="space-y-4 pb-20 md:pb-6">
                <div 
                id="map-container"
                ref={mapContainerRef}
                className="relative z-0 w-full h-[450px] rounded-3xl overflow-hidden border"
                >
                {mapError && (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <p className="text-sm text-center opacity-80">The map couldn't be loaded, please try again later</p>
                    </div>
                )}
                </div>
            </section>
        </>
    );
        
};
