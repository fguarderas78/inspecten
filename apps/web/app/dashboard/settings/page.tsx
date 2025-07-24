'use client'

import { useState, useEffect } from 'react'

export default function GoogleSettingsPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState({
    calendar: false,
    drive: false,
    sheets: false,
    gmail: false,
  })

  useEffect(() => {
    // Verificar si ya está conectado
    checkGoogleConnection()
  }, [])

  const checkGoogleConnection = async () => {
    // Aquí verificarías si el usuario tiene tokens válidos
    // Por ahora simularemos
    const hasTokens = localStorage.getItem('google_connected')
    setIsConnected(hasTokens === 'true')
    
    if (hasTokens) {
      setServices({
        calendar: true,
        drive: true,
        sheets: true,
        gmail: true,
      })
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    try {
      // Redirigir a la URL de autorización de Google
      window.location.href = '/api/auth/google'
    } catch (error) {
      console.error('Error al conectar:', error)
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    localStorage.removeItem('google_connected')
    setIsConnected(false)
    setServices({
      calendar: false,
      drive: false,
      sheets: false,
      gmail: false,
    })
  }

  const testCalendarSync = async () => {
    try {
      const response = await fetch('/api/google/calendar')
      const data = await response.json()
      console.log('Eventos del calendario:', data)
      alert('Sincronización exitosa! Ver consola para detalles.')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al sincronizar calendario')
    }
  }

  const testDriveUpload = async () => {
    try {
      // Crear un archivo de prueba
      const testContent = 'Archivo de prueba de SnapInspect'
      const blob = new Blob([testContent], { type: 'text/plain' })
      const file = new File([blob], 'test_snapinspect.txt', { type: 'text/plain' })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folderId', 'root')

      const response = await fetch('/api/google/drive', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      console.log('Archivo subido:', data)
      alert('Archivo subido exitosamente! Ver consola para detalles.')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al subir archivo')
    }
  }

  const testSheetsExport = async () => {
    try {
      const response = await fetch('/api/google/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
        }),
      })

      const data = await response.json()
      console.log('Hoja creada:', data)
      
      if (data.spreadsheetUrl) {
        window.open(data.spreadsheetUrl, '_blank')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear hoja de cálculo')
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Configuración de Google Workspace
        </h1>
        <p style={{ color: '#6b7280' }}>Conecta y configura los servicios de Google para tu cuenta</p>
      </div>

      {/* Estado de Conexión */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              Estado de Conexión
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              {isConnected ? 'Tu cuenta está conectada con Google Workspace' : 'Conecta tu cuenta para habilitar las integraciones'}
            </p>
          </div>
          
          {isConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 16px',
                backgroundColor: '#10b98120',
                color: '#10b981',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                ✓ Conectado
              </span>
              <button
                onClick={handleDisconnect}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  color: '#dc2626',
                  border: '1px solid #dc2626',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Desconectar
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              style={{
                padding: '10px 24px',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                style={{ width: '16px', height: '16px' }}
              />
              {loading ? 'Conectando...' : 'Conectar con Google'}
            </button>
          )}
        </div>
      </div>

      {/* Servicios Disponibles */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          Servicios Disponibles
        </h2>

        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Google Calendar */}
          <div style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                📅 Google Calendar
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Sincroniza inspecciones con tu calendario de Google
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {services.calendar && (
                <button
                  onClick={testCalendarSync}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Probar Sincronización
                </button>
              )}
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: services.calendar ? '#10b981' : '#ef4444'
              }}></span>
            </div>
          </div>

          {/* Google Drive */}
          <div style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                📁 Google Drive
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Almacena reportes y documentos automáticamente
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {services.drive && (
                <button
                  onClick={testDriveUpload}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Probar Subida
                </button>
              )}
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: services.drive ? '#10b981' : '#ef4444'
              }}></span>
            </div>
          </div>

          {/* Google Sheets */}
          <div style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                📊 Google Sheets
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Exporta datos y crea reportes en hojas de cálculo
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {services.sheets && (
                <button
                  onClick={testSheetsExport}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Crear Hoja de Prueba
                </button>
              )}
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: services.sheets ? '#10b981' : '#ef4444'
              }}></span>
            </div>
          </div>

          {/* Gmail */}
          <div style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                ✉️ Gmail
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Envía reportes y notificaciones automáticamente
              </p>
            </div>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: services.gmail ? '#10b981' : '#ef4444'
            }}></span>
          </div>
        </div>
      </div>

      {/* Configuración de Carpetas */}
      {isConnected && (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Configuración de Drive
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              Carpeta principal para reportes
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="SnapInspect_Reportes"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Guardar
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Estructura de carpetas
            </label>
            <div style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}>
              <div>📁 SnapInspect_Reportes/</div>
              <div style={{ marginLeft: '20px' }}>📁 2024/</div>
              <div style={{ marginLeft: '40px' }}>📁 Enero/</div>
              <div style={{ marginLeft: '60px' }}>📄 INSP-2024-001_Casa_Los_Pinos.pdf</div>
              <div style={{ marginLeft: '60px' }}>📊 INSP-2024-001_Datos.xlsx</div>
              <div style={{ marginLeft: '40px' }}>📁 Febrero/</div>
              <div style={{ marginLeft: '20px' }}>📁 Propiedades/</div>
              <div style={{ marginLeft: '40px' }}>📁 Casa_Los_Pinos/</div>
              <div style={{ marginLeft: '40px' }}>📁 Edificio_Central/</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}