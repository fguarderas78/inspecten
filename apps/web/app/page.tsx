'use client'

import { useState, useEffect, useRef } from 'react'
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

// Tipos
interface DashboardStats {
  totalAssets: number
  totalInspections: number
  completedInspections: number
  pendingInspections: number
  scheduledInspections: number
  totalTasks: number
  pendingTasks: number
  totalUsers: number
  revenue: number
  efficiency: number
  satisfaction: number
}

interface Widget {
  id: string
  type: string
  title: string
  size: 'small' | 'medium' | 'large' | 'full'
  position: { x: number; y: number }
  visible: boolean
}

interface Notification {
  id: string
  type: 'inspection' | 'task' | 'system' | 'alert'
  title: string
  message: string
  time: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
}

export default function EnhancedDashboard() {
  const router = useRouter()
  const [period, setPeriod] = useState('month')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 8,
    totalInspections: 5,
    completedInspections: 3,
    pendingInspections: 1,
    scheduledInspections: 1,
    totalTasks: 12,
    pendingTasks: 4,
    totalUsers: 4,
    revenue: 15420,
    efficiency: 87,
    satisfaction: 92
  })
  
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'stats', type: 'stats', title: 'Estadísticas', size: 'full', position: { x: 0, y: 0 }, visible: true },
    { id: 'analytics', type: 'analytics', title: 'Analytics', size: 'large', position: { x: 0, y: 1 }, visible: true },
    { id: 'map', type: 'map', title: 'Mapa', size: 'medium', position: { x: 2, y: 1 }, visible: true },
    { id: 'weather', type: 'weather', title: 'Clima', size: 'small', position: { x: 3, y: 1 }, visible: true },
    { id: 'calendar', type: 'calendar', title: 'Calendario', size: 'medium', position: { x: 0, y: 2 }, visible: true },
    { id: 'photos', type: 'photos', title: 'Fotos Recientes', size: 'medium', position: { x: 2, y: 2 }, visible: true },
    { id: 'team', type: 'team', title: 'Actividad del Equipo', size: 'medium', position: { x: 0, y: 3 }, visible: true },
    { id: 'chat', type: 'chat', title: 'Chat', size: 'small', position: { x: 3, y: 3 }, visible: false }
  ])
  const [customizingDashboard, setCustomizingDashboard] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [voiceSearchActive, setVoiceSearchActive] = useState(false)

  useEffect(() => {
    fetchDashboardData()
    fetchNotifications()
    
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [period])

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#111827' : '#f3f4f6'
    document.body.style.color = theme === 'dark' ? '#f3f4f6' : '#111827'
  }, [theme])

  const fetchDashboardData = async () => {
    // Simulación de API
  }

  const fetchNotifications = async () => {
    setNotifications([
      {
        id: '1',
        type: 'inspection',
        title: 'Nueva inspección asignada',
        message: 'Se te ha asignado la inspección de Villa Olivo',
        time: '5 min ago',
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'task',
        title: 'Tarea próxima a vencer',
        message: 'La tarea de revisión de documentos vence mañana',
        time: '1 hora',
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'system',
        title: 'Actualización del sistema',
        message: 'Nueva función de reportes disponible',
        time: '2 horas',
        read: true,
        priority: 'low'
      }
    ])
  }

  const handleSearch = (query: string) => {
    console.log('Buscando:', query)
  }

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = 'es-ES'
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        handleSearch(transcript)
      }
      recognition.start()
      setVoiceSearchActive(true)
      recognition.onend = () => setVoiceSearchActive(false)
    }
  }

  const renderWidget = (widget: Widget) => {
    const baseStyle = {
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: theme === 'dark' 
        ? '0 1px 3px rgba(0, 0, 0, 0.3)' 
        : '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
      height: '100%'
    }

    switch (widget.type) {
      case 'stats':
        return <StatsGrid stats={stats} theme={theme} router={router} />
      case 'analytics':
        return <AnalyticsWidget theme={theme} period={period} />
      case 'map':
        return <MapWidget theme={theme} />
      case 'weather':
        return <WeatherWidget theme={theme} />
      case 'calendar':
        return <CalendarWidget theme={theme} />
      case 'photos':
        return <PhotoGallery theme={theme} />
      case 'team':
        return <TeamActivity theme={theme} />
      case 'chat':
        return <ChatWidget theme={theme} />
      default:
        return null
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
      color: theme === 'dark' ? '#f3f4f6' : '#111827',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
        borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flex: 1
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              margin: 0,
              color: theme === 'dark' ? '#f3f4f6' : '#111827',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Actividad
          </button>
          <button
            onClick={() => setSelectedTab('ranking')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: selectedTab === 'ranking' 
                ? theme === 'dark' ? '#374151' : 'white' 
                : 'transparent',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: selectedTab === 'ranking' ? '600' : '400',
              color: theme === 'dark' ? '#f3f4f6' : '#111827',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Ranking
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {selectedTab === 'activity' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
                  borderRadius: '8px',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: getAvatarColor(activity.avatar),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  {activity.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '13px',
                    margin: 0,
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }}>
                    <strong>{activity.user}</strong> {activity.action}{' '}
                    <strong>{activity.target}</strong>
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                    margin: '4px 0 0 0'
                  }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {teamRanking.map((member) => (
              <div
                key={member.position}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: member.position === 1 
                    ? theme === 'dark' ? '#1e3a8a20' : '#dbeafe50'
                    : theme === 'dark' ? '#111827' : '#f9fafb',
                  borderRadius: '8px',
                  border: member.position === 1 
                    ? '1px solid #3b82f6' 
                    : 'none'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: member.position <= 3 
                    ? member.position === 1 ? '#fbbf24' 
                    : member.position === 2 ? '#c0c0c0' 
                    : '#cd7f32'
                    : theme === 'dark' ? '#374151' : '#e5e7eb',
                  color: member.position <= 3 ? 'white' : theme === 'dark' ? '#f3f4f6' : '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {member.position}
                </div>

                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: getAvatarColor(member.avatar),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {member.avatar}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    margin: 0,
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }}>
                    {member.name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                    margin: 0
                  }}>
                    {member.inspections} inspecciones • {member.efficiency}% eficiencia
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }}>
                    {member.points}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                    margin: 0
                  }}>
                    puntos
                  </p>
                </div>

                <div style={{
                  color: member.trend === 'up' ? '#10b981' 
                    : member.trend === 'down' ? '#ef4444' 
                    : '#6b7280'
                }}>
                  {member.trend === 'up' ? '↑' : member.trend === 'down' ? '↓' : '→'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTab === 'ranking' && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <Award size={16} color="#fbbf24" />
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: theme === 'dark' ? '#f3f4f6' : '#111827'
            }}>
              Logro de la Semana
            </span>
          </div>
          <p style={{
            fontSize: '12px',
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            margin: 0
          }}>
            Francisco Guarderas completó 5 inspecciones en un día 🏆
          </p>
        </div>
      )}
    </div>
  )
}

