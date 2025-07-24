'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/assets', label: 'Assets', icon: '🏠' },
    { href: '/dashboard/inspections', label: 'Inspecciones', icon: '📋' },
    { href: '/dashboard/tasks', label: 'Tareas', icon: '✓' },
    { href: '/dashboard/schedules', label: 'Agenda', icon: '📅' },
    { href: '/dashboard/users', label: 'Usuarios', icon: '👥' },
    { href: '/dashboard/checklists', label: 'Checklists', icon: '📝' },
    { href: '/dashboard/settings', label: 'Configuración', icon: '⚙️' },
  ]

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <aside style={{
        width: sidebarOpen ? '250px' : '60px',
        backgroundColor: 'white',
        boxShadow: '1px 0 3px rgba(0, 0, 0, 0.1)',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#dc2626',
            margin: 0,
            display: sidebarOpen ? 'block' : 'none'
          }}>
            INSPECTEN
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ☰
          </button>
        </div>

        <nav style={{ padding: '20px 0', marginBottom: '80px' }}>
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
                  borderLeft: isActive ? '3px solid #dc2626' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '20px', marginRight: '12px' }}>{item.icon}</span>
                <span style={{ display: sidebarOpen ? 'block' : 'none' }}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fafafa'
        }}>
          {sidebarOpen && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '14px', color: '#374151', fontWeight: '500', margin: '0 0 4px 0' }}>
                Francisco Guarderas
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                admin@inspecten.com
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '8px'
            }}
          >
            🚪
            {sidebarOpen && 'Cerrar Sesión'}
          </button>
        </div>
      </aside>

      <main style={{
        flex: 1,
        padding: '20px 40px',
        overflow: 'auto'
      }}>
        {children}
      </main>
    </div>
  )
}