// app/dashboard/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { GoogleLoginButton } from '@/components/google-login-button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userName, setUserName] = useState('Francisco Guarderas')
  const [userRole, setUserRole] = useState('Admin')

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
    // Limpiar datos de sesión
    localStorage.removeItem('google_access_token')
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '70px',
        backgroundColor: 'white',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        {/* Logo y Toggle */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#dc2626'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {sidebarOpen && (
              <>
                <Image 
                  src="/images/logo-inspecten.png" 
                  alt="INSPECTEN" 
                  width={40} 
                  height={40}
                  style={{ background: 'white', borderRadius: '8px', padding: '4px' }}
                />
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}>
                  INSPECTEN
                </h2>
              </>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: 'white',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px'
            }}
          >
            ☰
          </button>
        </div>

        {/* Google Login Button */}
        {sidebarOpen && (
          <div style={{ padding: '15px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <GoogleLoginButton />
          </div>
        )}

        {/* Menu de navegación */}
        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
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
                  color: isActive ? '#dc2626' : '#374151',
                  backgroundColor: isActive ? '#fee2e2' : 'transparent',
                  borderLeft: isActive ? '4px solid #dc2626' : '4px solid transparent',
                  transition: 'all 0.2s',
                  fontSize: '15px',
                  fontWeight: isActive ? '500' : '400'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                    e.currentTarget.style.color = '#dc2626'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#374151'
                  }
                }}
              >
                <span style={{ 
                  fontSize: '20px', 
                  marginRight: sidebarOpen ? '12px' : '0',
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {item.icon}
                </span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Información del usuario */}
        {sidebarOpen && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ 
                fontSize: '14px', 
                color: '#111827', 
                margin: '0 0 4px 0',
                fontWeight: '500'
              }}>
                {userName}
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                margin: 0 
              }}>
                {userRole}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'white',
                color: '#dc2626',
                border: '1px solid #dc2626',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.color = '#dc2626'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </aside>

      {/* Contenido principal */}
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? '260px' : '70px',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          padding: '20px 40px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
            textTransform: 'capitalize'
          }}>
            {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Notificaciones */}
            <button style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              position: 'relative'
            }}>
              🔔
              <span style={{
                position: 'absolute',
                top: '0',
                right: '0',
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
                3
              </span>
            </button>
            
            {/* Fecha y hora */}
            <div style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              {new Date().toLocaleDateString('es-EC', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <div style={{
          padding: '30px 40px',
          minHeight: 'calc(100vh - 80px)'
        }}>
          {children}
        </div>
      </main>
    </div>
  )
}