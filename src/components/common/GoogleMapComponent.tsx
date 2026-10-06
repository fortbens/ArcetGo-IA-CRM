import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ExternalLink, RefreshCw, AlertCircle, Eye } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  title: string;
  lat: number;
  lng: number;
  address?: string;
  price?: number;
  imageUrl?: string;
  badge?: string;
  stopNumber?: number;
  status?: string;
}

interface GoogleMapComponentProps {
  apiKey?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarkerItem[];
  showRoutePolyline?: boolean;
  enableStreetView?: boolean;
  height?: string;
  className?: string;
  onMarkerClick?: (marker: MapMarkerItem) => void;
  selectedMarkerId?: string;
}

const DEFAULT_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCk8YD2IdrpiCbzFhAelGVGnP3rsI9xbSM';

// Default center: Jardins / Av. Paulista, São Paulo
const DEFAULT_CENTER = { lat: -23.5615, lng: -46.6559 };

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  apiKey = DEFAULT_MAPS_KEY,
  center = DEFAULT_CENTER,
  zoom = 14,
  markers = [],
  showRoutePolyline = false,
  enableStreetView = true,
  height = '420px',
  className = '',
  onMarkerClick,
  selectedMarkerId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const streetViewContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'streetview'>('map');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const streetViewPanoramaRef = useRef<any>(null);

  // Load Google Maps JavaScript API
  useEffect(() => {
    if (!apiKey) {
      setLoadError('Chave de API do Google Maps não configurada.');
      return;
    }

    if ((window as any).google && (window as any).google.maps) {
      setMapLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => setMapLoaded(true));
      existingScript.addEventListener('error', () => setLoadError('Falha ao carregar a biblioteca do Google Maps.'));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setLoadError('Não foi possível carregar o Google Maps. Verifique sua conexão e chave de API.');
    document.head.appendChild(script);
  }, [apiKey]);

  // Initialize or update Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !(window as any).google?.maps) return;

    const google = (window as any).google;

    // Create map if not exists
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        mapTypeId: mapType,
        streetViewControl: enableStreetView,
        fullscreenControl: true,
        mapTypeControl: false,
        zoomControl: true,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'on' }] }
        ]
      });

      infoWindowRef.current = new google.maps.InfoWindow();
    } else {
      mapInstanceRef.current.setMapTypeId(mapType);
    }

    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const bounds = new google.maps.LatLngBounds();
    const routeCoords: any[] = [];

    // Add new markers
    markers.forEach((item, index) => {
      const position = { lat: item.lat, lng: item.lng };
      routeCoords.push(position);
      bounds.extend(position);

      const isSelected = selectedMarkerId === item.id;

      // Custom marker label or icon
      const marker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: item.title,
        label: item.stopNumber ? {
          text: String(item.stopNumber),
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '12px'
        } : undefined,
        animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
        icon: item.stopNumber ? {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: isSelected ? '#16a34a' : '#2563eb',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        } : undefined
      });

      marker.addListener('click', () => {
        if (onMarkerClick) onMarkerClick(item);

        const content = `
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px; max-width: 240px; color: #0f172a;">
            ${item.imageUrl ? `<img src="${item.imageUrl}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />` : ''}
            <div style="font-size: 13px; font-weight: bold; line-height: 1.2;">${item.title}</div>
            ${item.address ? `<div style="font-size: 11px; color: #64748b; margin-top: 4px;">📍 ${item.address}</div>` : ''}
            ${item.price ? `<div style="font-size: 13px; font-weight: 800; color: #16a34a; margin-top: 6px;">R$ ${item.price.toLocaleString('pt-BR')}</div>` : ''}
            <div style="margin-top: 8px; display: flex; gap: 6px;">
              <a href="https://maps.google.com/?q=${item.lat},${item.lng}" target="_blank" style="flex: 1; text-align: center; background: #2563eb; color: #fff; font-size: 11px; font-weight: bold; padding: 6px 8px; border-radius: 6px; text-decoration: none;">Abrir no Maps</a>
              <a href="https://waze.com/ul?ll=${item.lat},${item.lng}&navigate=yes" target="_blank" style="flex: 1; text-align: center; background: #0284c7; color: #fff; font-size: 11px; font-weight: bold; padding: 6px 8px; border-radius: 6px; text-decoration: none;">Waze</a>
            </div>
          </div>
        `;

        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    // Draw route polyline if requested
    if (showRoutePolyline && routeCoords.length > 1) {
      polylineRef.current = new google.maps.Polyline({
        path: routeCoords,
        geodesic: true,
        strokeColor: '#2563EB',
        strokeOpacity: 0.85,
        strokeWeight: 4,
        map: mapInstanceRef.current
      });
    }

    // Adjust viewport to fit markers
    if (markers.length > 1) {
      mapInstanceRef.current.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    } else if (markers.length === 1) {
      mapInstanceRef.current.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
      mapInstanceRef.current.setZoom(15);
    }
  }, [mapLoaded, markers, center, zoom, mapType, showRoutePolyline, selectedMarkerId]);

  // Street view init
  useEffect(() => {
    if (activeTab === 'streetview' && streetViewContainerRef.current && (window as any).google?.maps) {
      const google = (window as any).google;
      const targetPos = markers[0] ? { lat: markers[0].lat, lng: markers[0].lng } : center;

      streetViewPanoramaRef.current = new google.maps.StreetViewPanorama(streetViewContainerRef.current, {
        position: targetPos,
        pov: { heading: 165, pitch: 0 },
        zoom: 1
      });
    }
  }, [activeTab, center, markers]);

  if (loadError) {
    return (
      <div 
        style={{ height }} 
        className={`w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center text-center text-white ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-slate-200">Google Maps Platform</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">{loadError}</p>
        <div className="mt-4 flex gap-2">
          <a
            href={`https://maps.google.com/?q=${center.lat},${center.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir no Google Maps Web</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100 ${className}`}>
      {/* Top Map Controls Bar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => { setActiveTab('map'); setMapType('roadmap'); }}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
            activeTab === 'map' && mapType === 'roadmap' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          Mapa
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('map'); setMapType('satellite'); }}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
            activeTab === 'map' && mapType === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          Satélite
        </button>
        {enableStreetView && (
          <button
            type="button"
            onClick={() => setActiveTab('streetview')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'streetview' ? 'bg-amber-500 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Street View</span>
          </button>
        )}
      </div>

      {/* Markers Counter Badge */}
      {markers.length > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1.5 border border-slate-700">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>{markers.length} {markers.length === 1 ? 'Ponto Mapeado' : 'Paradas no Itinerário'}</span>
        </div>
      )}

      {/* Main Google Maps Canvas */}
      <div
        ref={mapContainerRef}
        style={{ height, display: activeTab === 'map' ? 'block' : 'none' }}
        className="w-full h-full"
      />

      {/* Street View Panorama Container */}
      <div
        ref={streetViewContainerRef}
        style={{ height, display: activeTab === 'streetview' ? 'block' : 'none' }}
        className="w-full h-full bg-slate-900"
      />

      {/* Loading Indicator */}
      {!mapLoaded && (
        <div 
          style={{ height }} 
          className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-slate-500 gap-2 text-xs"
        >
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="font-semibold">Carregando mapa interativo do Google Maps...</span>
        </div>
      )}
    </div>
  );
};
