'use client'

import { useEffect, useRef, useState } from 'react'

export default function PropertyMap({ properties, apiKey, onPropertyClick, selectedProperty }) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!window.google && apiKey) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        if (mapRef.current) {
          const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: { lat: -2.1894, lng: -79.8891 },
            zoom: 12,
          })
          setMap(mapInstance)
        }
      }
      document.head.appendChild(script)
    }
  }, [apiKey])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
    </div>
  )
}
