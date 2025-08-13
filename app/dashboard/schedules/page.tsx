'use client'

import { useState } from 'react'

export default function SchedulesPage() {
  const [viewMode, setViewMode] = useState('list') // list, week, day
  const [selectedInspector, setSelectedInspector] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showConflictWarning, setShowConflictWarning] = useState(false)

  // Inspecciones programadas con toda la información
  const schedules = [
    {
      id: 1,
      property: 'Casa Vista Hermosa',
      address: 'Av. Principal 123, Sector Norte',
      date: '2024-07-22',
      time: '09:00 AM',
      duration: '2 horas',
      endTime: '11:00 AM',
      inspector: 'Carlos Mendez',
      client: 'Juan Pérez',
      clientPhone: '+593 999-123-456',
      clientEmail: 'juan.perez@email.com',
      type: 'Inspección Regular',
      status: 'Confirmada',
      notes: 'Cliente confirmó disponibilidad. Llevar equipo de medición.',
      checklist: 'Residencial Completa',
      notificationSent: true
    },
    {
      id: 2,
      property: 'Edificio Centro',
      address: 'Calle Centro 456, Zona Comercial',
      date: '2024-07-22',
      time: '02:00 PM',
      duration: '3 horas',
      endTime: '05:00 PM',
      inspector: 'Ana Torres',
      client: 'María García',
      clientPhone: '+593 999-234-567',
      clientEmail: 'maria.garcia@email.com',
      type: 'Inspección Completa',
      status: 'Confirmada',
      notes: 'Edificio de 5 pisos. Acceso con administrador.',
      checklist: 'Comercial Grande',
      notificationSent: true
    },
    {
      id: 3,
      property: 'Local Comercial Plaza',
      address: 'Plaza Sur, Local 15',
      date: '2024-07-23',
      time: '10:00 AM',
      duration: '1.5 horas',
      endTime: '11:30 AM',
      inspector: 'Carlos Mendez',
      client: 'Carlos López',
      clientPhone: '+593 999-345-678',
      clientEmail: 'carlos.lopez@email.com',
      type: 'Inspección Rápida',
      status: 'Por Confirmar',
      notes: 'Pendiente confirmación del cliente',
      checklist: 'Comercial Pequeño',
      notificationSent: false
    },
    {
      id: 4,
      property: 'Casa Los Robles',
      address: 'Urb. Los Robles, Casa 45',
      date: '2024-07-23',
      time: '11:00 AM',
      duration: '2 horas',
      endTime: '01:00 PM',
      inspector: 'Carlos Mendez',
      client: 'Pedro Sánchez',
      clientPhone: '+593 999-456-789',
      clientEmail: 'pedro.sanchez@email.com',
      type: 'Pre-Inspección',
      status: 'Confirmada',
      notes: '⚠️ CONFLICTO DE HORARIO con inspección anterior',
      checklist: 'Pre-Venta',
      notificationSent: true,
      hasConflict: true
    }
  ]

  // Filtrar por inspector
  const filteredSchedules = selectedInspector === 'all' 
    ? schedules 
    : schedules.filter(s => s.inspector === selectedInspector)

  // Obtener inspectores únicos
  const inspectors = [...new Set(schedules.map(s => s.inspector))]

  // Verificar conflictos de horario
  const checkTimeConflict = (schedule1, schedule2) => {
    if (schedule1.inspector !== schedule2.inspector || schedule1.date !== schedule2.date) {
      return false
    }
    // Lógica simplificada para detectar conflictos
    return schedule1.hasConflict || schedule2.hasConflict
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
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>Agenda de Inspecciones</h1>
        <button style={{ 
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
        }}>
          <span>+</span> Programar Inspección
        </button>
      </div>

      {/* Conflict Warning */}
      {schedules.some(s => s.hasConflict) && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #dc2626',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg style={{ width: '24px', height: '24px', color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p style={{ fontWeight: '600', color: '#dc2626' }}>
              ⚠️ Conflicto de horarios detectado
            </p>
            <p style={{ fontSize: '14px', color: '#7f1d1d' }}>
              Carlos Mendez tiene inspecciones que se cruzan el 23/07/2024
            </p>
          </div>
        </div>
      )}

      {/* Filters and View Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        backgroundColor: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <select
            value={selectedInspector}
            onChange={(e) => setSelectedInspector(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="all">Todos los Inspectores</option>
            {inspectors.map(inspector => (
              <option key={inspector} value={inspector}>{inspector}</option>
            ))}
          </select>
          
          <input
            type="date"
            value="2024-07-22"
            onChange={(e) => console.log(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px 16px',
              backgroundColor: viewMode === 'list' ? '#dc2626' : 'white',
              color: viewMode === 'list' ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '6px 0 0 6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode('day')}
            style={{
              padding: '8px 16px',
              backgroundColor: viewMode === 'day' ? '#dc2626' : 'white',
              color: viewMode === 'day' ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '0',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Día
          </button>
          <button
            onClick={() => setViewMode('week')}
            style={{
              padding: '8px 16px',
              backgroundColor: viewMode === 'week' ? '#dc2626' : 'white',
              color: viewMode === 'week' ? 'white' : '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '0 6px 6px 0',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Semana
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredSchedules.map(schedule => (
            <div 
              key={schedule.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                borderLeft: `4px solid ${schedule.hasConflict ? '#dc2626' : schedule.status === 'Confirmada' ? '#10b981' : '#f59e0b'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                      {schedule.property}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: schedule.status === 'Confirmada' ? '#d1fae5' : '#fef3c7',
                      color: schedule.status === 'Confirmada' ? '#065f46' : '#92400e'
                    }}>
                      {schedule.status}
                    </span>
                    {schedule.notificationSent && (
                      <span style={{
                        fontSize: '12px',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Notificado
                      </span>
                    )}
                  </div>

                  {/* Schedule Info */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '15px' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
                        <strong>Fecha y Hora:</strong>
                      </p>
                      <p style={{ fontSize: '16px', color: '#111827', fontWeight: '500' }}>
                        {schedule.date} • {schedule.time} - {schedule.endTime}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        Duración: {schedule.duration}
                      </p>
                    </div>
                    
                    <div>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
                        <strong>Inspector Asignado:</strong>
                      </p>
                      <p style={{ fontSize: '16px', color: '#111827' }}>
                        {schedule.inspector}
                      </p>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                    <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                      <strong>Dirección:</strong> {schedule.address}
                    </p>
                    <p style={{ fontSize: '14px', color: '#374151' }}>
                      <strong>Tipo:</strong> {schedule.type} • <strong>Checklist:</strong> {schedule.checklist}
                    </p>
                  </div>

                  {/* Client Info */}
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      <strong>Información del Cliente:</strong>
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg style={{ width: '16px', height: '16px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span style={{ fontSize: '14px' }}>{schedule.client}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg style={{ width: '16px', height: '16px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span style={{ fontSize: '14px' }}>{schedule.clientPhone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg style={{ width: '16px', height: '16px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span style={{ fontSize: '14px' }}>{schedule.clientEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {schedule.notes && (
                    <div style={{ 
                      padding: '10px', 
                      backgroundColor: schedule.hasConflict ? '#fee2e2' : '#f3f4f6',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: schedule.hasConflict ? '#dc2626' : '#374151'
                    }}>
                      <strong>Notas:</strong> {schedule.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '20px' }}>
                  <button style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Editar
                  </button>
                  
                  {!schedule.notificationSent && (
                    <button style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Enviar Recordatorio
                    </button>
                  )}
                  
                  <button style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reprogramar
                  </button>
                  
                  {schedule.status === 'Por Confirmar' && (
                    <button style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}>
                      Confirmar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <div style={{
        marginTop: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
            Inspecciones Hoy
          </h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>2</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
            Esta Semana
          </h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>8</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
            Por Confirmar
          </h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>1</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
            Conflictos
          </h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>1</p>
        </div>
      </div>
    </div>
  )
}