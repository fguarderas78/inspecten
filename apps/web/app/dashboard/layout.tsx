{/* User Section at Bottom */}
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
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2'
              e.currentTarget.style.borderColor = '#dc2626'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <LogOut size={18} />
            {sidebarOpen && 'Cerrar Sesión'}
          </button>
        </div>'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardCheck, 
  CheckSquare, 
  Calendar, 
  Users, 
  FileText, 
  Calculator,
  Settings,
  Menu,
  LogOut
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('google_token')
      
      // Si Google está cargado, hacer logout de Google también
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect()
      }
      
      // Redirigir al login
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/propiedades', label: 'Propiedades', icon: Building2 },
    { href: '/dashboard/inspections', label: 'Inspecciones', icon: ClipboardCheck },
    { href: '/dashboard/tasks', label: 'Tareas', icon: CheckSquare },
    { href: '/dashboard/schedules', label: 'Agenda', icon: Calendar },
    { href: '/dashboard/users', label: 'Usuarios', icon: Users },
    { href: '/dashboard/checklists', label: 'Checklists', icon: FileText },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
    { href: '/dashboard/presupuestos', label: 'Presupuestos', icon: Calculator },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '70px',
        backgroundColor: '#ffffff',
        boxShadow: '2px 0 12px rgba(0, 0, 0, 0.06)',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        borderRight: '1px solid #E5E7EB'
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'flex-start' : 'center'
        }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#B91C1C',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                letterSpacing: '-1px'
              }}>
                INSPEC
              </span>
              <span style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#6B7280',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                letterSpacing: '-1px'
              }}>
                TEN
              </span>
            </div>
          ) : (
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#B91C1C',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}>
              I
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              marginLeft: 'auto',
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav style={{ padding: '16px 0' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
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
                  backgroundColor: isActive ? '#fef2f2' : 'transparent',
                  borderLeft: isActive ? '3px solid #dc2626' : '3px solid transparent',
                  transition: 'all 0.2s',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontSize: '15px',
                  fontWeight: isActive ? '500' : '400'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                    e.currentTarget.style.color = '#1f2937'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#4b5563'
                  }
                }}
              >
                <Icon size={20} style={{ marginRight: '12px', flexShrink: 0 }} />
                <span style={{ display: sidebarOpen ? 'block' : 'none' }}>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '32px 40px',
        overflow: 'auto',
        backgroundColor: '#F9FAFB',
        minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  )
}