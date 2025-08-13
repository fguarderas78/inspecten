'use client'

import { useState } from 'react'

export default function TasksPage() {
  const [showDropdown, setShowDropdown] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)

  const toggleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? null : index)
  }

  // Datos de ejemplo - tareas relacionadas con inspecciones
  const allTasks = [
    {
      id: 1,
      title: 'Clarificar observaciones en baño principal',
      inspection: 'INS-001 - Casa Vista Hermosa',
      assignedTo: 'Carlos Mendez',
      assignedBy: 'Ana Torres (Supervisor)',
      priority: 'Alta',
      status: 'Pendiente',
      dueDate: '2024-07-23',
      createdDate: '2024-07-21',
      type: 'Corrección',
      description: 'Las fotos del baño principal no muestran claramente el daño. Favor tomar nuevas fotos y actualizar el comentario.',
      comments: 2
    },
    {
      id: 2,
      title: 'Completar sección de electricidad',
      inspection: 'INS-002 - Edificio Centro',
      assignedTo: 'Juan Martinez',
      assignedBy: 'Francisco Guarderas (Admin)',
      priority: 'Media',
      status: 'En Progreso',
      dueDate: '2024-07-24',
      createdDate: '2024-07-20',
      type: 'Actualización',
      description: 'Falta completar la inspección del sistema eléctrico del piso 3.',
      comments: 5
    },
    {
      id: 3,
      title: 'Revisar medidas de seguridad',
      inspection: 'INS-003 - Local Comercial Plaza',
      assignedTo: 'Ana Torres',
      assignedBy: 'Francisco Guarderas (Admin)',
      priority: 'Alta',
      status: 'Completada',
      dueDate: '2024-07-20',
      createdDate: '2024-07-18',
      type: 'Revisión',
      description: 'Verificar que todas las salidas de emergencia estén correctamente documentadas.',
      comments: 8
    },
    {
      id: 4,
      title: 'Agregar fotos faltantes de cocina',
      inspection: 'INS-004 - Departamento Torre Sol',
      assignedTo: 'Carlos Mendez',
      assignedBy: 'Ana Torres (Supervisor)',
      priority: 'Media',
      status: 'Pendiente',
      dueDate: '2024-07-25',
      createdDate: '2024-07-21',
      type: 'Corrección',
      description: 'Faltan fotos de los gabinetes superiores y del área de lavado.',
      comments: 0
    },
    {
      id: 5,
      title: 'Error en reporte - corregir dirección',
      inspection: 'INS-005 - Casa Los Robles',
      assignedTo: 'Juan Martinez',
      assignedBy: 'Francisco Guarderas (Admin)',
      priority: 'Baja',
      status: 'Vencida',
      dueDate: '2024-07-19',
      createdDate: '2024-07-15',
      type: 'Corrección',
      description: 'La dirección en el reporte está incorrecta. Debe ser Calle 45 no 54.',
      comments: 3
    }
  ]

  // Filtrar tareas
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.inspection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filter === 'all' || task.status === filter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completada':
        return { bg: '#d1fae5', color: '#065f46' }
      case 'En Progreso':
        return { bg: '#dbeafe', color: '#1e40af' }
      case 'Pendiente':
        return { bg: '#fef3c7', color: '#92400e' }
      case 'Vencida':
        return { bg: '#fee2e2', color: '#dc2626' }
      default:
        return { bg: '#f3f4f6', color: '#374151' }
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Alta':
        return '#dc2626'
      case 'Media':
        return '#f59e0b'
      case 'Baja':
        return '#3b82f6'
      default:
        return '#6b7280'
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Corrección':
        return '🔧'
      case 'Actualización':
        return '📝'
      case 'Revisión':
        return '👁️'
      default:
        return '📋'
    }
  }

  // Estadísticas
  const stats = {
    total: allTasks.length,
    pendientes: allTasks.filter(t => t.status === 'Pendiente').length,
    enProgreso: allTasks.filter(t => t.status === 'En Progreso').length,
    completadas: allTasks.filter(t => t.status === 'Completada').length,
    vencidas: allTasks.filter(t => t.status === 'Vencida').length
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>Tareas de Inspección</h1>
        <button 
          onClick={() => setShowNewTaskModal(true)}
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
          <span>+</span> Asignar Nueva Tarea
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '10px'
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'all' ? '#dc2626' : 'transparent',
            color: filter === 'all' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Todas ({stats.total})
        </button>
        <button
          onClick={() => setFilter('Pendiente')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'Pendiente' ? '#f59e0b' : 'transparent',
            color: filter === 'Pendiente' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Pendientes ({stats.pendientes})
        </button>
        <button
          onClick={() => setFilter('En Progreso')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'En Progreso' ? '#3b82f6' : 'transparent',
            color: filter === 'En Progreso' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          En Progreso ({stats.enProgreso})
        </button>
        <button
          onClick={() => setFilter('Completada')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'Completada' ? '#10b981' : 'transparent',
            color: filter === 'Completada' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Completadas ({stats.completadas})
        </button>
        <button
          onClick={() => setFilter('Vencida')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'Vencida' ? '#dc2626' : 'transparent',
            color: filter === 'Vencida' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Vencidas ({stats.vencidas})
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Buscar tareas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredTasks.map((task, index) => {
          const statusStyle = getStatusColor(task.status)
          
          return (
            <div key={task.id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              borderLeft: `4px solid ${getPriorityColor(task.priority)}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>{getTypeIcon(task.type)}</span>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {task.title}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                      padding: '4px 10px',
                      borderRadius: '9999px'
                    }}>
                      {task.status}
                    </span>
                  </div>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#3b82f6',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    {task.inspection}
                  </p>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '12px'
                  }}>
                    {task.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    <div>
                      <strong>Asignado a:</strong> {task.assignedTo}
                    </div>
                    <div>
                      <strong>Por:</strong> {task.assignedBy}
                    </div>
                    <div>
                      <strong>Vence:</strong> {task.dueDate}
                    </div>
                    <div>
                      <strong>Comentarios:</strong> {task.comments}
                    </div>
                  </div>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => toggleDropdown(index)}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                  >
                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showDropdown === index && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '30px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      zIndex: 10,
                      minWidth: '200px'
                    }}>
                      <a href="#" style={{
                        display: 'block',
                        padding: '10px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Ver Inspección
                      </a>
                      <a href="#" style={{
                        display: 'block',
                        padding: '10px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Ver Comentarios
                      </a>
                      {task.status !== 'Completada' && (
                        <>
                          <a href="#" style={{
                            display: 'block',
                            padding: '10px 16px',
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '14px',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            Actualizar Estado
                          </a>
                          <a href="#" style={{
                            display: 'block',
                            padding: '10px 16px',
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '14px',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            Cambiar Fecha Límite
                          </a>
                          <a href="#" style={{
                            display: 'block',
                            padding: '10px 16px',
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '14px',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            Reasignar
                          </a>
                        </>
                      )}
                      <a href="#" style={{
                        display: 'block',
                        padding: '10px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Enviar Recordatorio
                      </a>
                      <a href="#" style={{
                        display: 'block',
                        padding: '10px 16px',
                        color: '#dc2626',
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}>
                        Eliminar Tarea
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid #e5e7eb'
              }}>
                {task.status === 'Pendiente' && (
                  <button style={{
                    padding: '6px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}>
                    Iniciar Tarea
                  </button>
                )}
                {task.status === 'En Progreso' && (
                  <button style={{
                    padding: '6px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}>
                    Marcar como Completada
                  </button>
                )}
                <button style={{
                  padding: '6px 16px',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  Agregar Comentario
                </button>
                <button style={{
                  padding: '6px 16px',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  Ver Detalles
                </button>
              </div>
            </div>
          )
        })}
      </div>
      
      {filteredTasks.length === 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '60px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          No se encontraron tareas
        </div>
      )}

      {/* Modal de Nueva Tarea (simplificado) */}
      {showNewTaskModal && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Asignar Nueva Tarea
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              Asigna tareas de corrección o actualización a los inspectores
            </p>
            <button
              onClick={() => setShowNewTaskModal(false)}
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
            {/* Aquí iría el formulario completo */}
          </div>
        </div>
      )}
    </div>
  )
}