import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Phone, Globe, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Hospital {
  name: string;
  distance: number;
  phone: string;
  type: string;
  address: string;
  coordinates: { lat: number; lng: number };
  website: string;
  opening_hours: string;
}

interface HospitalLocatorProps {
  showList?: boolean;
}

export const HospitalLocator = ({ showList = false }: HospitalLocatorProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const hospitalMarkersRef = useRef<L.Marker[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Default view (before location is found)
    mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // India center

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance.current);

    // Prompt for location on load if permission is not determined yet
    if (navigator.geolocation) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
                handleLocate();
            } else if (result.state === 'prompt') {
                // Wait for user action
            }
        });
    }

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  const fetchHospitals = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/nearby-hospitals', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      });
      const data = await res.json();
      
      if (data.status === 'ok') {
        setHospitals(data.hospitals);
        updateMapMarkers(data.hospitals, lat, lng);
      }
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMapMarkers = (hospitalList: Hospital[], userLat: number, userLng: number) => {
    if (!mapInstance.current) return;

    // Clear existing hospital markers
    hospitalMarkersRef.current.forEach(marker => marker.remove());
    hospitalMarkersRef.current = [];

    // Add User Marker
    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = L.marker([userLat, userLng], {
      icon: L.divIcon({
        className: 'bg-blue-600 rounded-full border-2 border-white shadow-lg w-4 h-4',
        iconSize: [16, 16]
      })
    })
    .addTo(mapInstance.current)
    .bindPopup("You are here")
    .openPopup();

    // Add Hospital Markers
    const bounds = L.latLngBounds([[userLat, userLng]]);
    
    hospitalList.forEach(h => {
      const marker = L.marker([h.coordinates.lat, h.coordinates.lng])
        .addTo(mapInstance.current!)
        .bindPopup(`
          <div class="p-1">
            <h3 class="font-bold text-sm">${h.name}</h3>
            <p class="text-xs text-slate-500">${h.type} • ${h.distance}km</p>
          </div>
        `);
        
      marker.on('click', () => setSelectedHospital(h));
      hospitalMarkersRef.current.push(marker);
      bounds.extend([h.coordinates.lat, h.coordinates.lng]);
    });

    // Fit map to show all markers
    mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchHospitals(latitude, longitude);
      },
      (error) => {
        setLoading(false);
        console.error(error);
        if (error.code === 1) {
            alert("Please allow location access to find nearby hospitals.");
        } else {
            alert("Unable to retrieve your location. Please check your connection.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const focusHospital = (h: Hospital) => {
      setSelectedHospital(h);
      if (mapInstance.current) {
          mapInstance.current.setView([h.coordinates.lat, h.coordinates.lng], 16);
          // Find marker and open popup
          // This is a bit simplified; ideally we'd map hospital IDs to markers
      }
  };

  return (
    <div className={`grid ${showList ? 'grid-cols-1 lg:grid-cols-3 gap-6 h-full' : 'h-full'}`}>
        <Card className={`overflow-hidden flex flex-col relative ${showList ? 'lg:col-span-2' : 'h-full'}`}>
        <CardHeader className="pb-2 bg-white z-10 shadow-sm">
            <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Hospital Locator
            </div>
            <Button size="sm" onClick={handleLocate} disabled={loading} className="gap-2">
                {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                <Navigation className="h-4 w-4" />
                )}
                {loading ? "Locating..." : "Find Nearby"}
            </Button>
            </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 relative flex-1 min-h-[300px]">
            <div ref={mapRef} className="absolute inset-0 z-0" />
            
            {/* Hospital Details Overlay - Only show if list is NOT shown (otherwise detail is redundant or can be handled differently) 
                Actually, keeping it consistent is fine, or hiding it on large screens if list is present.
                Let's keep it for map interaction context.
            */}
            {selectedHospital && !showList && (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 z-10 border border-slate-100 animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-slate-900">{selectedHospital.name}</h3>
                    <p className="text-xs text-slate-500">{selectedHospital.type} • {selectedHospital.distance} km away</p>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedHospital(null)}>×</Button>
                </div>
                
                <div className="space-y-2 text-sm">
                <p className="text-slate-600 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    {selectedHospital.address}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                    {selectedHospital.phone && selectedHospital.phone !== 'Contact: N/A' && (
                    <Button size="sm" variant="outline" className="h-8 gap-2 text-xs" onClick={() => window.open(`tel:${selectedHospital.phone}`)}>
                        <Phone className="h-3 w-3" /> Call
                    </Button>
                    )}
                    <Button size="sm" className="h-8 gap-2 text-xs" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.coordinates.lat},${selectedHospital.coordinates.lng}`)}>
                    <Navigation className="h-3 w-3" /> Directions
                    </Button>
                </div>
                </div>
            </div>
            )}
        </CardContent>
        </Card>

        {/* List View - Only visible if showList is true */}
        {showList && (
            <Card className="flex flex-col h-full overflow-hidden">
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-lg">Nearby Facilities</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                    {hospitals.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {hospitals.map((h, i) => (
                                <div 
                                    key={i} 
                                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${selectedHospital?.name === h.name ? 'bg-blue-50' : ''}`}
                                    onClick={() => focusHospital(h)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{h.name}</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">{h.type}</p>
                                        </div>
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap">
                                            {h.distance} km
                                        </span>
                                    </div>
                                    <div className="mt-3 text-sm text-slate-600 space-y-1">
                                        <p className="flex items-start gap-2 text-xs">
                                            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                                            {h.address}
                                        </p>
                                        {h.phone && h.phone !== 'Contact: N/A' && (
                                            <p className="flex items-center gap-2 text-xs">
                                                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                {h.phone}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                         <Button size="sm" variant="outline" className="h-7 text-xs w-full" onClick={(e) => {
                                             e.stopPropagation();
                                             window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.coordinates.lat},${h.coordinates.lng}`);
                                         }}>
                                            Get Directions
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500">
                            <MapPin className="h-10 w-10 text-slate-300 mb-2" />
                            <p>Click "Find Nearby" to see hospitals list</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );
};
