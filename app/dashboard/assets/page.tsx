'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Property {
  id: number
  name: string
  address: string
  owner: string
  type: string
  status: 'active' | 'inactive'
  lastInspection?: {
    date: string
    inspector: string
    status: 'completed' | 'pending'
  }
  pendingInspections: number
  completedInspections: number
  images?: string[]
}

export default function PropertiesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null)

  // Datos de ejemplo
  const [properties] = useState<Property[]>([
    {
      id: 1,
      name: 'Casa Los Robles',
      address: 'Av. Principal 123, Quito',
      owner: 'Juan Pérez',
      type: 'Residencial',
      status: 'active',
      lastInspection: {
        date: '2024-01-15',
        inspector: 'Carlos López',
        status: 'completed'
      },
      pendingInspections: 0,
      completedInspections: 5,
      images: ['/img1.jpg']
    },
    {
      id: 2,
      name: 'Edificio Central',
      address: 'Calle 45 #789, Guayaquil',
      owner: 'María García',
      type: 'Comercial',
      status: 'active',
      lastInspection: {
        date: '2024-01-20',
        inspector: 'Ana Martínez',
        status: 'pending'
      },
      pendingInspections: 1,
      completedInspections: 3,
      images: ['/img2.jpg', '/img3.jpg']
    },
    {
      id: 3,
      name: 'Local Plaza Norte',
      address: 'Plaza Norte Local 12',
      owner: 'Roberto Silva',
      type: 'Comercial',
      status: 'active',
      pendingInspections: 2,
      completedInspections: 8
    },
    {
      id: 4,
      name: 'Departamento Sky Tower',
      address: 'Torre Sky Piso 15',
      owner: 'Carmen Ruiz',
      type: 'Residencial',
      status: 'inactive',
      lastInspection: {
        date: '2023-12-10',
        inspector: 'Pedro Sánchez',
        status: 'completed'
      },
      pendingInspections: 0,
      completedInspections: 12
    }
  ])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(prev => [...prev, ...files])
    
    // Preview
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  const viewPropertyDetails = (property: Property) => {
    setSelectedProperty(property)
    setShowPropertyDetails(true)
    setActiveActionMenu(null)
  }

  // Cerrar menú cuando se hace clic fuera
  const handleClickOutside = () => {
    setActiveActionMenu(null)
  }

  // Filtrado
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || property.type === filterType
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div onClick={handleClickOutside}>
      {/* Header */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px'
          }}>
            Propiedades
          </h1>
          <p style={{ color: '#6b7280' }}>
            Gestiona todas las propiedades registradas
          </p>
        </div>
        <button
          onClick={() => setShowNewPropertyModal(true)}
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
            gap: '8px'
          }}
        >
          <span>+</span> Nueva Propiedad
        </button>
      </div>

      {/* Filtros */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 200px 200px',
          gap: '16px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Buscar por nombre, dirección o propietario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todos los tipos</option>
            <option value="Residencial">Residencial</option>
            <option value="Comercial">Comercial</option>
            <option value="Industrial">Industrial</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Lista de Propiedades Compacta */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {filteredProperties.map((property, index) => (
          <div
            key={property.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              borderBottom: index < filteredProperties.length - 1 ? '1px solid #e5e7eb' : 'none',
              transition: 'background-color 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
            }}
          >
            {/* Información principal */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '4px'
              }}>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {property.name}
                </h3>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: property.type === 'Residencial' ? '#dbeafe' : '#fef3c7',
                  color: property.type === 'Residencial' ? '#1e40af' : '#92400e',
                  whiteSpace: 'nowrap'
                }}>
                  {property.type}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: property.status === 'active' ? '#d1fae5' : '#fee2e2',
                  color: property.status === 'active' ? '#065f46' : '#991b1b',
                  whiteSpace: 'nowrap'
                }}>
                  {property.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <span>{property.address}</span>
                <span>•</span>
                <span>Propietario: {property.owner}</span>
                {property.lastInspection && (
                  <>
                    <span>•</span>
                    <span style={{
                      color: property.lastInspection.status === 'completed' ? '#10b981' : '#f59e0b'
                    }}>
                      {property.lastInspection.status === 'completed' ? '✓' : '⏳'} Última inspección: {property.lastInspection.date}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div style={{
              display: 'flex',
              gap: '24px',
              marginRight: '20px',
              fontSize: '13px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '600', color: '#10b981' }}>{property.completedInspections}</div>
                <div style={{ color: '#9ca3af', fontSize: '11px' }}>Completadas</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '600', color: '#f59e0b' }}>{property.pendingInspections}</div>
                <div style={{ color: '#9ca3af', fontSize: '11px' }}>Pendientes</div>
              </div>
            </div>

            {/* Botón de acciones */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveActionMenu(activeActionMenu === property.id ? null : property.id)
              }}
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px'
              }}
            >
              ⋮
            </button>

            {/* Menú de acciones */}
            {activeActionMenu === property.id && (
              <div 
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '100%',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  minWidth: '180px',
                  marginTop: '4px'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => viewPropertyDetails(property)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  👁️ Ver detalles
                </button>
                <button
                  onClick={() => router.push(`/dashboard/inspections/new?property=${property.id}`)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  📋 Nueva inspección
                </button>
                <button
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ✏️ Editar
                </button>
                <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />
                <button
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Nueva Propiedad */}
      {showNewPropertyModal && (
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
        }}
        onClick={() => setShowNewPropertyModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#111827'
            }}>
              Nueva Propiedad
            </h2>

            <form>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Nombre de la Propiedad
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Ej: Casa Los Robles"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Dirección
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Ej: Av. Principal 123, Quito"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Propietario
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Nombre del propietario"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Tipo de Propiedad
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>

              {/* Sección de imágenes */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Imágenes de la Propiedad
                </label>
                
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f9fafb'
                }}
                onClick={() => document.getElementById('imageUpload')?.click()}
                >
                  <input
                    id="imageUpload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📷</div>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Haz clic o arrastra imágenes aquí
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>
                    PNG, JPG hasta 10MB
                  </p>
                </div>

                {/* Vista previa de imágenes */}
                {imagePreview.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '12px',
                    marginTop: '16px'
                  }}>
                    {imagePreview.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Notas adicionales
                </label>
                <textarea
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Información adicional sobre la propiedad..."
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPropertyModal(false)
                    setSelectedImages([])
                    setImagePreview([])
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
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
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Crear Propiedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalles de Propiedad */}
      {showPropertyDetails && selectedProperty && (
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
        }}
        onClick={() => setShowPropertyDetails(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '24px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  {selectedProperty.name}
                </h2>
                <p style={{ color: '#6b7280' }}>{selectedProperty.address}</p>
              </div>
              <button
                onClick={() => setShowPropertyDetails(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            {/* Información básica */}
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Propietario</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedProperty.owner}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Tipo</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedProperty.type}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Estado</p>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: selectedProperty.status === 'active' ? '#d1fae5' : '#fee2e2',
                    color: selectedProperty.status === 'active' ? '#065f46' : '#991b1b'
                  }}>
                    {selectedProperty.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Estadísticas de inspecciones */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Resumen de Inspecciones
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px'
              }}>
                <div style={{
                  backgroundColor: '#dbeafe',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                    {selectedProperty.completedInspections}
                  </p>
                  <p style={{ fontSize: '14px', color: '#1e40af' }}>Completadas</p>
                </div>
                <div style={{
                  backgroundColor: '#fef3c7',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e' }}>
                    {selectedProperty.pendingInspections}
                  </p>
                  <p style={{ fontSize: '14px', color: '#92400e' }}>Pendientes</p>
                </div>
                <div style={{
                  backgroundColor: '#e0e7ff',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4338ca' }}>
                    {selectedProperty.completedInspections + selectedProperty.pendingInspections}
                  </p>
                  <p style={{ fontSize: '14px', color: '#4338ca' }}>Total</p>
                </div>
              </div>
            </div>

            {/* Última inspección */}
            {selectedProperty.lastInspection && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '16px'
                }}>
                  Última Inspección
                </h3>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>Fecha:</span>
                    <span style={{ fontWeight: '500' }}>{selectedProperty.lastInspection.date}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>Inspector:</span>
                    <span style={{ fontWeight: '500' }}>{selectedProperty.lastInspection.inspector}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Estado:</span>
                    <span style={{
                      fontWeight: '500',
                      color: selectedProperty.lastInspection.status === 'completed' ? '#10b981' : '#f59e0b'
                    }}>
                      {selectedProperty.lastInspection.status === 'completed' ? 'Completada' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => {
                  setShowPropertyDetails(false)
                  router.push(`/dashboard/inspections/new?property=${selectedProperty.id}`)
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Nueva Inspección
              </button>
              <button
                onClick={() => router.push(`/dashboard/properties/${selectedProperty.id}/inspections`)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Ver Todas las Inspecciones
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}