function ChatWidget({ theme }: any) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'María López',
      message: '¿Alguien puede revisar las fotos de Casa Alexander?',
      time: '10:30',
      isMe: false
    },
    {
      id: 2,
      user: 'Yo',
      message: 'Claro, las reviso ahora mismo',
      time: '10:32',
      isMe: true
    },
    {
      id: 3,
      user: 'María López',
      message: 'Gracias! Hay un problema en la cocina que necesita atención',
      time: '10:33',
      isMe: false
    }
  ])

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        user: 'Yo',
        message: message,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }])
      setMessage('')
    }
  }

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      padding: '24px',
      borderRadius: '12px',
      height: '400px',
      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: 0,
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <MessageSquare size={20} />
          Chat del Equipo
        </h3>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.isMe ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: msg.isMe 
                ? '#dc2626' 
                : theme === 'dark' ? '#374151' : '#f3f4f6',
              color: msg.isMe ? 'white' : theme === 'dark' ? '#f3f4f6' : '#111827'
            }}>
              {!msg.isMe && (
                <p style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  margin: '0 0 4px 0',
                  opacity: 0.8
                }}>
                  {msg.user}
                </p>
              )}
              <p style={{
                fontSize: '13px',
                margin: 0
              }}>
                {msg.message}
              </p>
              <p style={{
                fontSize: '11px',
                margin: '4px 0 0 0',
                opacity: 0.7
              }}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '8px'
      }}>
        <button
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            color: theme === 'dark' ? '#9ca3af' : '#6b7280'
          }}
          title="Adjuntar archivo"
        >
          <Paperclip size={16} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '6px',
            fontSize: '13px',
            backgroundColor: theme === 'dark' ? '#111827' : 'white',
            color: theme === 'dark' ? '#f3f4f6' : '#111827'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '8px 12px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}

