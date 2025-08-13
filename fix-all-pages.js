// fix-all-pages.js
// Script para arreglar todos los problemas de las páginas
// Ejecutar desde: C:\Users\coguc\Documents\GitHub\inspecten

const fs = require('fs');
const path = require('path');

console.log('🔧 Arreglando todas las páginas de INSPECTEN...\n');

// 1. VERIFICAR Y CREAR CARPETA ASSETS (PROPIEDADES)
console.log('1️⃣ Verificando carpeta assets...');
const assetsDir = path.join(process.cwd(), 'app', 'dashboard', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
    console.log('✅ Carpeta assets creada');
}

// Crear página de assets si no existe
const assetsPagePath = path.join(assetsDir, 'page.tsx');
if (!fs.existsSync(assetsPagePath)) {
    const assetsContent = `'use client'

import { useState } from 'react'

export default function AssetsPage() {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Datos de ejemplo
  const [properties] = useState([
    {
      id: 1,
      name: 'Torre Alfa',
      address: 'Av. Principal 123, Piso 12',
      type: 'Comercial',
      owner: 'Empresa ABC',
      status: 'active',
      lastInspection: '2024-01-10',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Edificio Central',
      address: 'Calle Secundaria 456',
      type: 'Residencial',
      owner: 'Juan Pérez',
      status: 'active',
      lastInspection: '2024-01-05',
      image: '/api/placeholder/300/200'
    }
  ])

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || property.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div>
      {/* Barra de herramientas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          flex: 1,
          minWidth: '300px'
        }}>
          <input
            type="text"
            placeholder="Buscar por nombre, dirección o propietario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc2626'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb'
            }}
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">Todos los tipos</option>
            <option value="Residencial">Residencial</option>
            <option value="Comercial">Comercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#b91c1c'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626'
          }}
        >
          <span>➕</span>
          Nueva Propiedad
        </button>
      </div>

      {/* Grid de propiedades */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Imagen */}
            <div style={{
              height: '180px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: '#d1d5db'
            }}>
              🏢
            </div>

            {/* Contenido */}
            <div style={{ padding: '20px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                {property.name}
              </h3>
              
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 12px 0'
              }}>
                📍 {property.address}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {property.type}
                </span>
                
                <span style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  👤 {property.owner}
                </span>
              </div>

              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid #e5e7eb',
                fontSize: '13px',
                color: '#6b7280'
              }}>
                Última inspección: {new Date(property.lastInspection).toLocaleDateString('es-ES')}
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '16px'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Nueva inspección para:', property.name)
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Nueva Inspección
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Ver detalles de:', property.name)
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    color: '#dc2626',
                    border: '1px solid #dc2626',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Ver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva Propiedad */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px'
            }}>
              Nueva Propiedad
            </h2>

            <form onSubmit={(e) => {
              e.preventDefault()
              console.log('Guardar propiedad')
              setShowModal(false)
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Nombre de la propiedad
                </label>
                <input
                  type="text"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Dirección
                </label>
                <input
                  type="text"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Tipo
                </label>
                <select
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Seleccione...</option>
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Propietario
                </label>
                <input
                  type="text"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}`;
    
    fs.writeFileSync(assetsPagePath, assetsContent);
    console.log('✅ Página de assets creada');
} else {
    console.log('✓ Página de assets ya existe');
}

// 2. ACTUALIZAR LAYOUT DEL DASHBOARD
console.log('\n2️⃣ Actualizando dashboard/layout.tsx...');
const dashboardLayoutPath = path.join(process.cwd(), 'app', 'dashboard', 'layout.tsx');
const layoutContent = fs.readFileSync(path.join(__dirname, 'dashboard-layout-improved.tsx'), 'utf8');
fs.writeFileSync(dashboardLayoutPath, layoutContent);
console.log('✅ Layout actualizado');

// 3. CREAR CONFIGURACIÓN DE GOOGLE DRIVE
console.log('\n3️⃣ Creando configuración de Google Drive...');
const libDir = path.join(process.cwd(), 'lib');
if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
}

const googleDriveConfig = `// lib/google-drive.ts
// Configuración para Google Drive

export const GOOGLE_DRIVE_CONFIG = {
  CLIENT_ID: '276697031867-17li97nhqr5adtrp8o8e7pr7lbop6jp0.apps.googleusercontent.com',
  API_KEY: 'YOUR_API_KEY', // Necesitarás obtener esto de Google Cloud Console
  DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  SCOPES: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',
  FOLDER_NAME: 'INSPECTEN_Backups'
}

// Función para inicializar Google Drive
export async function initGoogleDrive() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => {
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            apiKey: GOOGLE_DRIVE_CONFIG.API_KEY,
            clientId: GOOGLE_DRIVE_CONFIG.CLIENT_ID,
            discoveryDocs: GOOGLE_DRIVE_CONFIG.DISCOVERY_DOCS,
            scope: GOOGLE_DRIVE_CONFIG.SCOPES
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    }
    document.body.appendChild(script)
  })
}

// Función para guardar en Google Drive
export async function saveToGoogleDrive(fileName: string, content: any) {
  try {
    const boundary = '-------314159265358979323846'
    const delimiter = "\\r\\n--" + boundary + "\\r\\n"
    const close_delim = "\\r\\n--" + boundary + "--"

    const metadata = {
      'name': fileName,
      'mimeType': 'application/json',
      'parents': ['appDataFolder']
    }

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\\r\\n\\r\\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\\r\\n\\r\\n' +
      JSON.stringify(content) +
      close_delim

    const request = window.gapi.client.request({
      'path': '/upload/drive/v3/files',
      'method': 'POST',
      'params': {'uploadType': 'multipart'},
      'headers': {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody
    })

    const response = await request.execute()
    console.log('Archivo guardado en Google Drive:', response)
    return response
  } catch (error) {
    console.error('Error guardando en Google Drive:', error)
    throw error
  }
}
`;

fs.writeFileSync(path.join(libDir, 'google-drive.ts'), googleDriveConfig);
console.log('✅ Configuración de Google Drive creada');

// 4. RESUMEN
console.log('\n📊 RESUMEN:');
console.log('====================');
console.log('✅ Carpeta assets verificada/creada');
console.log('✅ Layout del dashboard actualizado (sidebar colapsable, fondo gris)');
console.log('✅ Configuración de Google Drive preparada');
console.log('\n⚠️  Próximos pasos:');
console.log('1. Reemplaza el contenido de app/dashboard/layout.tsx con el nuevo código');
console.log('2. Reinicia el servidor: npm run dev');
console.log('3. Las demás páginas necesitan ser creadas individualmente');

console.log('\n✨ Script completado!');