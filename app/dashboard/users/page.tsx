'use client'

import { useState } from 'react'

export default function UsersPage() {
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  // Datos de ejemplo con los roles específicos
  const users = [
    {
      id: 1,
      name: 'Francisco Guarderas',
      email: 'fguarderas@inspecten.com',
      role: 'Owner',
      phone: '+593 999-111-222',
      status: 'Activo',
      lastLogin: '2024-07-21 10:30 AM',
      inspections: 145,
      avatar: 'FG',
      permissions: 'Acceso completo al sistema'
    },
    {
      id: 2,
      name: 'Carlos Mendez',
      email: 'carlos.mendez@inspecten.com',
      role: 'Inspector',
      phone: '+593 999-123-456',
      status: 'Activo',
      lastLogin: '2024-07-21 08:15 AM',
      inspections: 89,
      avatar: 'CM',
      permissions: 'Solo inspecciones asignadas'
    },
    {
      id: 3,
      name: 'Ana Torres',
      email: 'ana.torres@inspecten.com',
      role: 'Supervisor',
      phone: '+593 999-234-567',
      status: 'Activo',
      lastLogin: '2024-07-20 06:45 PM',
      inspections: 124,
      avatar: 'AT',
      permissions: 'Inspecciones de su equipo'
    },
    {
      id: 4,
      name: 'Juan Martinez',
      email: 'juan.martinez@inspecten.com',
      role: 'Inspector',
      phone: '+593 999-345-678',
      status: 'Activo',
      lastLogin: '2024-07-21 09:00 AM',
      inspections: 67,
      avatar: 'JM',
      permissions: 'Solo inspecciones asignadas'
    },
    {
      id: 5,
      name: 'María López',
      email: 'maria.lopez@inspecten.com',
      role: 'Manager',
      phone: '+593 999-456-789',
      status: 'Activo',
      lastLogin: '2024-07-21 07:30 AM',
      inspections: 0,
      avatar: 'ML',
      permissions: 'Todas las inspecciones y usuarios'
    },
    {
      id: 6,
      name: 'Pedro Silva',
      email: 'pedro.silva@inspecten.com',
      role: 'Inspector',
      phone: '+593 999-567-890',
      status: 'Inactivo',
      lastLogin: '2024-07-15 03:20 PM',
      inspections: 45,
      avatar: 'PS',
      permissions: 'Solo inspecciones asignadas'
    }
  ]

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleColor = (role) => {
    switch(role) {
      case 'Owner':
        return { bg: '#fee2e2', color: '#dc2626', icon: '👑' }
      case 'Manager':
        return { bg: '#fde68a', color: '#d97706', icon: '🏢' }
      case 'Supervisor':
        return { bg: '#dbeafe', color: '#2563eb', icon: '👥' }
      case 'Inspector':
        return { bg: '#d1fae5', color: '#065f46', icon: '🔍' }
      default:
        return { bg: '#f3f4f6', color: '#374151', icon: '👤' }
    }
  }

  const getRoleDescription = (role) => {
    switch(role) {
      case 'Owner':
        return 'Acceso total al sistema, incluye configuraciones'
      case 'Manager':
        return 'Acceso a todas las inspecciones y gestión de usuarios'
      case 'Supervisor':
        return 'Acceso a inspecciones de su equipo'
      case 'Inspector':
        return 'Acceso solo a inspecciones asignadas'
      default:
        return ''
    }
  }

  const getAvatarColor = (name) => {
    const colors = ['#dc2626', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6']
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  // Contar usuarios por rol
  const roleCount = {
    owner: users.filter(u => u.role === 'Owner').length,
    manager: users.filter(u => u.role === 'Manager').length,
    supervisor: users.filter(u => u.role === 'Supervisor').length,
    inspector: users.filter(u => u.role === 'Inspector').length
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>Usuarios</h1>
        <button 
          onClick={() => setShowNewUserModal(true)}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>+</span> Nuevo Usuario
        </button>
      </div>

      {/* Role Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderTop: '4px solid #dc2626'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Owner</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{roleCount.owner}</p>
            </div>
            <span style={{ fontSize: '32px' }}>👑</span>
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderTop: '4px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Manager</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{roleCount.manager}</p>
            </div>
            <span style={{ fontSize: '32px' }}>🏢</span>
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderTop: '4px solid #3b82f6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Supervisor</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{roleCount.supervisor}</p>
            </div>
            <span style={{ fontSize: '32px' }}>👥</span>
          </div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderTop: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Inspector</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{roleCount.inspector}</p>
            </div>
            <span style={{ fontSize: '32px' }}>🔍</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 200px',
          gap: '15px'
        }}>
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="all">Todos los Roles</option>
            <option value="Owner">Owner</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Inspector">Inspector</option>
          </select>
        </div>
      </div>

      {/* Role Descriptions */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
          Permisos por Rol
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span>👑</span>
            <div>
              <strong>Owner:</strong>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                Acceso completo al sistema incluidas todas las configuraciones
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span>🏢</span>
            <div>
              <strong>Manager:</strong>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                Acceso a todas las inspecciones y puede gestionar usuarios
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span>👥</span>
            <div>
              <strong>Supervisor:</strong>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                Acceso a inspecciones de los inspectores a su cargo
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span>🔍</span>
            <div>
              <strong>Inspector:</strong>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                Acceso solo a las inspecciones que le sean asignadas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{ 
                padding: '12px 20px', 
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Usuario
              </th>
              <th style={{ 
                padding: '12px 20px', 
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Rol
              </th>
              <th style={{ 
                padding: '12px 20px', 
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Contacto
              </th>
              <th style={{ 
                padding: '12px 20px', 
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Actividad
              </th>
              <th style={{ 
                padding: '12px 20px', 
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Estado
              </th>
              <th style={{ 
                padding: '12px 20px', 
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const roleStyle = getRoleColor(user.role)
              
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: getAvatarColor(user.name),
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {user.avatar}
                      </div>
                      <div>
                        <p style={{ fontWeight: '500', color: '#111827' }}>{user.name}</p>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{roleStyle.icon}</span>
                      <span style={{
                        fontSize: '13px',
                        backgroundColor: roleStyle.bg,
                        color: roleStyle.color,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontWeight: '500'
                      }}>
                        {user.role}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {user.permissions}
                    </p>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <p style={{ fontSize: '14px', color: '#374151' }}>{user.phone}</p>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <p style={{ fontSize: '13px', color: '#374151' }}>
                      Último acceso: {user.lastLogin}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>
                      {user.inspections} inspecciones
                    </p>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: user.status === 'Activo' ? '#d1fae5' : '#e5e7eb',
                      color: user.status === 'Activo' ? '#065f46' : '#6b7280'
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: user.status === 'Activo' ? '#10b981' : '#6b7280'
                      }}></span>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => {
                          setSelectedUser(user)
                          setShowEditModal(true)
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        Editar
                      </button>
                      {user.status === 'Activo' ? (
                        <button style={{
                          padding: '6px 12px',
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          color: '#dc2626'
                        }}>
                          Desactivar
                        </button>
                      ) : (
                        <button style={{
                          padding: '6px 12px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}>
                          Activar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '60px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          No se encontraron usuarios
        </div>
      )}

      {/* New User Modal */}
      {showNewUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Nuevo Usuario
            </h2>
            <button
              onClick={() => setShowNewUserModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#6b7280'
              }}
            >
              ×
            </button>
            {/* Aquí iría el formulario */}
            <p style={{ color: '#6b7280' }}>Formulario de nuevo usuario...</p>
          </div>
        </div>
      )}
    </div>
  )
}