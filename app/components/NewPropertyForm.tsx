'use client'

import { useState, useEffect } from 'react'
import { theme } from '@/lib/theme'

interface NewPropertyFormProps {
  onClose: () => void
  onSave: (property: any) => void
}

interface PropertyData {
  // Información básica
  id?: string
  name: string
  type: string
  status: string
  
  // Dirección y ubicación
  address: {
    street: string
    number: string
    unit?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  
  // Información financiera
  pricing: {
    purchasePrice?: number
    currentValue?: number
    monthlyRent?: number
    propertyTax?: number
    maintenanceCost?: number
    currency: string
  }
  
  // Detalles de la propiedad
  details: {
    area: number
    areaUnit: string
    bedrooms?: number
    bathrooms?: number
    parkingSpaces?: number
    yearBuilt?: number
    floors?: number
    amenities: string[]
  }
  
  // Cliente/Propietario
  owner: {
    name: string
    email: string
    phone: string
    company?: string
    idNumber: string
    address?: string
    notes?: string
  }
  
  // Información de inspección
  inspection: {
    assignedInspector?: string
    inspectorName?: string
    defaultChecklist?: string
    lastInspectionDate?: string
    nextInspectionDate?: string
    frequency?: string
    accessInstructions?: string
  }
  
  // Documentos
  documents: {
    propertyTitle?: string
    insurancePolicy?: string
    taxDocuments?: string[]
    photos?: string[]
  }
  
  // Metadata
  createdAt?: string
  updatedAt?: string
  createdBy?: string
}

export default function NewPropertyForm({ onClose, onSave }: NewPropertyFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  // Estado del formulario
  const [formData, setFormData] = useState<PropertyData>({
    name: '',
    type: 'residential',
    status: 'active',
    address: {
      street: '',
      number: '',
      unit: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Ecuador'
    },
    coordinates: {
      lat: -2.1894,
      lng: -79.8891
    },
    pricing: {
      currency: 'USD'
    },
    details: {
      area: 0,
      areaUnit: 'm2',
      amenities: []
    },
    owner: {
      name: '',
      email: '',
      phone: '',
      idNumber: ''
    },
    inspection: {
      frequency: 'monthly'
    },
    documents: {}
  })

  // Datos de ejemplo
  const propertyTypes = [
    { value: 'residential', label: 'Residencial' },
    { value: 'commercial', label: 'Comercial' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'land', label: 'Terreno' },
    { value: 'office', label: 'Oficina' }
  ]

  const inspectors = [
    { id: '1', name: 'Carlos Mendez', email: 'carlos@inspecten.com', specialties: ['residential', 'commercial'] },
    { id: '2', name: 'Ana García', email: 'ana@inspecten.com', specialties: ['commercial', 'office'] },
    { id: '3', name: 'Roberto Silva', email: 'roberto@inspecten.com', specialties: ['industrial', 'land'] },
    { id: '4', name: 'María López', email: 'maria@inspecten.com', specialties: ['residential'] }
  ]

  const checklists = [
    { id: 'cl1', name: 'Checklist Residencial Básico', type: 'residential', items: 45 },
    { id: 'cl2', name: 'Checklist Comercial Completo', type: 'commercial', items: 78 },
    { id: 'cl3', name: 'Checklist Industrial', type: 'industrial', items: 92 },
    { id: 'cl4', name: 'Checklist Oficinas', type: 'office', items: 56 },
    { id: 'cl5', name: 'Checklist Terrenos', type: 'land', items: 23 }
  ]

  const amenitiesList = [
    'Piscina', 'Gimnasio', 'Seguridad 24/7', 'Estacionamiento', 
    'Áreas verdes', 'Sala de reuniones', 'Ascensor', 'Generador',
    'Sistema contra incendios', 'Aire acondicionado central'
  ]

  // Manejar cambios en el formulario
  const handleChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  // Cargar Google Maps
  useEffect(() => {
    if (showMap && !mapLoaded) {
      // Aquí cargarías Google Maps API
      console.log('Cargando Google Maps...')
      setMapLoaded(true)
    }
  }, [showMap, mapLoaded])

  // Buscar dirección en Google Maps
  const searchAddress = async () => {
    const fullAddress = `${formData.address.street} ${formData.address.number}, ${formData.address.city}, ${formData.address.country}`
    console.log('Buscando dirección:', fullAddress)
    
    // Simulación - En producción usarías Google Geocoding API
    setFormData(prev => ({
      ...prev,
      coordinates: {
        lat: -2.1894 + (Math.random() - 0.5) * 0.1,
        lng: -79.8891 + (Math.random() - 0.5) * 0.1
      }
    }))
  }

  // Guardar en Google Drive
  const saveToGoogleDrive = async (propertyData: PropertyData) => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' })
    
    // Estructura de carpetas en Google Drive
    const folderStructure = {
      root: 'INSPECTEN',
      property: `Propiedades/${propertyData.name}`,
      subfolders: [
        `Documentos`,
        `Inspecciones/${currentYear}`,
        `Fotos`,
        `Contratos`,
        `Reportes`
      ]
    }

    console.log('Creando estructura de carpetas:', folderStructure)
    
    // Guardar información de la propiedad
    const propertyFile = {
      name: `Propiedad_${propertyData.name}_Info.json`,
      path: `${folderStructure.root}/${folderStructure.property}/Documentos/`,
      content: propertyData
    }

    return {
      folderStructure,
      propertyFile,
      driveUrl: `https://drive.google.com/drive/folders/xxxxx` // URL simulada
    }
  }