function DashboardCustomizer({ widgets, setWidgets, theme, onClose }: any) {
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)

  const handleDragStart = (widgetId: string) => {
    setDraggedWidget(widgetId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetId: string) => {
    if (draggedWidget && draggedWidget !== targetId) {
      const newWidgets = [...widgets]
      const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidget)
      const targetIndex = newWidgets.findIndex(w => w.id === targetId)
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = newWidgets.splice(draggedIndex, 1)
        newWidgets.splice(targetIndex, 0, removed)
        setWidgets(newWidgets)
      }
    }
    setDraggedWidget(null)
  }

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(widgets.map((w: any) => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ))
  }

  const changeWidgetSize = (widgetId: string, size: string) => {
    setWidgets(widgets.map((w: any) => 
      w.id === widgetId ? { ...w, size } : w
    ))
  }

  return (
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
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
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
            color: theme === 'dark' ? '#f3f4f6' : '#111827'
          }}>
            Personalizar Dashboard
          </h2>
          <button
            onClick={onClose}
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

        <p style={{
          fontSize: '14px',
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          marginBottom: '24px'
        }}>
          Arrastra para reordenar, oculta/muestra widgets y ajusta sus tamaños
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {widgets.map((widget: any) => (
            <div
              key={widget.id}
              draggable
              onDragStart={() => handleDragStart(widget.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(widget.id)}
              style={{
                padding: '16px',
                backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
                borderRadius: '8px',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                cursor: 'move',
                opacity: widget.visible ? 1 : 0.6
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <GripVertical size={16} color={theme === 'dark' ? '#6b7280' : '#9ca3af'} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }}>
                    {widget.title}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <select
                    value={widget.size}
                    onChange={(e) => changeWidgetSize(widget.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '4px',
                      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                      color: theme === 'dark' ? '#f3f4f6' : '#111827',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="small">Pequeño</option>
                    <option value="medium">Mediano</option>
                    <option value="large">Grande</option>
                    <option value="full">Completo</option>
                  </select>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWidgetVisibility(widget.id)
                    }}
                    style={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: widget.visible ? '#10b981' : '#ef4444'
                    }}
                    title={widget.visible ? 'Ocultar' : 'Mostrar'}
                  >
                    {widget.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '32px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={() => {
              window.location.reload()
            }}
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
            Restaurar
          </button>
          <button
            onClick={onClose}
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
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}f4f6' : '#111827'
            }}>
              Dashboard
            </h1>

            <div style={{
              flex: 1,
              maxWidth: '500px',
              position: 'relative'
            }}>
              <Search 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Buscar propiedades, inspecciones, clientes... (Ctrl+K)"
                style={{
                  width: '100%',
                  padding: '8px 80px 8px 40px',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
                  color: theme === 'dark' ? '#f3f4f6' : '#111827'
                }}
              />
              <button
                onClick={handleVoiceSearch}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '4px 8px',
                  backgroundColor: voiceSearchActive ? '#dc2626' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: voiceSearchActive ? 'white' : '#6b7280'
                }}
              >
                <Mic size={16} />
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{
                padding: '8px 16px',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: theme === 'dark' ? '#111827' : 'white',
                color: theme === 'dark' ? '#f3f4f6' : '#111827',
                cursor: 'pointer'
              }}
            >
              <option value="today">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Año</option>
            </select>

            <button
              onClick={() => fetchDashboardData()}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: theme === 'dark' ? '#f3f4f6' : '#374151'
              }}
              title="Actualizar datos"
            >
              <RefreshCw size={16} />
            </button>

            <button
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '14px',
                color: theme === 'dark' ? '#f3f4f6' : '#374151'
              }}
            >
              <Download size={16} />
              Exportar
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  padding: '8px',
                  backgroundColor: notifications.some(n => !n.read) ? '#dc2626' : 'transparent',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  position: 'relative',
                  color: notifications.some(n => !n.read) ? 'white' : theme === 'dark' ? '#f3f4f6' : '#374151'
                }}
              >
                <Bell size={16} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationCenter
                  notifications={notifications}
                  theme={theme}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            <button
              onClick={() => setCustomizingDashboard(!customizingDashboard)}
              style={{
                padding: '8px',
                backgroundColor: customizingDashboard ? '#dc2626' : 'transparent',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                color: customizingDashboard ? 'white' : theme === 'dark' ? '#f3f4f6' : '#374151'
              }}
              title="Personalizar dashboard"
            >
              <Settings size={16} />
            </button>

            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                color: theme === 'dark' ? '#f3f4f6' : '#374151'
              }}
              title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        {customizingDashboard && (
          <DashboardCustomizer
            widgets={widgets}
            setWidgets={setWidgets}
            theme={theme}
            onClose={() => setCustomizingDashboard(false)}
          />
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          opacity: customizingDashboard ? 0.5 : 1,
          pointerEvents: customizingDashboard ? 'none' : 'auto'
        }}>
          {widgets
            .filter(w => w.visible)
            .map(widget => (
              <div
                key={widget.id}
                style={{
                  gridColumn: widget.size === 'small' ? 'span 1' :
                             widget.size === 'medium' ? 'span 2' :
                             widget.size === 'large' ? 'span 3' :
                             'span 4'
                }}
              >
                {renderWidget(widget)}
              </div>
            ))}
        </div>

        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button
            onClick={() => router.push('/dashboard/inspections/new')}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            title="Nueva Inspección"
          >
            <ClipboardList size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Componentes internos
