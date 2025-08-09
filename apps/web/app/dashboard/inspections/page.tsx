'use client'

import { useState, useEffect } from 'react'

export default function InspectionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [inspections, setInspections] = useState([
    {
      id: '1',
      code: 'INS-001',
      name: 'Inspección Casa Cumbayá',
      property: { name: 'Casa Cumbayá', address: 'Cumbayá, Quito' },
      client: { name: 'María García', phone: '0998765432' },
      inspector: 'Carlos Mendoza',
      date: '2024-01-20',
      time: '10:00',
      status: 'Completada',
      progress: 100,
      findings: 12,
      priority: 'Alta'
    },
    {
      id: '2',
      code: 'INS-002',
      name: 'Inspección Oficina Centro',
      property: { name: 'Oficina Centro', address: 'Av. Amazonas, Quito' },
      client: { name: 'Juan Pérez', phone: '0987654321' },
      inspector: 'Ana Rodríguez',
      date: '2024-01-22',
      time: '14:00',
      status: 'En proceso',
      progress: 65,
      findings: 5,
      priority: 'Media'
    },
    {
      id: '3',
      code: 'INS-003',
      name: 'Inspección Local Comercial',
      property: { name: 'Local Norte', address: 'Av. Eloy Alfaro, Quito' },
      client: { name: 'Pedro López', phone: '0976543210' },
      inspector: 'Luis Martínez',
      date: '2024-01-25',
      time: '09:00',
      status: 'Programada',
      progress: 0,
      findings: 0,
      priority: 'Baja'
    }
  ])

  // Función para crear inspección
  const handleCreateInspection = async (formData: any) => {
    setIsCreating(true);
    try {
      const inspectionData = {
        code: formData.get('code'),
        name: formData.get('name'),
        property: {
          name: formData.get('propertyName'),
          address: formData.get('propertyAddress')
        },
        client: {
          name: formData.get('clientName'),
          phone: formData.get('clientPhone')
        },
        inspector: formData.get('inspector'),
        date: formData.get('date'),
        time: formData.get('time'),
        priority: formData.get('priority'),
        notes: formData.get('notes'),
        status: 'Programada',
        progress: 0,
        findings: 0
      };

      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inspectionData),
      });

      const result = await response.json();

      if (result.success) {
        setInspections([...inspections, result.data]);
        setShowCreateModal(false);
        
        // Mostrar notificación
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        `;
        notification.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">✅</span>
            <div>
              <div style="font-weight: 600;">Inspección creada exitosamente</div>
              <div style="font-size: 14px; opacity: 0.9;">Respaldada en Drive: ${result.driveBackup?.fileName || 'Pendiente'}</div>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la inspección');
    } finally {
      setIsCreating(false);
    }
  };

  // Función para actualizar inspección
  const handleUpdateInspection = async (id: string, updateData: any) => {
    try {
      const response = await fetch('/api/inspections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updateData }),
      });

      const result = await response.json();

      if (result.success) {
        setInspections(inspections.map(insp => 
          insp.id === id ? result.data : insp
        ));
        
        alert('Inspección actualizada y respaldada en Drive');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar la inspección');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada': return '#10b981'
      case 'En proceso': return '#f59e0b'
      case 'Programada': return '#3b82f6'
      case 'Cancelada': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return '#ef4444'
      case 'Media': return '#f59e0b'
      case 'Baja': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const filteredInspections = Array.isArray(inspections) ? inspections.filter((inspection) => {
    const matchesSearch = 
      inspection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.code.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || inspection.status === filterStatus
    
    return matchesSearch && matchesStatus
  }) : []

  const handleViewDetails = (inspection: any) => {
    setSelectedInspection(inspection)
    setShowDetailsModal(true)
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Inspecciones
        </h1>
        <p style={{ color: '#6b7280' }}>
          Gestiona y monitorea todas las inspecciones
        </p>
      </div>

      {/* Barra de herramientas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar por código, propiedad, cliente o inspector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              width: '350px',
              fontSize: '14px'
            }}
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="Programada">Programada</option>
            <option value="En proceso">En proceso</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          + Nueva Inspección
        </button>
      </div>

      {/* Grid de inspecciones */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredInspections.map((inspection) => (
          <div
            key={inspection.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              position: 'relative',
              border: '1px solid #e5e7eb'
            }}
          >
            {/* Indicador de respaldo en Drive */}
            {false && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#dbeafe',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ☁️ Drive
              </div>
            )}

            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>
                  {inspection.code}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  {inspection.name}
                </p>
              </div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: `${getStatusColor(inspection.status)}20`,
                color: getStatusColor(inspection.status)
              }}>
                {inspection.status}
              </span>
            </div>

            {/* Info */}
            <div style={{ marginBottom: '16px', fontSize: '14px', color: '#4b5563' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Propiedad:</strong> {inspection.property.name}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Cliente:</strong> {inspection.client.name}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Inspector:</strong> {inspection.inspector}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Fecha:</strong> {new Date(inspection.date).toLocaleDateString()} - {inspection.time}
              </div>
            </div>

            {/* Progress bar */}
            {inspection.status === 'En proceso' && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <span>Progreso</span>
                  <span>{inspection.progress}%</span>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${inspection.progress}%`,
                      backgroundColor: '#f59e0b',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
                <span>
                  <strong>{inspection.findings}</strong> hallazgos
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: `${getPriorityColor(inspection.priority)}20`,
                  color: getPriorityColor(inspection.priority)
                }}>
                  Prioridad {inspection.priority}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleViewDetails(inspection)}
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
                  Ver detalles
                </button>
                {inspection.status === 'Completada' && (
                  <button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Generar reporte
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Nueva Inspección */}
      {showCreateModal && (
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
            borderRadius: '8px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#111827'
            }}>
              Nueva Inspección
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateInspection(formData);
            }}>
              {/* Información de la Inspección */}
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '8px'
              }}>
                Información de la Inspección
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Código de Inspección
                  </label>
                  <input
                    name="code"
                    type="text"
                    required
                    placeholder="INS-XXX"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Prioridad
                  </label>
                  <select
                    name="priority"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Nombre de la Inspección
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Ej: Inspección Casa Principal"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Información de la Propiedad */}
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
                marginTop: '24px',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '8px'
              }}>
                Información de la Propiedad
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Nombre de la Propiedad
                  </label>
                  <input
                    name="propertyName"
                    type="text"
                    required
                    placeholder="Ej: Casa Cumbayá"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Dirección
                  </label>
                  <input
                    name="propertyAddress"
                    type="text"
                    required
                    placeholder="Ej: Cumbayá, Quito"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Información del Cliente */}
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
                marginTop: '24px',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '8px'
              }}>
                Información del Cliente
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Nombre del Cliente
                  </label>
                  <input
                    name="clientName"
                    type="text"
                    required
                    placeholder="Ej: María García"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Teléfono
                  </label>
                  <input
                    name="clientPhone"
                    type="tel"
                    required
                    placeholder="Ej: 0998765432"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Programación */}
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
                marginTop: '24px',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '8px'
              }}>
                Programación
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Fecha
                  </label>
                  <input
                    name="date"
                    type="date"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Hora
                  </label>
                  <input
                    name="time"
                    type="time"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Inspector
                </label>
                <select
                  name="inspector"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Seleccionar inspector</option>
                  <option value="Carlos Mendoza">Carlos Mendoza</option>
                  <option value="Ana Rodríguez">Ana Rodríguez</option>
                  <option value="Luis Martínez">Luis Martínez</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Notas iniciales
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Agregar cualquier nota o instrucción especial..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Notificación de respaldo */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f0f9ff',
                borderRadius: '6px',
                marginBottom: '24px',
                gap: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>☁️</span>
                <div>
                  <p style={{ fontSize: '14px', color: '#0369a1', margin: '0 0 4px 0', fontWeight: '500' }}>
                    Respaldo automático en Google Drive
                  </p>
                  <p style={{ fontSize: '12px', color: '#0c4a6e', margin: 0 }}>
                    Esta inspección se respaldará automáticamente en la carpeta INSPECTEN_Respaldos
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isCreating ? '#9ca3af' : '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isCreating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isCreating ? (
                    <>
                      <span style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        border: '2px solid #ffffff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}></span>
                      Creando...
                    </>
                  ) : (
                    'Crear Inspección'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetailsModal && selectedInspection && (
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
            borderRadius: '8px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#111827'
            }}>
              Detalles de Inspección
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                {selectedInspection.code} - {selectedInspection.name}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Estado: <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: `${getStatusColor(selectedInspection.status)}20`,
                  color: getStatusColor(selectedInspection.status)
                }}>
                  {selectedInspection.status}
                </span>
              </p>
            </div>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
              <div>
                <strong>Propiedad:</strong> {selectedInspection.property.name}
                <br />
                <small style={{ color: '#6b7280' }}>{selectedInspection.property.address}</small>
              </div>
              <div>
                <strong>Cliente:</strong> {selectedInspection.client.name}
                <br />
                <small style={{ color: '#6b7280' }}>{selectedInspection.client.phone}</small>
              </div>
              <div>
                <strong>Inspector:</strong> {selectedInspection.inspector}
              </div>
              <div>
                <strong>Fecha y hora:</strong> {new Date(selectedInspection.date).toLocaleDateString()} - {selectedInspection.time}
              </div>
              {selectedInspection.driveFileId && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>☁️</span>
                  <div>
                    <p style={{ fontSize: '14px', color: '#0369a1', margin: 0 }}>
                      Respaldado en Google Drive
                    </p>
                    {selectedInspection.driveFileUrl && (
                      <a 
                        href={selectedInspection.driveFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '12px',
                          color: '#0284c7',
                          textDecoration: 'underline'
                        }}
                      >
                        Ver archivo en Drive
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
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
                Editar inspección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}