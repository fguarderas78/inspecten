'use client'

import { useState } from 'react'

export default function ChecklistsPage() {
  const [showNewChecklistModal, setShowNewChecklistModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedChecklist, setSelectedChecklist] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [filterType, setFilterType] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Datos de ejemplo de checklists
  const checklists = [
    {
      id: 1,
      name: 'Inspección de Vivienda Privada',
      type: 'Residencial',
      icon: '🏠',
      sections: 12,
      items: 145,
      lastModified: '2024-07-20',
      usage: 89,
      status: 'Activo',
      description: 'Checklist completo para inspección de casas y departamentos residenciales'
    },
    {
      id: 2,
      name: 'Inspección de Vehículo Ligero',
      type: 'Vehículos',
      icon: '🚗',
      sections: 8,
      items: 76,
      lastModified: '2024-07-18',
      usage: 45,
      status: 'Activo',
      description: 'Para inspección de autos, camionetas y SUVs'
    },
    {
      id: 3,
      name: 'Edificio Comercial',
      type: 'Comercial',
      icon: '🏢',
      sections: 15,
      items: 198,
      lastModified: '2024-07-15',
      usage: 34,
      status: 'Activo',
      description: 'Checklist para oficinas y locales comerciales'
    },
    {
      id: 4,
      name: 'Construcción en Proceso',
      type: 'Construcción',
      icon: '🏗️',
      sections: 20,
      items: 267,
      lastModified: '2024-07-10',
      usage: 12,
      status: 'Activo',
      description: 'Para seguimiento de obras en construcción'
    },
    {
      id: 5,
      name: 'Departamento Estudio',
      type: 'Residencial',
      icon: '🏠',
      sections: 8,
      items: 92,
      lastModified: '2024-07-08',
      usage: 23,
      status: 'Borrador',
      description: 'Checklist simplificado para departamentos pequeños'
    }
  ]

  // Ejemplo de estructura de sección
  const sampleSections = [
    {
      id: 1,
      name: 'Exterior',
      count: 0, // Contador ajustable
      items: [
        { name: 'Fachada', rating: 'Bueno/Regular/Malo', photos: true, comment: true },
        { name: 'Techo', rating: 'Bueno/Regular/Malo', photos: true, comment: true },
        { name: 'Jardín', rating: 'Bueno/Regular/Malo', photos: true, comment: true }
      ]
    },
    {
      id: 2,
      name: 'Habitaciones',
      count: 3, // El inspector puede ajustar este número
      items: [
        { name: 'Piso', rating: 'Bueno/Regular/Malo', photos: true, comment: true },
        { name: 'Paredes', rating: 'Bueno/Regular/Malo', photos: true, comment: true },
        { name: 'Techo', rating: 'Bueno/Regular/Malo', photos: true, comment: true },
        { name: 'Ventanas', rating: 'Bueno/Regular/Malo', photos: true, comment: true }
      ]
    }
  ]

  const getTypeColor = (type) => {
    switch(type) {
      case 'Residencial':
        return { bg: '#fee2e2', color: '#dc2626' }
      case 'Comercial':
        return { bg: '#dbeafe', color: '#2563eb' }
      case 'Vehículos':
        return { bg: '#fef3c7', color: '#d97706' }
      case 'Construcción':
        return { bg: '#d1fae5', color: '#065f46' }
      default:
        return { bg: '#f3f4f6', color: '#374151' }
    }
  }

  const filteredChecklists = filterType === 'all' 
    ? checklists 
    : checklists.filter(c => c.type === filterType)

  return (
    <div>
      {/* Page Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>Checklists</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ 
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Subir Excel
          </button>
          <button 
            onClick={() => setShowNewChecklistModal(true)}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>+</span> Nuevo Checklist
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #3b82f6',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <svg style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '5px' }}>
            <strong>Dos formas de crear checklists:</strong>
          </p>
          <ul style={{ fontSize: '13px', color: '#1e40af', paddingLeft: '20px', margin: 0 }}>
            <li>Editar online: Crear y modificar secciones y puntos directamente en el sistema</li>
            <li>Subir Excel: Importar checklists desde archivos Excel con formato predefinido</li>
          </ul>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Checklists</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{checklists.length}</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Activos</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
            {checklists.filter(c => c.status === 'Activo').length}
          </p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Usos</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
            {checklists.reduce((sum, c) => sum + c.usage, 0)}
          </p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Borradores</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
            {checklists.filter(c => c.status === 'Borrador').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setFilterType('all')}
            style={{
              padding: '8px 16px',
              backgroundColor: filterType === 'all' ? '#dc2626' : 'white',
              color: filterType === 'all' ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('Residencial')}
            style={{
              padding: '8px 16px',
              backgroundColor: filterType === 'Residencial' ? '#dc2626' : 'white',
              color: filterType === 'Residencial' ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🏠 Residencial
          </button>
          <button
            onClick={() => setFilterType('Comercial')}
            style={{
              padding: '8px 16px',
              backgroundColor: filterType === 'Comercial' ? '#dc2626' : 'white',
              color: filterType === 'Comercial' ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🏢 Comercial
          </button>
          <button
            onClick={() => setFilterType('Vehículos')}
            style={{
              padding: '8px 16px',
              backgroundColor: filterType === 'Vehículos' ? '#dc2626' : 'white',
              color: filterType === 'Vehículos' ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🚗 Vehículos
          </button>
          <button
            onClick={() => setFilterType('Construcción')}
            style={{
              padding: '8px 16px',
              backgroundColor: filterType === 'Construcción' ? '#dc2626' : 'white',
              color: filterType === 'Construcción' ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🏗️ Construcción
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '8px',
              backgroundColor: viewMode === 'grid' ? '#f3f4f6' : 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '4px 0 0 4px',
              cursor: 'pointer'
            }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px',
              backgroundColor: viewMode === 'list' ? '#f3f4f6' : 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer'
            }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Checklists Grid */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {filteredChecklists.map(checklist => {
            const typeStyle = getTypeColor(checklist.type)
            
            return (
              <div key={checklist.id} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '32px' }}>{checklist.icon}</span>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                        {checklist.name}
                      </h3>
                      <span style={{
                        fontSize: '12px',
                        backgroundColor: typeStyle.bg,
                        color: typeStyle.color,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        display: 'inline-block',
                        marginTop: '4px'
                      }}>
                        {checklist.type}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: checklist.status === 'Activo' ? '#d1fae5' : '#fef3c7',
                    color: checklist.status === 'Activo' ? '#065f46' : '#92400e'
                  }}>
                    {checklist.status}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '15px', lineHeight: '1.5' }}>
                  {checklist.description}
                </p>

                {/* Stats */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '10px',
                  marginBottom: '15px',
                  padding: '15px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>{checklist.sections}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Secciones</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>{checklist.items}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Items</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>{checklist.usage}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Usos</p>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '15px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    Modificado: {checklist.lastModified}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedChecklist(checklist)
                        setShowEditModal(true)
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Duplicar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredChecklists.length === 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '60px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <p style={{ marginBottom: '20px' }}>No se encontraron checklists</p>
          <button 
            onClick={() => setShowNewChecklistModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Crear Primer Checklist
          </button>
        </div>
      )}

      {/* Upload Excel Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Subir Checklist desde Excel
            </h2>
            <button
              onClick={() => setShowUploadModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#6b7280'
              }}
            >
              ×
            </button>
            
            <div style={{
              border: '2px dashed #e5e7eb',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <svg style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p style={{ color: '#374151', marginBottom: '8px' }}>
                Arrastra tu archivo Excel aquí o
              </p>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                Seleccionar Archivo
              </button>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
                Formatos soportados: .xlsx, .xls
              </p>
            </div>

            <div style={{
              backgroundColor: '#f9fafb',
              padding: '15px',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#374151'
            }}>
              <p style={{ fontWeight: '600', marginBottom: '8px' }}>
                Formato requerido del Excel:
              </p>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>Columna A: Sección</li>
                <li>Columna B: Item a revisar</li>
                <li>Columna C: Opciones de calificación</li>
                <li>Columna D: Permite fotos (Sí/No)</li>
                <li>Columna E: Permite comentarios (Sí/No)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Edit Checklist Modal */}
      {showEditModal && selectedChecklist && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                Editar: {selectedChecklist.name}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {/* Sample Sections Editor */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                Secciones y Puntos de Revisión
              </h3>
              
              {sampleSections.map(section => (
                <div key={section.id} style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <input 
                      type="text" 
                      value={section.name}
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        backgroundColor: 'white'
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label style={{ fontSize: '14px', color: '#374151' }}>
                        Contador:
                      </label>
                      <input 
                        type="number" 
                        value={section.count}
                        min="0"
                        style={{
                          width: '60px',
                          padding: '6px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                  </div>
                  
                  {section.items.map((item, index) => (
                    <div key={index} style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 80px 80px 40px',
                      gap: '10px',
                      alignItems: 'center'
                    }}>
                      <input 
                        type="text" 
                        value={item.name}
                        placeholder="Punto a revisar"
                        style={{
                          padding: '6px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px'
                        }}
                      />
                      <input 
                        type="text" 
                        value={item.rating}
                        placeholder="Opciones"
                        style={{
                          padding: '6px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <input type="checkbox" checked={item.photos} />
                        Fotos
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <input type="checkbox" checked={item.comment} />
                        Notas
                      </label>
                      <button style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#dc2626'
                      }}>
                        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  <button style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}>
                    + Agregar punto
                  </button>
                </div>
              ))}
              
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                marginTop: '10px'
              }}>
                + Agregar Sección
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}