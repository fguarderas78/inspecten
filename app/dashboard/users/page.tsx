'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'manager' | 'supervisor' | 'inspector'
  status: 'active' | 'inactive'
  phone?: string
  department?: string
  joinDate: string
  lastActive: string
  inspectionsCompleted?: number
  inspectionsAssigned?: number
  averageRating?: number
  avatar?: string
  specialties?: string[]
}

export default function UsersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null)

  // Datos de ejemplo
  const [users] = useState<User[]>([
    {
      id: 'USR-001',
      name: 'Francisco Guarderas',
      email: 'francisco@inspecten.com',
      role: 'owner',
      status: 'active',
      phone: '+593 98 765 4321',
      department: 'Dirección',
      joinDate: '2023-01-15',
      lastActive: '2024-01-23',
      inspectionsCompleted: 0,
      inspectionsAssigned: 0,
      averageRating: 5.0
    },
    {
      id: 'USR-002',
      name: 'Carlos López',
      email: 'carlos.lopez@inspecten.com',
      role: 'inspector',
      status: 'active',
      phone: '+593 98 123 4567',
      department: 'Inspecciones',
      joinDate: '2023-03-20',
      lastActive: '2024-01-23',
      inspectionsCompleted: 45,
      inspectionsAssigned: 3,
      averageRating: 4.8,
      specialties: ['Residencial', 'Comercial']
    },
    {
      id: 'USR-003',
      name: 'Ana Martínez',
      email: 'ana.martinez@inspecten.com',
      role: 'manager',
      status: 'active',
      phone: '+593 98 234 5678',
      department: 'Operaciones',
      joinDate: '2023-02-10',
      lastActive: '2024-01-22',
      inspectionsCompleted: 0,
      inspectionsAssigned: 0,
      averageRating: 5.0
    },
    {
      id: 'USR-004',
      name: 'Pedro Sánchez',
      email: 'pedro.sanchez@inspecten.com',
      role: 'inspector',
      status: 'active',
      phone: '+593 98 345 6789',
      department: 'Inspecciones',
      joinDate: '2023-06-01',
      lastActive: '2024-01-21',
      inspectionsCompleted: 32,
      inspectionsAssigned: 5,
      averageRating: 4.6,
      specialties: ['Industrial', 'Comercial']
    },
    {
      id: 'USR-005',
      name: 'María García',
      email: 'maria.garcia@inspecten.com',
      role: 'supervisor',
      status: 'inactive',
      phone: '+593 98 456 7890',
      department: 'Calidad',
      joinDate: '2023-04-15',
      lastActive: '2024-01-10',
      inspectionsCompleted: 0,
      inspectionsAssigned: 0,
      averageRating: 4.9
    }
  ])

  const handleClickOutside = () => {
    setActiveActionMenu(null)
  }

  const viewUserDetails = (user: User) => {
    setSelectedUser(user)
    setShowUserDetails(true)
    setActiveActionMenu(null)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return '#dc2626'
      case 'admin': return '#7c3aed'
      case 'manager': return '#2563eb'
      case 'supervisor': return '#0891b2'
      case 'inspector': return '#059669'
      default: return '#6b7280'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'owner': return 'Propietario'
      case 'admin': return 'Administrador'
      case 'manager': return 'Gerente'
      case 'supervisor': return 'Supervisor'
      case 'inspector': return 'Inspector'
      default: return role
    }
  }

  // Filtrado
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Estadísticas
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    inspectors: users.filter(u => u.role === 'inspector').length,
    totalInspections: users.reduce((acc, u) => acc + (u.inspectionsCompleted || 0), 0)
  }

  return (
    <div onClick={handleClickOutside}>
      {/* Header */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px'
          }}>
            Usuarios
          </h1>
          <p style={{ color: '#6b7280' }}>
            Gestiona los usuarios y permisos del sistema
          </p>
        </div>
        <button
          onClick={() => setShowNewUserModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>+</span> Nuevo Usuario
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.total}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Usuarios</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{stats.active}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Activos</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280' }}>{stats.inactive}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Inactivos</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>{stats.inspectors}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Inspectores</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.totalInspections}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Inspecciones Totales</div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 200px 200px',
          gap: '16px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Buscar por nombre, email o departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todos los roles</option>
            <option value="owner">Propietario</option>
            <option value="admin">Administrador</option>
            <option value="manager">Gerente</option>
            <option value="supervisor">Supervisor</option>
            <option value="inspector">Inspector</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Lista de Usuarios Compacta */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {filteredUsers.map((user, index) => (
          <div
            key={user.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              borderBottom: index < filteredUsers.length - 1 ? '1px solid #e5e7eb' : 'none',
              transition: 'background-color 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: getRoleColor(user.role) + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              fontSize: '16px',
              fontWeight: '600',
              color: getRoleColor(user.role)
            }}>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>

            {/* Información principal */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '4px'
              }}>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  {user.name}
                </h3>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: getRoleColor(user.role) + '20',
                  color: getRoleColor(user.role)
                }}>
                  {getRoleText(user.role)}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  backgroundColor: user.status === 'active' ? '#d1fae5' : '#fee2e2',
                  color: user.status === 'active' ? '#065f46' : '#991b1b'
                }}>
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <span>✉️ {user.email}</span>
                {user.phone && <span>📱 {user.phone}</span>}
                {user.department && <span>🏢 {user.department}</span>}
                <span>📅 Último acceso: {user.lastActive}</span>
              </div>
            </div>

            {/* Estadísticas (solo para inspectores) */}
            {user.role === 'inspector' && (
              <div style={{
                display: 'flex',
                gap: '24px',
                marginRight: '20px',
                fontSize: '13px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#10b981' }}>{user.inspectionsCompleted}</div>
                  <div style={{ color: '#9ca3af', fontSize: '11px' }}>Completadas</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#f59e0b' }}>{user.inspectionsAssigned}</div>
                  <div style={{ color: '#9ca3af', fontSize: '11px' }}>Asignadas</div>
                </div>
                {user.averageRating && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', color: '#3b82f6' }}>
                      ⭐ {user.averageRating}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '11px' }}>Rating</div>
                  </div>
                )}
              </div>
            )}

            {/* Botón de acciones */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveActionMenu(activeActionMenu === user.id ? null : user.id)
              }}
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px'
              }}
            >
              ⋮
            </button>

            {/* Menú de acciones */}
            {activeActionMenu === user.id && (
              <div 
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '100%',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  minWidth: '180px',
                  marginTop: '4px'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => viewUserDetails(user)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  👁️ Ver perfil
                </button>
                <button
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ✏️ Editar
                </button>
                <button
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🔑 Cambiar contraseña
                </button>
                <button
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {user.status === 'active' ? '🚫 Desactivar' : '✅ Activar'}
                </button>
                <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />
                <button
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Nuevo Usuario */}
      {showNewUserModal && (
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
        }}
        onClick={() => setShowNewUserModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#111827'
            }}>
              Nuevo Usuario
            </h2>

            <form>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="usuario@inspecten.com"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="+593 98 XXX XXXX"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Departamento
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Ej: Inspecciones"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Rol
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <option value="">Seleccionar rol</option>
                  <option value="admin">Administrador - Control total del sistema</option>
                  <option value="manager">Gerente - Gestión de operaciones</option>
                  <option value="supervisor">Supervisor - Supervisión de inspectores</option>
                  <option value="inspector">Inspector - Realizar inspecciones</option>
                </select>
              </div>

              {/* Permisos específicos */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Permisos específicos
                </label>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" /> Ver propiedades
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" /> Crear propiedades
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" /> Ver inspecciones
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" /> Crear inspecciones
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" /> Ver reportes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" /> Gestionar usuarios
                  </label>
                </div>
              </div>

              {/* Especialidades (solo para inspectores) */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Especialidades (para inspectores)
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" /> Residencial
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" /> Comercial
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" /> Industrial
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Contraseña temporal
                  </label>
                  <input
                    type="password"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Repetir contraseña"
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
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
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalles de Usuario */}
      {showUserDetails && selectedUser && (
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
        }}
        onClick={() => setShowUserDetails(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: getRoleColor(selectedUser.role) + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '600',
                  color: getRoleColor(selectedUser.role)
                }}>
                  {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    {selectedUser.name}
                  </h2>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: getRoleColor(selectedUser.role) + '20',
                      color: getRoleColor(selectedUser.role)
                    }}>
                      {getRoleText(selectedUser.role)}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: selectedUser.status === 'active' ? '#d1fae5' : '#fee2e2',
                      color: selectedUser.status === 'active' ? '#065f46' : '#991b1b'
                    }}>
                      {selectedUser.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowUserDetails(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            {/* Información de contacto */}
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Información de Contacto
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Email</p>
                  <p style={{ fontSize: '15px', color: '#374151' }}>✉️ {selectedUser.email}</p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Teléfono</p>
                    <p style={{ fontSize: '15px', color: '#374151' }}>📱 {selectedUser.phone}</p>
                  </div>
                )}
                {selectedUser.department && (
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Departamento</p>
                    <p style={{ fontSize: '15px', color: '#374151' }}>🏢 {selectedUser.department}</p>
                  </div>
                )}
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Miembro desde</p>
                  <p style={{ fontSize: '15px', color: '#374151' }}>📅 {selectedUser.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Estadísticas (para inspectores) */}
            {selectedUser.role === 'inspector' && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                  Estadísticas de Rendimiento
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px'
                }}>
                  <div style={{
                    backgroundColor: '#dbeafe',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                      {selectedUser.inspectionsCompleted}
                    </p>
                    <p style={{ fontSize: '14px', color: '#1e40af' }}>Inspecciones Completadas</p>
                  </div>
                  <div style={{
                    backgroundColor: '#fef3c7',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e' }}>
                      {selectedUser.inspectionsAssigned}
                    </p>
                    <p style={{ fontSize: '14px', color: '#92400e' }}>Inspecciones Asignadas</p>
                  </div>
                  <div style={{
                    backgroundColor: '#e0e7ff',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4338ca' }}>
                      ⭐ {selectedUser.averageRating}
                    </p>
                    <p style={{ fontSize: '14px', color: '#4338ca' }}>Calificación Promedio</p>
                  </div>
                </div>

                {/* Especialidades */}
                {selectedUser.specialties && selectedUser.specialties.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Especialidades:
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedUser.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '16px',
                            fontSize: '13px'
                          }}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actividad reciente */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Actividad Reciente
              </h3>
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '500' }}>Último acceso:</span> {selectedUser.lastActive}
                </div>
                {selectedUser.role === 'inspector' && (
                  <>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500' }}>Última inspección:</span> 20 de enero, 2024 - Casa Los Robles
                    </div>
                    <div>
                      <span style={{ fontWeight: '500' }}>Próxima inspección:</span> 25 de enero, 2024 - Edificio Central
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Editar Perfil
              </button>
              {selectedUser.role === 'inspector' && (
                <button
                  onClick={() => router.push(`/dashboard/users/${selectedUser.id}/inspections`)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Ver Historial de Inspecciones
                </button>
              )}
              <button
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}