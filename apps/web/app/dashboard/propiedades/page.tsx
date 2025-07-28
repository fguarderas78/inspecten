'use client'

import { useState, useEffect } from 'react'

interface Propiedad {
  id: string
  nombre: string
  direccion: string
  tipo: 'Residencial' | 'Comercial' | 'Industrial'
  propietario: string
  telefono: string
  email: string
  superficie: string
  habitaciones?: number
  banos?: number
  estacionamientos?: number
  fechaRegistro: string
  estado: 'Activa' | 'Inactiva'
  ultimaInspeccion?: string
  proximaInspeccion?: string
  notas?: string
  imagen?: string
}

interface NuevaInspeccion {
  propiedadId: string
  propiedadNombre: string
  fecha: string
  hora: string
  inspector: string
  notas?: string
}

export default function PropiedadesPage() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showInspeccionModal, setShowInspeccionModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('all')
  const [previewImage, setPreviewImage] = useState<string>('')
  
  const [formData, setFormData] = useState<Partial<Propiedad>>({
    tipo: 'Residencial',
    estado: 'Activa'
  })

  const [inspeccionData, setInspeccionData] = useState<NuevaInspeccion>({
    propiedadId: '',
    propiedadNombre: '',
    fecha: '',
    hora: '',
    inspector: ''
  })

  // Lista de inspectores (después vendrá de la base de datos)
  const inspectores = [
    { id: '1', nombre: 'Juan Pérez' },
    { id: '2', nombre: 'María García' },
    { id: '3', nombre: 'Carlos López' },
    { id: '4', nombre: 'Ana Martínez' }
  ]

  useEffect(() => {
    cargarPropiedades()
  }, [])

  // Cargar propiedades desde localStorage y Google Drive
  const cargarPropiedades = async () => {
    // Primero cargar de localStorage
    const savedProps = localStorage.getItem('inspecten_propiedades')
    if (savedProps) {
      setPropiedades(JSON.parse(savedProps))
    }

    // Intentar cargar de Google Drive
    try {
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbzdWQUY4-aNy41_Pex_56gFOroxKnU44nsaBW3Ljp-q68L9zoyzTdrRXB2qAkGANWPg/exec'
      
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getProperties'
        })
      })
      
      const result = await response.json()
      if (result.success && result.properties && result.properties.length > 0) {
        setPropiedades(result.properties)
        // Actualizar localStorage con datos de Drive
        localStorage.setItem('inspecten_propiedades', JSON.stringify(result.properties))
      }
    } catch (error) {
      console.error('Error al cargar de Google Drive:', error)
    }
  }

  // Manejar carga de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB máximo
        alert('La imagen no debe superar los 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreviewImage(base64String)
        setFormData({...formData, imagen: base64String})
      }
      reader.readAsDataURL(file)
    }
  }

  // Guardar propiedad
  const handleSavePropiedad = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const nuevaPropiedad: Propiedad = {
        id: Date.now().toString(),
        nombre: formData.nombre || '',
        direccion: formData.direccion || '',
        tipo: formData.tipo || 'Residencial',
        propietario: formData.propietario || '',
        telefono: formData.telefono || '',
        email: formData.email || '',
        superficie: formData.superficie || '',
        habitaciones: formData.habitaciones,
        banos: formData.banos,
        estacionamientos: formData.estacionamientos,
        fechaRegistro: new Date().toISOString().split('T')[0],
        estado: formData.estado || 'Activa',
        notas: formData.notas,
        imagen: formData.imagen
      }

      // Guardar en localStorage
      const updatedProps = [...propiedades, nuevaPropiedad]
      setPropiedades(updatedProps)
      localStorage.setItem('inspecten_propiedades', JSON.stringify(updatedProps))

      // Guardar en Google Drive
      try {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbzdWQUY4-aNy41_Pex_56gFOroxKnU44nsaBW3Ljp-q68L9zoyzTdrRXB2qAkGANWPg/exec'
        
        const response = await fetch(scriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'addProperty',
            data: nuevaPropiedad
          })
        })
        
        const result = await response.json()
        if (result.success) {
          console.log('✅ Guardado en Google Drive exitosamente')
          alert('Propiedad guardada exitosamente en Google Drive!')
        } else {
          console.error('Error:', result.message)
          alert('Propiedad guardada localmente. Error en Drive: ' + result.message)
        }
      } catch (error) {
        console.error('Error al guardar en Google Drive:', error)
        alert('Propiedad guardada localmente. No se pudo conectar con Drive.')
      }

      setShowModal(false)
      setFormData({ tipo: 'Residencial', estado: 'Activa' })
      setPreviewImage('')
    } catch (error) {
      alert('Error al guardar la propiedad')
    } finally {
      setLoading(false)
    }
  }

  // Abrir modal de nueva inspección
  const handleNuevaInspeccion = (propiedad: Propiedad) => {
    // Fecha mínima: mañana
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0]
    
    setInspeccionData({
      propiedadId: propiedad.id,
      propiedadNombre: propiedad.nombre,
      fecha: minDate,
      hora: '09:00',
      inspector: ''
    })
    setShowInspeccionModal(true)
  }

  // Guardar inspección
  const handleSaveInspeccion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Aquí guardarías la inspección en la base de datos
      const inspecciones = JSON.parse(localStorage.getItem('inspecten_inspecciones') || '[]')
      const nuevaInspeccion = {
        ...inspeccionData,
        id: Date.now().toString(),
        estado: 'Programada',
        fechaCreacion: new Date().toISOString()
      }
      
      inspecciones.push(nuevaInspeccion)
      localStorage.setItem('inspecten_inspecciones', JSON.stringify(inspecciones))
      
      alert(`Inspección programada para el ${inspeccionData.fecha} a las ${inspeccionData.hora} con ${inspectores.find(i => i.id === inspeccionData.inspector)?.nombre}`)
      setShowInspeccionModal(false)
    } catch (error) {
      alert('Error al programar la inspección')
    }
  }

  // Manejar ver detalles
  const handleVerDetalles = (propiedad: Propiedad) => {
    alert(`Detalles de ${propiedad.nombre}:\n\nDirección: ${propiedad.direccion}\nPropietario: ${propiedad.propietario}\nTeléfono: ${propiedad.telefono}\nEmail: ${propiedad.email || 'No registrado'}\nSuperficie: ${propiedad.superficie || 'No especificada'}\n\nNotas: ${propiedad.notas || 'Sin notas'}`)
    // Aquí podrías abrir un modal más elaborado o navegar a una página de detalles
  }

  // Filtrar propiedades
  const propiedadesFiltradas = propiedades.filter(prop => {
    const matchSearch = prop.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       prop.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       prop.propietario.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTipo = filterTipo === 'all' || prop.tipo === filterTipo
    return matchSearch && matchTipo
  })

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Propiedades
        </h1>
        <p style={{ color: '#6b7280' }}>Gestiona todas las propiedades registradas</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, dirección o propietario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="all">Todos los tipos</option>
          <option value="Residencial">Residencial</option>
          <option value="Comercial">Comercial</option>
          <option value="Industrial">Industrial</option>
        </select>

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
            cursor: 'pointer'
          }}
        >
          + Nueva Propiedad
        </button>
      </div>

      {propiedadesFiltradas.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🏠</span>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            No hay propiedades registradas
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Comienza agregando tu primera propiedad
          </p>
          <button
            onClick={() => setShowModal(true)}
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
            + Agregar Primera Propiedad
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {propiedadesFiltradas.map((propiedad) => (
            <div
              key={propiedad.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ 
                height: '150px', 
                backgroundColor: '#e5e7eb', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {propiedad.imagen ? (
                  <img 
                    src={propiedad.imagen} 
                    alt={propiedad.nombre}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '36px', color: '#9ca3af' }}>🏠</span>
                )}
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '2px 6px',
                  backgroundColor: propiedad.estado === 'Activa' ? '#10b981' : '#6b7280',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '11px'
                }}>
                  {propiedad.estado}
                </span>
              </div>

              <div style={{ padding: '12px' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '6px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {propiedad.nombre}
                </h3>
                
                <p style={{ 
                  fontSize: '13px', 
                  color: '#6b7280', 
                  marginBottom: '8px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  📍 {propiedad.direccion}
                </p>

                <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                  <div style={{ marginBottom: '2px' }}><strong>Tipo:</strong> {propiedad.tipo}</div>
                  <div style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    <strong>Propietario:</strong> {propiedad.propietario}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleNuevaInspeccion(propiedad)}
                    style={{
                      flex: 1,
                      padding: '5px 10px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Nueva Inspección
                  </button>
                  <button
                    onClick={() => handleVerDetalles(propiedad)}
                    style={{
                      flex: 1,
                      padding: '5px 10px',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Nueva Propiedad */}
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
          zIndex: 50,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Nueva Propiedad
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setPreviewImage('')
                  setFormData({ tipo: 'Residencial', estado: 'Activa' })
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSavePropiedad} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                {/* Sección de Imagen */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    Fotografía de la Propiedad
                  </label>
                  <div style={{ 
                    border: '2px dashed #d1d5db', 
                    borderRadius: '8px', 
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    position: 'relative'
                  }}>
                    {previewImage ? (
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '200px', 
                            borderRadius: '4px',
                            marginBottom: '10px'
                          }} 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage('')
                            setFormData({...formData, imagen: ''})
                          }}
                          style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 5
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <label 
                          htmlFor="property-image-upload"
                          style={{
                            cursor: 'pointer',
                            display: 'block',
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <span style={{ fontSize: '48px', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>
                            📷
                          </span>
                          <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                            Click para subir imagen o arrastra aquí
                          </p>
                          <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                            PNG, JPG hasta 5MB
                          </p>
                        </label>
                        <input
                          id="property-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{
                            display: 'none'
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Información Básica */}
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    Información Básica
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                        Nombre de la Propiedad *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nombre || ''}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                        Dirección *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.direccion || ''}
                        onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                          Tipo de Propiedad *
                        </label>
                        <select
                          required
                          value={formData.tipo || 'Residencial'}
                          onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
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

                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                          Superficie
                        </label>
                        <input
                          type="text"
                          placeholder="ej: 150 m²"
                          value={formData.superficie || ''}
                          onChange={(e) => setFormData({...formData, superficie: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del Propietario */}
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    Información del Propietario
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                        Nombre del Propietario *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.propietario || ''}
                        onChange={(e) => setFormData({...formData, propietario: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.telefono || ''}
                          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Características (solo para residencial) */}
                {formData.tipo === 'Residencial' && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                      Características
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                          Habitaciones
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.habitaciones || ''}
                          onChange={(e) => setFormData({...formData, habitaciones: parseInt(e.target.value)})}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                          Baños
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.banos || ''}
                          onChange={(e) => setFormData({...formData, banos: parseInt(e.target.value)})}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                          Estacionamientos
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.estacionamientos || ''}
                          onChange={(e) => setFormData({...formData, estacionamientos: parseInt(e.target.value)})}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notas */}
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Notas adicionales
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notas || ''}
                    onChange={(e) => setFormData({...formData, notas: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Botones */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setPreviewImage('')
                    setFormData({ tipo: 'Residencial', estado: 'Activa' })
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: loading ? '#9ca3af' : '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Guardando...' : 'Guardar Propiedad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Nueva Inspección */}
      {showInspeccionModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '20px'
          }}
          onClick={(e) => {
            // Cerrar si se hace click en el fondo oscuro
            if (e.target === e.currentTarget) {
              setShowInspeccionModal(false)
            }
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '500px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer click dentro
          >
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Programar Nueva Inspección
              </h2>
              <button
                onClick={() => setShowInspeccionModal(false)}
                type="button"
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveInspeccion} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  Propiedad: {inspeccionData.propiedadNombre}
                </h3>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Fecha de Inspección *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={inspeccionData.fecha}
                    onChange={(e) => setInspeccionData({...inspeccionData, fecha: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Hora *
                  </label>
                  <input
                    type="time"
                    required
                    value={inspeccionData.hora}
                    onChange={(e) => setInspeccionData({...inspeccionData, hora: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Inspector Asignado *
                  </label>
                  <select
                    required
                    value={inspeccionData.inspector}
                    onChange={(e) => setInspeccionData({...inspeccionData, inspector: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Seleccionar inspector...</option>
                    {inspectores.map(inspector => (
                      <option key={inspector.id} value={inspector.id}>
                        {inspector.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Notas para el inspector
                  </label>
                  <textarea
                    rows={3}
                    value={inspeccionData.notas || ''}
                    onChange={(e) => setInspeccionData({...inspeccionData, notas: e.target.value})}
                    placeholder="Información adicional, puntos de atención especial, etc."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Vista previa del calendario */}
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  <p style={{ marginBottom: '4px' }}>
                    <strong>📅 Fecha:</strong> {inspeccionData.fecha ? new Date(inspeccionData.fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ''}
                  </p>
                  <p>
                    <strong>🕐 Hora:</strong> {inspeccionData.hora}
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={() => setShowInspeccionModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
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
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Programar Inspección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}