'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  // Datos de ejemplo - en producción vendrían del backend
  const inspectionsPending = [
    { id: 1, property: 'Casa Los Pinos', date: '2024-01-28', client: 'María García', inspector: 'Carlos Ruiz' },
    { id: 2, property: 'Edificio Central', date: '2024-01-29', client: 'Juan Pérez', inspector: 'Ana López' },
    { id: 3, property: 'Local Comercial Norte', date: '2024-01-30', client: 'Roberto Silva', inspector: 'Carlos Ruiz' },
  ]

  const pendingTasks = [
    { id: 1, title: 'Revisar reporte de Casa Los Pinos', priority: 'alta', assignee: 'Carlos Ruiz', dueDate: '2024-01-28' },
    { id: 2, title: 'Contactar propietario Edificio Central', priority: 'media', assignee: 'Ana López', dueDate: '2024-01-29' },
    { id: 3, title: 'Actualizar checklist de seguridad', priority: 'baja', assignee: 'Pedro Martín', dueDate: '2024-01-30' },
    { id: 4, title: 'Programar reinspección Local Norte', priority: 'alta', assignee: 'Carlos Ruiz', dueDate: '2024-01-31' },
  ]

  const calendarEvents = [
    { id: 1, title: 'Inspección Casa Los Pinos', date: '2024-01-28', time: '09:00', type: 'inspection', inspectionId: 1 },
    { id: 2, title: 'Reunión equipo técnico', date: '2024-01-28', time: '14:00', type: 'meeting' },
    { id: 3, title: 'Inspección Edificio Central', date: '2024-01-29', time: '10:00', type: 'inspection', inspectionId: 2 },
    { id: 4, title: 'Capacitación nuevos inspectores', date: '2024-01-30', time: '15:00', type: 'training' },
  ]

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'alta': return '#dc2626'
      case 'media': return '#f59e0b'
      case 'baja': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'inspection': return '#dc2626'
      case 'meeting': return '#3b82f6'
      case 'training': return '#10b981'
      default: return '#6b7280'
    }
  }

  const handleInspectionClick = (inspectionId: number) => {
    // Navegar a la inspección específica
    router.push(`/dashboard/inspections/${inspectionId}`)
  }

  const handleTaskClick = (taskId: number) => {
    // Navegar a la tarea específica
    router.push(`/dashboard/tasks/${taskId}`)
  }

  const handleEventClick = (event: any) => {
    if (event.type === 'inspection' && event.inspectionId) {
      // Si es una inspección, abrir esa inspección
      router.push(`/dashboard/inspections/${event.inspectionId}`)
    } else {
      // Si no, ir al calendario general
      router.push('/dashboard/schedules')
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280' }}>
          Bienvenido de vuelta, Francisco
        </p>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {/* Inspecciones Pendientes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fef2f2'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              📋 Inspecciones Pendientes
            </h2>
            <button
              onClick={() => router.push('/dashboard/inspections')}
              style={{
                fontSize: '14px',
                color: '#dc2626',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Ver todas →
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            {inspectionsPending.map((inspection, index) => (
              <div
                key={inspection.id}
                onClick={() => handleInspectionClick(inspection.id)}
                style={{
                  padding: '16px',
                  marginBottom: index < inspectionsPending.length - 1 ? '12px' : '0',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fee2e2'
                  e.currentTarget.style.borderColor = '#dc2626'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                    {inspection.property}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Cliente: {inspection.client}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#dc2626' }}>
                    📅 {inspection.date}
                  </span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    Inspector: {inspection.inspector}
                  </span>
                </div>
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
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#eff6ff'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              ✓ Tareas Pendientes
            </h2>
            <button
              onClick={() => router.push('/dashboard/tasks')}
              style={{
                fontSize: '14px',
                color: '#3b82f6',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Ver todas →
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            {pendingTasks.map((task, index) => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                style={{
                  padding: '16px',
                  marginBottom: index < pendingTasks.length - 1 ? '12px' : '0',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff'
                  e.currentTarget.style.borderColor = '#3b82f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                    {task.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Asignado a: {task.assignee}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getPriorityColor(task.priority) + '20',
                    color: getPriorityColor(task.priority),
                    fontWeight: '500'
                  }}>
                    Prioridad {task.priority}
                  </span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    Vence: {task.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendario / Agenda */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f0fdf4'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              📅 Próximos Eventos
            </h2>
            <button
              onClick={() => router.push('/dashboard/schedules')}
              style={{
                fontSize: '14px',
                color: '#10b981',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Ver calendario →
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            {calendarEvents.map((event, index) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                style={{
                  padding: '16px',
                  marginBottom: index < calendarEvents.length - 1 ? '12px' : '0',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0fdf4'
                  e.currentTarget.style.borderColor = '#10b981'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {event.date} a las {event.time}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getEventTypeColor(event.type) + '20',
                    color: getEventTypeColor(event.type),
                    fontWeight: '500'
                  }}>
                    {event.type === 'inspection' ? 'Inspección' : 
                     event.type === 'meeting' ? 'Reunión' : 'Capacitación'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}