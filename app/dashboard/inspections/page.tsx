'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Inspection {
  id: string
  code: string
  property: string
  address: string
  client: string
  inspector: string
  status: 'completed' | 'in-progress' | 'scheduled'
  progress: number
  date: string
  type: string
  priority: 'high' | 'normal' | 'low'
  duration?: string
  checklistItems?: {
    total: number
    completed: number
  }
  images?: string[]
  notes?: string
}

export default function InspectionsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [showNewInspectionModal, setShowNewInspectionModal] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null)
  const [showInspectionDetails, setShowInspectionDetails] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null)

  // Datos de ejemplo
  const [inspections] = useState<Inspection[]>([
    {
      id: 'INS-001',
      code: 'INS-2024-001',
      property: 'Casa Los Robles',
      address: 'Av. Principal 123, Quito',
      client: 'Juan Pérez',
      inspector: 'Carlos López',
      status: 'completed',
      progress: 100,
      date: '2024-01-20',
      type: 'Regular',
      priority: 'normal',
      duration: '2h 30min',
      checklistItems: { total: 45, completed: 45 },
      images: ['/img1.jpg', '/img2.jpg']
    },
    {
      id: 'INS-002',
      code: 'INS-2024-002',
      property: 'Edificio Central',
      address: 'Calle 45 #789, Guayaquil',
      client: 'María García',
      inspector: 'Ana Martínez',
      status: 'in-progress',
      progress: 65,
      date: '2024-01-21',
      type: 'Pre-compra',
      priority: 'high',
      checklistItems: { total: 50, completed: 32 }
    },
    {
      id: 'INS-003',
      code: 'INS-2024-003',
      property: 'Local Plaza Norte',
      address: 'Plaza Norte Local 12',
      client: 'Roberto Silva',
      inspector: 'Pedro Sánchez',
      status: 'scheduled',
      progress: 0,
      date: '2024-01-25',
      type: 'Comercial',
      priority: 'normal'
    },
    {
      id: 'INS-004',
      code: 'INS-2024-004',
      property: 'Departamento Sky Tower',
      address: 'Torre Sky Piso 15',
      client: 'Carmen Ruiz',
      inspector: 'Luis Mendoza',
      status: 'in-progress',
      progress: 30,
      date: '2024-01-22',
      type: 'Post-construcción',
      priority: 'low',
      checklistItems: { total: 60, completed: 18 }
    }
  ])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(prev => [...prev, ...files])
    
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

  const viewInspectionDetails = (inspection: Inspection) => {
    setSelectedInspection(inspection)
    setShowInspectionDetails(true)
    setActiveActionMenu(null)
  }

  const handleClickOutside = () => {
    setActiveActionMenu(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#f59e0b'
      case 'scheduled': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada'
      case 'in-progress': return 'En Proceso'
      case 'scheduled': return 'Programada'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626'
      case 'normal': return '#6b7280'
      case 'low': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  // Filtrado
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = 
      inspection.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || inspection.status === filterStatus
    
    // Filtro de fecha simplificado para el ejemplo
    const matchesDate = filterDate === 'all' || 
      (filterDate === 'today' && inspection.date === new Date().toISOString().split('T')[0]) ||
      (filterDate === 'week' && true) || // Implementar lógica real
      (filterDate === 'month' && true)   // Implementar lógica real
    
    return matchesSearch && matchesStatus && matchesDate
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
            Inspecciones
          </h1>
          <p style={{ color: '#6b7280' }}>
            Gestiona todas las inspecciones realizadas y programadas
          </p>
        </div>
        <button
          onClick={() => setShowNewInspectionModal(true)}
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
          <span>+</span> Nueva Inspección
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
            placeholder="Buscar por código, propiedad, cliente o inspector..."
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
            <option value="completed">Completadas</option>
            <option value="in-progress">En Proceso</option>
            <option value="scheduled">Programadas</option>
          </select>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
          </select>
        </div>
      </div>

      {/* Lista de Inspecciones Compacta */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {filteredInspections.map((inspection, index) => (
          <div
            key={inspection.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              borderBottom: index < filteredInspections.length - 1 ? '1px solid #e5e7eb' : 'none',
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
                  margin: 0
                }}>
                  {inspection.code}
                </h3>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {inspection.property}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: `${getStatusColor(inspection.status)}20`,
                  color: getStatusColor(inspection.status),
                  whiteSpace: 'nowrap'
                }}>
                  {getStatusText(inspection.status)}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: inspection.type === 'Regular' ? '#e0e7ff' : 
                                 inspection.type === 'Pre-compra' ? '#fef3c7' : 
                                 inspection.type === 'Comercial' ? '#dbeafe' : '#e5e7eb',
                  color: inspection.type === 'Regular' ? '#4338ca' : 
                         inspection.type === 'Pre-compra' ? '#92400e' : 
                         inspection.type === 'Comercial' ? '#1e40af' : '#374151'
                }}>
                  {inspection.type}
                </span>
                {inspection.priority === 'high' && (
                  <span style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    ⚠️ Alta prioridad
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <span>{inspection.address}</span>
                <span>•</span>
                <span>Cliente: {inspection.client}</span>
                <span>•</span>
                <span>Inspector: {inspection.inspector}</span>
                <span>•</span>
                <span>📅 {inspection.date}</span>
              </div>
            </div>

            {/* Progreso y estadísticas */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginRight: '20px'
            }}>
              {/* Barra de progreso */}
              {inspection.status !== 'scheduled' && (
                <div style={{ width: '120px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ color: '#6b7280' }}>Progreso</span>
                    <span style={{ fontWeight: '600' }}>{inspection.progress}%</span>
                  </div>
                  <div style={{
                    backgroundColor: '#e5e7eb',
                    height: '6px',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${inspection.progress}%`,
                      height: '100%',
                      backgroundColor: getStatusColor(inspection.status),
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}

              {/* Items del checklist */}
              {inspection.checklistItems && (
                <div style={{ textAlign: 'center', fontSize: '13px' }}>
                  <div style={{ fontWeight: '600' }}>
                    {inspection.checklistItems.completed}/{inspection.checklistItems.total}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '11px' }}>Items</div>
                </div>
              )}

              {/* Duración */}
              {inspection.duration && (
                <div style={{ textAlign: 'center', fontSize: '13px' }}>
                  <div style={{ fontWeight: '600' }}>{inspection.duration}</div>
                  <div style={{ color: '#9ca3af', fontSize: '11px' }}>Duración</div>
                </div>
              )}
            </div>

            {/* Botón de acciones */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveActionMenu(activeActionMenu === inspection.id ? null : inspection.id)
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
            {activeActionMenu === inspection.id && (
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
                  onClick={() => viewInspectionDetails(inspection)}
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
                {inspection.status === 'in-progress' && (
                  <button
                    onClick={() => router.push(`/dashboard/inspections/${inspection.id}/continue`)}
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
                    ▶️ Continuar
                  </button>
                )}
                {inspection.status === 'completed' && (
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
                    📄 Generar reporte
                  </button>
                )}
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

      {/* Modal Nueva Inspección */}
      {showNewInspectionModal && (
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
        onClick={() => setShowNewInspectionModal(false)}
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
              Nueva Inspección
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
                  Propiedad
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <option value="">Seleccionar propiedad</option>
                  <option value="1">Casa Los Robles - Av. Principal 123</option>
                  <option value="2">Edificio Central - Calle 45 #789</option>
                  <option value="3">Local Plaza Norte - Plaza Norte Local 12</option>
                </select>
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
                    Inspector
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <option value="">Asignar inspector</option>
                    <option value="1">Carlos López</option>
                    <option value="2">Ana Martínez</option>
                    <option value="3">Pedro Sánchez</option>
                    <option value="4">Luis Mendoza</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Tipo de Inspección
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <option value="">Seleccionar tipo</option>
                    <option value="regular">Regular</option>
                    <option value="pre-compra">Pre-compra</option>
                    <option value="post-construccion">Post-construcción</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>
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
                    Fecha
                  </label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
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
                    Hora
                  </label>
                  <input
                    type="time"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Prioridad
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}>
                    <input type="radio" name="priority" value="high" />
                    <span style={{ color: '#dc2626' }}>⚠️ Alta</span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}>
                    <input type="radio" name="priority" value="normal" defaultChecked />
                    <span>Normal</span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}>
                    <input type="radio" name="priority" value="low" />
                    <span style={{ color: '#3b82f6' }}>Baja</span>
                  </label>
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
                  Documentos/Imágenes iniciales
                </label>
                
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f9fafb'
                }}
                onClick={() => document.getElementById('docUpload')?.click()}
                >
                  <input
                    id="docUpload"
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📁</div>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Haz clic o arrastra archivos aquí
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>
                    PDF, PNG, JPG hasta 10MB
                  </p>
                </div>

                {/* Vista previa */}
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
                  Notas/Instrucciones
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
                  placeholder="Instrucciones especiales para el inspector..."
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
                    setShowNewInspectionModal(false)
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
                  Crear Inspección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalles de Inspección */}
      {showInspectionDetails && selectedInspection && (
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
        onClick={() => setShowInspectionDetails(false)}
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
                  Inspección {selectedInspection.code}
                </h2>
                <p style={{ color: '#6b7280' }}>{selectedInspection.property}</p>
              </div>
              <button
                onClick={() => setShowInspectionDetails(false)}
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
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Cliente</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedInspection.client}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Inspector</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedInspection.inspector}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Tipo</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedInspection.type}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Estado</p>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: `${getStatusColor(selectedInspection.status)}20`,
                    color: getStatusColor(selectedInspection.status)
                  }}>
                    {getStatusText(selectedInspection.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Progreso */}
            {selectedInspection.status !== 'scheduled' && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '16px'
                }}>
                  Progreso de la Inspección
                </h3>
                <div style={{
                  backgroundColor: '#e5e7eb',
                  height: '20px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${selectedInspection.progress}%`,
                    height: '100%',
                    backgroundColor: getStatusColor(selectedInspection.status),
                    transition: 'width 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {selectedInspection.progress}%
                  </div>
                </div>
                {selectedInspection.checklistItems && (
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {selectedInspection.checklistItems.completed} de {selectedInspection.checklistItems.total} items completados
                  </p>
                )}
              </div>
            )}

            {/* Detalles adicionales */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '24px'
            }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  📅 Fecha de Inspección
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedInspection.date}</p>
              </div>
              {selectedInspection.duration && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    ⏱️ Duración
                  </h4>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedInspection.duration}</p>
                </div>
              )}
            </div>

            {/* Dirección completa */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                📍 Dirección
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedInspection.address}</p>
            </div>

            {/* Imágenes adjuntas */}
            {selectedInspection.images && selectedInspection.images.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  📷 Imágenes de la Inspección
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '12px'
                }}>
                  {selectedInspection.images.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        aspectRatio: '1',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e5e7eb',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>📷</span>
                    </div>
                  ))}
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
              {selectedInspection.status === 'in-progress' && (
                <button
                  onClick={() => {
                    setShowInspectionDetails(false)
                    router.push(`/dashboard/inspections/${selectedInspection.id}/continue`)
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
                  Continuar Inspección
                </button>
              )}
              {selectedInspection.status === 'completed' && (
                <button
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
                  Generar Reporte PDF
                </button>
              )}
              <button
                onClick={() => router.push(`/dashboard/inspections/${selectedInspection.id}/edit`)}
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
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}