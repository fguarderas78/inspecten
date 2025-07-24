'use client'
import { useState, useEffect } from 'react'
import { Search, Plus, Filter, Calendar, User, Building2, Clock, CheckCircle, AlertCircle, FileText, X, MessageSquare } from 'lucide-react'

export default function InspeccionesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [inspections, setInspections] = useState([])
  const [properties, setProperties] = useState([])
  const [inspectors, setInspectors] = useState([])
  const [newInspection, setNewInspection] = useState({
    name: '',
    propertyId: '',
    inspectorId: '',
    date: '',
    time: '',
    comments: '',
    clientName: ''
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchInspections()
    fetchProperties()
    fetchInspectors()
  }, [])

  const fetchInspections = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/inspections`)
      const data = await response.json()
      
      if (response.ok) {
        setInspections(data)
      }
    } catch (error) {
      console.error('Error al cargar inspecciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties?status=active')
      const data = await response.json()
      if (response.ok) {
        setProperties(data)
      }
    } catch (error) {
      console.error('Error al cargar propiedades:', error)
    }
  }

  const fetchInspectors = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (response.ok) {
        setInspectors(data)
      }
    } catch (error) {
      console.error('Error al cargar inspectores:', error)
    }
  }

  const filteredInspections = inspections.filter((inspection: any) => {
    const matchesSearch = 
      inspection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspector?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.code.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || inspection.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return { bg: '#d1fae5', color: '#065f46', label: 'Completada' }
      case 'in-progress': return { bg: '#dbeafe', color: '#1e40af', label: 'En Proceso' }
      case 'scheduled': return { bg: '#fef3c7', color: '#92400e', label: 'Programada' }
      default: return { bg: '#f3f4f6', color: '#374151', label: 'Pendiente' }
    }
  }

  const getStatusCounts = () => {
    return {
      total: inspections.length,
      completed: inspections.filter((i: any) => i.status === 'completed').length,
      inProgress: inspections.filter((i: any) => i.status === 'in-progress').length,
      scheduled: inspections.filter((i: any) => i.status === 'scheduled').length
    }
  }

  const counts = getStatusCounts()

  const handleCreateInspection = async () => {
    try {
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInspection)
      })

      if (response.ok) {
        // Recargar inspecciones
        fetchInspections()
        setShowModal(false)
        // Reset form
        setNewInspection({
          name: '',
          propertyId: '',
          inspectorId: '',
          date: '',
          time: '',
          comments: '',
          clientName: ''
        })
      }
    } catch (error) {
      console.error('Error al crear inspección:', error)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '600', 
          color: '#111827', 
          marginBottom: '8px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
          Inspecciones
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Gestiona y monitorea todas las inspecciones
        </p>
      </div>

      {/* Compact Stats Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#6b7280'
          }} />
          <span style={{ fontSize: '14px', color: '#374151' }}>Total: <strong>{counts.total}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981'
          }} />
          <span style={{ fontSize: '14px', color: '#374151' }}>Completadas: <strong>{counts.completed}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6'
          }} />
          <span style={{ fontSize: '14px', color: '#374151' }}>En Proceso: <strong>{counts.inProgress}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#f59e0b'
          }} />
          <span style={{ fontSize: '14px', color: '#374151' }}>Programadas: <strong>{counts.scheduled}</strong></span>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ 
          flex: 1, 
          minWidth: '300px',
          position: 'relative' 
        }}>
          <Search style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} size={20} />
          <input
            type="text"
            placeholder="Buscar por código, propiedad, cliente o inspector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif"
            }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="completed">Completadas</option>
          <option value="in-progress">En Proceso</option>
          <option value="scheduled">Programadas</option>
        </select>

        {/* New Inspection Button */}
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
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <Plus size={18} />
          Nueva Inspección
        </button>
      </div>

      {/* Inspections List - Compact Design */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando inspecciones...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredInspections.map((inspection: any) => {
            const status = getStatusColor(inspection.status)
            // Formatear fecha y hora
            const inspectionDate = new Date(inspection.date)
            const formattedDate = inspectionDate.toLocaleDateString()
            const formattedTime = inspectionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            
            return (
              <div key={inspection.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}>
                {/* Progress Circle - Smaller */}
                <div style={{ 
                  position: 'relative',
                  width: '50px',
                  height: '50px',
                  flexShrink: 0
                }}>
                  <svg width="50" height="50" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      stroke={
                        inspection.status === 'completed' ? '#10b981' :
                        inspection.status === 'in-progress' ? '#3b82f6' : '#f59e0b'
                      }
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - inspection.progress / 100)}`}
                      style={{ transition: 'stroke-dashoffset 0.3s' }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    {inspection.progress}%
                  </div>
                </div>

                {/* Main Info - Compact */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#111827',
                      margin: 0
                    }}>
                      {inspection.name}
                    </h3>
                    <span style={{
                      fontSize: '13px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: status.bg,
                      color: status.color,
                      fontWeight: '500'
                    }}>
                      {status.label}
                    </span>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      {inspection.code}
                    </span>
                  </div>
                  
                  {/* Compact Details in One Line */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '16px',
                    fontSize: '13px',
                    color: '#6b7280',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building2 size={14} />
                      {inspection.property?.name || 'Sin propiedad'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={14} />
                      {inspection.clientName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={14} style={{ color: '#dc2626' }} />
                      {inspection.inspector?.name || 'Sin asignar'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      {formattedDate}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {formattedTime}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  flexShrink: 0
                }}>
                  {inspection.status === 'completed' && (
                    <button style={{
                      padding: '6px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: '#374151',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FileText size={14} />
                      Ver Reporte
                    </button>
                  )}
                  {inspection.status === 'in-progress' && (
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#3b82f6',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      Continuar
                    </button>
                  )}
                  {inspection.status === 'scheduled' && (
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      Iniciar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal for New Inspection */}
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
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Nueva Inspección</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateInspection(); }}>
              {/* Inspection Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Nombre de la Inspección <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newInspection.name}
                  onChange={(e) => setNewInspection({ ...newInspection, name: e.target.value })}
                  placeholder="Ej: Inspección Anual Completa"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Client Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Nombre del Cliente <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newInspection.clientName}
                  onChange={(e) => setNewInspection({ ...newInspection, clientName: e.target.value })}
                  placeholder="Ej: María García"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Property Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Propiedad <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={newInspection.propertyId}
                  onChange={(e) => setNewInspection({ ...newInspection, propertyId: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Selecciona una propiedad</option>
                  {properties.map((property: any) => (
                    <option key={property.id} value={property.id}>
                      {property.name} - {property.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Inspector Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Inspector <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={newInspection.inspectorId}
                  onChange={(e) => setNewInspection({ ...newInspection, inspectorId: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Selecciona un inspector</option>
                  {inspectors.map((inspector: any) => (
                    <option key={inspector.id} value={inspector.id}>
                      {inspector.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Fecha <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={newInspection.date}
                    onChange={(e) => setNewInspection({ ...newInspection, date: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
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
                    Hora <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="time"
                    value={newInspection.time}
                    onChange={(e) => setNewInspection({ ...newInspection, time: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Comments */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Comentarios
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    marginLeft: '8px',
                    fontWeight: '400'
                  }}>
                    (Opcional)
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <MessageSquare 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '12px',
                      color: '#9ca3af'
                    }} 
                  />
                  <textarea
                    value={newInspection.comments}
                    onChange={(e) => setNewInspection({ ...newInspection, comments: e.target.value })}
                    placeholder="Agrega notas o instrucciones especiales para esta inspección..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
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
                    borderRadius: '6px',
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
    </div>
  )
}