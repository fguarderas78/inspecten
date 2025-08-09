'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Home, ClipboardList, CheckCircle, Clock, AlertCircle, TrendingUp, Calendar,
  Users, BarChart3, FileText, Building2, Wrench, Bell, Search, Settings,
  MapPin, Cloud, DollarSign, Target, MessageSquare, Sun, Moon, Download,
  Mic, X, ChevronDown, Activity, Award, Camera, Filter, RefreshCw,
  Zap, PieChart, TrendingDown, AlertTriangle, Info, ChevronLeft, ChevronRight,
  Wind, Droplets, Thermometer, CloudRain, Image, Eye, EyeOff, GripVertical,
  Send, Paperclip, Trash2, Edit, MoreVertical, Navigation
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [period, setPeriod] = useState('week')
  const [showInspectionModal, setShowInspectionModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  // Colores de marca SnapInspect
  const colors = {
    primary: '#dc2626', // Rojo principal
    primaryDark: '#b91c1c', // Rojo oscuro para hover
    primaryLight: '#ef4444', // Rojo claro
    primaryBg: '#fee2e2', // Fondo rojo muy claro
    secondary: '#111827', // Negro/Gris muy oscuro
    success: '#10b981', // Verde
    warning: '#f59e0b', // Amarillo
    info: '#3b82f6', // Azul
    danger: '#ef4444', // Rojo peligro
    // Grises
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827'
  }

  // Estados para los widgets personalizables
  const [widgets, setWidgets] = useState([
    { id: 'stats', title: 'Estadísticas', visible: true, size: 'full' },
    { id: 'recent', title: 'Inspecciones Recientes', visible: true, size: 'large' },
    { id: 'tasks', title: 'Tareas Pendientes', visible: true, size: 'medium' },
    { id: 'schedule', title: 'Próximas Inspecciones', visible: true, size: 'medium' },
    { id: 'weather', title: 'Clima', visible: true, size: 'small' },
    { id: 'calendar', title: 'Calendario', visible: true, size: 'medium' },
    { id: 'analytics', title: 'Analytics', visible: true, size: 'large' },
    { id: 'map', title: 'Mapa', visible: true, size: 'medium' }
  ])

  const stats = {
    totalAssets: 78,
    totalInspections: 234,
    completedInspections: 189,
    pendingInspections: 45,
    revenue: 125000,
    efficiency: 89,
    satisfaction: 94
  }

  const recentInspections = [
    {
      id: 1,
      code: 'INS-2025-001',
      property: 'Oficina COSUCO',
      address: 'Mirador de los Ríos, Puerto Azul',
      date: '2025-01-25',
      inspector: 'Francisco Guarderas',
      status: 'completed',
      progress: 100,
      priority: 'high',
      client: 'Juan Pérez',
      images: 25,
      issues: 2
    },
    {
      id: 2,
      code: 'INS-2025-002',
      property: 'Casa Alexander',
      address: 'Circunvalación Sur 205',
      date: '2025-01-24',
      inspector: 'María López',
      status: 'in-progress',
      progress: 65,
      priority: 'medium',
      client: 'Ana García',
      images: 15,
      issues: 5
    },
    {
      id: 3,
      code: 'INS-2025-003',
      property: 'Villa Olivo',
      address: 'Av. Santana y Calle 10',
      date: '2025-01-23',
      inspector: 'Carlos Mendoza',
      status: 'scheduled',
      progress: 0,
      priority: 'low',
      client: 'Pedro Rodríguez',
      images: 0,
      issues: 0
    }
  ]

  const pendingTasks = [
    {
      id: 1,
      title: 'Revisar fotos de cocina',
      property: 'Casa Alexander',
      priority: 'high',
      assignee: 'Francisco G.',
      dueDate: '2025-01-26',
      status: 'pending',
      avatar: 'FG'
    },
    {
      id: 2,
      title: 'Completar informe de baños',
      property: 'Oficina COSUCO',
      priority: 'medium',
      assignee: 'María L.',
      dueDate: '2025-01-27',
      status: 'in-progress',
      avatar: 'ML'
    },
    {
      id: 3,
      title: 'Agendar re-inspección',
      property: 'Villa Olivo',
      priority: 'low',
      assignee: 'Carlos M.',
      dueDate: '2025-01-28',
      status: 'pending',
      avatar: 'CM'
    }
  ]

  const upcomingSchedule = [
    {
      id: 1,
      property: 'Edificio Corporativo',
      client: 'Luis Martínez',
      date: '2025-01-26',
      time: '09:00',
      inspector: 'Francisco Guarderas',
      type: 'commercial',
      duration: '2 horas'
    },
    {
      id: 2,
      property: 'Casa Samborondón',
      client: 'María Fernández',
      date: '2025-01-26',
      time: '14:00',
      inspector: 'María López',
      type: 'residential',
      duration: '1.5 horas'
    },
    {
      id: 3,
      property: 'Local Comercial Centro',
      client: 'Roberto Sánchez',
      date: '2025-01-27',
      time: '10:00',
      inspector: 'Carlos Mendoza',
      type: 'commercial',
      duration: '1 hora'
    }
  ]

  const notifications = [
    {
      id: 1,
      title: 'Nueva inspección asignada',
      message: 'Se te ha asignado la inspección de Edificio Corporativo',
      time: 'Hace 5 minutos',
      type: 'inspection',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      title: 'Tarea completada',
      message: 'María López completó la revisión de fotos',
      time: 'Hace 20 minutos',
      type: 'task',
      priority: 'medium',
      read: false
    },
    {
      id: 3,
      title: 'Recordatorio',
      message: 'Inspección programada para mañana a las 9:00 AM',
      time: 'Hace 1 hora',
      type: 'alert',
      priority: 'low',
      read: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#f59e0b'
      case 'scheduled': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getAvatarColor = (initials: string) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
    return colors[initials.charCodeAt(0) % colors.length]
  }

  // Función para manejar la búsqueda por voz
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = 'es-ES'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsRecording(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsRecording(false)
      }

      recognition.onerror = () => {
        setIsRecording(false)
      }

      recognition.start()
    } else {
      alert('Tu navegador no soporta reconocimiento de voz')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
      color: theme === 'dark' ? '#f3f4f6' : '#111827'
    }}>
      {/* Header mejorado */}
      <header style={{
        backgroundColor: theme === 'dark' ? colors.gray900 : 'white',
        borderBottom: `1px solid ${theme === 'dark' ? colors.gray700 : colors.gray200}`,
        padding: '16px 40px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: theme === 'dark' ? 'white' : colors.gray900
            }}>
              <div style={{
                padding: '10px',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
              }}>
                <Home size={20} color="white" />
              </div>
              Dashboard
            </h1>

            {/* Selector de período mejorado */}
            <div style={{
              display: 'flex',
              gap: '2px',
              padding: '3px',
              backgroundColor: theme === 'dark' ? colors.gray800 : colors.gray100,
              borderRadius: '10px',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              {['day', 'week', 'month', 'year'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: '8px 18px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: period === p ? '600' : '400',
                    backgroundColor: period === p 
                      ? theme === 'dark' ? colors.primary : 'white' 
                      : 'transparent',
                    color: period === p
                      ? theme === 'dark' ? 'white' : colors.primary
                      : theme === 'dark' ? colors.gray300 : colors.gray600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: period === p ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  {p === 'day' ? 'Día' : p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Barra de búsqueda con voz mejorada */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: theme === 'dark' ? colors.gray800 : colors.gray50,
              padding: '10px 16px',
              borderRadius: '10px',
              width: '320px',
              border: `1px solid ${theme === 'dark' ? colors.gray700 : colors.gray200}`,
              transition: 'all 0.2s'
            }}>
              <Search size={18} color={colors.gray500} />
              <input
                type="text"
                placeholder="Buscar propiedades, clientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  fontSize: '14px',
                  color: theme === 'dark' ? 'white' : colors.gray900
                }}
              />
              <button
                onClick={handleVoiceSearch}
                style={{
                  padding: '6px',
                  backgroundColor: isRecording ? colors.primaryBg : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: isRecording ? colors.primary : colors.gray500,
                  animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Mic size={16} />
              </button>
            </div>

            {/* Botón de actualizar mejorado */}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px',
                backgroundColor: theme === 'dark' ? colors.gray800 : 'white',
                border: `1px solid ${theme === 'dark' ? colors.gray700 : colors.gray200}`,
                borderRadius: '10px',
                cursor: 'pointer',
                color: theme === 'dark' ? colors.gray300 : colors.gray600,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Actualizar datos"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary
                e.currentTarget.style.color = colors.primary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme === 'dark' ? colors.gray700 : colors.gray200
                e.currentTarget.style.color = theme === 'dark' ? colors.gray300 : colors.gray600
              }}
            >
              <RefreshCw size={18} />
            </button>

            {/* Notificaciones con contador mejorado */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  padding: '10px',
                  backgroundColor: theme === 'dark' ? colors.gray800 : 'white',
                  border: `1px solid ${theme === 'dark' ? colors.gray700 : colors.gray200}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: theme === 'dark' ? colors.gray300 : colors.gray600,
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary
                  e.currentTarget.style.color = colors.primary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme === 'dark' ? colors.gray700 : colors.gray200
                  e.currentTarget.style.color = theme === 'dark' ? colors.gray300 : colors.gray600
                }}
              >
                <Bell size={18} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '20px',
                    height: '20px',
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${theme === 'dark' ? colors.gray900 : 'white'}`,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Dropdown de notificaciones */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  width: '360px',
                  maxHeight: '480px',
                  backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '16px',
                    borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: 0
                    }}>
                      Notificaciones
                    </h3>
                    <button
                      style={{
                        fontSize: '12px',
                        color: '#3b82f6',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Marcar todas como leídas
                    </button>
                  </div>
                  <div style={{
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        style={{
                          padding: '16px',
                          borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                          backgroundColor: notification.read 
                            ? 'transparent' 
                            : theme === 'dark' ? '#111827' : '#f9fafb',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{
                            padding: '8px',
                            backgroundColor: `${getPriorityColor(notification.priority)}20`,
                            borderRadius: '8px',
                            color: getPriorityColor(notification.priority)
                          }}>
                            {notification.type === 'inspection' ? <ClipboardList size={16} /> :
                             notification.type === 'task' ? <Wrench size={16} /> :
                             <AlertCircle size={16} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              margin: '0 0 4px 0'
                            }}>
                              {notification.title}
                            </h4>
                            <p style={{
                              fontSize: '13px',
                              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                              margin: '0 0 4px 0'
                            }}>
                              {notification.message}
                            </p>
                            <span style={{
                              fontSize: '12px',
                              color: theme === 'dark' ? '#6b7280' : '#9ca3af'
                            }}>
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Toggle de tema mejorado */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{
                padding: '10px',
                background: theme === 'dark' 
                  ? `linear-gradient(135deg, ${colors.gray700} 0%, ${colors.gray800} 100%)`
                  : `linear-gradient(135deg, ${colors.gray100} 0%, ${colors.gray200} 100%)`,
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                color: theme === 'dark' ? colors.warning : colors.gray700,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={() => setShowInspectionModal(true)}
              style={{
                padding: '12px 24px',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)'
              }}
            >
              <ClipboardList size={18} />
              Nueva Inspección
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main style={{ 
        padding: '24px 40px',
        backgroundColor: theme === 'dark' ? colors.gray900 : colors.gray50
      }}>
        {/* Grid de estadísticas mejorado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {[
            {
              title: 'Assets Totales',
              value: stats.totalAssets,
              icon: Building2,
              color: colors.primary,
              bgColor: colors.primaryBg,
              iconBg: colors.primary,
              link: '/dashboard/assets',
              trend: '+12%',
              trendUp: true
            },
            {
              title: 'Inspecciones Totales',
              value: stats.totalInspections,
              icon: ClipboardList,
              color: colors.info,
              bgColor: '#dbeafe',
              iconBg: colors.info,
              link: '/dashboard/inspections',
              trend: '+8%',
              trendUp: true
            },
            {
              title: 'Completadas',
              value: stats.completedInspections,
              icon: CheckCircle,
              color: colors.success,
              bgColor: '#d1fae5',
              iconBg: colors.success,
              link: '/dashboard/inspections?filter=completed',
              trend: '+15%',
              trendUp: true
            },
            {
              title: 'En Proceso',
              value: stats.pendingInspections,
              icon: Clock,
              color: colors.warning,
              bgColor: '#fef3c7',
              iconBg: colors.warning,
              link: '/dashboard/inspections?filter=in-progress',
              trend: '-5%',
              trendUp: false
            }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                onClick={() => router.push(stat.link)}
                style={{
                  backgroundColor: theme === 'dark' ? colors.gray800 : 'white',
                  padding: '24px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${theme === 'dark' ? colors.gray700 : colors.gray200}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.borderColor = stat.color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = theme === 'dark' ? colors.gray700 : colors.gray200
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: `radial-gradient(circle, ${stat.color}20 0%, transparent 70%)`,
                  borderRadius: '50%'
                }} />

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  position: 'relative'
                }}>
                  <div style={{
                    padding: '12px',
                    background: `linear-gradient(135deg, ${stat.iconBg} 0%, ${stat.color} 100%)`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${stat.color}40`
                  }}>
                    <Icon size={24} color="white" />
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: stat.trendUp ? colors.success : colors.danger,
                    backgroundColor: stat.trendUp ? '#d1fae5' : '#fee2e2',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {stat.trend}
                  </div>
                </div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: theme === 'dark' ? 'white' : colors.gray900,
                  margin: '0 0 4px 0'
                }}>
                  {stat.value}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: theme === 'dark' ? colors.gray400 : colors.gray600,
                  margin: 0
                }}>
                  {stat.title}
                </p>
              </div>
            )
          })}
        </div>

        {/* Grid principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px'
        }}>
          {/* Inspecciones Recientes mejorado */}
          <div style={{
            gridColumn: 'span 8',
            backgroundColor: theme === 'dark' ? colors.gray800 : 'white',
            padding: '28px',
            borderRadius: '16px',
            border: `1px solid ${theme === 'dark' ? colors.gray700 : colors.gray200}`,
            boxShadow: theme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: 0,
                color: theme === 'dark' ? 'white' : colors.gray900,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  padding: '8px',
                  backgroundColor: colors.primaryBg,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ClipboardList size={18} color={colors.primary} />
                </div>
                Inspecciones Recientes
              </h2>
              <button
                onClick={() => router.push('/dashboard/inspections')}
                style={{
                  fontSize: '14px',
                  color: colors.primary,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.gap = '8px'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.gap = '4px'
                }}
              >
                Ver todas 
                <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentInspections.map((inspection) => (
                <div
                  key={inspection.id}
                  style={{
                    padding: '20px',
                    backgroundColor: theme === 'dark' ? colors.gray700 : colors.gray50,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: `1px solid ${theme === 'dark' ? colors.gray600 : colors.gray200}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? colors.gray600 : 'white'
                    e.currentTarget.style.borderColor = colors.primary
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? colors.gray700 : colors.gray50
                    e.currentTarget.style.borderColor = theme === 'dark' ? colors.gray600 : colors.gray200
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    background: theme === 'dark' 
                      ? `linear-gradient(135deg, ${colors.gray600} 0%, ${colors.gray700} 100%)`
                      : `linear-gradient(135deg, ${colors.gray100} 0%, ${colors.gray200} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Building2 size={28} color={theme === 'dark' ? colors.gray400 : colors.gray500} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        margin: 0
                      }}>
                        {inspection.property}
                      </h3>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: `${getPriorityColor(inspection.priority)}20`,
                        color: getPriorityColor(inspection.priority)
                      }}>
                        {inspection.priority === 'high' ? 'Alta' : 
                         inspection.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '13px',
                      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                      margin: '0 0 8px 0'
                    }}>
                      {inspection.address} • {inspection.client}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '12px',
                      color: theme === 'dark' ? '#6b7280' : '#9ca3af'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {new Date(inspection.date).toLocaleDateString('es-ES')}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Camera size={14} />
                        {inspection.images} fotos
                      </span>
                      {inspection.issues > 0 && (
                        <span style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          color: '#ef4444'
                        }}>
                          <AlertCircle size={14} />
                          {inspection.issues} problemas
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      backgroundColor: `${getStatusColor(inspection.status)}20`,
                      color: getStatusColor(inspection.status)
                    }}>
                      {inspection.status === 'completed' ? 'Completada' :
                       inspection.status === 'in-progress' ? 'En Proceso' : 'Programada'}
                    </span>
                    {inspection.progress > 0 && (
                      <div style={{ width: '60px' }}>
                        <div style={{
                          width: '100%',
                          height: '4px',
                          backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${inspection.progress}%`,
                            height: '100%',
                            backgroundColor: getStatusColor(inspection.status),
                            transition: 'width 0.3s'
                          }} />
                        </div>
                        <span style={{
                          fontSize: '11px',
                          color: theme === 'dark' ? '#6b7280' : '#9ca3af',
                          marginTop: '2px',
                          display: 'block',
                          textAlign: 'right'
                        }}>
                          {inspection.progress}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tareas Pendientes mejorado */}
          <div style={{
            gridColumn: 'span 4',
            backgroundColor: theme === 'dark' ? colors.gray800 : 'white',
            padding: '28px',
            borderRadius: '16px',
            border: `1px solid ${theme === 'dark' ? colors.gray700 : colors.gray200}`,
            boxShadow: theme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: 0,
                color: theme === 'dark' ? 'white' : colors.gray900,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  padding: '8px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Wrench size={18} color={colors.warning} />
                </div>
                Tareas Pendientes
              </h2>
              <span style={{
                fontSize: '14px',
                padding: '6px 12px',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                color: 'white',
                borderRadius: '20px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
              }}>
                {pendingTasks.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: '16px',
                    backgroundColor: theme === 'dark' ? colors.gray700 : colors.gray50,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: `1px solid ${theme === 'dark' ? colors.gray600 : colors.gray200}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)'
                    e.currentTarget.style.borderColor = colors.primary
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? colors.gray600 : 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.borderColor = theme === 'dark' ? colors.gray600 : colors.gray200
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? colors.gray700 : colors.gray50
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${getAvatarColor(task.avatar)} 0%, ${getAvatarColor(task.avatar)}dd 100%)`,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      flexShrink: 0,
                      boxShadow: `0 2px 8px ${getAvatarColor(task.avatar)}40`
                    }}>
                      {task.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        margin: '0 0 4px 0'
                      }}>
                        {task.title}
                      </h4>
                      <p style={{
                        fontSize: '12px',
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        margin: 0
                      }}>
                        {task.property}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '8px'
                      }}>
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: `${getPriorityColor(task.priority)}20`,
                          color: getPriorityColor(task.priority)
                        }}>
                          {task.priority === 'high' ? 'Alta' : 
                           task.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: theme === 'dark' ? '#6b7280' : '#9ca3af'
                        }}>
                          Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Próximas Inspecciones */}
          <div style={{
            gridColumn: 'span 12',
            backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
            padding: '24px',
            borderRadius: '12px',
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: 0
              }}>
                Próximas Inspecciones
              </h2>
              <button
                onClick={() => router.push('/dashboard/schedules')}
                style={{
                  fontSize: '14px',
                  color: '#3b82f6',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Ver calendario completo →
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {upcomingSchedule.map((schedule) => (
                <div
                  key={schedule.id}
                  style={{
                    padding: '16px',
                    backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
                    borderRadius: '8px',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme === 'dark' ? '#374151' : '#e5e7eb'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        margin: '0 0 4px 0'
                      }}>
                        {schedule.property}
                      </h3>
                      <p style={{
                        fontSize: '13px',
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        margin: 0
                      }}>
                        Cliente: {schedule.client}
                      </p>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: schedule.type === 'commercial' ? '#8b5cf620' : '#10b98120',
                      color: schedule.type === 'commercial' ? '#8b5cf6' : '#10b981'
                    }}>
                      {schedule.type === 'commercial' ? 'Comercial' : 'Residencial'}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '12px',
                    color: theme === 'dark' ? '#6b7280' : '#9ca3af'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      {new Date(schedule.date).toLocaleDateString('es-ES')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {schedule.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} />
                      {schedule.inspector}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Nueva Inspección */}
      {showInspectionModal && (
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
            backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: 0
              }}>
                Nueva Inspección
              </h2>
              <button
                onClick={() => setShowInspectionModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Propiedad
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: theme === 'dark' ? '#111827' : 'white',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }}
                >
                  <option>Seleccionar propiedad</option>
                  <option>Oficina COSUCO</option>
                  <option>Casa Alexander</option>
                  <option>Villa Olivo</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Inspector
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: theme === 'dark' ? '#111827' : 'white',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }}
                >
                  <option>Asignar inspector</option>
                  <option>Francisco Guarderas</option>
                  <option>María López</option>
                  <option>Carlos Mendoza</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Fecha y Hora
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="date"
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: theme === 'dark' ? '#111827' : 'white',
                      color: theme === 'dark' ? '#f3f4f6' : '#111827'
                    }}
                  />
                  <input
                    type="time"
                    style={{
                      padding: '10px',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: theme === 'dark' ? '#111827' : 'white',
                      color: theme === 'dark' ? '#f3f4f6' : '#111827'
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '32px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: theme === 'dark' ? '#f3f4f6' : '#374151',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
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

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}