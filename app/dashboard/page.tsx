'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
<<<<<<< HEAD

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
=======
  const [showNewModal, setShowNewModal] = useState(false)

  // Datos de ejemplo para inspecciones en proceso
  const inspeccionesEnProceso = [
    {
      id: 'INS-2024-001',
      propiedad: 'Casa Mediterránea',
      cliente: 'María García',
      progreso: 65,
      inspector: 'Carlos Rodríguez',
      fecha: '15/02/2024'
    },
    {
      id: 'INS-2024-002',
      propiedad: 'Edificio Central',
      cliente: 'Juan Pérez',
      progreso: 40,
      inspector: 'Ana Martínez',
      fecha: '14/02/2024'
    },
    {
      id: 'INS-2024-003',
      propiedad: 'Local Comercial Norte',
      cliente: 'Empresa ABC',
      progreso: 85,
      inspector: 'Pedro Sánchez',
      fecha: '13/02/2024'
    }
  ]

  // Tareas pendientes
  const tareasPendientes = [
    {
      id: 1,
      titulo: 'Revisar informe INS-2024-001',
      prioridad: 'alta',
      asignado: 'Francisco G.',
      vence: '16/02'
    },
    {
      id: 2,
      titulo: 'Completar checklist',
      prioridad: 'media',
      asignado: 'Ana M.',
      vence: '17/02'
    },
    {
      id: 3,
      titulo: 'Actualizar fotos',
      prioridad: 'baja',
      asignado: 'Carlos R.',
      vence: '18/02'
    }
  ]

  // Agenda - Próximas inspecciones
  const proximasInspecciones = [
    {
      id: 'INS-2024-004',
      propiedad: 'Villa Los Pinos',
      cliente: 'Roberto Silva',
      fecha: '16/02',
      hora: '09:00',
      inspector: 'Carlos R.'
    },
    {
      id: 'INS-2024-005',
      propiedad: 'Depto Centro',
      cliente: 'Laura Mendoza',
      fecha: '16/02',
      hora: '14:30',
      inspector: 'Ana M.'
    },
    {
      id: 'INS-2024-006',
      propiedad: 'Bodega Industrial',
      cliente: 'Logística XYZ',
      fecha: '17/02',
      hora: '10:00',
      inspector: 'Pedro S.'
    }
  ]

  const getPrioridadColor = (prioridad: string) => {
    switch(prioridad) {
      case 'alta': return '#dc2626'
      case 'media': return '#f59e0b'
      case 'baja': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getProgresoColor = (progreso: number) => {
    if (progreso >= 75) return '#10b981'
    if (progreso >= 50) return '#f59e0b'
    return '#dc2626'
  }

  const handleNewInspection = () => {
    setShowNewModal(true)
  }

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  
  try {
    // Obtener los valores del formulario
    const formElement = e.currentTarget
    const formData = {
      propertyId: (formElement.elements.namedItem('property') as HTMLSelectElement).value,
      clientName: (formElement.elements.namedItem('clientName') as HTMLInputElement).value,
      clientEmail: (formElement.elements.namedItem('clientEmail') as HTMLInputElement)?.value || '',
      type: (formElement.elements.namedItem('type') as HTMLSelectElement).value,
      inspectorId: (formElement.elements.namedItem('inspector') as HTMLSelectElement).value,
      inspectorName: (formElement.elements.namedItem('inspector') as HTMLSelectElement).options[(formElement.elements.namedItem('inspector') as HTMLSelectElement).selectedIndex].text,
      scheduledDate: `${(formElement.elements.namedItem('date') as HTMLInputElement).value}T${(formElement.elements.namedItem('time') as HTMLInputElement).value}`,
      notes: (formElement.elements.namedItem('notes') as HTMLTextAreaElement)?.value || ''
    };

    // Debug: mostrar qué datos se están enviando
    console.log('Enviando datos:', formData);

    // Enviar a la API
    const response = await fetch('/api/inspections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Debug: mostrar la respuesta
    console.log('Respuesta status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error(errorData.error || 'Error al crear inspección');
    }

    const newInspection = await response.json();
    console.log('Inspección creada:', newInspection);
    
    // Cerrar modal y redirigir
    setShowNewModal(false);
    router.push('/dashboard/inspections');
    
    // Mensaje de éxito
    alert(`Inspección ${newInspection.code} creada exitosamente!`);
  } catch (error) {
    console.error('Error completo:', error);
    alert(`Error al crear la inspección: ${error.message}`);
  }
}

  return (
    <div>
      {/* Header sin la palabra Dashboard */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <button
          onClick={handleNewInspection}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
>>>>>>> 8863e460278a82e22e1803b734eb71c65c9a0207
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
<<<<<<< HEAD
            backgroundColor: '#fef2f2'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              📋 Inspecciones Pendientes
=======
            gap: '6px'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Nueva Inspección
        </button>
      </div>

      {/* Grid de contenido principal más compacto */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {/* Inspecciones en Proceso */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Inspecciones en Proceso
>>>>>>> 8863e460278a82e22e1803b734eb71c65c9a0207
            </h2>
            <button
              onClick={() => router.push('/dashboard/inspections')}
              style={{
<<<<<<< HEAD
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
=======
                padding: '2px 8px',
                backgroundColor: 'transparent',
                color: '#dc2626',
                border: '1px solid #dc2626',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Ver todas
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {inspeccionesEnProceso.map(inspeccion => (
              <div 
                key={inspeccion.id}
                onClick={() => router.push('/dashboard/inspections')}
                style={{
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#dc2626'
                  e.currentTarget.style.backgroundColor = '#fef2f2'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '500', color: '#111827', fontSize: '14px' }}>{inspeccion.id}</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{inspeccion.fecha}</span>
                </div>
                <p style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '14px' }}>{inspeccion.propiedad}</p>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6b7280' }}>
                  {inspeccion.cliente} • {inspeccion.inspector}
                </p>
                
                {/* Barra de progreso más delgada */}
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '2px'
                  }}>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>Progreso</span>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '600',
                      color: getProgresoColor(inspeccion.progreso)
                    }}>
                      {inspeccion.progreso}%
                    </span>
                  </div>
                  <div style={{
                    height: '4px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${inspeccion.progreso}%`,
                      backgroundColor: getProgresoColor(inspeccion.progreso),
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
>>>>>>> 8863e460278a82e22e1803b734eb71c65c9a0207
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tareas Pendientes */}
        <div style={{
          backgroundColor: 'white',
<<<<<<< HEAD
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
=======
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Tareas Pendientes
>>>>>>> 8863e460278a82e22e1803b734eb71c65c9a0207
            </h2>
            <button
              onClick={() => router.push('/dashboard/tasks')}
              style={{
<<<<<<< HEAD
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
=======
                padding: '2px 8px',
                backgroundColor: 'transparent',
                color: '#dc2626',
                border: '1px solid #dc2626',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Ver todas
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tareasPendientes.map(tarea => (
              <div 
                key={tarea.id}
                onClick={() => router.push('/dashboard/tasks')}
                style={{
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#dc2626'
                  e.currentTarget.style.backgroundColor = '#fef2f2'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: getPrioridadColor(tarea.prioridad)
                  }} />
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '500',
                    color: getPrioridadColor(tarea.prioridad),
                    textTransform: 'uppercase'
                  }}>
                    {tarea.prioridad}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: 'auto' }}>
                    Vence: {tarea.vence}
                  </span>
                </div>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                  {tarea.titulo}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                  Asignado: {tarea.asignado}
                </p>
>>>>>>> 8863e460278a82e22e1803b734eb71c65c9a0207
              </div>
            ))}
          </div>
        </div>

<<<<<<< HEAD
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
=======
        {/* Agenda - Próximas Inspecciones */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          gridColumn: 'span 2'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Agenda - Próximas Inspecciones
>>>>>>> 8863e460278a82e22e1803b734eb71c65c9a0207
            </h2>
            <button
              onClick={() => router.push('/dashboard/schedules')}
              style={{
<<<<<<< HEAD
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
=======
                padding: '2px 8px',
                backgroundColor: 'transparent',
                color: '#dc2626',
                border: '1px solid #dc2626',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Ver calendario
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {proximasInspecciones.map(inspeccion => (
              <div 
                key={inspeccion.id}
                onClick={() => router.push('/dashboard/schedules')}
                style={{
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#dc2626'
                  e.currentTarget.style.backgroundColor = '#fef2f2'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                <div style={{
                  width: '45px',
                  height: '45px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
                    {inspeccion.fecha.split('/')[0]}
                  </span>
                  <span style={{ fontSize: '10px', color: '#dc2626' }}>
                    Feb
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: '500', color: '#111827', fontSize: '13px' }}>{inspeccion.id}</span>
                    <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '500' }}>
                      {inspeccion.hora}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 2px 0', color: '#374151', fontSize: '13px' }}>{inspeccion.propiedad}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                    {inspeccion.cliente} • {inspeccion.inspector}
                  </p>
>>>>>>> 8863e460278a82e22e1803b734eb71c65c9a0207
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
<<<<<<< HEAD
=======

      {/* Modal de Nueva Inspección */}
      {showNewModal && (
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
            padding: '32px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '24px',
              color: '#111827'
            }}>
              Nueva Inspección
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Propiedad
                </label>
                <select
                  name="property"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Seleccionar propiedad</option>
                  <option value="1">Casa Mediterránea - Av. Principal 123</option>
                  <option value="2">Edificio Central - Centro Comercial</option>
                  <option value="3">Villa Los Pinos - Urbanización Norte</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Cliente
                </label>
                <input
                  name="clientName"
                  type="text"
                  required
                  placeholder="Nombre del cliente"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Email del Cliente (Opcional)
                </label>
                <input
                  name="clientEmail"
                  type="email"
                  placeholder="cliente@email.com"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Tipo de Inspección
                </label>
                <select
                  name="type"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="general">Inspección General</option>
                  <option value="preventiva">Inspección Preventiva</option>
                  <option value="correctiva">Inspección Correctiva</option>
                  <option value="seguridad">Inspección de Seguridad</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Inspector Asignado
                </label>
                <select
                  name="inspector"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Seleccionar inspector</option>
                  <option value="1">Carlos Rodríguez</option>
                  <option value="2">Ana Martínez</option>
                  <option value="3">Pedro Sánchez</option>
                  <option value="4">Francisco Guarderas</option>
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
                  Notas (Opcional)
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Agregar notas o instrucciones especiales..."
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

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
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
                    padding: '8px 16px',
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
>>>>>>> 8863e460278a82e22e1803b734eb71c65c9a0207
    </div>
  )
}