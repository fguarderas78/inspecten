'use client'

import { useState } from 'react'

export default function PropiedadesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showModal, setShowModal] = useState(false)

  const propiedades = [
    {
      id: 1,
      name: 'Casa Cumbayá',
      type: 'Residencial',
      address: 'Cumbayá, Quito',
      owner: 'María García',
      area: '250 m²',
      status: 'Activo',
      lastInspection: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'
    },
    {
      id: 2,
      name: 'Oficina Centro',
      type: 'Comercial',
      address: 'Av. Amazonas y Naciones Unidas',
      owner: 'Juan Pérez',
      area: '180 m²',
      status: 'Activo',
      lastInspection: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
    },
    {
      id: 3,
      name: 'Bodega Norte',
      type: 'Industrial',
      address: 'Parque Industrial Norte',
      owner: 'Industrias ABC',
      area: '500 m²',
      status: 'Activo',
      lastInspection: '2023-12-20',
      image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400'
    },
    {
      id: 4,
      name: 'Local Comercial Sur',
      type: 'Comercial',
      address: 'CC El Recreo',
      owner: 'Ana López',
      area: '120 m²',
      status: 'Inactivo',
      lastInspection: '2023-11-30',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
    }
  ]

  const filteredPropiedades = propiedades.filter(prop => {
    const matchesSearch = 
      prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.owner.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || prop.type === filterType
    
    return matchesSearch && matchesType
  })

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Propiedades
        </h1>
        <p style={{ color: '#6b7280' }}>
          Gestiona todas las propiedades registradas en el sistema
        </p>
      </div>

      {/* Barra de herramientas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, dirección o propietario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              width: '300px',
              fontSize: '14px'
            }}
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Todos los tipos</option>
            <option value="Residencial">Residencial</option>
            <option value="Comercial">Comercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          + Nueva Propiedad
        </button>
      </div>

      {/* Grid de propiedades */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {filteredPropiedades.map((prop) => (
          <div
            key={prop.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{
              height: '200px',
              backgroundImage: `url(${prop.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: prop.status === 'Activo' ? '#10b981' : '#6b7280',
                color: 'white'
              }}>
                {prop.status}
              </span>
            </div>
            
            <div style={{ padding: '16px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                {prop.name}
              </h3>
              
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '12px'
              }}>
                {prop.address}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#374151',
                marginBottom: '12px'
              }}>
                <span>
                  <strong>Tipo:</strong> {prop.type}
                </span>
                <span>
                  <strong>Área:</strong> {prop.area}
                </span>
              </div>
              
              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid #e5e7eb',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <p style={{ marginBottom: '4px' }}>
                  <strong>Propietario:</strong> {prop.owner}
                </p>
                <p>
                  <strong>Última inspección:</strong> {new Date(prop.lastInspection).toLocaleDateString()}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '16px'
              }}>
                <button
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Nueva inspección
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva Propiedad */}
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
            borderRadius: '8px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#111827'
            }}>
              Nueva Propiedad
            </h2>
            
            <form>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Nombre de la propiedad
                </label>
                <input
                  type="text"
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
                  Tipo
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option>Residencial</option>
                  <option>Comercial</option>
                  <option>Industrial</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Dirección
                </label>
                <input
                  type="text"
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
                  Propietario
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Área (m²)
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Guardar propiedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}