function StatsGrid({ stats, theme, router }: any) {
  const statCards = [
    {
      title: 'Assets Totales',
      value: stats.totalAssets,
      icon: Building2,
      color: '#3b82f6',
      bgColor: theme === 'dark' ? '#1e3a8a' : '#dbeafe',
      link: '/dashboard/assets',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Inspecciones Totales',
      value: stats.totalInspections,
      icon: ClipboardList,
      color: '#8b5cf6',
      bgColor: theme === 'dark' ? '#5b21b6' : '#e9d5ff',
      link: '/dashboard/inspections',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Completadas',
      value: stats.completedInspections,
      icon: CheckCircle,
      color: '#10b981',
      bgColor: theme === 'dark' ? '#064e3b' : '#d1fae5',
      link: '/dashboard/inspections?filter=completed',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'En Proceso',
      value: stats.pendingInspections,
      icon: Clock,
      color: '#f59e0b',
      bgColor: theme === 'dark' ? '#78350f' : '#fef3c7',
      link: '/dashboard/inspections?filter=in-progress',
      trend: '-5%',
      trendUp: false
    },
    {
      title: 'Ingresos del Mes',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: '#10b981',
      bgColor: theme === 'dark' ? '#064e3b' : '#d1fae5',
      link: '/dashboard/finance',
      trend: '+22%',
      trendUp: true
    },
    {
      title: 'Eficiencia',
      value: `${stats.efficiency}%`,
      icon: Activity,
      color: '#3b82f6',
      bgColor: theme === 'dark' ? '#1e3a8a' : '#dbeafe',
      link: '/dashboard/analytics',
      trend: '+3%',
      trendUp: true
    },
    {
      title: 'Satisfacción',
      value: `${stats.satisfaction}%`,
      icon: Award,
      color: '#8b5cf6',
      bgColor: theme === 'dark' ? '#5b21b6' : '#e9d5ff',
      link: '/dashboard/reviews',
      trend: '+2%',
      trendUp: true
    },
    {
      title: 'Alertas Activas',
      value: 3,
      icon: AlertTriangle,
      color: '#ef4444',
      bgColor: theme === 'dark' ? '#7f1d1d' : '#fee2e2',
      link: '/dashboard/alerts',
      trend: '3 nuevas',
      trendUp: false
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    }}>
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            onClick={() => router.push(stat.link)}
            style={{
              backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
              padding: '20px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              backgroundColor: stat.bgColor,
              borderRadius: '50%',
              opacity: 0.2
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '12px',
              position: 'relative'
            }}>
              <div style={{
                padding: '10px',
                backgroundColor: stat.bgColor,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} color={stat.color} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: stat.trendUp ? '#10b981' : '#ef4444'
              }}>
                {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.trend}
              </div>
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#f3f4f6' : '#111827',
              margin: '0 0 4px 0'
            }}>
              {stat.value}
            </h3>
            <p style={{
              fontSize: '13px',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              margin: 0
            }}>
              {stat.title}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function NotificationCenter({ notifications, theme, onClose }: any) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'inspection': return <ClipboardList size={16} />
      case 'task': return <Wrench size={16} />
      case 'alert': return <AlertCircle size={16} />
      default: return <Bell size={16} />
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

  return (
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
          margin: 0,
          color: theme === 'dark' ? '#f3f4f6' : '#111827'
        }}>
          Notificaciones
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Marcar todas como leídas
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div style={{
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {notifications.map((notification: any) => (
          <div
            key={notification.id}
            style={{
              padding: '16px',
              borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
              backgroundColor: notification.read 
                ? 'transparent' 
                : theme === 'dark' ? '#111827' : '#f9fafb',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#111827' : '#f3f4f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = notification.read 
                ? 'transparent' 
                : theme === 'dark' ? '#111827' : '#f9fafb'
            }}
          >
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <div style={{
                padding: '8px',
                backgroundColor: `${getPriorityColor(notification.priority)}20`,
                borderRadius: '8px',
                color: getPriorityColor(notification.priority)
              }}>
                {getIcon(notification.type)}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 4px 0',
                  color: theme === 'dark' ? '#f3f4f6' : '#111827'
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
              {!notification.read && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  flexShrink: 0,
                  marginTop: '4px'
                }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsWidget({ theme, period }: any) {
  const data = {
    avgInspectionTime: 45,
    completionRate: 92,
    inspectionsPerDay: 3.5,
    customerSatisfaction: 4.8
  }

  const chartData = [
    { label: 'Lun', value: 4, completed: 3 },
    { label: 'Mar', value: 6, completed: 5 },
    { label: 'Mie', value: 3, completed: 3 },
    { label: 'Jue', value: 5, completed: 4 },
    { label: 'Vie', value: 7, completed: 6 },
    { label: 'Sab', value: 2, completed: 2 },
    { label: 'Dom', value: 0, completed: 0 }
  ]

  const maxValue = Math.max(...chartData.map(d => d.value))

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      padding: '24px',
      borderRadius: '12px',
      height: '100%',
      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: 0,
          color: theme === 'dark' ? '#f3f4f6' : '#111827'
        }}>
          Analytics Avanzados
        </h3>
        <BarChart3 size={20} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <Clock size={16} color="#3b82f6" />
            <span style={{
              fontSize: '13px',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}>
              Tiempo Promedio
            </span>
          </div>
          <p style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0,
            color: theme === 'dark' ? '#f3f4f6' : '#111827'
          }}>
            {data.avgInspectionTime} min
          </p>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <TrendingUp size={16} color="#10b981" />
            <span style={{
              fontSize: '13px',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}>
              Tasa Completación
            </span>
          </div>
          <p style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0,
            color: theme === 'dark' ? '#f3f4f6' : '#111827'
          }}>
            {data.completionRate}%
          </p>
        </div>
      </div>

      <div style={{
        height: '200px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '100%',
          gap: '8px'
        }}>
          {chartData.map((item, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                height: '100%'
              }}
            >
              <div style={{
                width: '100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: '2px'
              }}>
                <div
                  style={{
                    width: '100%',
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: '#3b82f6',
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    minHeight: '20px',
                    transition: 'all 0.3s ease'
                  }}
                  title={`Total: ${item.value}`}
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      height: `${(item.completed / item.value) * 100}%`,
                      backgroundColor: '#10b981',
                      borderRadius: '4px 4px 0 0'
                    }}
                    title={`Completadas: ${item.completed}`}
                  />
                </div>
              </div>
              <span style={{
                fontSize: '12px',
                color: theme === 'dark' ? '#9ca3af' : '#6b7280'
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MapWidget({ theme }: any) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  const properties = [
    { id: 1, name: 'Oficina COSUCO', lat: -2.1894, lng: -79.8833, status: 'completed' },
    { id: 2, name: 'Casa Alexander', lat: -2.1920, lng: -79.8890, status: 'in-progress' },
    { id: 3, name: 'Villa Olivo', lat: -2.1850, lng: -79.8800, status: 'scheduled' },
    { id: 4, name: 'Centro Comercial', lat: -2.1910, lng: -79.8850, status: 'completed' },
    { id: 5, name: 'Edificio Corporativo', lat: -2.1870, lng: -79.8870, status: 'scheduled' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#f59e0b'
      case 'scheduled': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      padding: '24px',
      borderRadius: '12px',
      height: '400px',
      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: 0,
          color: theme === 'dark' ? '#f3f4f6' : '#111827'
        }}>
          Mapa de Propiedades
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
              borderRadius: '6px',
              backgroundColor: theme === 'dark' ? '#111827' : 'white',
              color: theme === 'dark' ? '#f3f4f6' : '#111827',
              cursor: 'pointer'
            }}
          >
            <option value="all">Todas</option>
            <option value="completed">Completadas</option>
            <option value="in-progress">En Proceso</option>
            <option value="scheduled">Programadas</option>
          </select>
        </div>
      </div>

      <div style={{
        flex: 1,
        backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme === 'dark' ? '#6b7280' : '#9ca3af',
          fontSize: '14px'
        }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 300"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {[...Array(10)].map((_, i) => (
              <g key={i}>
                <line
                  x1={i * 40}
                  y1="0"
                  x2={i * 40}
                  y2="300"
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1={i * 30}
                  x2="400"
                  y2={i * 30}
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                  strokeWidth="1"
                />
              </g>
            ))}
            
            {properties
              .filter(p => selectedFilter === 'all' || p.status === selectedFilter)
              .map((property, index) => (
                <g key={property.id}>
                  <circle
                    cx={150 + index * 50}
                    cy={100 + index * 20}
                    r="8"
                    fill={getStatusColor(property.status)}
                    style={{ cursor: 'pointer' }}
                  />
                  <text
                    x={150 + index * 50}
                    y={90 + index * 20}
                    textAnchor="middle"
                    fontSize="11"
                    fill={theme === 'dark' ? '#f3f4f6' : '#111827'}
                  >
                    {property.name.split(' ')[0]}
                  </text>
                </g>
              ))}
          </svg>
        </div>
      </div>
    </div>
  )
}

