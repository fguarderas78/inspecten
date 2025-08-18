'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Formulario {
  id: string
  nombre: string
  tipo: 'biblioteca' | 'personalizado' | 'activo'
  basadoEn?: string
  secciones: number
  items: number
  usos?: number
  estado?: 'plantilla' | 'en_uso' | 'completado'
  propiedad?: string
}

export default function FormulariosPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<'biblioteca' | 'personalizados' | 'activos'>('biblioteca')
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [importing, setImporting] = useState(false)

  const formularios: Formulario[] = [
    {
      id: 'vivienda',
      nombre: 'Inspección de Vivienda Privada',
      tipo: 'biblioteca',
      secciones: 12,
      items: 68,
      usos: 45,
      estado: 'plantilla'
    },
    {
      id: 'oficinas',
      nombre: 'Inspección de Oficinas',
      tipo: 'biblioteca',
      secciones: 10,
      items: 52,
      usos: 23,
      estado: 'plantilla'
    },
    {
      id: 'vehiculo',
      nombre: 'Inspección de Vehículo Ligero',
      tipo: 'biblioteca',
      secciones: 8,
      items: 45,
      usos: 15,
      estado: 'plantilla'
    },
    {
      id: 'villa-olivo',
      nombre: 'Villa Olivo - Vista al Bosque',
      tipo: 'personalizado',
      basadoEn: 'Inspección de Vivienda',
      secciones: 9,
      items: 52,
      estado: 'completado',
      propiedad: 'Villa Olivo'
    }
  ]

  const filteredFormularios = formularios
    .filter(f => f.tipo === activeTab || (activeTab === 'activos' && f.estado === 'en_uso'))
    .filter(f => f.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleUseTemplate = (templateId: string) => {
    router.push(`/dashboard/formularios/editor?template=${templateId}`)
  }

  const handleOpenForm = (formId: string) => {
    router.push(`/dashboard/formularios/editor?id=${formId}`)
  }

  const handleViewReport = (formId: string) => {
    router.push(`/dashboard/reportes/${formId}`)
  }

  const handleNewForm = (templateId?: string) => {
    setShowNewModal(false)
    if (templateId === 'nuevo') {
      router.push('/dashboard/formularios/editor?new=true')
    } else if (templateId) {
      router.push(`/dashboard/formularios/editor?template=${templateId}`)
    }
  }

  const handleImportFromDrive = async () => {
    setImporting(true)
    try {
      // Simular importación desde Google Drive
      console.log('Abriendo selector de Google Drive...')
      // Aquí iría la integración real con Google Drive API
      setTimeout(() => {
        alert('Archivo importado exitosamente desde Google Drive')
        setImporting(false)
      }, 2000)
    } catch (error) {
      console.error('Error al importar:', error)
      setImporting(false)
    }
  }

  const handleImportFromComputer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImporting(true)
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          console.log('Procesando archivo:', file.name)
          // Aquí procesarías el archivo Excel
          // Por ahora simulamos el proceso
          setTimeout(() => {
            alert(`Archivo "${file.name}" importado exitosamente`)
            setImporting(false)
            // Resetear el input
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          }, 1500)
        } catch (error) {
          console.error('Error al procesar archivo:', error)
          alert('Error al procesar el archivo')
          setImporting(false)
        }
      }
      
      reader.readAsArrayBuffer(file)
    }
  }

  const handleDropdownClick = (formId: string, action: string) => {
    setShowDropdown(null)
    
    switch(action) {
      case 'edit':
        router.push(`/dashboard/formularios/editor?id=${formId}`)
        break
      case 'config':
        router.push(`/dashboard/formularios/config?id=${formId}`)
        break
      case 'duplicate':
        console.log('Duplicando formulario:', formId)
        break
      case 'export':
        console.log('Exportando a Drive:', formId)
        break
      case 'report':
        handleViewReport(formId)
        break
      case 'delete':
        if (confirm('¿Está seguro de eliminar este formulario?')) {
          console.log('Eliminando:', formId)
        }
        break
    }
  }

  const handleSaveToLibrary = (formId: string) => {
    if (confirm('¿Guardar este formulario en la biblioteca como plantilla definitiva?')) {
      console.log('Guardando en biblioteca:', formId)
    }
  }

  return (
    <div style={{ padding: '20px 40px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '28px', color: '#333', margin: 0 }}>Formularios</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar formulario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              width: '300px',
              fontSize: '14px'
            }}
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportFromComputer}
            style={{ display: 'none' }}
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: importing ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: importing ? 0.6 : 1
            }}
          >
            💻 {importing ? 'Importando...' : 'Importar desde Computadora'}
          </button>

          <button
            onClick={handleImportFromDrive}
            disabled={importing}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: importing ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: importing ? 0.6 : 1
            }}
          >
            📤 Importar desde Drive
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            + Nuevo Formulario
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '25px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        {['biblioteca', 'personalizados', 'activos'].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '10px 15px',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '3px solid #dc2626' : '3px solid transparent',
              color: activeTab === tab ? '#dc2626' : '#374151',
              fontWeight: 500,
              transition: 'all 0.3s',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'activos' ? 'En Uso' : tab}
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {filteredFormularios.map((formulario) => (
          <div
            key={formulario.id}
            style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'all 0.3s'
            }}
          >
            <div style={{
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '5px',
                color: '#111827'
              }}>
                {formulario.nombre}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {formulario.basadoEn || 'Plantilla Base'}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 500,
                  backgroundColor: formulario.tipo === 'biblioteca' ? '#dbeafe' : '#fce7f3',
                  color: formulario.tipo === 'biblioteca' ? '#1e40af' : '#be185d'
                }}>
                  {formulario.tipo === 'biblioteca' ? 'Biblioteca' : 'Personalizado'}
                </span>
                {formulario.estado === 'completado' && (
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: '#d1fae5',
                    color: '#065f46'
                  }}>
                    Completado
                  </span>
                )}
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#374151' }}>
                    {formulario.secciones}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Secciones</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#374151' }}>
                    {formulario.items}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Items</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#374151' }}>
                    {formulario.usos || '-'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {formulario.tipo === 'biblioteca' ? 'Usos' : 'Estado'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                  onClick={() => {
                    if (formulario.tipo === 'biblioteca') {
                      handleUseTemplate(formulario.id)
                    } else if (formulario.estado === 'completado') {
                      handleViewReport(formulario.id)
                    } else {
                      handleOpenForm(formulario.id)
                    }
                  }}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    flex: 1
                  }}
                >
                  {formulario.tipo === 'biblioteca' ? 'Usar Plantilla' : 
                   formulario.estado === 'completado' ? 'Ver Reporte' : 'Abrir'}
                </button>
                
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowDropdown(showDropdown === formulario.id ? null : formulario.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #e5e7eb',
                      color: '#6b7280',
                      padding: '8px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    ⋮
                  </button>
                  {showDropdown === formulario.id && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '5px',
                      backgroundColor: 'white',
                      minWidth: '200px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      borderRadius: '5px',
                      zIndex: 1000
                    }}>
                      <div
                        onClick={() => handleDropdownClick(formulario.id, 'edit')}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                      >
                        📝 Editar Formulario
                      </div>
                      <div
                        onClick={() => handleDropdownClick(formulario.id, 'config')}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                      >
                        ⚙️ Configurar Parámetros
                      </div>
                      <div
                        onClick={() => handleDropdownClick(formulario.id, 'duplicate')}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                      >
                        📋 Duplicar
                      </div>
                      {formulario.estado === 'completado' && (
                        <div
                          onClick={() => handleDropdownClick(formulario.id, 'report')}
                          style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f3f4f6'
                          }}
                        >
                          📊 Generar Reporte PDF
                        </div>
                      )}
                      <div
                        onClick={() => handleDropdownClick(formulario.id, 'export')}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                      >
                        📥 Exportar a Drive
                      </div>
                      <div
                        onClick={() => handleDropdownClick(formulario.id, 'delete')}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          color: '#dc2626'
                        }}
                      >
                        🗑️ Eliminar
                      </div>
                    </div>
                  )}
                </div>
                
                {formulario.tipo === 'personalizado' && (
                  <button
                    onClick={() => handleSaveToLibrary(formulario.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #e5e7eb',
                      color: '#6b7280',
                      padding: '8px',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    💾
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nuevo Formulario */}
      {showNewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '400px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
                Seleccionar Plantilla
              </h2>
              <button
                onClick={() => setShowNewModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleNewForm('vivienda')}
                style={{
                  padding: '15px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: 500, marginBottom: '5px' }}>
                  🏠 Inspección de Vivienda Privada
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  12 secciones • 68 items
                </div>
              </button>

              <button
                onClick={() => handleNewForm('oficinas')}
                style={{
                  padding: '15px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: 500, marginBottom: '5px' }}>
                  🏢 Inspección de Oficinas
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  10 secciones • 52 items
                </div>
              </button>

              <button
                onClick={() => handleNewForm('vehiculo')}
                style={{
                  padding: '15px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: 500, marginBottom: '5px' }}>
                  🚗 Inspección de Vehículo Ligero
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  8 secciones • 45 items
                </div>
              </button>

              <button
                onClick={() => handleNewForm('nuevo')}
                style={{
                  padding: '15px',
                  border: '2px dashed #e5e7eb',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s',
                  marginTop: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: 500, marginBottom: '5px', color: '#dc2626' }}>
                  ➕ Crear Formulario Nuevo
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Empezar desde cero
                </div>
              </button>
            </div>

            <div style={{ 
              marginTop: '20px', 
              padding: '10px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '5px',
              fontSize: '13px',
              color: '#6b7280'
            }}>
              💡 Los formularios se guardan automáticamente en Google Drive
            </div>
          </div>
        </div>
      )}
    </div>
  )
}