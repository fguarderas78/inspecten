'use client'
import { useState, useEffect } from 'react'
import { Search, Plus, Filter, Building2, MapPin, User, Calendar, Archive, Upload, Camera, FolderOpen, X } from 'lucide-react'

export default function PropiedadesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState([])
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    owner: '',
    type: 'Residencial',
    image: null as File | null,
    imagePreview: ''
  })

  // Cargar propiedades desde la API
  useEffect(() => {
    fetchProperties()
  }, [showArchived])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const status = showArchived ? 'archived' : 'active'
      const response = await fetch(`/api/properties?status=${status}`)
      const data = await response.json()
      
      if (response.ok) {
        setProperties(data)
      }
    } catch (error) {
      console.error('Error al cargar propiedades:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = properties.filter((property: any) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.owner.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || property.type === filterType
    
    return matchesSearch && matchesType
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewProperty({ ...newProperty, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewProperty(prev => ({ ...prev, imagePreview: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateProperty = async () => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProperty.name,
          address: newProperty.address,
          owner: newProperty.owner,
          type: newProperty.type,
          imageUrl: newProperty.imagePreview || null
        })
      })

      if (response.ok) {
        // Recargar propiedades
        fetchProperties()
        setShowModal(false)
        // Reset form
        setNewProperty({
          name: '',
          address: '',
          owner: '',
          type: 'Residencial',
          image: null,
          imagePreview: ''
        })
      }
    } catch (error) {
      console.error('Error al crear propiedad:', error)
    }
  }

  const handleArchiveToggle = async (propertyId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'archived' : 'active'
      const response = await fetch('/api/properties', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: propertyId,
          status: newStatus
        })
      })

      if (response.ok) {
        fetchProperties()
      }
    } catch (error) {
      console.error('Error al actualizar propiedad:', error)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '600', 
          color: '#111827', 
          marginBottom: '8px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
          Propiedades
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Gestiona las propiedades registradas en el sistema
        </p>
      </div>

      {/* Filters and Actions */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ 
          flex: 1, 
          minWidth: '300px',
          position: 'relative' 
        }}>
          <Search style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, dirección o propietario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif"
            }}
          />
        </div>

        {/* Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <option value="all">Todos los tipos</option>
          <option value="Residencial">Residencial</option>
          <option value="Comercial">Comercial</option>
          <option value="Industrial">Industrial</option>
        </select>

        {/* Toggle Archived */}
        <button
          onClick={() => setShowArchived(!showArchived)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: showArchived ? '#fef2f2' : 'white',
            color: showArchived ? '#dc2626' : '#374151',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <Archive size={18} />
          {showArchived ? 'Ver Activas' : 'Ver Archivadas'}
        </button>

        {/* New Property Button */}
        <button
          onClick={() => setShowModal(true)}
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
            gap: '8px',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <Plus size={18} />
          Nueva Propiedad
        </button>
      </div>

      {/* Status Bar */}
      <div style={{ 
        padding: '12px 16px',
        backgroundColor: showArchived ? '#fef3c7' : '#dbeafe',
        borderRadius: '8px',
        marginBottom: '24px',
        fontSize: '14px',
        color: showArchived ? '#92400e' : '#1e40af'
      }}>
        {loading ? 
          'Cargando propiedades...' :
          showArchived ? 
            `Mostrando ${filteredProperties.length} propiedades archivadas` : 
            `Mostrando ${filteredProperties.length} propiedades activas`
        }
      </div>

      {/* Properties Grid - Smaller Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando propiedades...</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredProperties.map((property: any) => (
            <div key={property.id} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              opacity: property.status === 'archived' ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Image - Smaller */}
              <div style={{ 
                height: '140px', 
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={property.imageUrl || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'} 
                  alt={property.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
                {property.status === 'archived' && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Archive size={14} />
                    Archivada
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  color: '#111827'
                }}>
                  {property.name}
                </h3>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} />
                    <span>{property.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} />
                    <span>{property.owner}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>Creada: {new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Type Badge and Action */}
                <div style={{ 
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: 
                      property.type === 'Residencial' ? '#dbeafe' :
                      property.type === 'Comercial' ? '#fef3c7' : '#e0e7ff',
                    color: 
                      property.type === 'Residencial' ? '#1e40af' :
                      property.type === 'Comercial' ? '#92400e' : '#3730a3'
                  }}>
                    {property.type}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleArchiveToggle(property.id, property.status)
                    }}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      color: property.status === 'active' ? '#dc2626' : '#059669'
                    }}
                  >
                    {property.status === 'active' ? 'Archivar' : 'Activar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for New Property */}
      {showModal && (
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
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Nueva Propiedad</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateProperty(); }}>
              {/* Image Upload */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500' 
                }}>
                  Imagen de la Propiedad
                </label>
                <div style={{
                  border: '2px dashed #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb'
                }}>
                  {newProperty.imagePreview ? (
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={newProperty.imagePreview} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '8px' 
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setNewProperty({ ...newProperty, image: null, imagePreview: '' })}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          gap: '12px' 
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            gap: '16px',
                            marginBottom: '8px'
                          }}>
                            <div style={{
                              padding: '12px',
                              backgroundColor: '#fee2e2',
                              borderRadius: '8px',
                              color: '#dc2626'
                            }}>
                              <Upload size={24} />
                            </div>
                            <div style={{
                              padding: '12px',
                              backgroundColor: '#dbeafe',
                              borderRadius: '8px',
                              color: '#3b82f6'
                            }}>
                              <Camera size={24} />
                            </div>
                            <div style={{
                              padding: '12px',
                              backgroundColor: '#d1fae5',
                              borderRadius: '8px',
                              color: '#10b981'
                            }}>
                              <FolderOpen size={24} />
                            </div>
                          </div>
                          <p style={{ fontSize: '14px', color: '#6b7280' }}>
                            Click para subir imagen desde tu dispositivo
                          </p>
                          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                            Soporta: JPG, PNG, GIF (máx. 10MB)
                          </p>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Property Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500' 
                }}>
                  Nombre de la Propiedad
                </label>
                <input
                  type="text"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Address */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500' 
                }}>
                  Dirección
                </label>
                <input
                  type="text"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Owner */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500' 
                }}>
                  Propietario
                </label>
                <input
                  type="text"
                  value={newProperty.owner}
                  onChange={(e) => setNewProperty({ ...newProperty, owner: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Type */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500' 
                }}>
                  Tipo de Propiedad
                </label>
                <select
                  value={newProperty.type}
                  onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
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
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Crear Propiedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}