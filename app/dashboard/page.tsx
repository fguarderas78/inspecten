'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [period, setPeriod] = useState('month')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewInspection, setShowNewInspection] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Función para formatear fechas de manera consistente
  const formatDate = (date: string | Date): string => {
    if (!date) return ''
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return ''
    
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    
    return `${day}/${month}/${year}`
  }

  // Estadísticas dinámicas según el período
  const [stats, setStats] = useState({
    total: 67,
    completed: 52,
    pending: 15,
    tasks: 34
  })

  // Actualizar estadísticas cuando cambie el período
  useEffect(() => {
    const statsData = {
      day: { total: 3, completed: 2, pending: 1, tasks: 4 },
      week: { total: 15, completed: 12, pending: 3, tasks: 8 },
      month: { total: 67, completed: 52, pending: 15, tasks: 34 },
      year: { total: 845, completed: 712, pending: 133, tasks: 423 }
    }
    setStats(statsData[period as keyof typeof statsData])
  }, [period])

  // Atajo de teclado para búsqueda (tecla F)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault()
          document.getElementById('search-input')?.focus()
        }
      }
    }
    
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [])

  // Cálculo del porcentaje de completado
  const completionPercentage = Math.round((stats.completed / stats.total) * 100) || 0

  // Datos de ejemplo
  const recentInspections = [
    { 
      id: 1, 
      property: 'Torre Alfa - Piso 12', 
      client: 'Juan Pérez', 
      date: '2024-01-19', 
      inspector: 'Carlos Mendez',
      status: 'completed' 
    },
    { 
      id: 2, 
      property: 'Casa Los Ceibos', 
      client: 'María García', 
      date: '2024-01-18', 
      inspector: 'Ana López',
      status: 'in-progress' 
    },
    { 
      id: 3, 
      property: 'Oficina Centro', 
      client: 'Roberto Silva', 
      date: '2024-01-17', 
      inspector: 'Pedro Ruiz',
      status: 'completed' 
    },
    { 
      id: 4, 
      property: 'Local Comercial Mall', 
      client: 'Carmen Díaz', 
      date: '2024-01-16', 
      inspector: 'Carlos Mendez',
      status: 'completed' 
    },
    { 
      id: 5, 
      property: 'Bodega Industrial Norte', 
      client: 'Luis Martínez', 
      date: '2024-01-15', 
      inspector: 'Ana López',
      status: 'in-progress' 
    }
  ]

  const pendingTasks = [
    { 
      id: 1, 
      task: 'Revisar sistema eléctrico', 
      property: 'Torre Alfa', 
      priority: 'high',
      dueDate: '2024-01-20' 
    },
    { 
      id: 2, 
      task: 'Inspección de fontanería', 
      property: 'Casa Los Ceibos', 
      priority: 'medium',
      dueDate: '2024-01-21' 
    },
    { 
      id: 3, 
      task: 'Verificar aire acondicionado', 
      property: 'Oficina Centro', 
      priority: 'low',
      dueDate: '2024-01-22' 
    },
    { 
      id: 4, 
      task: 'Evaluar estructura', 
      property: 'Local Mall', 
      priority: 'high',
      dueDate: '2024-01-23' 
    },
    { 
      id: 5, 
      task: 'Revisar sistema contra incendios', 
      property: 'Bodega Industrial', 
      priority: 'medium',
      dueDate: '2024-01-24' 
    }
  ]

  const upcomingInspections = [
    { 
      id: 1, 
      property: 'Departamento Vista Mar', 
      client: 'Ana Rodríguez', 
      date: '2024-01-22',
      time: '09:00',
      inspector: 'Carlos Mendez' 
    },
    { 
      id: 2, 
      property: 'Casa Samborondón', 
      client: 'Pedro López', 
      date: '2024-01-23',
      time: '14:00',
      inspector: 'Ana López' 
    },
    { 
      id: 3, 
      property: 'Oficina Edificio Trade', 
      client: 'Sofía Vera', 
      date: '2024-01-24',
      time: '10:00',
      inspector: 'Pedro Ruiz' 
    },
    { 
      id: 4, 
      property: 'Local Plaza Lagos', 
      client: 'Miguel Ángel Torres', 
      date: '2024-01-25',
      time: '11:00',
      inspector: 'Carlos Mendez' 
    },
    { 
      id: 5, 
      property: 'Penthouse Bellini', 
      client: 'Patricia Mendoza', 
      date: '2024-01-26',
      time: '16:00',
      inspector: 'Ana López' 
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return priority
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
      case 'in-progress': return 'En proceso'
      case 'pending': return 'Pendiente'
      default: return status
    }
  }

  // Manejar clic en tarjetas de estadísticas
  const handleStatCardClick = (type: string) => {
    switch (type) {
      case 'total':
        router.push('/dashboard/inspections')
        break
      case 'completed':
        router.push('/dashboard/inspections?status=completed')
        break
      case 'pending':
        router.push('/dashboard/inspections?status=pending')
        break
      case 'tasks':
        router.push('/dashboard/tasks')
        break
    }
  }

  return (
    <div>
      {/* Header - SIN Checklist Library, Video Library y Support */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '4px'
          }}>
            Página Principal
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Bienvenido de vuelta, Francisco
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            position: 'relative'
          }}>
            <input
              id="search-input"
              type="text"
              placeholder="Buscar... (presiona F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              style={{
                padding: '8px 16px 8px 36px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                width: '250px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
            <svg 
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9ca3af'
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            {/* Indicador de atajo de teclado */}
            {!isSearchFocused && !searchQuery && (
              <span style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '500',
                border: '1px solid #e5e7eb'
              }}>
                F
              </span>
            )}
          </div>
          
          <button
            onClick={() => {
              router.push('/dashboard/inspections')
            }}
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
              gap: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          >
            <span style={{ fontSize: '16px' }}>+</span>
            Nueva Inspección
          </button>
        </div>
      </div>

      {/* Selector de período */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '20px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '8px'
      }}>
        {[
          { value: 'day', label: 'Día' },
          { value: 'week', label: 'Semana' },
          { value: 'month', label: 'Mes' },
          { value: 'year', label: 'Año' }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setPeriod(option.value)}
            style={{
              padding: '4px 12px',
              backgroundColor: period === option.value ? '#dc2626' : 'transparent',
              color: period === option.value ? 'white' : '#6b7280',
              border: period === option.value ? 'none' : '1px solid #e5e7eb',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Tarjetas de estadísticas - MÁS PEQUEÑAS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Total de Inspecciones */}
        <div 
          onClick={() => handleStatCardClick('total')}
          style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
                Total Inspecciones
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                {stats.total}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fee2e2',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>📋</span>
            </div>
          </div>
        </div>

        {/* Completadas */}
        <div 
          onClick={() => handleStatCardClick('completed')}
          style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
                Completadas
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
                {stats.completed}
              </p>
              <div style={{ marginTop: '6px' }}>
                <div style={{
                  backgroundColor: '#e5e7eb',
                  height: '6px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  width: '80px'
                }}>
                  <div style={{
                    backgroundColor: '#10b981',
                    height: '100%',
                    width: `${completionPercentage}%`,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                  {completionPercentage}% del total
                </p>
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#d1fae5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>✓</span>
            </div>
          </div>
        </div>

        {/* Pendientes */}
        <div 
          onClick={() => handleStatCardClick('pending')}
          style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
                Pendientes
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
                {stats.pending}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>⏰</span>
            </div>
          </div>
        </div>

        {/* Tareas */}
        <div 
          onClick={() => handleStatCardClick('tasks')}
          style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
                Tareas Activas
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
                {stats.tasks}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>📝</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secciones de contenido */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '20px' 
      }}>
        {/* Inspecciones Recientes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              Inspecciones Recientes
            </h2>
            <button
              onClick={() => router.push('/dashboard/inspections')}
              style={{
                color: '#dc2626',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Ver todas →
            </button>
          </div>
          
          <div style={{ maxHeight: '280px', overflow: 'auto' }}>
            {recentInspections.map((inspection, index) => (
              <div 
                key={inspection.id} 
                style={{
                  padding: '10px 20px',
                  borderBottom: index < recentInspections.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  flex: 1,
                  alignItems: 'center',
                  minWidth: 0 
                }}>
                  <span style={{ 
                    fontWeight: '500', 
                    color: '#111827',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '160px'
                  }}>
                    {inspection.property}
                  </span>
                  <span style={{ 
                    color: '#6b7280', 
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100px'
                  }}>
                    {inspection.client}
                  </span>
                  <span style={{ 
                    color: '#6b7280', 
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}>
                    {formatDate(inspection.date)}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    backgroundColor: `${getStatusColor(inspection.status)}20`,
                    color: getStatusColor(inspection.status),
                    whiteSpace: 'nowrap'
                  }}>
                    {getStatusText(inspection.status)}
                  </span>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/inspections?id=${inspection.id}`)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tareas Pendientes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              Tareas Pendientes
            </h2>
            <button
              onClick={() => router.push('/dashboard/tasks')}
              style={{
                color: '#dc2626',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Ver todas →
            </button>
          </div>
          
          <div style={{ maxHeight: '280px', overflow: 'auto' }}>
            {pendingTasks.map((task, index) => (
              <div 
                key={task.id} 
                style={{
                  padding: '10px 20px',
                  borderBottom: index < pendingTasks.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  flex: 1,
                  alignItems: 'center',
                  minWidth: 0 
                }}>
                  <span style={{ 
                    fontWeight: '500', 
                    color: '#111827',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '160px'
                  }}>
                    {task.task}
                  </span>
                  <span style={{ 
                    color: '#6b7280', 
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100px'
                  }}>
                    {task.property}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    backgroundColor: `${getPriorityColor(task.priority)}20`,
                    color: getPriorityColor(task.priority),
                    whiteSpace: 'nowrap'
                  }}>
                    {getPriorityText(task.priority)}
                  </span>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/tasks?id=${task.id}`)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas Inspecciones */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          gridColumn: 'span 2'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              Próximas Inspecciones
            </h2>
            <button
              onClick={() => router.push('/dashboard/schedules')}
              style={{
                color: '#dc2626',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Ver calendario completo →
            </button>
          </div>
          
          <div style={{ maxHeight: '280px', overflow: 'auto' }}>
            {upcomingInspections.map((inspection, index) => (
              <div 
                key={inspection.id} 
                style={{
                  padding: '10px 20px',
                  borderBottom: index < upcomingInspections.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  flex: 1,
                  alignItems: 'center',
                  minWidth: 0 
                }}>
                  <span style={{ 
                    fontWeight: '500', 
                    color: '#111827',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '180px'
                  }}>
                    {inspection.property}
                  </span>
                  <span style={{ 
                    color: '#6b7280', 
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '120px'
                  }}>
                    {inspection.client}
                  </span>
                  <span style={{ 
                    color: '#6b7280', 
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}>
                    {formatDate(inspection.date)}
                  </span>
                  <span style={{ 
                    color: '#dc2626', 
                    fontSize: '12px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}>
                    {inspection.time}
                  </span>
                  <span style={{ 
                    color: '#6b7280', 
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100px'
                  }}>
                    {inspection.inspector}
                  </span>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/schedules?date=${inspection.date}`)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}