// components/property-map.tsx
'use client'

import { useEffect, useRef, useState } from 'react';
import { googleConfig } from '../apps/web/lib/google-config';
interface PropertyMapProps {
  address?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  height?: string;
}

export function PropertyMap({ address, onLocationSelect, height = '400px' }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar el script de Google Maps
  useEffect(() => {
    if (!googleConfig.mapsApiKey) {
      console.error('API Key de Google Maps no configurada');
      return;
    }

    // Verificar si ya está cargado
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Cargar el script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleConfig.mapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Inicializar el mapa
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: -0.1807, lng: -78.4678 }, // Quito, Ecuador
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    setMap(mapInstance);

    // Agregar click listener si se permite selección
    if (onLocationSelect) {
      mapInstance.addListener('click', async (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat() || 0;
        const lng = e.latLng?.lng() || 0;

        // Obtener dirección desde coordenadas
        const geocoder = new google.maps.Geocoder();
        try {
          const result = await geocoder.geocode({ location: { lat, lng } });
          const address = result.results[0]?.formatted_address || 'Dirección desconocida';
          
          onLocationSelect({ lat, lng, address });
          
          // Actualizar marker
          if (marker) {
            marker.setPosition({ lat, lng });
          } else {
            const newMarker = new google.maps.Marker({
              position: { lat, lng },
              map: mapInstance,
              draggable: true,
              animation: google.maps.Animation.DROP,
            });
            setMarker(newMarker);
          }
        } catch (error) {
          console.error('Error obteniendo dirección:', error);
        }
      });
    }
  }, [isLoaded, onLocationSelect]);

  // Buscar dirección si se proporciona
  useEffect(() => {
    if (!map || !address) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(16);

        // Actualizar o crear marker
        if (marker) {
          marker.setPosition(location);
        } else {
          const newMarker = new google.maps.Marker({
            position: location,
            map: map,
            animation: google.maps.Animation.DROP,
          });
          setMarker(newMarker);
        }
      }
    });
  }, [map, address]);

  if (!googleConfig.mapsApiKey) {
    return (
      <div style={{
        height,
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        color: '#6b7280'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Google Maps no configurado</p>
          <p style={{ fontSize: '12px' }}>Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div 
        ref={mapRef} 
        style={{ 
          height, 
          width: '100%', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }} 
      />
      {onLocationSelect && (
        <p style={{ 
          marginTop: '8px', 
          fontSize: '14px', 
          color: '#6b7280',
          textAlign: 'center'
        }}>
          Haz clic en el mapa para seleccionar la ubicación
        </p>
      )}
    </div>
  );
}