function WeatherWidget({ theme }: any) {
  const weather = {
    temp: 28,
    condition: 'Parcialmente nublado',
    humidity: 65,
    wind: 12,
    forecast: [
      { day: 'Hoy', temp: 28, icon: 'cloud' },
      { day: 'Mañana', temp: 27, icon: 'rain' },
      { day: 'Miércoles', temp: 29, icon: 'sun' },
      { day: 'Jueves', temp: 26, icon: 'cloud' },
      { day: 'Viernes', temp: 30, icon: 'sun' }
    ]
  }

  const getWeatherIcon = (type: string, size: number = 24) => {
    switch (type) {
      case 'sun': return <Sun size={size} color="#f59e0b" />
      case 'cloud': return <Cloud size={size} color="#6b7280" />
      case 'rain': return <CloudRain size={size} color="#3b82f6" />
      default: return <Cloud size={size} color="#6b7280" />
    }
  }

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      padding: '24px',
      borderRadius: '12px',
      height: '100%',
      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        margin: '0 0 16px 0',
        color: theme === 'dark' ? '#f3f4f6' : '#111827'
      }}>
        Clima - Guayaquil
      </h3>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: theme === 'dark' ? '#f3f4f6' : '#111827'
          }}>
            {weather.temp}°C
          </div>
          <p style={{
            fontSize: '14px',
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            margin: 0
          }}>
            {weather.condition}
          </p>
        </div>
        {getWeatherIcon('cloud', 48)}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
          borderRadius: '6px'
        }}>
          <Droplets size={16} color="#3b82f6" />
          <div>
            <p style={{
              fontSize: '11px',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              margin: 0
            }}>
              Humedad
            </p>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              margin: 0,
              color: theme === 'dark' ? '#f3f4f6' : '#111827'
            }}>
              {weather.humidity}%
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
          borderRadius: '6px'
        }}>
          <Wind size={16} color="#6b7280" />
          <div>
            <p style={{
              fontSize: '11px',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              margin: 0
            }}>
              Viento
            </p>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              margin: 0,
              color: theme === 'dark' ? '#f3f4f6' : '#111827'
            }}>
              {weather.wind} km/h
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarWidget({ theme }: any) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const events: any = {
    '2025-01-25': [
      { time: '09:00', title: 'Inspección Oficina COSUCO', type: 'inspection' },
      { time: '14:00', title: 'Revisión Villa Olivo', type: 'inspection' }
    ],
    '2025-01-26': [
      { time: '10:00', title: 'Mantenimiento Sistema', type: 'maintenance' }
    ]
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateStr = formatDate(date)
      const hasEvents = events[dateStr]
      const isToday = formatDate(new Date()) === dateStr
      const isSelected = formatDate(selectedDate) === dateStr

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          style={{
            aspectRatio: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            cursor: 'pointer',
            position: 'relative',
            backgroundColor: isSelected 
              ? '#dc2626' 
              : isToday 
                ? theme === 'dark' ? '#374151' : '#e5e7eb'
                : 'transparent',
            color: isSelected 
              ? 'white' 
              : theme === 'dark' ? '#f3f4f6' : '#111827',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: isToday ? '600' : '400' }}>
            {day}
          </span>
          {hasEvents && (
            <div style={{
              position: 'absolute',
              bottom: '4px',
              display: 'flex',
              gap: '2px'
            }}>
              {hasEvents.slice(0, 3).map((_: any, index: number) => (
                <div
                  key={index}
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'white' : '#dc2626'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      padding: '24px',
      borderRadius: '12px',
      height: '100%',
      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: 0,
          color: theme === 'dark' ? '#f3f4f6' : '#111827'
        }}>
          Calendario
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: theme === 'dark' ? '#f3f4f6' : '#111827'
          }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        marginBottom: '8px'
      }}>
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
          <div
            key={index}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '600',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              padding: '4px'
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        flex: 1
      }}>
        {renderCalendar()}
      </div>
    </div>
  )
}

