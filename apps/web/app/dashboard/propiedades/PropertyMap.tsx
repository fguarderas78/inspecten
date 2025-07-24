'use client'

import { useEffect, useRef, useState } from 'react'

interface Property {
  id: number
  nombre: string
  direccion: string
  lat?: number
  lng?: number
  tipo: string
  estado: string
}

interface PropertyMapProps {
  properties: Property[]
  apiKey: string
  onPropertyClick?: (property: Property) => void
  selectedProperty?: Property | null
}

export default function PropertyMap({ properties, apiKey, onPropertyClick, selectedProperty }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    // Cargar el script de Google Maps
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      document.head.appendChild(script)
    } else {
      initializeMap()
    }
  }, [apiKey])

  const initializeMap = () => {
    if (!mapRef.current) return

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: -2.1894, lng: -79.8891 }, // Guayaquil
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    setMap(mapInstance)
    setInfoWindow(new google.maps.InfoWindow())
  }

  useEffect(() => {
    if (!map) return

    // Limpiar marcadores anteriores
    markers.forEach(marker => marker.setMap(null))

    // Crear nuevos marcadores
    const newMarkers: google.maps.Marker[] = []
    const bounds = new google.maps.LatLngBounds()

    properties.forEach(property => {
      if (property.lat && property.lng) {
        const position = { lat: property.lat, lng: property.lng }
        
        const marker = new google.maps.Marker({
          position,
          map,
          title: property.nombre,
          icon: {
            url: getMarkerIcon(property.tipo),
            scaledSize: new google.maps.Size(40, 40)
          },
          animation: selectedProperty?.id === property.id ? 
            google.maps.Animation.BOUNCE : undefined
        })

        marker.addListener('click', () => {
          if (onPropertyClick) {
            onPropertyClick(property)
          }
          
          if (infoWindow) {
            infoWindow.setContent(`
              <div style="padding: 10px; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 16px;">
                  ${property.nombre}
                </h3>
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
                  ${property.direccion}
                </p>
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                  Tipo: ${property.tipo}
                </p>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                  <button 
                    onclick="window.inspectProperty(${property.id})"
                    style="
                      padding: 6px 12px;
                      background-color: #dc2626;
                      color: white;
                      border: none;
                      border-radius: 4px;
                      font-size: 12px;
                      cursor: pointer;
                    "
                  >
                    Nueva Inspección
                  </button>
                  <button 
                    onclick="window.viewPropertyDetails(${property.id})"
                    style="
                      padding: 6px 12px;
                      background-color: white;
                      color: #374151;
                      border: 1px solid #d1d5db;
                      border-radius: 4px;
                      font-size: 12px;
                      cursor: pointer;
                    "
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            `)
            infoWindow.open(map, marker)
          }
        })

        newMarkers.push(marker)
        bounds.extend(position)
      }
    })

    setMarkers(newMarkers)

    // Ajustar vista para mostrar todos los marcadores
    if (newMarkers.length > 0) {
      map.fitBounds(bounds)
      
      // Evitar zoom excesivo
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 16) map.setZoom(16)
        google.maps.event.removeListener(listener)
      })
    }
  }, [map, properties, selectedProperty, onPropertyClick, infoWindow])

  const getMarkerIcon = (tipo: string) => {
    const colors = {
      'Residencial': 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      'Comercial': 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'Industrial': 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'default': 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    }
    
    return colors[tipo as keyof typeof colors] || colors.default
  }

  // Geocodificar direcciones sin coordenadas
  useEffect(() => {
    if (!map || !window.google) return

    const geocoder = new google.maps.Geocoder()
    
    properties.forEach(property => {
      if (!property.lat || !property.lng) {
        geocoder.geocode({ address: property.direccion }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location
            
            // Aquí deberías actualizar la propiedad con las coordenadas
            // mediante una llamada a tu API
            console.log(`Coordenadas para ${property.nombre}:`, {
              lat: location.lat(),
              lng: location.lng()
            })
          }
        })
      }
    })
  }, [map, properties])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '100%', borderRadius: '8px' }}
      />
      
      {/* Leyenda del mapa */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '12px'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Tipo de Propiedad:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#4285f4', 
              borderRadius: '50%' 
            }}></div>
            <span>Residencial</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#0f9d58', 
              borderRadius: '50%' 
            }}></div>
            <span>Comercial</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#f4b400', 
              borderRadius: '50%' 
            }}></div>
            <span>Industrial</span>
          </div>
        </div>
      </div>

      {/* Controles del mapa */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={() => {
            if (navigator.geolocation && map) {
              navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
                map.setCenter(pos)
                map.setZoom(15)
              })
            }
          }}
          style={{
            padding: '8px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            fontSize: '20px'
          }}
          title="Mi ubicación"
        >
          📍
        </button>
      </div>
    </div>
  )
}