'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ScheduleEvent {
  id: string
  title: string
  type: 'inspection' | 'meeting' | 'task' | 'reminder'
  property?: string
  client?: string
  inspector?: string
  date: string
  startTime: string
  endTime: string
  status: 'confirmed' | 'tentative' | 'cancelled'
  location?: string
  notes?: string
  attendees?: string[]
  color: string
}

export default function SchedulesPage() {
  const router = useRouter()
  const [viewType, setViewType] = useState<'list' | 'day' | 'week' | 'month'>('list')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewEventModal, setShowNewEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null)

  // Datos de ejemplo
  const [events] = useState<ScheduleEvent[]>([
    {
      id: 'EVT-001',
      title: 'Inspección Casa Los Robles',
      type: 'inspection',
      property: 'Casa Los Robles',
      client: 'Juan Pérez',
      inspector: 'Carlos López',
      date: '2024-01-23',
      startTime: '09:00',
      endTime: '11:00',
      status: 'confirmed',
      location: 'Av. Principal 123, Quito',
      notes: 'Llevar equipo de medición',
      color: '#dc2626'
    },
    {
      id: 'EVT-002',
      title: 'Reunión con cliente - Edificio Central',
      type: 'meeting',
      client: 'María García',
      date: '2024-01-23',
      startTime: '14:00',
      endTime: '15:00',
      status: 'confirmed',
      location: 'Oficina principal',
      attendees: ['María García', 'Ana Martínez', 'Francisco Guarderas'],
      color: '#3b82f6'
    },
    {
      id: 'EVT-003',
      title: 'Revisión sistema eléctrico',
      type: 'task',
      property: 'Local Plaza Norte',
      date: '2024-01-24',
      startTime: '10:00',
      endTime: '12:00',
      status: 'tentative',
      inspector: 'Pedro Sánchez',
      color: '#f59e0b'
    },
    {
      id: 'EVT-004',
      title: 'Recordatorio: Enviar reporte mensual',
      type: 'reminder',
      date: '2024-01-25',
      startTime: '09:00',
      endTime: '09:30',
      status: 'confirmed',
      color: '#10b981'
    },
    {
      id: 'EVT-005',
      title: 'Inspección Pre-compra Departamento Sky',
      type: 'inspection',
      property: 'Departamento Sky Tower',
      client: 'Roberto Silva',
      inspector: 'Carlos López',
      date: '2024-01-25',
      startTime: '15:00',
      endTime: '17:00',
      status: 'confirmed',
      location: 'Torre Sky Piso 15',
      color: '#dc2626'
    }
  ])

  const handleClickOutside = () => {
    setActiveActionMenu(null)
  }

  const viewEventDetails = (event: ScheduleEvent) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
    setActiveActionMenu(null)
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'inspection': return '📋'
      case 'meeting': return '👥'
      case 'task': return '✓'
      case 'reminder': return '🔔'
      default: return '📅'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return { text: 'Confirmado', color: '#10b981' }
      case 'tentative': return { text: 'Por confirmar', color: '#f59e0b' }
      case 'cancelled': return { text: 'Cancelado', color: '#dc2626' }
      default: return { text: status, color: '#6b7280' }
    }
  }

  // Filtrado
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.property && event.property.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.client && event.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.inspector && event.inspector.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || event.type === filterType
    
    return matchesSearch && matchesType
  })

  // Agrupar eventos por fecha
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const date = event.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {} as Record<string, ScheduleEvent[]>)

  // Ordenar fechas
  const sortedDates = Object.keys(groupedEvents).sort()

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
            Agenda
          </h1>
          <p style={{ color: '#6b7280' }}>
            Gestiona tu calendario de inspecciones y eventos
          </p>
        </div>
        <button
          onClick={() => setShowNewEventModal(true)}
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
          <span>+</span> Nuevo Evento
        </button>
      </div>

      {/* Controles de vista y filtros */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          {/* Selector de vista */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewType('list')}
              style={{
                padding: '8px 16px',
                backgroundColor: viewType === 'list' ? '#dc2626' : 'white',
                color: viewType === 'list' ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Lista
            </button>
            <button
              onClick={() => setViewType('day')}
              style={{
                padding: '8px 16px',
                backgroundColor: viewType === 'day' ? '#dc2626' : 'white',
                color: viewType === 'day' ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Día
            </button>
            <button
              onClick={() => setViewType('week')}
              style={{
                padding: '8px 16px',
                backgroundColor: viewType === 'week' ? '#dc2626' : 'white',
                color: viewType === 'week' ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Semana
            </button>
            <button
              onClick={() => setViewType('month')}
              style={{
                padding: '8px 16px',
                backgroundColor: viewType === 'month' ? '#dc2626' : 'white',
                color: viewType === 'month' ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Mes
            </button>
          </div>

          {/* Navegación de fecha */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              padding: '6px',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              ←
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button style={{
              padding: '6px',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              →
            </button>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Hoy
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 200px',
          gap: '16px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Buscar por título, propiedad, cliente o inspector..."
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
            <option value="inspection">Inspecciones</option>
            <option value="meeting">Reuniones</option>
            <option value="task">Tareas</option>
            <option value="reminder">Recordatorios</option>
          </select>
        </div>
      </div>

      {/* Vista de Lista Compacta */}
      {viewType === 'list' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {sortedDates.map((date, dateIndex) => (
            <div key={date}>
              {/* Separador de fecha */}
              <div style={{
                padding: '12px 20px',
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>📅</span>
                {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {groupedEvents[date].length} eventos
                </span>
              </div>

              {/* Eventos del día */}
              {groupedEvents[date].map((event, index) => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 20px',
                    borderBottom: dateIndex === sortedDates.length - 1 && index === groupedEvents[date].length - 1 
                      ? 'none' 
                      : '1px solid #e5e7eb',
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
                  {/* Indicador de color */}
                  <div style={{
                    width: '4px',
                    height: '40px',
                    backgroundColor: event.color,
                    borderRadius: '2px',
                    marginRight: '12px'
                  }} />

                  {/* Hora */}
                  <div style={{
                    marginRight: '16px',
                    minWidth: '100px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {event.startTime} - {event.endTime}
                  </div>

                  {/* Información principal */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '18px' }}>{getEventIcon(event.type)}</span>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0
                      }}>
                        {event.title}
                      </h3>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: `${getStatusBadge(event.status).color}20`,
                        color: getStatusBadge(event.status).color
                      }}>
                        {getStatusBadge(event.status).text}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center'
                    }}>
                      {event.property && <span>📍 {event.property}</span>}
                      {event.client && <span>👤 Cliente: {event.client}</span>}
                      {event.inspector && <span>🔍 Inspector: {event.inspector}</span>}
                      {event.location && <span>📌 {event.location}</span>}
                    </div>
                  </div>

                  {/* Botón de acciones */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveActionMenu(activeActionMenu === event.id ? null : event.id)
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
                  {activeActionMenu === event.id && (
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
                        onClick={() => viewEventDetails(event)}
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
                        📅 Reprogramar
                      </button>
                      {event.status !== 'cancelled' && (
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
                          ❌ Cancelar
                        </button>
                      )}
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
          ))}
        </div>
      )}

      {/* Placeholder para otras vistas */}
      {viewType !== 'list' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <p>Vista de {viewType === 'day' ? 'Día' : viewType === 'week' ? 'Semana' : 'Mes'} en desarrollo</p>
        </div>
      )}

      {/* Modal Nuevo Evento */}
      {showNewEventModal && (
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
        onClick={() => setShowNewEventModal(false)}
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
              Nuevo Evento
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
                  Tipo de Evento
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <option value="inspection">📋 Inspección</option>
                  <option value="meeting">👥 Reunión</option>
                  <option value="task">✓ Tarea</option>
                  <option value="reminder">🔔 Recordatorio</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Título del Evento
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
                  placeholder="Ej: Inspección Casa Los Robles"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
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
                    Hora inicio
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

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Hora fin
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Propiedad (si aplica)
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <option value="">Seleccionar propiedad</option>
                    <option value="1">Casa Los Robles</option>
                    <option value="2">Edificio Central</option>
                    <option value="3">Local Plaza Norte</option>
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
                    Inspector/Responsable
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <option value="">Seleccionar responsable</option>
                    <option value="1">Carlos López</option>
                    <option value="2">Ana Martínez</option>
                    <option value="3">Pedro Sánchez</option>
                  </select>
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
                  Ubicación
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
                  placeholder="Dirección o lugar del evento"
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
                  Asistentes (para reuniones)
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
                  placeholder="Separar con comas: Juan Pérez, María García..."
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Notas
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
                  placeholder="Detalles adicionales del evento..."
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowNewEventModal(false)}
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
                  Crear Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalles del Evento */}
      {showEventDetails && selectedEvent && (
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
        onClick={() => setShowEventDetails(false)}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{getEventIcon(selectedEvent.type)}</span>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#111827'
                  }}>
                    {selectedEvent.title}
                  </h2>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: `${getStatusBadge(selectedEvent.status).color}20`,
                  color: getStatusBadge(selectedEvent.status).color
                }}>
                  {getStatusBadge(selectedEvent.status).text}
                </span>
              </div>
              <button
                onClick={() => setShowEventDetails(false)}
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

            {/* Información del evento */}
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>📅 Fecha</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    {new Date(selectedEvent.date + 'T00:00:00').toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>⏰ Horario</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles adicionales */}
            {selectedEvent.location && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  📍 Ubicación
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedEvent.location}</p>
              </div>
            )}

            {selectedEvent.property && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  🏠 Propiedad
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedEvent.property}</p>
              </div>
            )}

            {selectedEvent.client && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  👤 Cliente
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedEvent.client}</p>
              </div>
            )}

            {selectedEvent.inspector && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  🔍 Inspector
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedEvent.inspector}</p>
              </div>
            )}

            {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  👥 Asistentes
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedEvent.attendees.map((attendee, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '16px',
                        fontSize: '13px'
                      }}
                    >
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedEvent.notes && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  📝 Notas
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedEvent.notes}</p>
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
              {selectedEvent.type === 'inspection' && (
                <button
                  onClick={() => router.push(`/dashboard/inspections/${selectedEvent.id}`)}
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
                  Ir a Inspección
                </button>
              )}
              <button
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