function PhotoGallery({ theme }: any) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  const photos = [
    {
      id: 1,
      property: 'Oficina COSUCO',
      date: '2025-01-25',
      inspector: 'Francisco G.',
      hasIssue: false
    },
    {
      id: 2,
      property: 'Casa Alexander',
      date: '2025-01-24',
      inspector: 'María L.',
      hasIssue: true
    },
    {
      id: 3,
      property: 'Villa Olivo',
      date: '2025-01-24',
      inspector: 'Carlos M.',
      hasIssue: true
    },
    {
      id: 4,
      property: 'Centro Comercial',
      date: '2025-01-23',
      inspector: 'Ana R.',
      hasIssue: false
    }
  ]

  const filteredPhotos = photos.filter(photo => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'issues') return photo.hasIssue
    return true
  })

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      padding: '24px',
      borderRadius: '12px',
      height: '100%',
      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: 0,
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Camera size={20} />
          Fotos Recientes
        </h3>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '6px',
            backgroundColor: theme === 'dark' ? '#111827' : 'white',
            color: theme === 'dark' ? '#f3f4f6' : '#111827',
            cursor: 'pointer'
          }}
        >
          <option value="all">Todas</option>
          <option value="recent">Últimas 48h</option>
          <option value="issues">Con problemas</option>
        </select>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        flex: 1,
        overflowY: 'auto'
      }}>
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              aspectRatio: '1',
              backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
              border: photo.hasIssue 
                ? '2px solid #ef4444' 
                : `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme === 'dark' ? '#6b7280' : '#9ca3af'
            }}>
              <Image size={32} />
            </div>

            {photo.hasIssue && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '24px',
                height: '24px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                !
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamActivity({ theme }: any) {
  const [selectedTab, setSelectedTab] = useState('activity')

  const activities = [
    {
      id: 1,
      user: 'Francisco Guarderas',
      action: 'completó inspección',
      target: 'Oficina COSUCO',
      time: 'Hace 5 minutos',
      avatar: 'FG'
    },
    {
      id: 2,
      user: 'María López',
      action: 'subió 15 fotos en',
      target: 'Casa Alexander',
      time: 'Hace 20 minutos',
      avatar: 'ML'
    }
  ]

  const teamRanking = [
    {
      position: 1,
      name: 'Francisco Guarderas',
      inspections: 12,
      efficiency: 98,
      points: 1250,
      trend: 'up',
      avatar: 'FG'
    },
    {
      position: 2,
      name: 'María López',
      inspections: 10,
      efficiency: 95,
      points: 1100,
      trend: 'up',
      avatar: 'ML'
    }
  ]

  const getAvatarColor = (initials: string) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
    return colors[initials.charCodeAt(0) % colors.length]
  }

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      padding: '24px',
      borderRadius: '12px',
      height: '100%',
      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: 0,
            color: theme === 'dark' ? '#f3f4f6' : '#111827'
          }}>
            Equipo
          </h3>
          <Users size={20} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
        </div>
        
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '4px',
          backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => setSelectedTab('activity')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: selectedTab === 'activity' 
                ? theme === 'dark' ? '#374151' : 'white' 
                : 'transparent',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: selectedTab === 'activity' ? '600' : '400',
              color: theme === 'dark' ? '#f3