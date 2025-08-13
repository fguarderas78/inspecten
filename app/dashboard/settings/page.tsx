'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [isDriveConnected, setIsDriveConnected] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('driveConnected') === 'true') {
      setIsDriveConnected(true)
      alert('Google Drive conectado exitosamente!')
      window.history.replaceState({}, '', '/dashboard/settings')
    }
  }, [])

  const handleGoogleConnect = () => {
    window.location.href = '/api/auth/google'
  }

  const handleDisconnect = () => {
    setIsDriveConnected(false)
    alert('Google Drive desconectado')
  }

  const testBackup = async () => {
    setTesting(true)
    try {
      const testInspection = {
        code: 'TEST-' + Date.now(),
        name: 'Inspeccion de Prueba',
        property: 'Casa de Prueba',
        date: new Date().toISOString(),
        inspector: 'Usuario Prueba',
        status: 'Completada'
      }

      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testInspection)
      })

      const result = await response.json()
      console.log('Resultado completo:', result)
      
      if (result.success && result.driveBackup?.success) {
        alert('¡Respaldo creado! Revisa tu Google Drive en la carpeta INSPECTEN_Respaldos')
      } else {
        alert('Error al crear respaldo. Revisa la consola para más detalles.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al probar el respaldo')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px' }}>
        Configuracion
      </h1>

      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>
          Google Drive
        </h2>

        {isDriveConnected ? (
          <div>
            <p style={{ color: '#10b981', marginBottom: '16px', fontSize: '16px' }}>
              ✅ Google Drive conectado exitosamente
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleDisconnect}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Desconectar
              </button>
              <button
                onClick={testBackup}
                disabled={testing}
                style={{
                  padding: '8px 16px',
                  backgroundColor: testing ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: testing ? 'not-allowed' : 'pointer'
                }}
              >
                {testing ? 'Creando respaldo...' : 'Probar Respaldo'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Conecta Google Drive para respaldar automaticamente tus inspecciones
            </p>
            <button
              onClick={handleGoogleConnect}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Conectar Google Drive
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
