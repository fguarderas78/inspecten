'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPicture, setUserPicture] = useState('')

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = sessionStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      router.push('/')
      return
    }

    // Obtener datos del usuario
    setUserName(sessionStorage.getItem('userName') || 'Usuario')
    setUserEmail(sessionStorage.getItem('userEmail') || '')
    setUserPicture(sessionStorage.getItem('userPicture') || '')
  }, [router])

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/assets', label: 'Propiedades', icon: '🏠' },
    { href: '/dashboard/inspections', label: 'Inspecciones', icon: '📋' },
    { href: '/dashboard/tasks', label: 'Tareas', icon: '✓' },
    { href: '/dashboard/schedules', label: 'Agenda', icon: '📅' },
    { href: '/dashboard/budgets', label: 'Presupuestos', icon: '💰' },
    { href: '/dashboard/users', label: 'Usuarios', icon: '👥' },
    { href: '/dashboard/checklists', label: 'Checklists', icon: '📝' },
    { href: '/dashboard/settings', label: 'Configuración', icon: '⚙️' },
  ]

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  // Obtener el título de la página actual
  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.href === pathname)
    return currentItem ? currentItem.label : 'Dashboard'
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '250px' : '70px',
        backgroundColor: '#f9fafb',
        borderRight: '1px solid #e5e7eb',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Logo y toggle */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            overflow: 'hidden'
          }}>
            <img 
              src="/Inspecten-01.png" 
              alt="INSPECTEN" 
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                flexShrink: 0
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const textLogo = document.createElement('div')
                textLogo.innerHTML = '<strong style="color: #dc2626; font-size: 20px;">IN</strong>'
                e.currentTarget.parentElement?.appendChild(textLogo)
              }}
            />
            {sidebarOpen && (
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#dc2626',
                margin: 0,
                whiteSpace: 'nowrap'
              }}>
                INSPECTEN
              </h2>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu */}
        <nav style={{ 
          padding: '12px 0',
          flex: 1
        }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  color: isActive ? '#dc2626' : '#4b5563',
                  backgroundColor: isActive ? '#fee2e2' : 'transparent',
                  borderLeft: isActive ? '3px solid #dc2626' : '3px solid transparent',
                  transition: 'all 0.2s',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <span style={{ 
                  fontSize: '20px',
                  flexShrink: 0
                }}>{item.icon}</span>
                {sidebarOpen && (
                  <span style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: sidebarOpen ? '16px' : '12px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#ffffff'
        }}>
          {sidebarOpen ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              {userPicture ? (
                <img 
                  src={userPicture} 
                  alt={userName}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ overflow: 'hidden' }}>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#111827', 
                  margin: 0,
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {userName}
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {userEmail}
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              {userPicture ? (
                <img 
                  src={userPicture} 
                  alt={userName}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fecaca'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2'
            }}
          >
            <span>🚪</span>
            {sidebarOpen && 'Cerrar Sesión'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Bar */}
        <header style={{
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {menuItems.find(item => item.href === pathname)?.icon} {getPageTitle()}
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Botón de sincronización con Google Drive */}
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#4b5563',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.boxShadow = 'none'
              }}
              title="Sincronizar con Google Drive"
            >
              <span>☁️</span>
              Sincronizar
            </button>

            {/* Notificaciones */}
            <button
              style={{
                position: 'relative',
                padding: '8px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span style={{ fontSize: '20px' }}>🔔</span>
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: '#dc2626',
                borderRadius: '50%'
              }}></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '32px 40px',
          overflow: 'auto',
          backgroundColor: '#ffffff'
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}