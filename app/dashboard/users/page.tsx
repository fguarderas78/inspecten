// app/dashboard/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { GoogleDriveClient } from '../../../lib/google-drive-client'

interface User {
  id: number
  name: string
  email: string
  role: string
  phone: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export default function UsersPage() {
  const searchParams = useSearchParams()
  const googleDrive = GoogleDriveClient.getInstance()
  
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Francisco Guarderas', email: 'francisco@inspecten.com', role: 'Owner', phone: '+593 999 123456', active: true },
    { id: 2, name: 'María González', email: 'maria@inspecten.com', role: 'Manager', phone: '+593 998 234567', active: true },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos@inspecten.com', role: 'Supervisor', phone: '+593 997 345678', active: true },
    { id: 4, name: 'Ana Martínez', email: 'ana@inspecten.com', role: 'Inspector', phone: '+593 996 456789', active: true },
    { id: 5, name: 'Luis Pérez', email: 'luis@inspecten.com', role: 'Inspector', phone: '+593 995 567890', active: false },
    { id: 6, name: 'Sofía Torres', email: 'sofia@inspecten.com', role: 'Inspector', phone: '+593 994 678901', active: true }
  ])

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isGoogleDriveConnected, setIsGoogleDriveConnected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [modals, setModals] = useState({
    details: false,
    info: false,
    edit: false
  })
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Inspector',
    phone: ''
  })

  // Verificar autenticación al cargar
  useEffect(() => {
    checkGoogleDriveAuth()
    
    // Verificar si venimos del callback de autenticación
    const authStatus = searchParams.get('auth')
    if (authStatus === 'success') {
      setIsGoogleDriveConnected(true)
      // Limpiar URL
      window.history.replaceState({}, '', '/dashboard/users')
    }
  }, [searchParams])

  const checkGoogleDriveAuth = async () => {
    const isAuthenticated = await googleDrive.checkAuth()
    setIsGoogleDriveConnected(isAuthenticated)
  }

  const connectGoogleDrive = async () => {
    await googleDrive.authenticate()
  }

  const saveUserToGoogleDrive = async (user: User, action: 'CREATE' | 'UPDATE' | 'DELETE') => {
    if (!isGoogleDriveConnected) return

    setIsSaving(true)
    try {
      await googleDrive.backupUser(user, action)
      console.log(`Usuario respaldado: ${action} - ${user.name}`)
    } catch (error) {
      console.error('Error al respaldar:', error)
      alert('Error al respaldar en Google Drive')
    } finally {
      setIsSaving(false)
    }
  }

  const createDailyBackup = async () => {
    if (!isGoogleDriveConnected) {
      alert('Primero debes conectar Google Drive')
      return
    }

    setIsSaving(true)
    try {
      await googleDrive.createDailyBackup(users)
      alert('Respaldo diario creado exitosamente')
    } catch (error) {
      console.error('Error creando respaldo:', error)
      alert('Error al crear respaldo diario')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: true }))
  }

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }))
  }

  const handleDetailsClick = (userId: number) => {
    setSelectedUserId(userId)
    openModal('details')
  }

  const showUserInfo = () => {
    closeModal('details')
    openModal('info')
  }

  const editUser = () => {
    const user = users.find(u => u.id === selectedUserId)
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      })
      closeModal('details')
      openModal('edit')
    }
  }

  const openNewUserModal = () => {
    setSelectedUserId(null)
    setFormData({
      name: '',
      email: '',
      role: 'Inspector',
      phone: ''
    })
    openModal('edit')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const userData: User = {
      id: selectedUserId || Math.max(...users.map(u => u.id)) + 1,
      ...formData,
      active: true,
      createdAt: selectedUserId ? users.find(u => u.id === selectedUserId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (selectedUserId) {
      // Editar usuario existente
      setUsers(prev => prev.map(u => u.id === selectedUserId ? userData : u))
      await saveUserToGoogleDrive(userData, 'UPDATE')
    } else {
      // Crear nuevo usuario
      setUsers(prev => [...prev, userData])
      await saveUserToGoogleDrive(userData, 'CREATE')
    }

    closeModal('edit')
    alert(selectedUserId ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente')
  }

  const confirmDelete = async () => {
    const user = users.find(u => u.id === selectedUserId)
    if (user && confirm(`¿Está seguro de eliminar al usuario ${user.name}?`)) {
      // Guardar en Google Drive antes de eliminar
      await saveUserToGoogleDrive(user, 'DELETE')
      
      // Eliminar de la lista
      setUsers(prev => prev.filter(u => u.id !== selectedUserId))
      closeModal('details')
      alert('Usuario eliminado correctamente')
    }
  }

  const selectedUser = users.find(u => u.id === selectedUserId)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', color: '#111827', margin: 0 }}>Usuarios</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isGoogleDriveConnected ? (
            <button
              onClick={connectGoogleDrive}
              style={{
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🔗</span> Conectar Google Drive
            </button>
          ) : (
            <>
              <button
                onClick={createDailyBackup}
                disabled={isSaving}
                style={{
                  backgroundColor: isSaving ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {isSaving ? 'Guardando...' : '💾 Crear Respaldo'}
              </button>
            </>
          )}
          <button
            onClick={openNewUserModal}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            + Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Status de Google Drive */}
      {isGoogleDriveConnected && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d1fae5',
          color: '#065f46',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✓</span> Google Drive conectado - Los cambios se respaldan automáticamente
        </div>
      )}

      {/* Users List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {filteredUsers.map((user, index) => (
          <div
            key={user.id}
            style={{
              padding: '12px 20px',
              borderBottom: index < filteredUsers.length - 1 ? '1px solid #e5e7eb' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontWeight: '500', color: '#111827', fontSize: '14px' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.role}</div>
            </div>
            <button
              onClick={() => handleDetailsClick(user.id)}
              style={{
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Detalles
            </button>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {modals.details && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal('details')
          }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '18px', color: '#111827', margin: 0 }}>Opciones de Usuario</h2>
              <button
                onClick={() => closeModal('details')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={showUserInfo}
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#3b82f6'
                  }}
                >
                  <span>ℹ️</span> Ver Información
                </button>
                <button
                  onClick={editUser}
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#f59e0b'
                  }}
                >
                  <span>✏️</span> Editar Usuario
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#ef4444'
                  }}
                >
                  <span>🗑️</span> Eliminar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {modals.info && selectedUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal('info')
          }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '18px', color: '#111827', margin: 0 }}>Información del Usuario</h2>
              <button
                onClick={() => closeModal('info')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Nombre Completo</div>
                <div style={{ fontSize: '14px', color: '#111827' }}>{selectedUser.name}</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Email</div>
                <div style={{ fontSize: '14px', color: '#111827' }}>{selectedUser.email}</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Rol</div>
                <div style={{ fontSize: '14px', color: '#111827' }}>{selectedUser.role}</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Teléfono</div>
                <div style={{ fontSize: '14px', color: '#111827' }}>{selectedUser.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Estado</div>
                <div style={{ fontSize: '14px', color: '#111827' }}>{selectedUser.active ? 'Activo' : 'Inactivo'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modals.edit && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal('edit')
          }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '18px', color: '#111827', margin: 0 }}>
                {selectedUserId ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button
                onClick={() => closeModal('edit')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Rol
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Inspector">Inspector</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Manager">Manager</option>
                    <option value="Owner">Owner</option>
                  </select>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => closeModal('edit')}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: isSaving ? '#9ca3af' : '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}