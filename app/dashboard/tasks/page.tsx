'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  property?: string
  inspection?: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string
  createdDate: string
  category: string
  attachments?: number
  comments?: number
}

export default function TasksPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null)

  // Datos de ejemplo
  const [tasks] = useState<Task[]>([
    {
      id: 'TSK-001',
      title: 'Reparar filtraciones en el techo',
      description: 'Se detectaron filtraciones durante la inspección',
      assignedTo: 'Juan Pérez',
      property: 'Casa Los Robles',
      inspection: 'INS-2024-001',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-01-25',
      createdDate: '2024-01-20',
      category: 'Mantenimiento',
      attachments: 3,
      comments: 2
    },
    {
      id: 'TSK-002',
      title: 'Revisar sistema eléctrico',
      description: 'Verificar conexiones del panel principal',
      assignedTo: 'Carlos López',
      property: 'Edificio Central',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2024-01-26',
      createdDate: '2024-01-21',
      category: 'Seguridad',
      attachments: 1,
      comments: 5
    },
    {
      id: 'TSK-003',
      title: 'Actualizar documentación de propiedad',
      description: 'Completar formularios de registro municipal',
      assignedTo: 'Ana Martínez',
      property: 'Local Plaza Norte',
      priority: 'low',
      status: 'completed',
      dueDate: '2024-01-22',
      createdDate: '2024-01-15',
      category: 'Administrativo',
      comments: 3
    },
    {
      id: 'TSK-004',
      title: 'Inspección de seguimiento',
      description: 'Verificar correcciones realizadas',
      assignedTo: 'Pedro Sánchez',
      property: 'Departamento Sky Tower',
      inspection: 'INS-2024-004',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-01-24',
      createdDate: '2024-01-22',
      category: 'Inspección',
      attachments: 2
    }
  ])

  const handleClickOutside = () => {
    setActiveActionMenu(null)
  }

  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setShowTaskDetails(true)
    setActiveActionMenu(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626'
      case 'medium': return '#f59e0b'
      case 'low': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#f59e0b'
      case 'pending': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada'
      case 'in-progress': return 'En Proceso'
      case 'pending': return 'Pendiente'
      default: return status
    }
  }

  // Filtrado
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.property && task.property.toLowerCase().includes(searchTerm.toLowerCase())) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesAssignee = filterAssignee === 'all' || task.assignedTo === filterAssignee
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  // Estadísticas rápidas
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
  }

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
            Tareas
          </h1>
          <p style={{ color: '#6b7280' }}>
            Gestiona las tareas pendientes y asignaciones
          </p>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
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
          <span>+</span> Nueva Tarea
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.total}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Total</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280' }}>{stats.pending}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Pendientes</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.inProgress}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>En Proceso</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{stats.completed}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Completadas</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          borderLeft: '4px solid #dc2626'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{stats.highPriority}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Alta Prioridad</div>
        </div>
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
          gridTemplateColumns: '1fr 180px 180px 180px',
          gap: '16px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Buscar por título, descripción, propiedad o asignado..."
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
            <option value="pending">Pendientes</option>
            <option value="in-progress">En Proceso</option>
            <option value="completed">Completadas</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todas las prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todos los asignados</option>
            <option value="Juan Pérez">Juan Pérez</option>
            <option value="Carlos López">Carlos López</option>
            <option value="Ana Martínez">Ana Martínez</option>
            <option value="Pedro Sánchez">Pedro Sánchez</option>
          </select>
        </div>
      </div>

      {/* Lista de Tareas Compacta */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {filteredTasks.map((task, index) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              borderBottom: index < filteredTasks.length - 1 ? '1px solid #e5e7eb' : 'none',
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
            {/* Indicador de prioridad */}
            <div style={{
              width: '4px',
              height: '40px',
              backgroundColor: getPriorityColor(task.priority),
              borderRadius: '2px',
              marginRight: '16px'
            }} />

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
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  opacity: task.status === 'completed' ? 0.7 : 1
                }}>
                  {task.title}
                </h3>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: `${getStatusColor(task.status)}20`,
                  color: getStatusColor(task.status)
                }}>
                  {getStatusText(task.status)}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: '#e0e7ff',
                  color: '#4338ca'
                }}>
                  {task.category}
                </span>
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <span>{task.description}</span>
                {task.property && (
                  <>
                    <span>•</span>
                    <span>📍 {task.property}</span>
                  </>
                )}
                <span>•</span>
                <span>👤 {task.assignedTo}</span>
                <span>•</span>
                <span>📅 Vence: {task.dueDate}</span>
              </div>
            </div>

            {/* Indicadores adicionales */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginRight: '20px',
              fontSize: '13px'
            }}>
              {task.attachments && task.attachments > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                  <span>📎</span>
                  <span>{task.attachments}</span>
                </div>
              )}
              {task.comments && task.comments > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                  <span>💬</span>
                  <span>{task.comments}</span>
                </div>
              )}
            </div>

            {/* Botón de acciones */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveActionMenu(activeActionMenu === task.id ? null : task.id)
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
            {activeActionMenu === task.id && (
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
                  onClick={() => viewTaskDetails(task)}
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
                {task.status !== 'completed' && (
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
                    ✅ Marcar completada
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
                  🔄 Reasignar
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

      {/* Modal Nueva Tarea */}
      {showNewTaskModal && (
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
        onClick={() => setShowNewTaskModal(false)}
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
              Nueva Tarea
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
                  Título de la Tarea
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
                  placeholder="Ej: Reparar filtraciones en el techo"
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
                  Descripción
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
                  placeholder="Detalles de la tarea..."
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
                    Asignar a
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <option value="">Seleccionar responsable</option>
                    <option value="1">Juan Pérez</option>
                    <option value="2">Carlos López</option>
                    <option value="3">Ana Martínez</option>
                    <option value="4">Pedro Sánchez</option>
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
                    Categoría
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <option value="">Seleccionar categoría</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="seguridad">Seguridad</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="inspeccion">Inspección</option>
                    <option value="limpieza">Limpieza</option>
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
                    Propiedad (opcional)
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
                    Fecha de vencimiento
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
                    <span style={{ color: '#dc2626' }}>🔴 Alta</span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}>
                    <input type="radio" name="priority" value="medium" defaultChecked />
                    <span style={{ color: '#f59e0b' }}>🟡 Media</span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}>
                    <input type="radio" name="priority" value="low" />
                    <span style={{ color: '#3b82f6' }}>🔵 Baja</span>
                  </label>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
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
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalles de Tarea */}
      {showTaskDetails && selectedTask && (
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
        onClick={() => setShowTaskDetails(false)}
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
                  {selectedTask.title}
                </h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: `${getStatusColor(selectedTask.status)}20`,
                    color: getStatusColor(selectedTask.status)
                  }}>
                    {getStatusText(selectedTask.status)}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '14px',
                    color: getPriorityColor(selectedTask.priority),
                    fontWeight: '500'
                  }}>
                    {selectedTask.priority === 'high' ? '🔴' : selectedTask.priority === 'medium' ? '🟡' : '🔵'}
                    Prioridad {selectedTask.priority === 'high' ? 'Alta' : selectedTask.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowTaskDetails(false)}
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
              <p style={{ fontSize: '15px', color: '#374151', marginBottom: '16px' }}>
                {selectedTask.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Asignado a</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedTask.assignedTo}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Categoría</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedTask.category}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Fecha de vencimiento</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedTask.dueDate}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Creada el</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedTask.createdDate}</p>
                </div>
              </div>
            </div>

            {/* Propiedad e Inspección relacionada */}
            {(selectedTask.property || selectedTask.inspection) && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '16px'
                }}>
                  Información Relacionada
                </h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {selectedTask.property && (
                    <div style={{
                      flex: 1,
                      padding: '16px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px'
                    }}>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Propiedad</p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827' }}>📍 {selectedTask.property}</p>
                    </div>
                  )}
                  {selectedTask.inspection && (
                    <div style={{
                      flex: 1,
                      padding: '16px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px'
                    }}>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Inspección</p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827' }}>📋 {selectedTask.inspection}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Adjuntos y Comentarios */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {selectedTask.attachments && selectedTask.attachments > 0 && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    📎 Archivos adjuntos ({selectedTask.attachments})
                  </h4>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    <div style={{ marginBottom: '8px' }}>• Imagen_reparacion_1.jpg</div>
                    <div style={{ marginBottom: '8px' }}>• Presupuesto.pdf</div>
                    <div>• Informe_tecnico.docx</div>
                  </div>
                </div>
              )}
              {selectedTask.comments && selectedTask.comments > 0 && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    💬 Comentarios ({selectedTask.comments})
                  </h4>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    Ver todos los comentarios →
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              {selectedTask.status !== 'completed' && (
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Marcar como Completada
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