  // Sincronizar con otros módulos
  const syncWithModules = async (propertyData: PropertyData) => {
    console.log('Sincronizando con otros módulos...')
    
    // Actualizar en diferentes módulos
    const updates = {
      schedules: {
        // Agregar inspección programada si hay inspector asignado
        inspection: propertyData.inspection.assignedInspector ? {
          propertyId: propertyData.id,
          inspectorId: propertyData.inspection.assignedInspector,
          frequency: propertyData.inspection.frequency,
          nextDate: propertyData.inspection.nextInspectionDate
        } : null
      },
      tasks: {
        // Crear tarea de primera inspección
        newInspection: {
          title: `Primera inspección - ${propertyData.name}`,
          assignedTo: propertyData.inspection.assignedInspector,
          dueDate: propertyData.inspection.nextInspectionDate,
          priority: 'high'
        }
      },
      users: {
        // Actualizar carga de trabajo del inspector
        inspectorWorkload: {
          inspectorId: propertyData.inspection.assignedInspector,
          addProperty: propertyData.id
        }
      }
    }

    return updates
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validaciones
      if (!formData.name || !formData.owner.name || !formData.owner.email) {
        alert('Por favor complete los campos obligatorios')
        setIsSaving(false)
        return
      }

      // Preparar datos
      const propertyData: PropertyData = {
        ...formData,
        id: `PROP-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: sessionStorage.getItem('userEmail') || 'admin@inspecten.com'
      }

      // Guardar en Google Drive
      const driveResult = await saveToGoogleDrive(propertyData)
      console.log('Guardado en Drive:', driveResult)

      // Sincronizar con otros módulos
      const syncResult = await syncWithModules(propertyData)
      console.log('Sincronización:', syncResult)

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Llamar callback
      onSave(propertyData)
      
      alert('Propiedad creada exitosamente')
      onClose()
    } catch (error) {
      console.error('Error al crear propiedad:', error)
      alert('Error al crear la propiedad')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Información Básica', icon: '🏠' },
    { id: 'location', label: 'Ubicación', icon: '📍' },
    { id: 'financial', label: 'Información Financiera', icon: '💰' },
    { id: 'owner', label: 'Propietario/Cliente', icon: '👤' },
    { id: 'inspection', label: 'Inspección', icon: '📋' },
    { id: 'documents', label: 'Documentos', icon: '📄' }
  ]

  return (
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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.lg,
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadows.xl
      }}>
        {/* Header */}
        <div style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.gray[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: theme.colors.text.primary,
            margin: 0
          }}>
            Nueva Propiedad
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme.colors.gray[600],
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${theme.colors.gray[200]}`,
          padding: `0 ${theme.spacing.lg}`,
          overflowX: 'auto'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.primary.main}` : '2px solid transparent',
                color: activeTab === tab.id ? theme.colors.primary.main : theme.colors.gray[600],
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: theme.transitions.fast,
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: theme.spacing.lg }}>
            {/* Tab: Información Básica */}
            {activeTab === 'basic' && (
              <div style={{ display: 'grid', gap: theme.spacing.lg }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: theme.spacing.md }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: theme.colors.text.primary
                    }}>
                      Nombre de la Propiedad *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ej: Torre Alfa - Piso 12"
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: `1px solid ${theme.colors.gray[300]}`,
                        borderRadius: theme.borderRadius.md,
                        fontSize: '14px',
                        fontFamily: theme.typography.fontFamily,
                        outline: 'none',
                        transition: theme.transitions.fast
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.colors.primary.main
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = theme.colors.gray[300]
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: theme.colors.text.primary
                    }}>
                      Tipo de Propiedad *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: `1px solid ${theme.colors.gray[300]}`,
                        borderRadius: theme.borderRadius.md,
                        fontSize: '14px',
                        fontFamily: theme.typography.fontFamily,
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      {propertyTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: theme.spacing.md,
                    color: theme.colors.text.primary
                  }}>
                    Detalles de la Propiedad
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.md }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Área
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="number"
                          value={formData.details.area}
                          onChange={(e) => handleChange('details', 'area', parseFloat(e.target.value) || 0)}
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                        <select
                          value={formData.details.areaUnit}
                          onChange={(e) => handleChange('details', 'areaUnit', e.target.value)}
                          style={{
                            padding: '10px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            backgroundColor: 'white'
                          }}
                        >
                          <option value="m2">m²</option>
                          <option value="ft2">ft²</option>
                        </select>
                      </div>
                    </div>

                    {formData.type === 'residential' && (
                      <>
                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: theme.colors.text.primary
                          }}>
                            Habitaciones
                          </label>
                          <input
                            type="number"
                            value={formData.details.bedrooms || ''}
                            onChange={(e) => handleChange('details', 'bedrooms', parseInt(e.target.value) || 0)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              border: `1px solid ${theme.colors.gray[300]}`,
                              borderRadius: theme.borderRadius.md,
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: theme.colors.text.primary
                          }}>
                            Baños
                          </label>
                          <input
                            type="number"
                            value={formData.details.bathrooms || ''}
                            onChange={(e) => handleChange('details', 'bathrooms', parseInt(e.target.value) || 0)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              border: `1px solid ${theme.colors.gray[300]}`,
                              borderRadius: theme.borderRadius.md,
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Año de Construcción
                      </label>
                      <input
                        type="number"
                        value={formData.details.yearBuilt || ''}
                        onChange={(e) => handleChange('details', 'yearBuilt', parseInt(e.target.value) || 0)}
                        placeholder="2020"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Estacionamientos
                      </label>
                      <input
                        type="number"
                        value={formData.details.parkingSpaces || ''}
                        onChange={(e) => handleChange('details', 'parkingSpaces', parseInt(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Pisos
                      </label>
                      <input
                        type="number"
                        value={formData.details.floors || ''}
                        onChange={(e) => handleChange('details', 'floors', parseInt(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.colors.text.primary
                  }}>
                    Amenidades
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '8px'
                  }}>
                    {amenitiesList.map(amenity => (
                      <label
                        key={amenity}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: theme.borderRadius.sm,
                          transition: theme.transitions.fast
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = theme.colors.gray[50]
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.details.amenities.includes(amenity)}
                          onChange={(e) => {
                            const amenities = e.target.checked
                              ? [...formData.details.amenities, amenity]
                              : formData.details.amenities.filter(a => a !== amenity)
                            handleChange('details', 'amenities', amenities)
                          }}
                          style={{
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '14px', color: theme.colors.text.primary }}>
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Ubicación */}
            {activeTab === 'location' && (
              <div style={{ display: 'grid', gap: theme.spacing.lg }}>
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: theme.spacing.md,
                    color: theme.colors.text.primary
                  }}>
                    Dirección Completa
                  </h4>
                  
                  <div style={{ display: 'grid', gap: theme.spacing.md }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: theme.spacing.md }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Calle *
                        </label>
                        <input
                          type="text"
                          value={formData.address.street}
                          onChange={(e) => handleChange('address', 'street', e.target.value)}
                          placeholder="Av. Principal"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Número
                        </label>
                        <input
                          type="text"
                          value={formData.address.number}
                          onChange={(e) => handleChange('address', 'number', e.target.value)}
                          placeholder="123"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.md }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Unidad/Depto
                        </label>
                        <input
                          type="text"
                          value={formData.address.unit}
                          onChange={(e) => handleChange('address', 'unit', e.target.value)}
                          placeholder="A-1201"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) => handleChange('address', 'city', e.target.value)}
                          placeholder="Guayaquil"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Código Postal
                        </label>
                        <input
                          type="text"
                          value={formData.address.zipCode}
                          onChange={(e) => handleChange('address', 'zipCode', e.target.value)}
                          placeholder="090150"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={searchAddress}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: theme.colors.primary.main,
                        color: 'white',
                        border: 'none',
                        borderRadius: theme.borderRadius.md,
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        alignSelf: 'flex-start'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      </svg>
                      Buscar en Google Maps
                    </button>
                  </div>
                </div>

                {/* Mapa */}
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: theme.spacing.md,
                    color: theme.colors.text.primary
                  }}>
                    Ubicación en el Mapa
                  </h4>

                  <div style={{
                    height: '400px',
                    backgroundColor: theme.colors.gray[100],
                    borderRadius: theme.borderRadius.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${theme.colors.gray[300]}`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {!showMap ? (
                      <button
                        type="button"
                        onClick={() => setShowMap(true)}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: theme.colors.primary.main,
                          color: 'white',
                          border: 'none',
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Cargar Mapa
                      </button>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</p>
                        <p style={{ color: theme.colors.text.secondary }}>
                          Google Maps
                        </p>
                        <p style={{ fontSize: '12px', color: theme.colors.text.secondary, marginTop: '8px' }}>
                          Lat: {formData.coordinates.lat.toFixed(6)}, Lng: {formData.coordinates.lng.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Información Financiera */}
            {activeTab === 'financial' && (
              <div style={{ display: 'grid', gap: theme.spacing.lg }}>
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: theme.spacing.md,
                    color: theme.colors.text.primary
                  }}>
                    Valores de la Propiedad
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: theme.spacing.md }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Precio de Compra
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          value={formData.pricing.currency}
                          onChange={(e) => handleChange('pricing', 'currency', e.target.value)}
                          style={{
                            padding: '10px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            backgroundColor: 'white'
                          }}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>
                        <input
                          type="number"
                          value={formData.pricing.purchasePrice || ''}
                          onChange={(e) => handleChange('pricing', 'purchasePrice', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Valor Actual Estimado
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{
                          padding: '10px',
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          backgroundColor: theme.colors.gray[50],
                          color: theme.colors.text.secondary
                        }}>
                          {formData.pricing.currency}
                        </span>
                        <input
                          type="number"
                          value={formData.pricing.currentValue || ''}
                          onChange={(e) => handleChange('pricing', 'currentValue', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Renta Mensual
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{
                          padding: '10px',
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          backgroundColor: theme.colors.gray[50],
                          color: theme.colors.text.secondary
                        }}>
                          {formData.pricing.currency}
                        </span>
                        <input
                          type="number"
                          value={formData.pricing.monthlyRent || ''}
                          onChange={(e) => handleChange('pricing', 'monthlyRent', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Impuesto Predial Anual
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{
                          padding: '10px',
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          backgroundColor: theme.colors.gray[50],
                          color: theme.colors.text.secondary
                        }}>
                          {formData.pricing.currency}
                        </span>
                        <input
                          type="number"
                          value={formData.pricing.propertyTax || ''}
                          onChange={(e) => handleChange('pricing', 'propertyTax', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen financiero */}
                {(formData.pricing.monthlyRent || formData.pricing.currentValue) && (
                  <div style={{
                    padding: theme.spacing.lg,
                    backgroundColor: theme.colors.gray[50],
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.gray[200]}`
                  }}>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: theme.spacing.md,
                      color: theme.colors.text.primary
                    }}>
                      Análisis Financiero
                    </h5>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.md }}>
                      {formData.pricing.monthlyRent && formData.pricing.currentValue ? (
                        <>
                          <div>
                            <p style={{ fontSize: '12px', color: theme.colors.text.secondary, marginBottom: '4px' }}>
                              Retorno Anual
                            </p>
                            <p style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.primary.main }}>
                              {((formData.pricing.monthlyRent * 12 / formData.pricing.currentValue) * 100).toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '12px', color: theme.colors.text.secondary, marginBottom: '4px' }}>
                              Renta Anual
                            </p>
                            <p style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text.primary }}>
                              {formData.pricing.currency} {(formData.pricing.monthlyRent * 12).toLocaleString()}
                            </p>
                          </div>
                        </>
                      ) : null}
                      
                      {formData.pricing.currentValue && formData.pricing.purchasePrice ? (
                        <div>
                          <p style={{ fontSize: '12px', color: theme.colors.text.secondary, marginBottom: '4px' }}>
                            Valorización
                          </p>
                          <p style={{ 
                            fontSize: '18px', 
                            fontWeight: '600', 
                            color: formData.pricing.currentValue > formData.pricing.purchasePrice ? '#10b981' : '#ef4444'
                          }}>
                            {((formData.pricing.currentValue - formData.pricing.purchasePrice) / formData.pricing.purchasePrice * 100).toFixed(2)}%
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Propietario/Cliente */}
            {activeTab === 'owner' && (
              <div style={{ display: 'grid', gap: theme.spacing.lg }}>
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: theme.spacing.md,
                    color: theme.colors.text.primary
                  }}>
                    Información del Propietario/Cliente
                  </h4>
                  
                  <div style={{ display: 'grid', gap: theme.spacing.md }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: theme.spacing.md }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          value={formData.owner.name}
                          onChange={(e) => handleChange('owner', 'name', e.target.value)}
                          placeholder="Juan Pérez García"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Cédula/RUC *
                        </label>
                        <input
                          type="text"
                          value={formData.owner.idNumber}
                          onChange={(e) => handleChange('owner', 'idNumber', e.target.value)}
                          placeholder="0912345678"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: theme.spacing.md }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.owner.email}
                          onChange={(e) => handleChange('owner', 'email', e.target.value)}
                          placeholder="correo@ejemplo.com"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          value={formData.owner.phone}
                          onChange={(e) => handleChange('owner', 'phone', e.target.value)}
                          placeholder="+593 99 123 4567"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Empresa (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.owner.company || ''}
                        onChange={(e) => handleChange('owner', 'company', e.target.value)}
                        placeholder="Empresa ABC S.A."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Dirección del Cliente
                      </label>
                      <textarea
                        value={formData.owner.address || ''}
                        onChange={(e) => handleChange('owner', 'address', e.target.value)}
                        placeholder="Dirección completa del cliente..."
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          resize: 'vertical',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Notas sobre el Cliente
                      </label>
                      <textarea
                        value={formData.owner.notes || ''}
                        onChange={(e) => handleChange('owner', 'notes', e.target.value)}
                        placeholder="Información adicional relevante..."
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          resize: 'vertical',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Inspección */}
            {activeTab === 'inspection' && (
              <div style={{ display: 'grid', gap: theme.spacing.lg }}>
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: theme.spacing.md,
                    color: theme.colors.text.primary
                  }}>
                    Configuración de Inspección
                  </h4>
                  
                  <div style={{ display: 'grid', gap: theme.spacing.md }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Inspector Asignado
                        </label>
                        <select
                          value={formData.inspection.assignedInspector || ''}
                          onChange={(e) => {
                            const inspector = inspectors.find(i => i.id === e.target.value)
                            setFormData({
                              ...formData,
                              inspection: {
                                ...formData.inspection,
                                assignedInspector: e.target.value,
                                inspectorName: inspector?.name || ''
                              }
                            })
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="">Seleccionar inspector...</option>
                          {inspectors
                            .filter(inspector => inspector.specialties.includes(formData.type))
                            .map(inspector => (
                              <option key={inspector.id} value={inspector.id}>
                                {inspector.name} - {inspector.specialties.join(', ')}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Checklist Predeterminado
                        </label>
                        <select
                          value={formData.inspection.defaultChecklist || ''}
                          onChange={(e) => handleChange('inspection', 'defaultChecklist', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="">Seleccionar checklist...</option>
                          {checklists
                            .filter(checklist => checklist.type === formData.type)
                            .map(checklist => (
                              <option key={checklist.id} value={checklist.id}>
                                {checklist.name} ({checklist.items} items)
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.md }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Frecuencia de Inspección
                        </label>
                        <select
                          value={formData.inspection.frequency}
                          onChange={(e) => handleChange('inspection', 'frequency', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="weekly">Semanal</option>
                          <option value="biweekly">Quincenal</option>
                          <option value="monthly">Mensual</option>
                          <option value="quarterly">Trimestral</option>
                          <option value="semiannual">Semestral</option>
                          <option value="annual">Anual</option>
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Última Inspección
                        </label>
                        <input
                          type="date"
                          value={formData.inspection.lastInspectionDate || ''}
                          onChange={(e) => handleChange('inspection', 'lastInspectionDate', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.colors.text.primary
                        }}>
                          Próxima Inspección
                        </label>
                        <input
                          type="date"
                          value={formData.inspection.nextInspectionDate || ''}
                          onChange={(e) => handleChange('inspection', 'nextInspectionDate', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: `1px solid ${theme.colors.gray[300]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme.colors.text.primary
                      }}>
                        Instrucciones de Acceso
                      </label>
                      <textarea
                        value={formData.inspection.accessInstructions || ''}
                        onChange={(e) => handleChange('inspection', 'accessInstructions', e.target.value)}
                        placeholder="Código de acceso, persona de contacto, horarios permitidos, etc..."
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '14px',
                          resize: 'vertical',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Información del inspector seleccionado */}
                {formData.inspection.assignedInspector && (
                  <div style={{
                    padding: theme.spacing.lg,
                    backgroundColor: theme.colors.primary.main + '10',
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.primary.main}30`
                  }}>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.primary.dark
                    }}>
                      Inspector Asignado
                    </h5>
                    {(() => {
                      const inspector = inspectors.find(i => i.id === formData.inspection.assignedInspector)
                      return inspector ? (
                        <div style={{ display: 'flex', gap: theme.spacing.lg }}>
                          <p style={{ fontSize: '14px', color: theme.colors.text.primary }}>
                            <strong>{inspector.name}</strong>
                          </p>
                          <p style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                            {inspector.email}
                          </p>
                          <p style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                            Especialidades: {inspector.specialties.join(', ')}
                          </p>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Documentos */}
            {activeTab === 'documents' && (
              <div style={{ display: 'grid', gap: theme.spacing.lg }}>
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: theme.spacing.md,
                    color: theme.colors.text.primary
                  }}>
                    Documentos de la Propiedad
                  </h4>
                  
                  <div style={{
                    border: `2px dashed ${theme.colors.gray[300]}`,
                    borderRadius: theme.borderRadius.md,
                    padding: theme.spacing.xl,
                    textAlign: 'center',
                    backgroundColor: theme.colors.gray[50]
                  }}>
                    <svg 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill={theme.colors.gray[400]}
                      style={{ margin: '0 auto 16px' }}
                    >
                      <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
                    </svg>
                    
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: theme.colors.text.primary,
                      marginBottom: '8px'
                    }}>
                      Arrastra archivos aquí o haz clic para seleccionar
                    </p>
                    
                    <p style={{
                      fontSize: '14px',
                      color: theme.colors.text.secondary,
                      marginBottom: '16px'
                    }}>
                      Formatos aceptados: PDF, JPG, PNG, DOC
                    </p>
                    
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      style={{ display: 'none' }}
                      id="file-upload"
                      onChange={(e) => {
                        console.log('Archivos seleccionados:', e.target.files)
                      }}
                    />
                    
                    <label
                      htmlFor="file-upload"
                      style={{
                        padding: '10px 20px',
                        backgroundColor: theme.colors.primary.main,
                        color: 'white',
                        borderRadius: theme.borderRadius.md,
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'inline-block'
                      }}
                    >
                      Seleccionar Archivos
                    </label>
                  </div>
                </div>

                {/* Lista de tipos de documentos */}
                <div>
                  <h5 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: theme.spacing.md,
                    color: theme.colors.text.primary
                  }}>
                    Documentos Recomendados
                  </h5>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: theme.spacing.sm
                  }}>
                    {[
                      'Escritura de propiedad',
                      'Póliza de seguro',
                      'Planos arquitectónicos',
                      'Certificado de gravámenes',
                      'Pago de impuestos prediales',
                      'Contratos de arrendamiento',
                      'Fotos de la propiedad',
                      'Historial de mantenimiento'
                    ].map(doc => (
                      <div
                        key={doc}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: theme.colors.gray[100],
                          borderRadius: theme.borderRadius.sm,
                          fontSize: '13px',
                          color: theme.colors.text.secondary,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span style={{ color: theme.colors.gray[400] }}>📄</span>
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información sobre Google Drive */}
                <div style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.primary.main + '10',
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.primary.main}30`
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: theme.colors.primary.dark,
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Los documentos se sincronizarán automáticamente con Google Drive en la carpeta:
                    <strong>INSPECTEN/Propiedades/{formData.name || '[Nombre de Propiedad]'}/Documentos</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer con acciones */}
          <div style={{
            padding: theme.spacing.lg,
            borderTop: `1px solid ${theme.colors.gray[200]}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.colors.gray[50]
          }}>
            <div style={{
              fontSize: '13px',
              color: theme.colors.text.secondary
            }}>
              * Campos obligatorios
            </div>
            
            <div style={{
              display: 'flex',
              gap: theme.spacing.md
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: theme.colors.text.secondary,
                  border: `1px solid ${theme.colors.gray[300]}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: theme.transitions.fast
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.gray[50]
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isSaving || !formData.name || !formData.owner.name || !formData.owner.email}
                style={{
                  padding: '10px 24px',
                  backgroundColor: isSaving || !formData.name || !formData.owner.name || !formData.owner.email 
                    ? theme.colors.gray[300] 
                    : theme.colors.primary.main,
                  color: 'white',
                  border: 'none',
                  borderRadius: theme.borderRadius.md,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isSaving || !formData.name || !formData.owner.name || !formData.owner.email 
                    ? 'not-allowed' 
                    : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: theme.transitions.fast
                }}
              >
                {isSaving ? (
                  <>
                    <span style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }}></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                    </svg>
                    Crear Propiedad
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}