'use client'

import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalInspections: 156,
    completedInspections: 142,
    pendingInspections: 14,
    totalProperties: 48,
    activeProperties: 45,
    scheduledThisWeek: 8
  })

  const recentInspections = [
    { id: 1, property: 'Casa Valle de los Chillos', date: '2024-01-25', status: 'completed', inspector: 'Juan Pérez' },
    { id: 2, property: 'Edificio Centro Norte', date: '2024-01-24', status: 'pending', inspector: 'María García' },
    { id: 3, property: 'Local Comercial La Mariscal', date: '2024-01-23', status: 'in_progress', inspector: 'Carlos López' },
    { id: 4, property: 'Bodega Industrial Norte', date: '2024-01-22', status: 'completed', inspector: 'Ana Martínez' },
  ]

  const upcomingTasks = [
    { id: 1, task: 'Inspección de seguridad', property: 'Casa Valle', dueDate: '2024-01-26', priority: 'high' },
    { id: 2, task: 'Revisión eléctrica', property: 'Edificio Centro', dueDate: '2024-01-27', priority: 'medium' },
    { id: 3, task: 'Evaluación estructural', property: 'Bodega Norte', dueDate: '2024-01-28', priority: 'low' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#111827',
          margin: '0 0 8px 0',
          letterSpacing: '-0.5px'
        }}>
          Panel de Control
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6B7280',
          margin: 0
        }}>
          Bienvenido de vuelta, Francisco. Aquí está el resumen de hoy.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Total Inspections */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Total Inspecciones
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 4px 0'
          }}>
            {stats.totalInspections}
          </p>
          <p style={{
            fontSize: '13px',
            color: '#10B981',
            margin: 0
          }}>
            +12% desde el mes pasado
          </p>
        </div>

        {/* Completed */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Completadas
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#10B981',
            margin: '0 0 4px 0'
          }}>
            {stats.completedInspections}
          </p>
          <p style={{
            fontSize: '13px',
            color: '#6B7280',
            margin: 0
          }}>
            91% de cumplimiento
          </p>
        </div>

        {/* Pending */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Pendientes
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#F59E0B',
            margin: '0 0 4px 0'
          }}>
            {stats.pendingInspections}
          </p>
          <p style={{
            fontSize: '13px',
            color: '#6B7280',
            margin: 0
          }}>
            Requieren atención
          </p>
        </div>

        {/* Properties */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Propiedades Activas
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#8B5CF6',
            margin: '0 0 4px 0'
          }}>
            {stats.activeProperties}
          </p>
          <p style={{
            fontSize: '13px',
            color: '#6B7280',
            margin: 0
          }}>
            De {stats.totalProperties} totales
          </p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {/* Recent Inspections */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              Inspecciones Recientes
            </h2>
          </div>
          <div style={{ padding: '16px' }}>
            {recentInspections.map((inspection) => (
              <div key={inspection.id} style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: '#f9fafb',
                transition: 'all 0.2s'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px'
                }}>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {inspection.property}
                  </h4>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: 
                      inspection.status === 'completed' ? '#D1FAE5' :
                      inspection.status === 'pending' ? '#FEF3C7' : '#DBEAFE',
                    color: 
                      inspection.status === 'completed' ? '#065F46' :
                      inspection.status === 'pending' ? '#92400E' : '#1E40AF'
                  }}>
                    {inspection.status === 'completed' ? 'Completada' :
                     inspection.status === 'pending' ? 'Pendiente' : 'En Proceso'}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  color: '#6B7280'
                }}>
                  <span>Inspector: {inspection.inspector}</span>
                  <span>{new Date(inspection.date).toLocaleDateString('es-EC')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              Tareas Próximas
            </h2>
          </div>
          <div style={{ padding: '16px' }}>
            {upcomingTasks.map((task) => (
              <div key={task.id} style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px'
                }}>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {task.task}
                  </h4>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 
                      task.priority === 'high' ? '#EF4444' :
                      task.priority === 'medium' ? '#F59E0B' : '#10B981'
                  }}></span>
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  marginBottom: '4px'
                }}>
                  {task.property}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#9CA3AF'
                }}>
                  Vence: {new Date(task.dueDate).toLocaleDateString('es-EC')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}