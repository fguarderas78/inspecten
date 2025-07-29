'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/propiedades', label: 'Propiedades', icon: '🏠' },
    { href: '/dashboard/inspections', label: 'Inspecciones', icon: '📋' },
    { href: '/dashboard/tasks', label: 'Tareas', icon: '✓' },
    { href: '/dashboard/schedules', label: 'Agenda', icon: '📅' },
    { href: '/dashboard/presupuestos', label: 'Presupuestos', icon: '💰' },
    { href: '/dashboard/users', label: 'Usuarios', icon: '👥' },
    { href: '/dashboard/checklists', label: 'Checklists', icon: '📝' },
    { href: '/dashboard/settings', label: 'Configuración', icon: '⚙️' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '250px' : '60px',
        backgroundColor: 'white',
        boxShadow: '1px 0 3px rgba(0, 0, 0, 0.1)',
        transition: 'width 0.3s ease',
        overflow: 'hidden'
      }}>
        {/* Logo */}
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

        {/* Menu */}
        <nav style={{ padding: '20px 0' }}>
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

        {/* User Info */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb',
          display: sidebarOpen ? 'block' : 'none'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
            Francisco Guarderas
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
            Admin
          </p>
        </div>
      </aside>

      {/* Main Content */}
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