'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Users, ClipboardCheck, CheckCircle2, Clock, AlertCircle, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  const [period, setPeriod] = useState('week')

  const stats = {
    totalInspections: 156,
    completedInspections: 142,
    pendingInspections: 14,
    totalTasks: 89,
    totalBudgets: 47,
    budgetsApproved: 32,
    budgetsPending: 15,
    totalRevenue: 125840
  }

  const recentInspections = [
    { id: 'INS001', property: 'Casa Residencial Norte', progress: 100, status: 'completed', date: '2024-03-20' },
    { id: 'INS002', property: 'Edificio Comercial Centro', progress: 75, status: 'in-progress', date: '2024-03-21' },
    { id: 'INS003', property: 'Bodega Industrial Sur', progress: 30, status: 'in-progress', date: '2024-03-22' },
  ]

  const pendingTasks = [
    { id: 1, title: 'Revisar planos eléctricos', priority: 'high', assignee: 'Carlos Méndez' },
    { id: 2, title: 'Completar informe INS002', priority: 'medium', assignee: 'Ana Torres' },
    { id: 3, title: 'Verificar sistema contra incendios', priority: 'high', assignee: 'Luis García' },
  ]

  const upcomingInspections = [
    { id: 'INS004', property: 'Apartamento 5B Torre Sol', date: '2024-03-25', time: '09:00 AM', inspector: 'Juan Pérez' },
    { id: 'INS005', property: 'Local Comercial Plaza Mayor', date: '2024-03-25', time: '02:00 PM', inspector: 'María Silva' },
    { id: 'INS006', property: 'Casa Conjunto Cerrado', date: '2024-03-26', time: '10:00 AM', inspector: 'Roberto Díaz' },
  ]

  const budgetStats = [
    { label: 'Presupuestos Este Mes', value: 12, change: '+15%', positive: true },
    { label: 'Valor Total', value: '$45,280', change: '+8%', positive: true },
    { label: 'Tasa de Aprobación', value: '68%', change: '-5%', positive: false },
    { label: 'Tiempo Promedio', value: '3.2 días', change: '-12%', positive: true },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '600', 
          color: '#111827', 
          marginBottom: '8px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          letterSpacing: '-0.5px'
        }}>
          Dashboard
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        }}>
          Resumen de actividades y métricas
        </p>
      </div>

      {/* Period Selector */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', backgroundColor: 'white', borderRadius: '8px', padding: '4px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: period === p ? '#dc2626' : 'transparent',
                color: period === p ? 'white' : '#4b5563',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}
            >
              {p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        {/* Inspections Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#6b7280',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}>
              Total Inspecciones
            </h3>
            <ClipboardCheck size={20} color="#dc2626" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: '#111827', fontFamily: "'Inter', sans-serif" }}>
            {stats.totalInspections}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', gap: '4px' }}>
            <TrendingUp size={16} color="#10b981" />
            <span style={{ fontSize: '14px', color: '#10b981' }}>+12% este mes</span>
          </div>
        </div>

        {/* Completed Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#6b7280',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}>
              Completadas
            </h3>
            <CheckCircle2 size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: '#111827', fontFamily: "'Inter', sans-serif" }}>
            {stats.completedInspections}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
            91% de completitud
          </div>
        </div>

        {/* Revenue Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#6b7280',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}>
              Ingresos Totales
            </h3>
            <DollarSign size={20} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: '#111827', fontFamily: "'Inter', sans-serif" }}>
            ${stats.totalRevenue.toLocaleString('es-ES')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', gap: '4px' }}>
            <TrendingUp size={16} color="#10b981" />
            <span style={{ fontSize: '14px', color: '#10b981' }}>+23% vs mes anterior</span>
          </div>
        </div>
      </div>

      {/* Budget Statistics Section */}
      <div style={{ 
        marginBottom: '32px',
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e5e5'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '20px', 
          color: '#111827',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
          📊 Estadísticas de Presupuestos
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '16px' 
        }}>
          {budgetStats.map((stat, index) => (
            <div key={index} style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #e5e5e5'
            }}>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                marginBottom: '8px',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}>
                {stat.label}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <p style={{ 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: '#111827',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {stat.value}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {stat.positive ? 
                    <TrendingUp size={14} color="#10b981" /> : 
                    <TrendingDown size={14} color="#ef4444" />
                  }
                  <span style={{ 
                    fontSize: '13px', 
                    color: stat.positive ? '#10b981' : '#ef4444',
                    fontWeight: '500'
                  }}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Recent Inspections */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '16px', 
            color: '#111827',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          }}>
            Inspecciones Recientes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentInspections.map((inspection) => (
              <div key={inspection.id} style={{
                padding: '16px',
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ 
                      fontWeight: '500', 
                      color: '#111827', 
                      marginBottom: '4px',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                    }}>
                      {inspection.property}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>{inspection.id} • {inspection.date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      color: inspection.progress === 100 ? '#10b981' : '#3b82f6',
                      marginBottom: '4px' 
                    }}>
                      {inspection.progress}%
                    </div>
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: inspection.status === 'completed' ? '#d1fae5' : '#dbeafe',
                      color: inspection.status === 'completed' ? '#065f46' : '#1e40af'
                    }}>
                      {inspection.status === 'completed' ? 'Completada' : 'En proceso'}
                    </span>
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${inspection.progress}%`,
                    height: '100%',
                    backgroundColor: inspection.progress === 100 ? '#10b981' : '#3b82f6',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Pending Tasks */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f0f0f0'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px', 
              color: '#111827',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}>
              Tareas Pendientes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingTasks.map((task) => (
                <div key={task.id} style={{
                  padding: '12px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: task.priority === 'high' ? '#ef4444' : '#f59e0b',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontWeight: '500', 
                      color: '#111827', 
                      marginBottom: '2px',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                    }}>
                      {task.title}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>
                      Asignado a: {task.assignee}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Inspections */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f0f0f0'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px', 
              color: '#111827',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}>
              Próximas Inspecciones
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingInspections.map((inspection) => (
                <div key={inspection.id} style={{
                  padding: '12px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <p style={{ 
                        fontWeight: '500', 
                        color: '#111827', 
                        marginBottom: '4px',
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                      }}>
                        {inspection.property}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        Inspector: {inspection.inspector}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#dc2626' }}>
                        {inspection.time}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        {inspection.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Statistics Section - Moved to bottom */}
      <div style={{ 
        marginTop: '32px',
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e5e5'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '20px', 
          color: '#111827',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
          📊 Estadísticas de Presupuestos
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '16px' 
        }}>
          {budgetStats.map((stat, index) => (
            <div key={index} style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #e5e5e5'
            }}>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                marginBottom: '8px',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}>
                {stat.label}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <p style={{ 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: '#111827',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {stat.value}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {stat.positive ? 
                    <TrendingUp size={14} color="#10b981" /> : 
                    <TrendingDown size={14} color="#ef4444" />
                  }
                  <span style={{ 
                    fontSize: '13px', 
                    color: stat.positive ? '#10b981' : '#ef4444',
                    fontWeight: '500'
                  }}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}